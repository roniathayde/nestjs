import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachmentIds: z.array(z.uuid()),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
export class CreateQuestionController {
	constructor(private createQuestion: CreateQuestionUseCase) {}

	@Post()
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(new ZodValidationPipe(createQuestionBodySchema))
		body: CreateQuestionBodySchema,
	) {
		const { title, content, attachmentIds } = body
		const userId = user.sub

		await this.createQuestion.execute({
			title,
			content,
			authorId: userId,
			attachmentIds,
		})
	}
}
