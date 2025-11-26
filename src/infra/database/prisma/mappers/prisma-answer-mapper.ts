import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import type { Prisma, Answer as PrismaAnswer } from '@prisma/client'

export abstract class PrismaAnswerMapper {
	static toDomain(answerPrisma: PrismaAnswer): Answer {
		return Answer.create(
			{
				content: answerPrisma.content,
				questionId: new UniqueEntityID(answerPrisma.questionId),
				authorId: new UniqueEntityID(answerPrisma.authorId),
				createdAt: answerPrisma.createdAt,
				updatedAt: answerPrisma.updatedAt,
			},
			new UniqueEntityID(answerPrisma.id),
		)
	}

	static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
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
