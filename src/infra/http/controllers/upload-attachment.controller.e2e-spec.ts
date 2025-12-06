import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'

import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { StudentFactory } from '../../../../test/factories/make-student'

describe('Upload attachment (E2E)', () => {
	let app: INestApplication
	let jwt: JwtService
	let studentFactory: StudentFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		jwt = moduleRef.get(JwtService)
		studentFactory = moduleRef.get(StudentFactory)

		await app.init()
	})

	test('[POST] /attachments', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessTooken = jwt.sign({ sub: user.id.toString() })

		const response = await request(app.getHttpServer())
			.post(`/attachments`)
			.set('Authorization', `Bearer ${accessTooken}`)
			.attach('file', './test/e2e/sample-upload.jpeg')

		expect(response.statusCode).toBe(201)
		expect(response.body).toEqual({
			attachmentId: expect.any(String),
		})
	})
})
