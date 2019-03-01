import React from 'react';
import * as dd from 'dingtalk-jsapi';
import axios from 'axios';
import { ChatBox, MessageRoles, MessageTypes, MessageStatus, scrollTo, guid } from 'react-yc-chatbox';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Chat';
import { Toast } from 'antd-mobile';
import 'antd-mobile/lib/toast/style/css'
import ddService from '../services/ddService';

class Home extends React.Component {
    state = {
        canRecord: false,
        config: {}
    }
    _voiceId = '';
    _config = {};

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.messages.length > this.props.messages.length) {
            const chatbox = document.getElementById('messages');
            scrollTo(chatbox, chatbox.scrollHeight, 300);
        }
    }

    componentDidMount() {
        // 在钉钉中
        if (dd.version && (dd.ios || dd.android || dd.pc)) {
            axios.get('/api/SampleData/GetDDConfig')
                .then((response) => {
                    const config = response.data;
                    dd.config({
                        agentId: config.agentId, // 必填，微应用ID
                        corpId: config.corpId,//必填，企业ID
                        timeStamp: config.timeStamp, // 必填，生成签名的时间戳
                        nonceStr: config.nonceStr, // 必填，生成签名的随机串
                        signature: config.signature, // 必填，签名
                        jsApiList: [
                            'runtime.info',
                            'device.audio.startRecord',
                            'device.audio.stopRecord',
                            'device.audio.onRecordEnd',
                            'device.audio.download',
                            'device.audio.play',
                            'device.audio.translateVoice',
                            'runtime.permission.requestAuthCode'
                        ]
                    });

                    dd.ready(() => {
                        const { corpId, token } = config;
                        // 免登获取钉钉用户信息
                        ddService.getUserInfo(corpId, token, (userInfo) => {
                            this.props.saveDDUserInfo(userInfo);
                        })

                        // 并且在苹果或者安卓设备中
                        if (dd.ios || dd.android) {
                            this.setState({ canRecord: true });
                        }
                        dd.device.audio.onRecordEnd({
                            onSuccess: (res) => {
                                this.onSubmit(res, MessageTypes.Voice);
                            },
                            onFail: function (err) {

                            }
                        });
                    })
                })
                .catch(function (error) {
                    // todo: when fail
                });

            dd.error(error => {
                // todo: when fail
            });
        }
        this.fetchData();
    }

    fetchData() {
        this.props.requestHistoryMesssages();
    }

    onSubmit(data, type) {
        const content = type === MessageTypes.Voice ? '' : data;
        const { send , ddUser} = this.props;
        const id = guid();

        send && send({ name:'我', id, status: MessageStatus.Sending, content, data, type, role: MessageRoles.Self, datetime: new Date() }, ddUser.userid);

        return true;
    }

    /**开始录音 */
    startTalk = () => {
        this._voiceId = guid();
        if (this.state.canRecord) {
            dd.device.audio.startRecord({
                onSuccess: () => {
                    // 支持最长为60秒（包括）的音频录制
                    const { receive } = this.props;
                    receive && receive({ content: "正在发送...", id: this._voiceId, type: MessageTypes.Text, role: MessageRoles.Self, datetime: new Date() });
                },
                onFail: function (err) {
                    // todo : when fail
                }
            });
        }
    }

    /**结束录音 */
    endTalk = () => {
        const { remove } = this.props;
        if (this.state.canRecord) {
            dd.device.audio.stopRecord({
                onSuccess: (res) => {

                    // 太短
                    if (res.duration < 0.8) {
                        remove && remove(this._voiceId);
                        Toast.fail('说话时间太短！', 1)
                        return;
                    }
                    this.convertToText(res, text => {
                        remove && remove(this._voiceId);
                        this.onSubmit({ ...res, text }, MessageTypes.Voice);
                    });
                },
                onFail: err => {
                    remove && remove(this._voiceId);
                    // todo : when fail
                }
            });
        }
    }

    convertToText = (res, callback) => {
        const { mediaId, duration } = res;
        if (this.state.canRecord && mediaId) {
            dd.device.audio.translateVoice({
                mediaId: mediaId,
                duration: duration,
                onSuccess: function (res) {
                    let text = res.content;
                    if (!text || text === '') {
                        text = "没有听清。";
                    }
                    callback(text);
                },
                onFail: () => {
                    callback('没有听清。')
                }
            });
        }
    }

    /**播放语音消息 */
    playRecord = (mediaId, callback) => {
        if (this.state.canRecord) {
            dd.device.audio.download({
                mediaId: mediaId,
                onSuccess: (res) => {
                    dd.device.audio.play({
                        localAudioId: res.localAudioId,

                        onSuccess: function () {
                            callback();
                        },

                        onFail: function (err) {
                        }
                    });
                },
                onFail: function (err) {
                    // todo: when fail
                }
            });
        }
    }

    render() {
        const menus = [
            { icon: 'tupian', text: '图片', onClick: () => { alert('图片') } },
            { icon: 'file', text: '文件', onClick: () => { alert('文件') } },
            { icon: 'yuyinshuru', text: '语音输入', onClick: () => { alert('语音输入') } },
        ]

        const title = (
            <React.Fragment>
                小摩摩 <i>v1.0</i>
            </React.Fragment>);

        const inputProps = {
            onSubmit: this.onSubmit.bind(this),
            voiceEnabled: this.state.canRecord,
            onRecordStart: this.startTalk,
            onRecordEnded: this.endTalk
        }

        const messageProps = {
            conversion: true,
            messages: this.props.messages,
            hasNewMessage: false,
            displayTitle: true,
            displayStatus: true,
            playRecord: this.playRecord
        }

        return (
            <React.Fragment>
                <ChatBox
                    id="messages"
                    menus={menus}
                    displayHeader={false}
                    headerProps={{ title }}
                    messageProps={messageProps}
                    loading={this.props.loading}
                    inputProps={inputProps} />
            </React.Fragment>
        );
    }
}
export default connect(
    state => state.chat,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Home);