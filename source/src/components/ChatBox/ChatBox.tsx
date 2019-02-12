import * as React from 'react';
import InputArea, { InputAreaProps } from '../InputArea';
import FootMenu from '../FootMenu';
import MessageBox from '../MessageBox';
import { IMessageBoxProps } from '../MessageBox/MessageBox';
import IconFont from '../IconFont';
import { Menu } from '../FootMenu/Menu';
import Header from '../Header/Header';
import Spin from '../Spin/Spin';
import common from '../../utils/common';
import { IHeaderProps } from '../Header/Header';
const styles = require('./ChatBox.css');

interface IChatBoxPros {
    id?: string;
    loading: boolean;   // 加载状态
    menus?: Menu[]; // 菜单
    headerProps?: IHeaderProps;
    inputProps?: InputAreaProps;    // 输入框配置
    messageProps?: IMessageBoxProps;    // 消息配置
    displayHeader?: boolean
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
        loading: true,
        displayHeader: true
    }

    /**
     * 滚动消息栏到最底部
     */
    scrollBottom() {
        const { canScroll } = this.state;
        if (canScroll) {
            const main = document.getElementsByClassName(styles.main)[0];
            common.scrollTo(main, main.scrollHeight, 300);
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

    getMainStyle() {
        const { closed } = this.state;
        const { displayHeader } = this.props;

        let mainStyle: React.CSSProperties = {};
        if (!closed) {
            mainStyle.bottom = '250px';
        }
        if (displayHeader) {
            mainStyle.top = '50px';
        }
        return mainStyle;
    }

    closeFootMenu() {
        this.setState({ closed: true });
    }

    render() {
        const { messageProps, inputProps, headerProps, menus, displayHeader, loading, id } = this.props;
        const { closed, hasNewMessage } = this.state;

        let footerStyle = !closed ? ({ height: '250px' }) : undefined;

        return (
            <div className={styles.container}>
                {displayHeader && <Header className={styles.header} {...headerProps} />}
                <div className={styles.main}
                    id={id}
                    style={this.getMainStyle()}
                    onClick={() => { if (this.state.closed === false) { this.closeFootMenu() } }}>
                    {
                        loading ?
                            <Spin /> :
                            <MessageBox {...messageProps} />
                    }
                </div>
                <div className={styles.footer} style={footerStyle}>
                    <InputArea {...inputProps}
                        closed={this.state.closed}
                        onCollapse={(state) => { this.setState({ closed: state }); !state && this.scrollBottom() }}
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