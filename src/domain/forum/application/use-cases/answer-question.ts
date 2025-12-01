import { right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionUseCaseRequest {
	authorId: string
	questionId: string
	attachmentIds: string[]
	content: string
}

type AnswerQuestionUseCaseResponse = Either<
	null,
	{
		answer: Answer
	}
>

@Injectable()
export class AnswerQuestionUseCase {
	constructor(private answerRepository: AnswersRepository) {}

	async execute({
		authorId,
		questionId,
		content,
		attachmentIds,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityID(authorId),
			questionId: new UniqueEntityID(questionId),
		})

		const answerAttachments = attachmentIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityID(attachmentId),
				answerId: answer.id,
			})
		})

		answer.attachments = new AnswerAttachmentList(answerAttachments)

		await this.answerRepository.create(answer)

		return right({ answer })
	}
}
