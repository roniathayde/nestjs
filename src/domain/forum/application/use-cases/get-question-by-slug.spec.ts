import { makeAttachment } from '../../../../../test/factories/make-attachment'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { makeQuestionAttachment } from '../../../../../test/factories/make-question-attachment'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryAttachmentsRepository } from '../../../../../test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

let sut: GetQuestionBySlugUseCase

describe(`Get question by slug`, () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()

		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		)

		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository) // System Under Test
	})

	it('should be able to get a question by slug', async () => {
		const student = makeStudent({ name: 'John Doe' })

		inMemoryStudentsRepository.items.push(student)

		const newQuestion = makeQuestion({
			authorId: student.id,
			slug: Slug.create(`example-question`),
		})

		inMemoryQuestionsRepository.create(newQuestion)

		const attachment = makeAttachment({
			title: 'attachment 1',
		})

		inMemoryAttachmentsRepository.items.push(attachment)

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				attachmentId: attachment.id,
				questionId: newQuestion.id,
			}),
		)

		const result = await sut.execute({
			slug: newQuestion.slug.value,
		})

		expect(result.isRight()).toEqual(true)

		expect(result.value).toEqual({
			question: expect.objectContaining({
				title: newQuestion.title,
				author: 'John Doe',
				attachments: [
					expect.objectContaining({
						title: 'attachment 1',
					}),
				],
			}),
		})
	})
})
