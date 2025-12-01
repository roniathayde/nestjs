import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'

import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { QuestionFactory } from '../../../../test/factories/make-question'
import { StudentFactory } from '../../../../test/factories/make-student'

describe('Comment on question (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let jwt: JwtService
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)

		await app.init()
	})

	test('[POST] /questions/:questionId/comments', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessTooken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const questionId = question.id.toString()

		const response = await request(app.getHttpServer())
			.post(`/questions/${questionId}/comments`)
			.set('Authorization', `Bearer ${accessTooken}`)
			.send({
				content: 'new comment',
			})

		expect(response.statusCode).toBe(201)

		const commentOnDatabase = await prisma.comment.findFirst({
			where: {
				content: 'new comment',
			},
		})

		expect(commentOnDatabase).toBeTruthy()
		expect(commentOnDatabase?.content).toEqual('new comment')
	})
})
