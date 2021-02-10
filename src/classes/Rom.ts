export default class Rom {
  public data: number[];

  constructor(romContent: Buffer) {
    this.data = [];

    this.loadRom(romContent);
    this.testLog();
  }

  loadRom(romContent: Buffer): void {
    for (let x = 0; x < romContent.length; x += 1) {
      this.data[x] = romContent[x];
    }
  }

  testLog(): void {
    console.log(this.data.toString());
    // for (let x = 0; x < this.data.length; x += 1) {
    //   console.log(this.data[x].toString(16));
    // }
  }
}
