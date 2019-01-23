import * as React from 'react';
import InputArea, { InputAreaProps } from '../InputArea';
import FootMenu from '../FootMenu';
import MessageBox from '../MessageBox';
import { Message } from '../MessageBox/Message';
let styles = require('./ChatBox.css');

interface ChatBoxPros {
    messages: Message[];
    loading: boolean;
    inputProps?: InputAreaProps;
    menu?: React.ReactNode
}

class ChatBox extends React.Component<ChatBoxPros, any>{
    constructor(props: ChatBoxPros) {
        super(props);
        this.state = {
            closed: true
        }
    }

    static defaultProps = {
        messages: [],
        loading: false
    }

    render() {
        const { messages, inputProps } = this.props;
        const { closed } = this.state;
        let mainStyle = !closed ? ({ bottom: '250px' }) : undefined;
        let footerStyle = !closed ? ({ height: '250px' }) : undefined;

        return (
            <div className={styles.container}>
                <div className={styles.main} style={mainStyle}>
                    <MessageBox messages={messages} />
                </div>
                <div className={styles.footer} style={footerStyle}>
                    <InputArea {...inputProps}
                        closed={this.state.closed}
                        onCollapse={(state) => { this.setState({ closed: state }) }}
                        onSwitch={() => { this.setState({ closed: true }) }}
                    />
                    <FootMenu style={{ height: '200px' }} />
                </div>
            </div>
        )
    }
}

export default ChatBox;