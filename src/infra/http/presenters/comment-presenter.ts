import type { Comment } from '@/domain/forum/enterprise/entities/comment'

export class CommentPresenter {
	static toHTTP(comment: Comment<any>) {
		return {
			id: comment.id.toString(),
			createdAt: comment.createdAt,
			updatedAt: comment.updatedAt,
		}
	}
}
