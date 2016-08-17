export default class List {
  static random (list) {
    const idx = Math.floor(Math.random()*list.length)
    return [list[idx], list.filter( (_, i)=> i != idx )]
  }
}