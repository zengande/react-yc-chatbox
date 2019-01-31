# react-yc-chatbox
使用方法
``` 
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [
                { content: (<b>hello</b>), role: MessageRoles.Other, type: MessageTypes.Html, datetime: new Date('2018-12-12 15:45:56') },
                { content: '以上是历史消息', role: MessageRoles.System, type: MessageTypes.Notice, datetime: new Date('2018-12-12 15:45:56') }
            ],
            loading: false
        }
    }

    onSubmit(value, type) {
        console.log(value);
        const content = type === MessageTypes.Voice ? '' : value;
        // todo : upload voice data
        this.setState((preState) =>
            ({ messages: preState.messages.concat({ content: content, data: value, type: type, role: MessageRoles.Self, datetime: new Date() }) }));

        return true;
    }

    render() {
        const menus = [
            { icon: 'tupian', text: '图片', onClick: () => { alert('图片') } },
            { icon: 'file', text: '文件', onClick: () => { alert('文件') } },
            { icon: 'yuyinshuru', text: '语音输入', onClick: () => { alert('语音输入') } },
        ]
        return (
            <div className="App">
                <ChatBox
                    menus={menus}
                    messageProps={{ messages: this.state.messages, dispalyTime:false, hasNewMessage: true, displayAvatar: false, displayStatus: false }}
                    loading={this.state.loading}
                    inputProps={{ onSubmit: this.onSubmit.bind(this) }} />
            </div>
        );
    }
}

```