function getNumberBits(n) {
  const f64a = new Float64Array([n])
  const v = new DataView(f64a.buffer)
  let b = ''
  for (let i = 7; i >= 0; i--) {
    b += v
      .getUint8(i)
      .toString(2)
      .padStart(8, '0')
  }
  return {
    bits: b,
    sign: b[0],
    exponent: b.slice(1, 1 + 11),
    fraction: b.slice(1 + 11),
  }
}
