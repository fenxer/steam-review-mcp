import { describe, expect, it } from 'vitest'
import { pipe, sanitizeHTMLText } from './utils.js'

describe('pipe function', () => {
  it('should return input when no functions are provided', () => {
    expect(pipe('hello')).toBe('hello')
  })

  it('should apply single function to input', () => {
    const addOne = (x: number) => x + 1
    expect(pipe(5, addOne)).toBe(6)
  })

  it('should apply multiple functions in sequence', () => {
    const addOne = (x: number) => x + 1
    const double = (x: number) => x * 2
    const toString = (x: number) => x.toString()

    expect(pipe(5, addOne, double, toString)).toBe('12')
  })
})

describe('sanitizeHTMLText function (using pipe)', () => {
  it('should handle empty and null strings', () => {
    expect(sanitizeHTMLText('')).toBe('')
    expect(sanitizeHTMLText(null as any)).toBe('')
    expect(sanitizeHTMLText(undefined as any)).toBe('')
  })

  it('should decode HTML entities and strip tags', () => {
    expect(sanitizeHTMLText('&lt;div&gt;Hello &amp; world&lt;/div&gt;')).toBe('Hello & world')
    expect(sanitizeHTMLText('<p>Hello <strong>world</strong></p>')).toBe('Hello world')
  })

  it('should normalize whitespace and newlines', () => {
    expect(sanitizeHTMLText('Hello\r\nworld\n\ntest')).toBe('Hello\\nworld\\n\\ntest')
    expect(sanitizeHTMLText('  Multiple   spaces  ')).toBe('Multiple spaces')
  })

  it('should remove quotes', () => {
    expect(sanitizeHTMLText('He said "Hello" and \'world\'')).toBe('He said Hello and world')
  })
})
