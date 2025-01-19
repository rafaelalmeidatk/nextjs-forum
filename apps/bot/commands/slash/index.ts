import * as refreshAnswerCount from './refresh-answer-count.ts'
import * as refreshLastActive from './refresh-last-active.ts'
import * as lockLowEffortPost from './lock-low-effort-post.ts'
import * as removePostAnswer from './remove-post-answer.ts'
import * as addRegularMemberRole from './add-regular-member-role.ts'
import * as revokeRegularMemberRole from './revoke-regular-member-role.ts'
import * as getAnswerCount from './get-answer-count.ts'

export const slashCommands = [
  refreshAnswerCount.command,
  refreshLastActive.command,
  lockLowEffortPost.command,
  removePostAnswer.command,
  addRegularMemberRole.command,
  revokeRegularMemberRole.command,
  getAnswerCount.command,
]
