import { Injectable } from '@nestjs/common'
import { Attachment } from '../../enterprise/entities/attachment'

@Injectable()
export abstract class AttachmentsRepository {
	abstract create(attachment: Attachment): Promise<void>
}
