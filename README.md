# react-yc-chatbox

配置
``` 

id                  string | undefined              消息栏id
loading             boolean | undefined             加载状态
menus               Menu[] | undefined              底部伸缩菜单
headerProps         IHeaderProps | undefined        头部配置
inputProps          InputAreaProps | undefined      输入框配置
messageProps        IMessageBoxProps | undefined    消息框配置
displayHeader       boolean | undefined             是否显示头部栏

```

头部属性
```
title               React.ReactNode | undefined     头部内容
className           string | undefined              头部class
```

消息框属性
```
dispalyTime         boolean | undefined                                 是否显示时间
displayAvatar       boolean | undefined                                 是否显示头像                   
displayStatus       boolean | undefined                                 是否显示消息状态
messages            Message[]                                           消息
messageTemplate     (message: Message) => React.ReactNode | undefined   消息模板
```

输入框属性
```
placeholder         string | undefined                                  输入框提示内容
closed              boolean | undefined                                 指示底部伸缩栏关闭状态
disabled            boolean | undefined                                 指示输入框是否可用
voiceEnabled        boolean | undefined                                 指示语音对话是否可用
onSubmit            (value: string | AudioBlob, type: MessageTypes) => boolean;    
onCollapse          (state: boolean) => void;
onSwitch            () => void;
onSubmited          () => void;
onRecordFailed      (e: IRecordError) => void;
```