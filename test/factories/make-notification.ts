import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import {
	Notification,
	type NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

export function makeNotification(
	override: Partial<NotificationProps> = {},
	id?: UniqueEntityID,
) {
	const notification = Notification.create(
		{
			recipientId: new UniqueEntityID(),
			title: faker.lorem.sentence(4),
			content: faker.lorem.sentence(10),
			...override,
		},
		id,
	)

	return notification
}
