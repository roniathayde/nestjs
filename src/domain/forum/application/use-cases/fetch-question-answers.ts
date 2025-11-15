import { right, type Either } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersQuestionsUseCaseRequest {
	questionId: string
	page: number
}

type FetchQuestionAnswersQuestionsUseCaseResponse = Either<
	null,
	{
		answers: Answer[]
	}
>

export class FetchQuestionAnswersQuestionsUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		questionId,
		page,
	}: FetchQuestionAnswersQuestionsUseCaseRequest): Promise<FetchQuestionAnswersQuestionsUseCaseResponse> {
		const answers = await this.answersRepository.findManyByQuestionId(
			questionId,
			{ page },
		)

		return right({
			answers,
		})
	}
}
