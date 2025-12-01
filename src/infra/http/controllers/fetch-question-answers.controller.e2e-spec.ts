import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'

import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { AnswerFactory } from '../../../../test/factories/make-answer'
import { QuestionFactory } from '../../../../test/factories/make-question'
import { StudentFactory } from '../../../../test/factories/make-student'

describe('Fetch questions answers (E2E)', () => {
	let app: INestApplication
	let jwt: JwtService
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let answerFactory: AnswerFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AnswerFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		jwt = moduleRef.get(JwtService)
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		answerFactory = moduleRef.get(AnswerFactory)

		await app.init()
	})

	test('[GET] /questions/:questionId/answers', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessTooken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: 'Question 01',
		})

		const questionId = question.id

		await Promise.all([
			answerFactory.makePrismaAnswer({
				authorId: user.id,
				questionId,
				content: 'answer 1',
			}),
			answerFactory.makePrismaAnswer({
				authorId: user.id,
				questionId,
				content: 'answer 2',
			}),
		])

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id}/answers`)
			.set('Authorization', `Bearer ${accessTooken}`)
			.send()

		expect(response.statusCode).toBe(200)

		expect(response.body).toEqual({
			answers: expect.arrayContaining([
				expect.objectContaining({ content: 'answer 1' }),
				expect.objectContaining({ content: 'answer 2' }),
			]),
		})
	})
})
