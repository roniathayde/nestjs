import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import type { Prisma, Comment as PrismaComment } from '@prisma/client'

export abstract class PrismaAnswerCommentMapper {
	static toDomain(answerPrisma: PrismaComment): AnswerComment {
		if (!answerPrisma.answerId) {
			throw new Error('Invalid Comment: Missing answerId')
		}

		return AnswerComment.create(
			{
				content: answerPrisma.content,
				authorId: new UniqueEntityID(answerPrisma.authorId),
				answerId: new UniqueEntityID(answerPrisma.answerId),
				createdAt: answerPrisma.createdAt,
				updatedAt: answerPrisma.updatedAt,
			},
			new UniqueEntityID(answerPrisma.id),
		)
	}

	static toPrisma(answer: AnswerComment): Prisma.CommentUncheckedCreateInput {
		return {
			id: answer.id.toString(),
			authorId: answer.authorId.toString(),
			answerId: answer.answerId.toString(),
			content: answer.content,
			createdAt: answer.createdAt,
			updatedAt: answer.updatedAt,
		}
	}
}
