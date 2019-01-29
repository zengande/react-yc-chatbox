import * as React from 'react';
import InputArea, { InputAreaProps } from '../InputArea';
import FootMenu from '../FootMenu';
import MessageBox from '../MessageBox';
import { IMessageBoxProps } from '../MessageBox/MessageBox';
import IconFont from '../IconFont';
let styles = require('./ChatBox.css');

interface IChatBoxPros {
    loading: boolean;
    menu?: React.ReactNode;
    inputProps?: InputAreaProps;
    messageProps?: IMessageBoxProps;
}

interface IChatBoxState {
    closed: boolean;
    canScroll: boolean;
    hasNewMessage: boolean;
}

class ChatBox extends React.Component<IChatBoxPros, IChatBoxState>{
    constructor(props: IChatBoxPros) {
        super(props);
        this.state = {
            closed: true,
            canScroll: true,
            hasNewMessage: false
        }
    }

    static defaultProps = {
        loading: false
    }

    scrollTo(element: Element, to: number, duration: number) {
        var start = element.scrollTop,
            change = to - start,
            currentTime = 0,
            increment = 20;
        //t = current time
        //b = start value
        //c = change in value
        //d = duration
        const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        const animateScroll = function () {
            currentTime += increment;
            const val = easeInOutQuad(currentTime, start, change, duration);
            element.scrollTop = val;
            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }

    scrollBottom() {
        const { canScroll } = this.state;
        if (canScroll) {
            const main = document.getElementsByClassName(styles.main)[0];
            this.scrollTo(main, main.scrollHeight, 300);
        }
    }

    getNewMessageStyle() {
        const { closed } = this.state;
        if (!closed) {
            return { bottom: '255px' }
        }
        return { bottom: '55px' };
    }

    render() {
        const { messageProps, inputProps } = this.props;
        const { closed, hasNewMessage } = this.state;
        let mainStyle = !closed ? ({ bottom: '250px' }) : undefined;
        let footerStyle = !closed ? ({ height: '250px' }) : undefined;

        return (
            <div className={styles.container}>
                <div className={styles.main} style={mainStyle}>
                    <MessageBox {...messageProps} />
                </div>
                <div className={styles.footer} style={footerStyle}>
                    <InputArea {...inputProps}
                        closed={this.state.closed}
                        onCollapse={(state) => { this.setState({ closed: state }) }}
                        onSwitch={() => { this.setState({ closed: true }) }}
                        onSubmited={() => this.scrollBottom()}
                    />
                    <FootMenu style={{ height: '200px' }} />
                </div>
                {
                    hasNewMessage &&
                    <button className={styles.newmessage}
                        style={this.getNewMessageStyle()}
                        onClick={() => { this.scrollBottom() }}>
                        <IconFont style={{ fontSize: '12px', marginRight: '5px' }} type="down" />有新消息
                    </button>
                }
            </div>
        )
    }
}

export default ChatBox;