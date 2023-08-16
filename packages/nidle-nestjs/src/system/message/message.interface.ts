export interface MessageEvent {
  type: 'notification' | 'message' | 'event'; // 消息类型: 通知 | 消息 | 待办事件
  title: string; // 消息标题
  content: string; // 消息内容
  body?: {
    // 消息主体信息
    type: string; // 类型
    id: number;
    projectId?: number;
    enviroment: string;
    sponsor?: string; // 事件发起人
    operator?: string; // 事件处理人
  };
  users?: Array<string>; // 消息接收用户；无则所有人都能接收
  timestamp: number; // 消息时间
}
