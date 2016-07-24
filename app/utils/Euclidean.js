export default class Euclidean {
  static gcd (x, y) {
    // make it order agnostic
    const [max, min] = [x, y].sort( (a, b)=> b - a )
    if ( min === 0 ) return max
    return Euclidean.gcd( min, max % min )
  }

  static nearestTen (x) {
    return Math.round(x * 10) / 10
  }
}