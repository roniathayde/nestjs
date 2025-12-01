import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Param, Post } from '@nestjs/common'
import z from 'zod'

const commentOnAnswerBodySchema = z.object({
	content: z.string(),
})

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
	constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

	@Post()
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(new ZodValidationPipe(commentOnAnswerBodySchema))
		body: CommentOnAnswerBodySchema,
		@Param('answerId') answerId: string,
	) {
		const { content } = body
		const userId = user.sub

		await this.commentOnAnswer.execute({
			content,
			answerId,
			authorId: userId,
		})
	}
}
