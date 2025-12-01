import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, HttpCode, Param, Patch } from '@nestjs/common'

@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
	constructor(
		private chooseQuestionBestAnswerUseCaseUseCase: ChooseQuestionBestAnswerUseCase,
	) {}

	@Patch()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('answerId') answerId: string,
	) {
		const userId = user.sub

		await this.chooseQuestionBestAnswerUseCaseUseCase.execute({
			authorId: userId,
			answerId,
		})
	}
}
