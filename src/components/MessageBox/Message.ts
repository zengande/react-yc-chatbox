export interface Message {
    id: string,
    content: string,
    role: MessageRoles,
    type: MessageTypes,
    data?: any
}

export enum MessageRoles {
    Other = 2,
    Self = 4
}

export enum MessageTypes {
    Text = 2,
    Voice = 4,
    Image = 8,
    Html = 16
}