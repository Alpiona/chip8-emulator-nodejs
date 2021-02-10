import * as blessed from 'blessed';
import { COLOR, DISPLAY_HEIGHT, DISPLAY_WIDTH } from '../constants/General';

export default class Display {
  public pixels: number[][];

  public color: any;

  public screen: blessed.Widgets.Screen;

  constructor() {
    this.screen = blessed.screen({ smartCSR: true });
    this.screen.title = 'CHIP-8';

    this.clearPixels();
  }

  clearPixels(): void {
    for (let x = 0; x < DISPLAY_WIDTH; x += 1) {
      for (let y = 0; y < DISPLAY_HEIGHT; y += 1) {
        this.pixels[x][y] = 0;
      }
    }
  }

  drawPixels(): void {
    for (let x = 0; x < DISPLAY_WIDTH; x += 1) {
      for (let y = 0; y < DISPLAY_HEIGHT; y += 1) {
        if (this.pixels[x][y] === 1) {
          this.screen.fillRegion(blessed.colors.match(COLOR), 'X', x, x, y, y);
        } else {
          this.screen.clearRegion(x, x, y, y);
        }
      }
    }

    this.screen.render();
  }
}
