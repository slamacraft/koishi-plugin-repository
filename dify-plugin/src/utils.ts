import {Session} from 'koishi'

export function atMe(session: Session): boolean {
  return session.elements.some(it => it.type === "at" && it.attrs.id === session.selfId)
}

export function getTextContent(session: Session): string {
  // 把消息拼成一段
  return session.elements.filter(it => it.type === "text")
    .map(it => it.attrs.content.trim())
    .join(' ')
}
