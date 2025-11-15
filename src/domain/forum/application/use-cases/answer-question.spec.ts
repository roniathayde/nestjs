import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let sut: AnswerQuestionUseCase

describe(`Create Answer`, () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		)

		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository) // System Under Test
	})

	it('should be able to create an answer', async () => {
		const result = await sut.execute({
			questionId: `1`,
			instructorId: `Nova pergunta`,
			content: `Conteudo da pergunta`,
			attachmentIds: ['1', '2'],
		})

		expect(result.isRight()).toEqual(true)
		expect(inMemoryAnswersRepository.items[0]).toEqual(
			result?.value?.answer,
		)
		expect(
			inMemoryAnswersRepository.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
		])
		expect(
			inMemoryAnswersRepository.items[0].attachments.currentItems,
		).toHaveLength(2)
	})
})
