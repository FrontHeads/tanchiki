const magic = '🪄'

const cast = (spell: string, item: any) => {
  if (spell.startsWith(magic)) {
    return '🐷'
  }

  return item
}

test('spell casting', () => {
  const result = cast(magic, '🐸')
  expect(result).toBe('🐷')
})
