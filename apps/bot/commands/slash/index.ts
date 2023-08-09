import * as refreshAnswerCount from './refresh-answer-count.js'
import * as lockLowEffortPost from './lock-low-effort-post.js'

export const slashCommands = [
  refreshAnswerCount.command,
  lockLowEffortPost.command,
]
