import * as React from 'react';
import IconFont from '../IconFont';
const styles = require('./InputArea.css');

export interface InputAreaProps {
    placeholder?: string;
    closed?: boolean
    onSubmit?: (value: string) => boolean;
    onCollapse?: (state: boolean) => void;
    onSwitch?: () => void;
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
            type: InputTypes.Text
        }
    }

    static defaultProps = {
        placeholder: '快来和我聊天吧~',
        onSubmit: (value: string) => true,
        closed: true
    }

    textOnKeyUp(e: any) {
        if (e.keyCode === 13) {
            const { onSubmit } = this.props;
            let result = onSubmit && onSubmit(e.target.value);
            result && this.setState({
                text: ''
            });
        }
    }

    textOnChange(e: any) {
        this.setState({
            text: e.target.value
        })
    }

    textOnFocus(){
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

    render() {
        const { type } = this.state;
        const { placeholder, closed, onCollapse } = this.props;

        return (
            <div className={styles.inputarea}>
                <button className={styles.leftbutton} onClick={this.switchInput.bind(this)}>
                    <IconFont type={type === InputTypes.Text ? 'yuyin' : 'jianpan'} style={{ fontSize: '22px' }} />
                </button>
                <div className={styles.textarea}>
                    {
                        type === InputTypes.Text ?
                            <input
                                onFocus={this.textOnFocus.bind(this)}
                                onKeyUp={this.textOnKeyUp.bind(this)}
                                onChange={this.textOnChange.bind(this)}
                                value={this.state.text}
                                className={styles.textinput}
                                placeholder={placeholder} /> :
                            <div className={styles.voice}>按住 说话</div>
                    }

                </div>
                <button className={styles.rightbutton}
                    onClick={() => { this.setState({ type: InputTypes.Text }); onCollapse && onCollapse(!closed || false) }}>
                    {closed ?
                        <IconFont type="addition1" style={{ fontSize: '22px' }} /> :
                        <IconFont type="addition1" style={{ fontSize: '22px', color: '#0d9fc1' }} />
                    }
                </button>
            </div>
        )
    }
}

export default InputArea;