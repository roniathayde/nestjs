import type { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
	static toHTTP(questionDetails: QuestionDetails) {
		return {
			id: questionDetails.questionId.toString(),
			title: questionDetails.title,
			author: questionDetails.author,
			slug: questionDetails.slug.value,
			authorId: questionDetails.authorId.toString(),
			content: questionDetails.content,
			bestAnswerId: questionDetails.bestAnswerId?.toString(),
			attachments: questionDetails.attachments.map(
				AttachmentPresenter.toHTTP,
			),
			createdAt: questionDetails.createdAt,
			updatedAt: questionDetails.updatedAt,
		}
	}
}
