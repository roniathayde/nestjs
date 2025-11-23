import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import type { Prisma, Question as PrismaQuestion } from '@prisma/client'

export abstract class PrismaQuestionMapper {
	static toDomain(questionPrisma: PrismaQuestion): Question {
		return Question.create(
			{
				title: questionPrisma.title,
				content: questionPrisma.content,
				authorId: new UniqueEntityID(questionPrisma.authorId),
				bestAnswerId: questionPrisma.bestAnswerId
					? new UniqueEntityID(questionPrisma.bestAnswerId)
					: null,
				slug: Slug.create(questionPrisma.slug),
				createdAt: questionPrisma.createdAt,
				updatedAt: questionPrisma.updatedAt,
			},
			new UniqueEntityID(questionPrisma.id),
		)
	}

	static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
		return {
			id: question.id.toString(),
			authorId: question.authorId.toString(),
			bestAnswerId: question.bestAnswerId?.toString(),
			title: question.title,
			content: question.content,
			slug: question.slug.value,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		}
	}
}
