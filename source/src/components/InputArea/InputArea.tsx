import * as React from 'react';
import IconFont from '../IconFont';
const styles = require('./InputArea.css');

export interface InputAreaProps {
    placeholder?: string;
    closed?: boolean
    onSubmit?: (value: string) => boolean;
    onCollapse?: (state: boolean) => void;
    onSwitch?: () => void;
    onSubmited?: () => void;
}

export enum InputTypes {
    Text = 2,
    Voice = 4,
}

class InputArea extends React.Component<InputAreaProps, any> {
    constructor(props: InputAreaProps) {
        super(props);
        this.state = {
            text: '',
            type: InputTypes.Text,
            talking: false
        }
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
            let result = onSubmit && onSubmit(value);
            if (result) {
                this.setState({
                    text: ''
                });
                onSubmited && onSubmited();
            }
        }
    }

    textOnChange(e: any) {
        this.setState({
            text: e.target.value
        })
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

    render() {
        const { type, talking } = this.state;
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
                                onMouseDown={() => { this.setState({ talking: true }) }}
                                onTouchStart={() => { this.setState({ talking: true }) }}
                                onMouseUp={() => { this.setState({ talking: false }) }}
                                onTouchEnd={() => { this.setState({ talking: false }) }}
                                onContextMenu={(e) => { e.preventDefault(); return false }}
                            >{talking ? '松开 结束' : '按住 说话'}</button>
                    }

                </div>
                <button className={styles.rightbutton}
                    onClick={() => { this.setState({ type: InputTypes.Text }); onCollapse && onCollapse(!closed || false) }}>
                    {closed ?
                        <IconFont type="addition1" style={{ fontSize: '22px' }} /> :
                        <IconFont type="addition1" style={{ fontSize: '22px', color: '#0d9fc1' }} />
                    }
                </button>
            </div >
        )
    }
}

export default InputArea;