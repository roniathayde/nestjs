import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

@Controller('/questions/comments/:commentId')
export class DeleteQuestionCommentController {
	constructor(
		private deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase,
	) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('commentId') commentId: string,
	) {
		const userId = user.sub

		await this.deleteQuestionCommentUseCase.execute({
			authorId: userId,
			questionCommentId: commentId,
		})
	}
}
