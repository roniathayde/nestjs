import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
	save(answer: Answer): Promise<void>
	findById(id: string): Promise<Answer | null>
	findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<Answer[]>
	create(answer: Answer): Promise<void>
	delete(answer: Answer): Promise<void>
}
