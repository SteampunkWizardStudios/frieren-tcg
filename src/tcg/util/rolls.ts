export default class Rolls {
  static rollD6(): number {
    return this.rollDAny(6);
  }

  static rollD100(): number {
    return this.rollDAny(100);
  }

  static rollDAny(d: number): number {
    return Math.floor(Math.random() * d);
  }
}
