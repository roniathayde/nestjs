export abstract class HashComparer {
	abstract compare(plainText: string, hashedText: string): Promise<boolean>
}
