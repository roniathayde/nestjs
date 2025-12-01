import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { makeQuestionAttachment } from '../../../../../test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe(`Edit question`, () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		)
		sut = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentsRepository,
		) // System Under Test
	})

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID(`author-1`),
			},
			new UniqueEntityID(`question-1`),
		)

		inMemoryQuestionsRepository.create(newQuestion)

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID('1'),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID('2'),
			}),
		)

		await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: `author-1`,
			title: `Pergunta teste`,
			content: `Conteudo teste`,
			attachmentIds: ['1', '3'],
		})

		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: `Pergunta teste`,
			content: `Conteudo teste`,
		})
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toHaveLength(2)
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
		])
	})

	it('should not be able to edit a question from another user', async () => {
		const question = makeQuestion(
			{
				authorId: new UniqueEntityID(`author-1`),
			},
			new UniqueEntityID(`question-1`),
		)

		inMemoryQuestionsRepository.create(question)

		const result = await sut.execute({
			questionId: question.id.toString(),
			authorId: `author-2`,
			title: `pergunta teste`,
			content: `conteudo teste`,
			attachmentIds: [],
		})

		expect(result.isLeft()).toEqual(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
