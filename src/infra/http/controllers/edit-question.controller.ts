import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import z from 'zod'

const editQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
	constructor(private editQuestionUseCase: EditQuestionUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(new ZodValidationPipe(editQuestionBodySchema))
		body: EditQuestionBodySchema,
		@Param('id') questionId: string,
	) {
		const { title, content } = body
		const userId = user.sub

		await this.editQuestionUseCase.execute({
			title,
			content,
			authorId: userId,
			attachmentIds: [],
			questionId,
		})
	}
}
