import * as React from 'react';
import * as ReactDOM from 'react-dom';

const defaultState = {
    alertStatus: false,
    alertTip: "提示",
    closeDialog: function () { },
    childs: ''
}

class Dialog extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            ...defaultState
        };
    }

    //打开弹窗
    open = (options: any) => {
        options = options || {};
        options.alertStatus = true;
        var props = options.props || {};

        var childs = this.renderChildren(props, options.childrens) || '';
        console.log(childs);
        this.setState({
            ...defaultState,
            ...options,
            childs
        })
    }

    renderChildren(props: any, childrens: any) {
        //遍历所有子组件
        var childs: any = [];
        childrens = childrens || [];
        var ps = {
            ...props,  //给子组件绑定props
            _close: this.close  //给子组件也绑定一个关闭弹窗的事件    
        };
        childrens.forEach((currentItem: any, index: number) => {
            childs.push(React.createElement(
                currentItem,
                {
                    ...ps,
                    key: index
                }
            ));
        })
        return childs;
    }

    //关闭弹窗
    close() {
        this.state.closeDialog();
        this.setState({
            ...defaultState
        })
    }

    render() {
        return (
            <div>
                ssss
            </div>
        )
    }
}

let div = document.createElement('div');
let props = {

};
document.body.appendChild(div);

let Box = ReactDOM.render(React.createElement(
    Dialog,
    props
), div);

export default Box;　　