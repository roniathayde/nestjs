import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import z from 'zod'

const editAnswerBodySchema = z.object({
	content: z.string(),
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
	constructor(private editAnswerUseCase: EditAnswerUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(new ZodValidationPipe(editAnswerBodySchema))
		body: EditAnswerBodySchema,
		@Param('id') answerId: string,
	) {
		const { content } = body
		const userId = user.sub

		await this.editAnswerUseCase.execute({
			answerId,
			content,
			authorId: userId,
			attachmentIds: [],
		})
	}
}
