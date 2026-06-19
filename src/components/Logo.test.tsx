import '@testing-library/jest-dom'

function sum(a: number, b: number) {
    return a+ b;
}

test("adds 2+3 should be equal to 5", () => {
    expect(sum(2, 3)).toBe(5)
    expect(sum(3, 3)).not.toBe(5)
})