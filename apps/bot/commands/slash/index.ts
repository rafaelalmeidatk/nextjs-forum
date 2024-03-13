import * as refreshAnswerCount from './refresh-answer-count.js'
import * as refreshLastActive from './refresh-last-active.js'
import * as lockLowEffortPost from './lock-low-effort-post.js'
import * as removePostAnswer from './remove-post-answer.js'
import * as givePoints from './give-points.js'
import * as answers from './answers.js'
export const slashCommands = [
  refreshAnswerCount.command,
  refreshLastActive.command,
  lockLowEffortPost.command,
  removePostAnswer.command,
  givePoints.command,
  answers.command,
]
