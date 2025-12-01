import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'

import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { QuestionFactory } from '../../../../test/factories/make-question'
import { QuestionCommentFactory } from '../../../../test/factories/make-question-comment'
import { StudentFactory } from '../../../../test/factories/make-student'

describe('Fetch questions comments (E2E)', () => {
	let app: INestApplication
	let jwt: JwtService
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
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
		jwt = moduleRef.get(JwtService)
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		questionCommentFactory = moduleRef.get(QuestionCommentFactory)

		await app.init()
	})

	test('[GET] /questions/:questionId/comments', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessTooken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: 'Question 01',
		})

		const questionId = question.id.toString()

		await Promise.all([
			questionCommentFactory.makePrismaQuestionComment({
				authorId: user.id,
				questionId: question.id,
				content: 'comment 1',
			}),
			questionCommentFactory.makePrismaQuestionComment({
				authorId: user.id,
				questionId: question.id,
				content: 'comment 2',
			}),
		])

		const response = await request(app.getHttpServer())
			.get(`/questions/${questionId}/comments`)
			.set('Authorization', `Bearer ${accessTooken}`)
			.send()

		expect(response.statusCode).toBe(200)

		expect(response.body.comments).toHaveLength(2)
	})
})
