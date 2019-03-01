import * as React from 'react';
import { Message } from './Message';
import IconFont from '../IconFont';
import common from '../../utils/common';
// import { AudioBlob } from '../../utils/MediaRecorder';
const styles = require('./VoiceMessage.css');

export interface IVoiceMessageProps {
    message: Message;
    conversion: boolean;
    displayText?:boolean;
    playRecord: (mediaId: string, callback?: () => void) => void;
    // onConversion?: (mediaId: string, duration: number, callback?: (text: string) => void) => string;
}

export interface IVoiceMessageState {
    duration: number;
    mediaId: string;
    playing: boolean;
    text: string;
    diplayText: boolean;
}

class VoiceMessage extends React.Component<IVoiceMessageProps, IVoiceMessageState> {
    // _voice: HTMLAudioElement;
    // _audioBlob: AudioBlob;
    constructor(props: IVoiceMessageProps) {
        super(props);
        if (!props.message.voice) {
            throw 'invalid data type!';
        }
        // this._audioBlob = common.convert<AudioBlob>(props.message.data);
        const { duration, mediaId, text } = props.message.voice;
        this.state = {
            duration: duration,
            mediaId: mediaId,
            playing: false,
            text: text,
            diplayText: props.displayText || false
        }

        // this.initAudio();
    }

    shouldComponentUpdate(nextPorps: IVoiceMessageProps, nextState: IVoiceMessageState) {
        console.log(this.state);
        console.log(nextState);
        return nextState.duration !== this.state.duration ||
            nextState.mediaId !== this.state.mediaId ||
            nextState.text !== this.state.text ||
            nextState.diplayText !== this.state.diplayText ||
            nextState.playing !== this.state.playing;
    }

    // initAudio() {
    //     const { message } = this.props;

    //     if (message.type !== MessageTypes.Voice) {
    //         throw 'the message type is not vioce!';
    //     }

    //     var objectUrl = window.URL.createObjectURL(this._audioBlob.blob);
    //     this._voice = new Audio(objectUrl);
    //     this._voice.onloadeddata = () => {
    //         let duration = this._voice.duration;
    //         this.setState({ duration })
    //     }

    //     this._voice.onplay = () => {
    //         console.log('play');
    //         this.setState({ playing: true });
    //     }

    //     this._voice.onended = () => {
    //         console.log('ended');
    //         this.setState({ playing: false });
    //     }

    //     this._voice.onerror = () => {
    //         console.error('play error!');
    //     }
    // }

    controlVoicePlay() {
        // console.log(this._voice);
        // this._voice.play();

        const { playRecord } = this.props;
        const { mediaId, duration } = this.state;
        playRecord(mediaId, () => {
            this.setState({ playing: true });
        });
        setTimeout(() => {
            if (this.state.playing) {
                this.setState({ playing: false });
            }
        }, duration * 1000)
    }

    conversion() {
        // const { onConversion } = this.props;
        // const { mediaId, duration } = this.state;
        this.setState(preState => (
            { diplayText: !preState.diplayText }
        ));
        // if (onConversion) {
        //     onConversion(mediaId, duration, text => {
        //         this.setState({ text, diplayText: false });
        //     });
        // }
    }

    render() {
        const { conversion } = this.props;
        const { duration, text, diplayText } = this.state;
        const timespan = common.formatSecond(duration);

        return (
            <React.Fragment>
                <div className={styles.container}>
                    <p className={this.state.playing ? styles.playing : ''}
                        style={{ margin: '0px' }}
                        onClick={this.controlVoicePlay.bind(this)}>
                        <IconFont type='voice' />
                        <span className={styles.timespan}>{timespan}</span>
                    </p>
                    {
                        conversion &&
                        <button className={styles.conversion}
                            onClick={this.conversion.bind(this)}>
                            <IconFont type='zhuanhuan1' />
                        </button>
                    }
                </div>
                {diplayText && <p className={styles.text}>{text}</p>}
            </React.Fragment>
        )
    }
}

export default VoiceMessage