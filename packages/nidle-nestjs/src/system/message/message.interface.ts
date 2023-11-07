export interface MessageData {
  /** 消息类型: 通知 | 消息 | 待办事件 */
  type: 'notification' | 'message' | 'event';
  /** 消息标题 */
  title: string;
  /** 消息内容 */
  content: string;
  /** 消息时间 */
  timestamp?: number;
  /** 消息主体信息 */
  body?: {
    id: number;
    /** 业务动作类型 */
    type: string;
    environment: string;
    projectId?: number;
    /** 事件发起人 */
    sponsor?: string;
    /** 事件处理人 */
    operator?: string;
  };
  /** 消息接收用户；无则所有人都能接收 */
  users?: Array<string>;
}
