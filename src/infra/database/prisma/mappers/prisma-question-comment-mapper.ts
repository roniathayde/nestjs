import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import type { Prisma, Comment as PrismaComment } from '@prisma/client'

export abstract class PrismaQuestionCommentMapper {
	static toDomain(questionPrisma: PrismaComment): QuestionComment {
		if (!questionPrisma.questionId) {
			throw new Error('Invalid Comment: Missing questionId')
		}

		return QuestionComment.create(
			{
				content: questionPrisma.content,
				authorId: new UniqueEntityID(questionPrisma.authorId),
				questionId: new UniqueEntityID(questionPrisma.questionId),
				createdAt: questionPrisma.createdAt,
				updatedAt: questionPrisma.updatedAt,
			},
			new UniqueEntityID(questionPrisma.id),
		)
	}

	static toPrisma(
		answer: QuestionComment,
	): Prisma.CommentUncheckedCreateInput {
		return {
			id: answer.id.toString(),
			authorId: answer.authorId.toString(),
			questionId: answer.questionId.toString(),
			content: answer.content,
			createdAt: answer.createdAt,
			updatedAt: answer.updatedAt,
		}
	}
}
