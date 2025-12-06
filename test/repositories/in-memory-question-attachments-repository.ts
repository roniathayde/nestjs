import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	public items: QuestionAttachment[] = []

	async createMany(attachments: QuestionAttachment[]): Promise<void> {
		this.items.push(...attachments)
	}

	async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
		this.items = this.items.filter((item) => {
			return !attachments.some((attachment) => attachment.equals(item))
		})
	}

	async create(questionAttachment: QuestionAttachment) {
		this.items.push(questionAttachment)
	}

	async findManyByQuestionId(questionId: string) {
		const questionAttachment = this.items.filter(
			(item) => item.questionId.toString() === questionId,
		)

		return questionAttachment
	}

	async deleteManyByQuestionId(questionId: string) {
		const questionAttachment = this.items.filter(
			(item) => item.questionId.toString() !== questionId,
		)

		this.items = questionAttachment
	}
}
