import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import type { Attachment as PrismaAttachment } from '@prisma/client'

export abstract class PrismaQuestionAttachmentMapper {
	static toDomain(attachmentPrisma: PrismaAttachment): QuestionAttachment {
		if (!attachmentPrisma.questionId) {
			throw new Error('Invalid Comment: Missing questionId')
		}

		return QuestionAttachment.create(
			{
				attachmentId: new UniqueEntityID(attachmentPrisma.id),
				questionId: new UniqueEntityID(attachmentPrisma.questionId),
			},
			new UniqueEntityID(attachmentPrisma.id),
		)
	}
}
