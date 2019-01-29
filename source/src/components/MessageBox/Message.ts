import * as React from 'react';

export interface Message {
    id?: string;
    content: React.ReactNode;
    role: MessageRoles;
    type: MessageTypes;
    data?: any;
    datetime: Date;
    additional?: React.ReactNode;
    avatar?: string;
    name?: string;
    status?: MessageStatus;
    statusMsg?: string;
}

export enum MessageRoles {
    Other = 2,
    Self = 4,
    System = 8
}

export enum MessageStatus {
    Success = 2,
    Fail = 4
}

export enum MessageTypes {
    Text = 2,
    Voice = 4,
    Image = 8,
    Html = 16,
    Notice = 32
}