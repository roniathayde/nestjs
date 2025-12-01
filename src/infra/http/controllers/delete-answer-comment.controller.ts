import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

@Controller('/answers/comments/:answerCommentId')
export class DeleteAnswerCommentController {
	constructor(
		private deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase,
	) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('answerCommentId') answerCommentId: string,
	) {
		const userId = user.sub

		await this.deleteAnswerCommentUseCase.execute({
			authorId: userId,
			answerCommentId,
		})
	}
}
