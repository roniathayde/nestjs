import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import {
	Question,
	type QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export function makeQuestion(
	override: Partial<QuestionProps> = {},
	id?: UniqueEntityID,
) {
	const question = Question.create(
		{
			slug: Slug.create(`example-question`),
			authorId: new UniqueEntityID(),
			title: faker.lorem.sentence(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	)

	return question
}
