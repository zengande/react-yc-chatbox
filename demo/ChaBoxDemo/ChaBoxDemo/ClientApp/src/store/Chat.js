import { MessageRoles, MessageTypes } from 'react-yc-chatbox';
import React from 'react';

const receiveMessageType = 'ReceiveMessage';
const requestHistoryType = 'RequestHistoryMessages';
const loadingData = 'LoadingData';

const initialState = {
    messages: [],
    loading: false
};

export const actionCreators = {
    receive: (message) => async (dispatch, getState) => {
        console.log(message);
        dispatch({ type: receiveMessageType, message });
    },
    requestHistoryMesssages: () => async (dispatch) => {
        dispatch({ type: loadingData, loading: true });
        setTimeout(() => {
            let messages = [];
            for (var i = 0; i < 20; i++) {
                messages.push({ content: `消息${i}`, type: MessageTypes.Text, role: i % 3 === 0 ? MessageRoles.Self : MessageRoles.Other, datetime: new Date() })
            }

            const list = (
                <ol>
                    <li>wjfa slk gj la skjf</li>
                    <li>wjfa slk gj la skjf</li>
                    <li>wjfa slk gj la skjf</li>
                    <li>wjfa slk gj la skjf</li>
                    <li>wjfa slk gj la skjf</li>
                </ol>
            )
            messages.push({ content: list, type: MessageTypes.Html, role:   MessageRoles.Other, datetime: new Date() })

            dispatch({ type: requestHistoryType, messages });
        }, 3000);


    }
};

export const reducer = (state, action) => {
    state = state || initialState;

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

    return state;
};
