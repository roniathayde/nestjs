import { InMemoryNotificationsRepository } from '../../../../../test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sut: SendNotificationUseCase

describe(`Send notification`, () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

		sut = new SendNotificationUseCase(inMemoryNotificationsRepository) // System Under Test
	})

	it('should be able to send a notification', async () => {
		const result = await sut.execute({
			recipientId: `1`,
			title: `Nova notificação`,
			content: `Conteudo da notificação`,
		})

		expect(result.isRight()).toEqual(true)
		expect(inMemoryNotificationsRepository.items[0]).toEqual(
			result?.value?.notification,
		)
	})
})
