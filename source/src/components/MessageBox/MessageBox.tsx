import * as React from 'react';
import { Message, MessageRoles, MessageTypes, MessageStatus } from './Message';
import 'moment/locale/zh-cn';
import common from '../../utils/common';
import VoiceMessage from './VoiceMessage';
import Spin from '../spin/Spin';
import FeedbackTooltip from '../feedbacktooltip/FeedbackTooltip';
const moment = require('moment');
const styles = require('./MessageBox.css');

export interface IMessageBoxProps {
    messages: Message[];
    conversion?: boolean;
    displayTitle?: boolean;
    displayStatus?: boolean;
    displayText?: boolean;
    feedback?: boolean;
    playRecord?: (mediaId: string, callback?: () => void) => void;
    // onConversion?: (mediaId: string, duration: number, callback?: (text: string) => void) => string;
    messageTemplate?: (message: Message) => React.ReactNode;
    onItemSelected?: (message: Message, index: number) => boolean;
}

class MessageBox extends React.PureComponent<IMessageBoxProps> {
    static defaultProps = {
        messages: [],
        displayStatus: false,
        conversion: false,
        displayText: true,
        displayTitle: true,
        feedback: false
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

    /**渲染消息主体内容 */
    renderMessageContent(message: Message) {
        const { playRecord, conversion, displayText } = this.props;
        // 语音消息
        if (message.type === MessageTypes.Voice) {
            return (
                <VoiceMessage message={message}
                    playRecord={playRecord ? playRecord : () => { }}
                    conversion={conversion || false}
                    displayText={displayText}
                // onConversion={onConversion}
                />
            );
        }
        return message.content;
    }

    /**渲染消息反馈菜单气泡 */
    renderFeedbackPopover(message: Message) {
        /* <button className={styles.feedback}>
                <IconFont type="more" />
            </button> */
        const { onItemSelected } = this.props;
        if (message.feedback) {
            return <FeedbackTooltip message={message}
                onItemSelected={onItemSelected} />
        }
        return;
    }

    /**渲染消息组件 */
    renderMessage(message: Message) {
        const key = message.id ? message.id : common.guid();
        if (message.type === MessageTypes.Notice) {
            return (
                <div key={key} className={styles.notice}>
                    <p>{message.content}</p>
                </div>
            );
        } else {
            const { displayStatus, messageTemplate, displayTitle, feedback } = this.props;
            return (
                <div className={this.getClassNames(message.role)} key={key}>
                    {
                        displayTitle &&
                        <p className={styles.header}>{message.name}<time className={styles.time}>{moment(message.datetime).calendar()}</time></p>
                    }
                    {
                        message.role === MessageRoles.Self && displayStatus && this.renderMesasgeStatus(message)
                    }
                    <div className={styles.message}>
                        <div className={styles.body}>
                            {messageTemplate ? messageTemplate(message) : this.renderMessageContent(message)}
                        </div>
                        {message.additional}
                    </div>
                    {
                        message.role === MessageRoles.Other && feedback && this.renderFeedbackPopover(message)
                    }
                </div>
            );
        }
    }

    renderMesasgeStatus(message: Message): React.ReactNode {
        switch (message.status) {
            case MessageStatus.Sending:
                return (<Spin className={styles.sending} scale={.7} />);
            case MessageStatus.Success:
                return <span className={`${styles.status} ${styles.success}`}></span>;
            case MessageStatus.Fail:
                return <span className={`${styles.status} ${styles.fail}`}></span>;
            default:
                break;
        }
        return;

    }

    render() {
        const { messages } = this.props;
        return (
            <div className={styles.messages}>
                {messages.map(message => this.renderMessage(message))}
            </div>
        )
    }
}

export default MessageBox;