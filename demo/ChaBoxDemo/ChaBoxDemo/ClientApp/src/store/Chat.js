import { MessageRoles, MessageTypes, MessageStatus, guid } from 'react-yc-chatbox';
import axios from 'axios';

const receiveMessageType = 'ReceiveMessage';
const requestHistoryType = 'RequestHistoryMessages';
const loadingData = 'LoadingData';
const removeMessage = 'RemoveMessage';
const messageSent = 'MessageSent';
const sendMessage = 'SendMessage';
const saveDDUserInfo = 'SaveDDUserInfo';

const initialState = {
    messages: [],
    loading: false,
    ddUser: {}
};

export const actionCreators = {
    send: (message,ddUserId) => async (dispatch) => {
        dispatch({ type: sendMessage, message });
        const question = message.type === MessageTypes.Text ? message.content : message.data.text;
        axios({
            url: 'http://10.0.1.46:5005/api/v1/messages',
            method: 'post',
            data: {
                question,
                userId: ddUserId
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
            const { data } = response;
            dispatch({ type: messageSent, id: message.id, result: true });
            if (data.success) {
                // todo : 判断出差申请
                if (data.data.intent === '出差申请') {
                    const msg = { name: '小摩摩', id: guid(), content: '开始提申请', type: MessageTypes.Text, role: MessageRoles.Other, datetime: new Date() };
                    dispatch({ type: receiveMessageType, message: { ...msg } });
                    return;
                }
                const msg = { name: '小摩摩',id: guid(), content: data.message, type: MessageTypes.Text, role: MessageRoles.Other, datetime: new Date() };
                dispatch({ type: receiveMessageType, message: { ...msg } });
            }
        }).catch((error) => {
            dispatch({ type: messageSent, id: message.id, result: false });
            dispatch({ type: receiveMessageType, message: { name:'小摩摩', id: guid(), content: '发生了错误', type: MessageTypes.Text, role: MessageRoles.Other, datetime: new Date() } });
        })
    },
    receive: (message) => async (dispatch, getState) => {
        dispatch({ type: receiveMessageType, message });
    },
    sent: (id) => async (dispatch) => {
        dispatch({ type: messageSent, id });
    },
    remove: (id) => async (dispatch) => {
        if (id === '') {
            return;
        }
        dispatch({ type: removeMessage, id });
    },
    requestHistoryMesssages: () => async (dispatch) => {
        dispatch({ type: loadingData, loading: true });
        setTimeout(() => {
            let messages = [];
            dispatch({ type: requestHistoryType, messages });
        }, 1000);


    },
    saveDDUserInfo: (userInfo) => async (dispatch) => {
        dispatch({ type: saveDDUserInfo, userInfo })
        dispatch({ type: receiveMessageType, message: { name: '小摩摩', content: JSON.stringify(userInfo), id: guid(), type: MessageTypes.Text, role: MessageRoles.Other, datetime: new Date() } })
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === saveDDUserInfo) {
        return {
            ...state,
            ddUser: action.userInfo
        };
    }

    if (action.type === sendMessage) {
        return {
            ...state,
            messages: state.messages.concat(action.message)
        };
    }

    if (action.type === receiveMessageType) {
        return {
            ...state,
            messages: state.messages.concat(action.message)
        };
    }

    if (action.type === requestHistoryType) {
        return {
            ...state,
            messages: action.messages,
            loading: false
        }
    }

    if (action.type === loadingData) {
        return {
            ...state,
            loading: action.loading
        }
    }

    if (action.type === removeMessage) {
        const messages = state.messages.filter(message => message.id !== action.id);
        return ({
            ...state,
            messages
        })
    }

    if (action.type === messageSent) {
        const messages = state.messages.map(message => {
            if (message.id && message.id === action.id) {
                message.status = action.result ? MessageStatus.Success : MessageStatus.Fail;
            }
            return message;
        });
        return ({
            ...state,
            messages
        })
    }


    return state;
};
