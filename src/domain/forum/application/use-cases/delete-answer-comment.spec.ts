import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comment-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe(`Delete Answer Comment`, () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository =
			new InMemoryAnswerCommentsRepository()

		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository) // System Under Test
	})

	it('should be able to delete a answer comment', async () => {
		const answerComment = makeAnswerComment()

		await inMemoryAnswerCommentsRepository.create(answerComment)

		await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: answerComment.authorId.toString(),
		})

		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete another user answer comment', async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityID(`author-1`),
		})

		await inMemoryAnswerCommentsRepository.create(answerComment)

		const result = await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: `author-2`,
		})

		expect(result.isLeft()).toEqual(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
