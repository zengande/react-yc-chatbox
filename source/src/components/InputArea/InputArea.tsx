import * as React from 'react';
import IconFont from '../IconFont';
import MediaRecorder from '../../utils/MediaRecorder';
import { MessageTypes } from '../MessageBox/Message';
const styles = require('./InputArea.css');

export interface InputAreaProps {
    placeholder?: string;
    closed?: boolean
    onSubmit?: (value: string | Blob, type: MessageTypes) => boolean;
    onCollapse?: (state: boolean) => void;
    onSwitch?: () => void;
    onSubmited?: () => void;
}

export enum InputTypes {
    Text = 2,
    Voice = 4,
}

class InputArea extends React.Component<InputAreaProps, any> {
    _mediaRecorder: MediaRecorder;

    constructor(props: InputAreaProps) {
        super(props);
        this.state = {
            text: '',
            type: InputTypes.Text,
            talking: false,
            showSendButton: false
        }

        MediaRecorder.get((rec) => {
            this._mediaRecorder = rec;
        });
    }

    static defaultProps = {
        placeholder: '快来和我聊天吧~',
        onSubmit: (value: string) => true,
        closed: true
    }

    textOnKeyUp(e: any) {
        let value = e.target.value;
        if (e.keyCode === 13 && value.trim() !== '') {
            const { onSubmit, onSubmited } = this.props;
            let result = onSubmit && onSubmit(value, MessageTypes.Text);
            if (result) {
                this.setState({
                    text: ''
                });
                onSubmited && onSubmited();
            }
        }
    }

    textOnChange(e: any) {
        let value = e.target.value;

        if (value.trim() !== '' &&
            this.state.showSendButton === false) {
            this.setState({ showSendButton: true })
        } else if (this.state.showSendButton) {
            this.setState({ showSendButton: false })
        }

        this.setState({
            text: value
        });
    }

    textOnFocus() {
        this.cloesMenuPanel();
    }

    cloesMenuPanel() {
        const { onSwitch } = this.props;
        onSwitch && onSwitch()

    }

    switchInput() {
        this.setState((preState: any) =>
            (preState.type === InputTypes.Text ?
                { type: InputTypes.Voice } :
                { type: InputTypes.Text })
        );
        this.cloesMenuPanel();
    }

    getTextareaStyle() {
        const { type } = this.state;
        return type === InputTypes.Text ?
            { marginRight: '60px' } :
            { marginRight: '50px' };
    }

    getVoiceButtonClass() {
        const { talking } = this.state;
        if (talking) {
            return `${styles.voice} ${styles.active}`
        }
        return styles.voice;
    }

    startRecord() {
        console.log('startRecord');
        this.setState({ talking: true });
        this._mediaRecorder.start();
    }

    endRecord() {
        console.log('endRecord');
        this.setState({ talking: false });
        var blob = this._mediaRecorder.getBlob();
        console.log(blob)
        
        this._mediaRecorder.reset();

        // todo:发送语音消息
        const { onSubmit, onSubmited } = this.props;
        let result = onSubmit && onSubmit(blob, MessageTypes.Voice);
        if (result) {
            onSubmited && onSubmited();
        }
    }

    render() {
        const { type, talking, showSendButton } = this.state;
        const { placeholder, closed, onCollapse } = this.props;

        return (
            <div className={styles.inputarea}>
                <button className={styles.leftbutton} onClick={this.switchInput.bind(this)}>
                    <IconFont type={type === InputTypes.Text ? 'yuyin' : 'jianpan'} style={{ fontSize: '22px' }} />
                </button>
                <div className={styles.textarea} style={this.getTextareaStyle()}>
                    {
                        type === InputTypes.Text ?
                            <input
                                onFocus={this.textOnFocus.bind(this)}
                                onKeyUp={this.textOnKeyUp.bind(this)}
                                onChange={this.textOnChange.bind(this)}
                                value={this.state.text}
                                className={styles.textinput}
                                placeholder={placeholder} /> :
                            <button
                                className={this.getVoiceButtonClass()}
                                onMouseDown={this.startRecord.bind(this)}
                                onTouchStart={this.startRecord.bind(this)}
                                onMouseUp={this.endRecord.bind(this)}
                                onTouchEnd={this.endRecord.bind(this)}
                                onContextMenu={(e) => { e.preventDefault(); return false }}
                            >{talking ? '松开 结束' : '按住 说话'}</button>
                    }

                </div>
                {
                    showSendButton ?
                        <button className={styles.send}>发送</button> :
                        <button className={styles.rightbutton}
                            onClick={() => { this.setState({ type: InputTypes.Text }); onCollapse && onCollapse(!closed || false) }}>
                            {closed ?
                                <IconFont type="addition1" style={{ fontSize: '22px' }} /> :
                                <IconFont type="addition1" style={{ fontSize: '22px', color: '#0d9fc1' }} />
                            }
                        </button>
                }


            </div >
        )
    }
}

export default InputArea;