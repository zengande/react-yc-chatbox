import * as React from 'react';
import { Message, MessageTypes } from './Message';
import IconFont from '../IconFont';
import common from '../../utils/common';
import { AudioBlob } from '../../utils/MediaRecorder';
const styles = require('./VoiceMessage.css');

export interface IVoiceMessageProps {
    message: Message;
}

export interface IVoiceMessageState {
    duration: number,
    playing: boolean
}

class VoiceMessage extends React.Component<IVoiceMessageProps, IVoiceMessageState> {
    _voice: HTMLAudioElement;
    _audioBlob: AudioBlob;
    constructor(props: IVoiceMessageProps) {
        super(props);
        if (!props.message.data) {
            throw 'invalid data type!';
        }
        this._audioBlob = common.convert<AudioBlob>(props.message.data);
        const duration = this._audioBlob.duration;
        this.state = {
            duration: duration,
            playing: false
        }

        this.initAudio();
    }

    shouldComponentUpdate(nextPorps: IVoiceMessageProps, nextState: IVoiceMessageState) {
        return nextState.duration !== this.state.duration ||
            nextState.playing !== this.state.playing;
    }

    initAudio() {
        const { message } = this.props;

        if (message.type !== MessageTypes.Voice) {
            throw 'the message type is not vioce!';
        }

        var objectUrl = window.URL.createObjectURL(this._audioBlob.blob);
        this._voice = new Audio(objectUrl);
        this._voice.onloadeddata = () => {
            let duration = this._voice.duration;
            this.setState({ duration })
        }

        this._voice.onplay = () => {
            console.log('play');
            this.setState({ playing: true });
        }

        this._voice.onended = () => {
            console.log('ended');
            this.setState({ playing: false });
        }

        this._voice.onerror = () => {
            console.error('play error!');
        }
    }

    controlVoicePlay() {
        console.log(this._voice);
        this._voice.play();
    }

    render() {
        const { message } = this.props;
        const { duration } = this.state;
        const timespan = common.formatSecond(duration);

        return (
            <div className={styles.container}
                onClick={this.controlVoicePlay.bind(this)}>
                <p className={this.state.playing ? styles.playing : ''}
                    style={{ margin: '0px' }}>
                    <IconFont type='voice' />
                    <span className={styles.timespan}>{timespan}</span>
                </p>
                {message.content !== '' && (<p className={styles.text}>{message.content}</p>)}
            </div>
        )
    }
}

export default VoiceMessage