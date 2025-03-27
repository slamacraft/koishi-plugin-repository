import {Config} from "./index";
import {Context} from "koishi";

const path = "/v1/chat-messages"

export interface DifyReq {
  query: string
  user: string
  conversation_id?: string
  response_mode?: "blocking" | "stream"
  // @see https://docs.dify.ai/docs/api/chat-messages/create-chat-message#inputs
  inputs?: object
}

export interface DifyResp {
  answer: string
  conversation_id: string
  message_id: string
}

/**
 * 向dify发送请求
 * @param config
 * @param req
 */
export async function sendDifyMsg(config: Config, req: DifyReq): Promise<DifyResp> {
  req.response_mode = req.response_mode || "blocking"
  req.inputs = req.inputs || {}

  let difyResp = await fetch(`${config.url}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.appKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req)
  })
  let result = await difyResp.json()
  return result
}
