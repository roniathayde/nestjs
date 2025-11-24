import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import type { Prisma, User as PrismaUser } from '@prisma/client'

export abstract class PrismaStudentMapper {
	static toDomain(studentPrisma: PrismaUser): Student {
		return Student.create(
			{
				name: studentPrisma.name,
				email: studentPrisma.email,
				password: studentPrisma.password,
			},
			new UniqueEntityID(studentPrisma.id),
		)
	}

	static toPrisma(question: Student): Prisma.UserUncheckedCreateInput {
		return {
			id: question.id.toString(),
			name: question.name,
			email: question.email,
			password: question.password,
		}
	}
}
