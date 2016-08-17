const ZERO = 0

function zeroedArray (x) {
  return Array(x).fill(ZERO)
}

function abs (n) {
  return Math.abs(n)
}

export default class Matrix {
	static create (width, height) {
    return new Matrix(width, height)
  }

  static square (n) {
    return new Matrix(n, n)
  }

  constructor (width, height) {
    this.rows = zeroedArray(height).map( _ => zeroedArray(width) )
  }

  map () {
    return this.rows.map.apply(this.rows, arguments)
  }
}

Matrix.random = {
  square (...args) {
    const [min,max] = args.map(abs)
    const n         = Math.floor( Math.random() * ( max - min + 1) ) + min
    return Matrix.square(n)
  }
}