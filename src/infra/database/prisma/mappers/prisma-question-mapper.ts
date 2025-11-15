import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import type { Question as PrismaQuestion } from '@prisma/client'

export abstract class PrismaQuestionMapper {
	static toDomain(questionPrisma: PrismaQuestion): Question {
		return Question.create(
			{
				title: questionPrisma.title,
				content: questionPrisma.content,
				authorId: new UniqueEntityID(questionPrisma.authorId),
				bestAnswerId: undefined,
				slug: Slug.create(questionPrisma.slug),
				createdAt: questionPrisma.createdAt,
				updatedAt: questionPrisma.updatedAt,
			},
			new UniqueEntityID(questionPrisma.id),
		)
	}
}
