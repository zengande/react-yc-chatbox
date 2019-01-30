interface IAudioData {
    size: number;
    buffer: any;
    inputSampleRate: number;
    inputSampleBits: number;
    outputSampleRate: number;
    oututSampleBits: number;
    input: (data: any) => void;
    encodeWAV: () => Blob;
    compress: () => Float32Array;
    reset: () => void;
}

class MediaRecorder {
    audioInput: MediaStreamAudioSourceNode;
    recorder: ScriptProcessorNode;
    context: AudioContext;
    audioData: IAudioData;

    canRecording = (navigator.getUserMedia != null);

    constructor(stream: MediaStream, config?: any) {
        const $this = this;

        config = config || {};
        config.sampleBits = config.sampleBits || 16;      //采样数位 8, 16
        config.sampleRate = config.sampleRate || (8000);   //采样率(1/6 44100) 

        this.context = new AudioContext();
        this.audioInput = this.context.createMediaStreamSource(stream);
        this.recorder = this.context.createScriptProcessor(4096, 1, 1);

        const inputSampleRate = this.context.sampleRate;
        const outputSampleRate = config.sampleRate;

        this.audioData = {
            size: 0          //录音文件长度
            , buffer: []     //录音缓存
            , inputSampleRate: inputSampleRate    //输入采样率
            , inputSampleBits: 16       //输入采样数位 8, 16
            , outputSampleRate: outputSampleRate    //输出采样率
            , oututSampleBits: config.sampleBits       //输出采样数位 8, 16
            , input: function (data: any) {
                this.buffer.push(new Float32Array(data));
                this.size += data.length;
            }
            , compress: function () { //合并压缩
                //合并
                var data = new Float32Array(this.size);
                var offset = 0;
                for (var i = 0; i < this.buffer.length; i++) {
                    data.set(this.buffer[i], offset);
                    offset += this.buffer[i].length;
                }
                //压缩
                var compression = parseInt(inputSampleRate / outputSampleRate + '');
                var length = data.length / compression;
                var result = new Float32Array(length);
                var index = 0, j = 0;
                while (index < length) {
                    result[index] = data[j];
                    j += compression;
                    index++;
                }
                return result;
            }
            , encodeWAV: function () {
                var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
                var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
                var bytes = this.compress();
                var dataLength = bytes.length * (sampleBits / 8);
                var buffer = new ArrayBuffer(44 + dataLength);
                var data = new DataView(buffer);


                var channelCount = 1;//单声道
                var offset = 0;


                var writeString = function (str: string) {
                    for (var i = 0; i < str.length; i++) {
                        data.setUint8(offset + i, str.charCodeAt(i));
                    }
                }

                // 资源交换文件标识符 
                writeString('RIFF'); offset += 4;
                // 下个地址开始到文件尾总字节数,即文件大小-8 
                data.setUint32(offset, 36 + dataLength, true); offset += 4;
                // WAV文件标志
                writeString('WAVE'); offset += 4;
                // 波形格式标志 
                writeString('fmt '); offset += 4;
                // 过滤字节,一般为 0x10 = 16 
                data.setUint32(offset, 16, true); offset += 4;
                // 格式类别 (PCM形式采样数据) 
                data.setUint16(offset, 1, true); offset += 2;
                // 通道数 
                data.setUint16(offset, channelCount, true); offset += 2;
                // 采样率,每秒样本数,表示每个通道的播放速度 
                data.setUint32(offset, sampleRate, true); offset += 4;
                // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8 
                data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true); offset += 4;
                // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8 
                data.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
                // 每样本数据位数 
                data.setUint16(offset, sampleBits, true); offset += 2;
                // 数据标识符 
                writeString('data'); offset += 4;
                // 采样数据总数,即数据总大小-44 
                data.setUint32(offset, dataLength, true); offset += 4;
                // 写入采样数据 
                if (sampleBits === 8) {
                    for (var i = 0; i < bytes.length; i++ , offset++) {
                        var s = Math.max(-1, Math.min(1, bytes[i]));
                        var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
                        val = parseInt(255 / (65535 / (val + 32768)) + '');
                        data.setInt8(offset, val);
                    }
                } else {
                    for (var i = 0; i < bytes.length; i++ , offset += 2) {
                        var s = Math.max(-1, Math.min(1, bytes[i]));
                        data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                    }
                }


                return new Blob([data], { type: 'audio/wav' });
            },
            reset: function () {
                this.size = 0;
                this.buffer = [];
            }
        };

        //音频采集
        this.recorder.onaudioprocess = function (e) {
            $this.audioData.input(e.inputBuffer.getChannelData(0));
            //record(e.inputBuffer.getChannelData(0));
            console.log(e);
        }

    }

    //开始录音
    start() {
        this.audioInput.connect(this.recorder);
        this.recorder.connect(this.context.destination);
    }


    //停止
    stop() {
        this.audioInput.disconnect();
        this.recorder.disconnect();
    }


    //获取音频文件
    getBlob() {
        this.stop();
        return this.audioData.encodeWAV();
    }

    reset() {
        this.audioData.size = 0;
        this.audioData.buffer = [];
    }

    //回放
    play(audio: HTMLAudioElement) {
        audio.src = window.URL.createObjectURL(this.getBlob());
    }


    //上传
    upload(url: string, callback: (parame: any, e: any) => void) {
        var fd = new FormData();
        fd.append("audioData", this.getBlob());
        var xhr = new XMLHttpRequest();
        if (callback) {
            xhr.upload.addEventListener("progress", function (e) {
                callback('uploading', e);
            }, false);
            xhr.addEventListener("load", function (e) {
                callback('ok', e);
            }, false);
            xhr.addEventListener("error", function (e) {
                callback('error', e);
            }, false);
            xhr.addEventListener("abort", function (e) {
                callback('cancel', e);
            }, false);
        }
        xhr.open("POST", url);
        xhr.send(fd);
    }
    // 获取录音机
    static get(callback: (rec: MediaRecorder) => void, config?: any) {
        const throwError = (message: string) => {
            alert(message);
            throw message;
        }

        if (callback) {
            if (navigator.getUserMedia) {
                navigator.getUserMedia(
                    { audio: true } //只启用音频
                    , function (stream) {
                        var rec = new MediaRecorder(stream, config);
                        callback(rec);
                    }
                    , function (error: any) {
                        console.error(error);
                        switch (error.code || error.name) {
                            case 'PERMISSION_DENIED':
                            case 'PermissionDeniedError':
                                throwError('用户拒绝提供信息。');
                                break;
                            case 'NOT_SUPPORTED_ERROR':
                            case 'NotSupportedError':
                                throwError('浏览器不支持硬件设备。');
                                break;
                            case 'MANDATORY_UNSATISFIED_ERROR':
                            case 'MandatoryUnsatisfiedError':
                                throwError('无法发现指定的硬件设备。');
                                break;
                            default:
                                throwError('无法打开麦克风。异常信息:' + (error.code || error.name));
                                break;
                        }
                    });
            } else {
                throwError('当前浏览器不支持录音功能。'); return;
            }
        }
    }


}

export default MediaRecorder;