import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
	implements AnswerAttachmentsRepository
{
	public items: AnswerAttachment[] = []

	async create(answerAttachment: AnswerAttachment) {
		this.items.push(answerAttachment)
	}

	async findManyByAnswerId(answerId: string) {
		const answerAttachment = this.items.filter(
			(item) => item.answerId.toString() === answerId,
		)

		return answerAttachment
	}

	async deleteManyByAnswerId(answerId: string) {
		const answerAttachment = this.items.filter(
			(item) => item.answerId.toString() !== answerId,
		)

		this.items = answerAttachment
	}
}
