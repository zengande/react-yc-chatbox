import * as React from 'react';
import InputArea, { InputAreaProps } from '../InputArea';
import FootMenu from '../FootMenu';
import MessageBox from '../MessageBox';
import { IMessageBoxProps } from '../MessageBox/MessageBox';
import IconFont from '../IconFont';
import { Menu } from '../FootMenu/Menu';
import Header from '../Header/Header';
import Spin from '../spin/Spin';
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
    displayHeader?: boolean;
    extendsNode?: React.ReactNode;
    displayExtends?: boolean;
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
        displayHeader: true,
        displayExtends: false
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
        let height = this.getExtendsHeight();
        let mainStyle: React.CSSProperties = {};
        if (!closed) {
            mainStyle.bottom = `${250 + height}px`;
        } else {
            mainStyle.bottom = `${50 + height}px`
        }
        if (displayHeader) {
            mainStyle.top = '50px';
        }
        return mainStyle;
    }

    closeFootMenu() {
        this.setState({ closed: true });
    }

    getExtendsHeight(): number {
        // const { displayExtends } = this.props;
        let footExtends = document.getElementById('yc-foot-extends');
        let height = 0;
        if (footExtends !== null) {
            height = footExtends.offsetHeight;
        }
        return height
    }

    render() {
        const { messageProps, inputProps, headerProps, menus, displayHeader, loading, id, extendsNode } = this.props;
        const { closed, hasNewMessage } = this.state;

        let height = this.getExtendsHeight();
        let footerStyle = !closed ? ({ height: `${250 + height}px` }) : ({ height: `${50 + height}px` });

        return (
            <div className={styles.container} >
                {displayHeader && <Header className={styles.header} {...headerProps} />}
                <div className={styles.main}
                    id={id}
                    style={this.getMainStyle()}
                    onClick={() => { if (this.state.closed === false) { this.closeFootMenu() } }}>
                    {
                        loading ?
                            <div style={{ textAlign: 'center' }}>
                                <Spin />
                                <p>加载中...</p>
                            </div> :
                            <MessageBox {...messageProps} />
                    }

                </div>
                <div className={styles.footer} style={footerStyle}>
                    <div className={styles.extends} id="yc-foot-extends">{extendsNode}</div>
                    <InputArea {...inputProps}
                        closed={this.state.closed}
                        onCollapse={(state) => { this.setState({ closed: state }); !state && this.scrollBottom() }}
                        onSwitch={() => { this.closeFootMenu() }}
                        onSubmited={() => this.scrollBottom()}
                    />
                    <FootMenu style={{ height: '200px' }}
                        menus={menus}
                        closed={() => { this.setState({ closed: true }) }} />
                </div>
                {
                    hasNewMessage &&
                    <button className={styles.newmessage}
                        style={this.getNewMessageStyle()}
                        onClick={() => { this.scrollBottom() }}>
                        <IconFont style={{ fontSize: '12px', marginRight: '5px' }} type="down" />有新消息
                    </button>
                }
            </div >
        )
    }
}

export default ChatBox;