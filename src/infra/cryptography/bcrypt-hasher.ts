import { HashComparer } from '@/domain/forum/application/criptography/hash-comparer'
import { HasherGenerator } from '@/domain/forum/application/criptography/hash-generator'
import { compare, hash } from 'bcryptjs'

export class BcryptHasher implements HasherGenerator, HashComparer {
	private HASH_SALT_LENGTH = 8

	hash(plainText: string): Promise<string> {
		return hash(plainText, this.HASH_SALT_LENGTH)
	}
	compare(plainText: string, hashedText: string): Promise<boolean> {
		return compare(plainText, hashedText)
	}
}
