import {Context} from "koishi";

declare module "koishi" {
  interface Tables {
    conversation: Conversation
  }
}

export interface Conversation {
  conversationId: string  // 对应的Dify对话id，也是表的id
  userId: string    // 发送人id
  groupId: string | "0"     // 群聊id, 如果没有则为0
}

export function initTable(ctx: Context) {
  ctx.model.extend('conversation', {
    userId: {
      type: 'string',
      nullable: false,
    },
    groupId: {
      type: 'string',
      nullable: false,
      initial: '0'
    },
    conversationId: 'string',
  }, {
    primary: 'conversationId'
  })
}
