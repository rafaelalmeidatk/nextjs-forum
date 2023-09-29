import * as refreshAnswerCount from './refresh-answer-count.js'
import * as refreshLastActive from './refresh-last-active.js'
import * as lockLowEffortPost from './lock-low-effort-post.js'
import * as removePostAnswer from './remove-post-answer.js'

export const slashCommands = [
  refreshAnswerCount.command,
  refreshLastActive.command,
  lockLowEffortPost.command,
  removePostAnswer.command,
]
