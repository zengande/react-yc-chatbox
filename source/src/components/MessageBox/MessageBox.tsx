import * as React from 'react';
import { Message, MessageRoles, MessageTypes } from './Message';
const styles = require('./MessageBox.css');

export interface MessageBoxProps {
    messages: Message[]
}

class MessageBox extends React.PureComponent<MessageBoxProps> {
    static defaultProps = {
        messages: []
    }

    getClassNames(role: MessageRoles) {
        return role === MessageRoles.Other ?
            `${styles.message} ${styles.text} ${styles.other}` :
            `${styles.message} ${styles.text} ${styles.self}`;
    }

    renderMessage(message: Message) {
        if (message.type === MessageTypes.Html) {
            return <div dangerouslySetInnerHTML={{ __html: message.content }} />
        }
        return message.content;
    }

    render() {
        const { messages } = this.props;

        return messages.map(
            (message) =>
                (<div key={message.id} className={this.getClassNames(message.role)}>{this.renderMessage(message)}</div>)
        );
    }
}

export default MessageBox;