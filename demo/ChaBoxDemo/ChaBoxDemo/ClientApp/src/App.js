import React from 'react';
import { ChatBox, MessageRoles, MessageTypes, scrollTo } from 'react-yc-chatbox';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from './store/Chat';

class App extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.messages.length > this.props.messages.length) {
            const chatbox = document.getElementById('messages');
            scrollTo(chatbox, chatbox.scrollHeight, 300);
        }
    }

    fetchData() {
        this.props.requestHistoryMesssages();
    }

    onSubmit(data, type) {
        console.log(data);
        const content = type === MessageTypes.Voice ? '' : data;
        // todo : upload voice data
        const { receive } = this.props;

        receive({ content: content, data: data, type: type, role: MessageRoles.Self, datetime: new Date() });

        return true;
    }

    render() {
        const menus = [
            { icon: 'tupian', text: '图片', onClick: () => { alert('图片') } },
            { icon: 'file', text: '文件', onClick: () => { alert('文件') } },
            { icon: 'yuyinshuru', text: '语音输入', onClick: () => { alert('语音输入') } },
        ]

        const title = (
            <React.Fragment>
                小摩摩 <i>v1.0</i>
            </React.Fragment>);

        return (
            <div className="App">
                <ChatBox
                    id="messages"
                    menus={menus}
                    displayHeader={true}
                    headerProps={{ title }}
                    messageProps={{ messages: this.props.messages, dispalyTime: true, hasNewMessage: true, displayAvatar: false, displayStatus: true }}
                    loading={this.props.loading}
                    inputProps={{ onSubmit: this.onSubmit.bind(this), onRecordFailed: (e) => { alert(e.message) } }} />
            </div>
        );
    }
}
export default connect(
    state => state.chat,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(App);
