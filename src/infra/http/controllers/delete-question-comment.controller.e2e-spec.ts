import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'

import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { QuestionFactory } from '../../../../test/factories/make-question'
import { QuestionCommentFactory } from '../../../../test/factories/make-question-comment'
import { StudentFactory } from '../../../../test/factories/make-student'

describe('Delete question comment (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let jwt: JwtService
	let questionFactory: QuestionFactory
	let studentFactory: StudentFactory
	let questionCommentFactory: QuestionCommentFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				QuestionCommentFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()
		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		questionCommentFactory = moduleRef.get(QuestionCommentFactory)

		await app.init()
	})

	test('[DELETE] /questions/comments/:commentId', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessTooken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const questionComment =
			await questionCommentFactory.makePrismaQuestionComment({
				authorId: user.id,
				questionId: question.id,
				content: 'question comment',
			})

		const questionCommentId = questionComment.id.toString()

		const response = await request(app.getHttpServer())
			.delete(`/questions/comments/${questionCommentId}`)
			.set('Authorization', `Bearer ${accessTooken}`)
			.send()

		const commentOnDatabase = await prisma.comment.findUnique({
			where: {
				id: questionCommentId,
			},
		})

		expect(response.statusCode).toBe(204)
		expect(commentOnDatabase).toBeNull()
	})
})
