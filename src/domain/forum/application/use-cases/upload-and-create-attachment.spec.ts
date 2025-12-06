import { FakeHasher } from '../../../../../test/cryptography/fake-hasher'
import { InMemoryAttachmentsRepository } from '../../../../../test/repositories/in-memory-attachments-repository'
import { FakeUploader } from '../../../../../test/storage/fake-uploader'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader

let fakeHasher: FakeHasher

let sut: UploadAndCreateAttachmentUseCase

describe(`Upload and create attachment`, () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
		fakeUploader = new FakeUploader()

		fakeHasher = new FakeHasher()

		sut = new UploadAndCreateAttachmentUseCase(
			inMemoryAttachmentsRepository,
			fakeUploader,
		) // System Under Test
	})

	it('should be able to upload an create an attachment', async () => {
		const result = await sut.execute({
			fileName: 'profile.png',
			fileType: 'image/png',
			body: Buffer.from(''),
		})

		expect(result.isRight()).toEqual(true)
		expect(result.value).toEqual({
			attachment: inMemoryAttachmentsRepository.items[0],
		})
		expect(fakeUploader.uploads).toHaveLength(1)
		expect(fakeUploader.uploads[0]).toEqual(
			expect.objectContaining({
				fileName: 'profile.png',
			}),
		)
	})

	it('should not be able to upload an attachment with invalid file type', async () => {
		const result = await sut.execute({
			fileName: 'profile.mp3',
			fileType: 'audio/mpeg',
			body: Buffer.from(''),
		})

		expect(result.isLeft()).toEqual(true)
		expect(result.value).toBeInstanceOf(InvalidAttachmentType)
	})
})
