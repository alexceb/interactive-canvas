import { CURRENT_USER } from "./comments.constants";
import type { Action, Workspace } from "./comments.types";
import { isValidMessageText } from "./message.utils";

export function workspaceReducer(state: Workspace, action: Action): Workspace {
  if (action.type === "workspace/reset") return action.workspace;
  if (action.type === "thread/add") {
    const thread = action.thread;
    if (
      !thread.id.trim() ||
      state.threads[thread.id] ||
      thread.messages.length !== 1 ||
      thread.messages[0].authorId !== CURRENT_USER ||
      !isValidMessageText(thread.messages[0].text) ||
      !Number.isFinite(thread.anchor.x) ||
      !Number.isFinite(thread.anchor.y)
    )
      return state;
    return { ...state, threads: { ...state.threads, [thread.id]: thread } };
  }
  const thread = state.threads[action.threadId];
  if (!thread) return state;
  let next = thread;
  if (action.type === "thread/resolve") {
    if (thread.resolved === action.resolved) return state;
    next = { ...thread, resolved: action.resolved };
  }
  if (action.type === "message/reply") {
    if (
      !isValidMessageText(action.message.text) ||
      action.message.authorId !== CURRENT_USER ||
      thread.messages.some((message) => message.id === action.message.id)
    )
      return state;
    next = { ...thread, messages: [...thread.messages, action.message] };
  }
  if (action.type === "message/edit") {
    const target = thread.messages.find((message) => message.id === action.messageId);
    if (
      !target ||
      target.authorId !== CURRENT_USER ||
      !isValidMessageText(action.text) ||
      target.text === action.text.trim()
    )
      return state;
    next = {
      ...thread,
      messages: thread.messages.map((message) =>
        message.id === action.messageId ? { ...message, text: action.text.trim(), editedAt: action.editedAt } : message,
      ),
    };
  }
  return { ...state, threads: { ...state.threads, [thread.id]: next } };
}
