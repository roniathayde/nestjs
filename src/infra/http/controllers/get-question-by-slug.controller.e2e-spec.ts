import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { AttachmentFactory } from '../../../../test/factories/make-attachment'
import { QuestionFactory } from '../../../../test/factories/make-question'
import { QuestionAttachmentFactory } from '../../../../test/factories/make-question-attachment'
import { StudentFactory } from '../../../../test/factories/make-student'

describe('Get questions by slug (E2E)', () => {
	let app: INestApplication
	let jwt: JwtService
	let studentFactory: StudentFactory
	let attachmentFactory: AttachmentFactory
	let questionAttachmentFactory: QuestionAttachmentFactory
	let questionFactory: QuestionFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AttachmentFactory,
				QuestionAttachmentFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()
		jwt = moduleRef.get(JwtService)
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		attachmentFactory = moduleRef.get(AttachmentFactory)
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

		await app.init()
	})

	test('[GET] /questions/:slug', async () => {
		const user = await studentFactory.makePrismaStudent({
			name: 'John Doe',
		})

		const accessTooken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: 'Question 01',
			slug: Slug.create('question-01'),
		})

		const attachment = await attachmentFactory.makePrismaAttachment({
			title: 'attachment 1',
		})

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id,
		})

		const response = await request(app.getHttpServer())
			.get(`/questions/question-01`)
			.set('Authorization', `Bearer ${accessTooken}`)
			.send()

		expect(response.statusCode).toBe(200)

		expect(response.body).toEqual({
			question: expect.objectContaining({
				title: 'Question 01',
				author: 'John Doe',
				attachments: [
					expect.objectContaining({
						title: 'attachment 1',
					}),
				],
			}),
		})
	})
})
