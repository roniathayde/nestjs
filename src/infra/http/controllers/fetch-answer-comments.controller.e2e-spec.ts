import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'

import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { AnswerFactory } from '../../../../test/factories/make-answer'
import { AnswerCommentFactory } from '../../../../test/factories/make-answer-comment'
import { QuestionFactory } from '../../../../test/factories/make-question'
import { StudentFactory } from '../../../../test/factories/make-student'

describe('Fetch questions comments (E2E)', () => {
	let app: INestApplication
	let jwt: JwtService
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let answerFactory: AnswerFactory
	let answerCommentFactory: AnswerCommentFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AnswerFactory,
				AnswerCommentFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()
		jwt = moduleRef.get(JwtService)
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		answerFactory = moduleRef.get(AnswerFactory)
		answerCommentFactory = moduleRef.get(AnswerCommentFactory)

		await app.init()
	})

	test('[GET] /answers/:questionId/comments', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessTooken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: 'Question 01',
		})

		const answer = await answerFactory.makePrismaAnswer({
			questionId: question.id,
			authorId: user.id,
		})

		const answerId = answer.id.toString()

		await Promise.all([
			answerCommentFactory.makePrismaAnswerComment({
				authorId: user.id,
				answerId: answer.id,
				content: 'comment 1',
			}),
			answerCommentFactory.makePrismaAnswerComment({
				authorId: user.id,
				answerId: answer.id,
				content: 'comment 2',
			}),
		])

		const response = await request(app.getHttpServer())
			.get(`/answers/${answerId}/comments`)
			.set('Authorization', `Bearer ${accessTooken}`)
			.send()

		expect(response.statusCode).toBe(200)

		expect(response.body.comments).toHaveLength(2)
	})
})
