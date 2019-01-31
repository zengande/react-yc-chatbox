import * as React from 'react';
import InputArea, { InputAreaProps } from '../InputArea';
import FootMenu from '../FootMenu';
import MessageBox from '../MessageBox';
import { IMessageBoxProps } from '../MessageBox/MessageBox';
import IconFont from '../IconFont';
import { Menu } from '../FootMenu/Menu';
let styles = require('./ChatBox.css');

interface IChatBoxPros {
    loading: boolean;   // 加载状态
    menus?: Menu[]; // 菜单
    inputProps?: InputAreaProps;    // 输入框配置
    messageProps?: IMessageBoxProps;    // 消息配置
}

interface IChatBoxState {
    closed: boolean;    // 脚部菜单栏关闭状态
    canScroll: boolean; // 允许滚动
    hasNewMessage: boolean; // 新消息状态
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

    /**
     * 滚动
     * @param element 滚动元素
     * @param to 位置
     * @param duration 时间 
     */
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

    /**
     * 滚动消息栏到最底部
     */
    scrollBottom() {
        const { canScroll } = this.state;
        if (canScroll) {
            const main = document.getElementsByClassName(styles.main)[0];
            this.scrollTo(main, main.scrollHeight, 300);
            this.setState({ hasNewMessage: false });
        }
    }

    getNewMessageStyle() {
        const { closed } = this.state;
        if (!closed) {
            return { bottom: '255px' }
        }
        return { bottom: '55px' };
    }

    closeFootMenu() {
        this.setState({ closed: true });
    }

    render() {
        const { messageProps, inputProps, menus } = this.props;
        const { closed, hasNewMessage } = this.state;
        let mainStyle = !closed ? ({ bottom: '250px' }) : undefined;
        let footerStyle = !closed ? ({ height: '250px' }) : undefined;

        return (
            <div className={styles.container}>
                <div className={styles.main}
                    style={mainStyle}
                    onClick={() => { if (this.state.closed === false) { this.closeFootMenu() } }}>
                    <MessageBox {...messageProps} />
                </div>
                <div className={styles.footer} style={footerStyle}>
                    <InputArea {...inputProps}
                        closed={this.state.closed}
                        onCollapse={(state) => { this.setState({ closed: state }) }}
                        onSwitch={() => { this.closeFootMenu() }}
                        onSubmited={() => this.scrollBottom()}
                    />
                    <FootMenu style={{ height: '200px' }}
                        menus={menus} />
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