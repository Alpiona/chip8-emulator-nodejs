import { FONT_DEFAULT } from '../constants/General';
import Rom from './Rom';

/**
 * Memory - 4096 bytes
 * Registers - 16 8 bit registers - V0 to VF (VF is flag)
 * Stack - Stack "Last in, first out" for 16 bit addresses
 * ST - Sound Timer
 * DT - Delay timer
 * I - Register called I used to point at locations in memory
 * SP - Stack Pointer
 * PC - Program counter, which points at the current instruction in memory
 */
export default class CpuComponents {
  public memory: Uint8Array;

  public registers: Uint8Array;

  public stack: Uint16Array;

  public ST: number;

  public DT: number;

  public I: number;

  public SP: number;

  public PC: number;

  constructor(rom: Rom) {
    this.reset();
    this.prepareMemory(rom);
  }

  reset(): void {
    this.memory = new Uint8Array(4096);
    this.registers = new Uint8Array(16);
    this.stack = new Uint16Array(16);
    this.I = 0;
    this.ST = 0;
    this.DT = 0;
    this.SP = 0;
    this.PC = 0x200;
  }

  prepareMemory(rom: Rom): void {
    this.loadFont();
    this.loadRom(rom);
  }

  loadFont(): void {
    const fontMemoryStart = 0x50;

    for (let x = 0; x < FONT_DEFAULT.length; x += 1) {
      this.memory[fontMemoryStart + x] = FONT_DEFAULT[x];
    }
  }

  loadRom(rom: Rom): void {
    const romMemoryStart = 0x200;

    // Rom data is 16-bit while memory is 8-bit, so one data is 2 bytes (2 memory spaces)
    for (let x = 0; x < rom.data.length; x += 1) {
      // Here will shift 8 bits (0x1234 will turn in 0x12)
      this.memory[romMemoryStart + 2 * x] = rom.data[x] >> 8;
      // Here will use binary masking & and 0xFF because has the last 8-bits on (the ones we want)
      this.memory[romMemoryStart + 2 * x + 1] = rom.data[x] & 0xff;
    }
  }
}
