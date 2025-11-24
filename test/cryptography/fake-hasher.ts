import type { HashComparer } from '@/domain/forum/application/criptography/hash-comparer'
import type { HasherGenerator } from '@/domain/forum/application/criptography/hash-generator'

export class FakeHasher implements HasherGenerator, HashComparer {
	async hash(plainText: string): Promise<string> {
		return plainText + '-hashed'
	}

	async compare(plainText: string, hashedText: string): Promise<boolean> {
		return plainText + '-hashed' === hashedText
	}
}
