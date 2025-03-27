import {Context, Schema, Session} from 'koishi'
import {atMe, getTextContent} from "./utils";
import {sendDifyMsg} from "./difyserver";
import {initTable} from "./tables";

export const name = 'dify-plugin'

export const inject = {
  optional: [],
  required: ['database']
}

export interface Config {
  url: string,
  appKey: string
}

export const Config: Schema<Config> = Schema.object({
  url: Schema.string().description("Dify后台地址"),
  appKey: Schema.string().description("Dify AppKey"),
})

export function apply(ctx: Context, config: Config) {
  // 初始化表结构
  initTable(ctx)

  // 注册清除会话事件
  ctx.command('dify-clear', '清理上下文')
    .action(async ({session}) => {
      await ctx.database.remove('conversation', {
        userId: session.userId,
        groupId: session.channelId
      })
    })

  // 注册事件，对私聊事件以及群聊里at时间使用dify进行回应
  ctx.middleware((session, next) => {
    if (session.subtype === "group" && !atMe(session)) {
      return
    }
    chatWithDify(ctx, config, session)
      .then(it => {
         session.send(it)
      })

    return next()
  })


}

async function chatWithDify(ctx: Context, config: Config, session: Session) {
  let textContent = getTextContent(session)

  let conversation = await ctx.database.get('conversation', {
    userId: session.userId,
    groupId: session.channelId
  })

  let conversationId = conversation?.[0]?.conversationId || ''

  let resp = await sendDifyMsg(config, {
    query: textContent,
    user: session.author.id,
    conversation_id: conversationId
  })

  if (!conversationId) {
    // 如果没有会话id，则创建会话id
    await ctx.database.create('conversation', {
      userId: session.userId,
      groupId: session.channelId,
      conversationId: resp.conversation_id
    })
  }

  return resp.answer
}
