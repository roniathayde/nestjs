export abstract class HasherGenerator {
	abstract hash(plainText: string): Promise<string>
}
