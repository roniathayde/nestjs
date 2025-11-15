import { Left, left, Right, right, type Either } from './either'

function doSomething(shouldSuccess: boolean): Either<string, string> {
	if (shouldSuccess) {
		return right('success')
	} else {
		return left('error')
	}
}

test('success result', () => {
	const successResult = doSomething(true)

	expect(successResult.value).toEqual('success')
	expect(successResult).toBeInstanceOf(Right)
})

test('error result', () => {
	const successResult = doSomething(false)

	expect(successResult.value).toEqual('error')
	expect(successResult).toBeInstanceOf(Left)
})
