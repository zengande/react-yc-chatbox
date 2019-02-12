import * as React from 'react';
import IconFont from '../IconFont';
import MediaRecorder, { AudioBlob } from '../../utils/MediaRecorder';
import { MessageTypes } from '../MessageBox/Message';
// import { debounce } from 'ts-debounce';
const styles = require('./InputArea.css');

export interface InputAreaProps {
    placeholder?: string;
    closed?: boolean;
    disabled?: boolean;
    onSubmit?: (value: string | AudioBlob, type: MessageTypes) => boolean;
    onCollapse?: (state: boolean) => void;
    onSwitch?: () => void;
    onSubmited?: () => void;
    onRecordFailed?: (e: IRecordError) => void;
}

export enum InputTypes {
    Text = 2,
    Voice = 4,
}

interface IRecordError {
    code: string;
    message: string
}

class InputArea extends React.Component<InputAreaProps, any> {
    _mediaRecorder: MediaRecorder;

    constructor(props: InputAreaProps) {
        super(props);
        this.state = {
            text: '',
            type: InputTypes.Text,
            talking: false,
            showSendButton: false,
            canRecording: false
        }

        MediaRecorder.get((rec) => {
            // console.log(rec.canRecording);
            this.setState({ canRecording: true });
            this._mediaRecorder = rec;
        }, (e) => {
            console.error(e);
        });
    }

    static defaultProps = {
        placeholder: '快来和我聊天吧~',
        onSubmit: (value: string) => true,
        onRecordFailed: (e: IRecordError) => {
            console.log(e);
        },
        closed: true,
        disable: false
    }

    textOnKeyUp(e: any) {
        let value = e.target.value;
        if (e.keyCode === 13 && value.trim() !== '') {
            this.submit();
        }
    }

    textOnChange(e: any) {
        let value = e.target.value;

        if (value.trim() !== '') {
            if (this.state.showSendButton === false) {
                this.setState({ showSendButton: true })
            }

        } else {
            if (this.state.showSendButton) {
                this.setState({ showSendButton: false })
            }
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
        if (this._mediaRecorder) {
            console.log('startRecord');
            this.setState({ talking: true });
            this._mediaRecorder.reset();
            this._mediaRecorder.start();
        }
    }

    endRecord() {
        if (this._mediaRecorder) {
            console.log('endRecord');
            this.setState({ talking: false });

            this._mediaRecorder.getBlobAsync()
                .then(data => {
                    // 发送语音消息
                    const { onSubmit, onSubmited, onRecordFailed } = this.props;
                    if (data.duration < 1) {
                        onRecordFailed && onRecordFailed({ code: 'TimeIsTooShort', message: '说话时间太短！' });
                        return;
                    }

                    let result = onSubmit && onSubmit(data, MessageTypes.Voice);
                    if (result) {
                        onSubmited && onSubmited();
                    }
                });
        }
    }

    submit() {
        const { text } = this.state;
        const { onSubmit, onSubmited } = this.props;
        let result = onSubmit && onSubmit(text, MessageTypes.Text);
        if (result) {
            this.setState({
                text: '',
                showSendButton: false
            });
            onSubmited && onSubmited();
        }
    }

    render() {
        const { type, talking, showSendButton, canRecording } = this.state;
        const { placeholder, closed, onCollapse, disabled } = this.props;

        return (
            <div className={styles.inputarea}>
                <button className={styles.leftbutton}
                    onClick={this.switchInput.bind(this)}
                    disabled={!canRecording} >
                    <IconFont type={type === InputTypes.Text ? 'yuyin' : 'jianpan'} style={{ fontSize: '22px' }} />
                </button>
                <div className={styles.textarea} style={this.getTextareaStyle()}>
                    {
                        type === InputTypes.Text ?
                            <input
                                id="txtInput"
                                onFocus={this.textOnFocus.bind(this)}
                                onKeyUp={this.textOnKeyUp.bind(this)}
                                onChange={this.textOnChange.bind(this)}
                                value={this.state.text}
                                className={styles.textinput}
                                placeholder={placeholder}
                                disabled={disabled} /> :
                            <button
                                className={this.getVoiceButtonClass()}
                                // onMouseDown={this.startRecord.bind(this)}
                                onTouchStart={this.startRecord.bind(this)}
                                // onMouseUp={this.endRecord.bind(this)}
                                onTouchEnd={this.endRecord.bind(this)}
                                onContextMenu={(e) => { e.preventDefault(); return false }}
                            >{talking ? '松开 结束' : '按住 说话'}</button>
                    }

                </div>
                {
                    showSendButton ?
                        <button className={styles.send}
                            onClick={this.submit.bind(this)}>
                            <IconFont type="send" style={{ fontSize: '22px', color: 'rgb(13, 159, 193)' }} />
                        </button> :
                        <button className={styles.rightbutton}
                            onClick={() => {
                                this.setState({ type: InputTypes.Text });
                                onCollapse && onCollapse(!closed || false);
                                if (!closed) {
                                    const input = document.getElementById('txtInput');
                                    input && input.focus();
                                }
                            }}>
                            {closed ?
                                <IconFont type="addition1" style={{ fontSize: '22px' }} /> :
                                <IconFont type="close" style={{ fontSize: '22px', color: '#0d9fc1' }} />
                            }
                        </button>
                }


            </div >
        )
    }
}

export default InputArea;