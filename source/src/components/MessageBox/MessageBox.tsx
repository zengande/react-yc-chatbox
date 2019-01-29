import * as React from 'react';
import { Message, MessageRoles, MessageTypes, MessageStatus } from './Message';
import 'moment/locale/zh-cn';
import common from '../../utils/common';
const moment = require('moment');
const styles = require('./MessageBox.css');

export interface IMessageBoxProps {
    messages: Message[],
    dispalyTime?: boolean,
    displayAvatar?: boolean,
    displayStatus?: boolean,
    messageTemplate?: (message: Message) => React.ReactNode;
}

class MessageBox extends React.PureComponent<IMessageBoxProps> {
    static defaultProps = {
        messages: [],
        dispalyTime: true,
        displayAvatar: false,
        displayStatus: false
    }

    getClassNames(role: MessageRoles) {
        let className = styles.container;
        switch (role) {
            case MessageRoles.Other: {
                className += ` ${styles.other}`;
                break;
            }
            case MessageRoles.Self: {
                className += ` ${styles.self}`;
                break;
            }
            case MessageRoles.System: {
                className += ` ${styles.system}`;
                break;
            }
        }
        return className;
    }

    getMessageStatus(status?: MessageStatus) {
        return status === MessageStatus.Fail ?
            `${styles.status} ${styles.fail}` :
            `${styles.status} ${styles.success}`
    }

    renderMessageContent(message: Message) {

        return message.content;
    }

    renderMessage(message: Message) {
        const key = message.id ? message.id : common.guid();
        if (message.type === MessageTypes.Notice) {
            return (
                <div key={key} className={styles.notice}>
                    {message.content}
                </div>
            );
        } else {
            return message.role === MessageRoles.Self ?
                this.renderSelfMessage(key, message) :
                this.renderOtherMessage(key, message);
        }
    }

    renderSelfMessage(key: string, message: Message) {
        const { dispalyTime, displayAvatar, displayStatus, messageTemplate } = this.props;

        return (
            <div className={this.getClassNames(message.role)} key={key}>
                {
                    displayStatus &&
                    <span className={this.getMessageStatus(message.status)}></span>
                }
                <div className={styles.message}>
                    <div className={styles.body}>
                        {messageTemplate ? messageTemplate(message) : this.renderMessageContent(message)}
                    </div>
                    {message.additional}
                    {
                        dispalyTime &&
                        <div className={styles.footer}>
                            <time>{moment(message.datetime).fromNow()}</time>
                        </div>
                    }
                </div>
                {
                    displayAvatar &&
                    <div className={styles.avatar}>AVATAR</div>
                }
            </div>
        )
    }

    renderOtherMessage(key: string, message: Message) {
        const { dispalyTime, displayAvatar, displayStatus, messageTemplate } = this.props;
        return (
            <div className={this.getClassNames(message.role)} key={key}>
                {
                    displayAvatar &&
                    <div className={styles.avatar}>AVATAR</div>
                }
                <div className={styles.message}>
                    <div className={styles.body}>
                        {messageTemplate ? messageTemplate(message) : this.renderMessageContent(message)}
                    </div>
                    {message.additional}
                    {
                        dispalyTime &&
                        <div className={styles.footer}>
                            <time>{moment(message.datetime).fromNow()}</time>
                        </div>
                    }
                </div>
                {
                    displayStatus &&
                    <span className={this.getMessageStatus(message.status)}></span>
                }
            </div>
        )
    }

    render() {
        const { messages } = this.props;
        console.log(messages);
        return (
            <div className={styles.messages}>
                {messages.map(message => this.renderMessage(message))}
            </div>
        )
    }
}

export default MessageBox;