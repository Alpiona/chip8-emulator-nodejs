import { DISPLAY_HEIGHT, DISPLAY_WIDTH } from '../constants/General';
import CpuComponents from './CpuComponents';
import Display from './Display';

export default class Instruction {
  protected cpuComponents: CpuComponents;

  protected display: Display;

  constructor(cpuComponents: CpuComponents, display: Display) {
    this.cpuComponents = cpuComponents;
    this.display = display;
  }

  nextInstruction(): void {
    this.decodeInstruction(this.fetchInstruction());
  }

  fetchInstruction(): number {
    // Return 2 space memories (8-bit) in a opcode (16-bit)
    // Ex: 0x12 and 0x34 is opcode 0x1234... Will converte 0x12 to 0x1200, and add 0x34
    const opcode =
      (this.cpuComponents.memory[this.cpuComponents.PC] << 8) +
      this.cpuComponents.memory[this.cpuComponents.PC + 1];

    this.cpuComponents.PC += 2;

    return opcode;
  }

  decodeInstruction(instruction: number): void {
    // 00E0 - CLS
    if (instruction === 0x00e0) {
      this.clearScreen();

      // 00EE - RET
    } else if (instruction === 0x00ee) {
      this.returnSubroutine();

      // 1NNN - JP addr
    } else if (instruction.toString(16).substr(0, 1) === '1') {
      this.jump(instruction.toString(16).substr(1, 3));

      // 2NNN - CALL addr
    } else if (instruction.toString(16).substr(0, 1) === '2') {
      this.call(instruction.toString(16).substr(1, 3));

      // 6xKK - LD Vx, byte
    } else if (instruction.toString(16).substr(0, 1) === '6') {
      this.setRegister(
        instruction.toString(16).substr(1, 1),
        instruction.toString(16).substr(2, 2),
      );

      // 7xKK - ADD Vx, byte
    } else if (instruction.toString(16).substr(0, 1) === '7') {
      this.addValueToRegister(
        instruction.toString(16).substr(1, 1),
        instruction.toString(16).substr(2, 2),
      );

      // ANNN - LD I, addr
    } else if (instruction.toString(16).substr(0, 1) === 'A') {
      this.setIndexRegister(instruction.toString(16).substr(1, 3));

      // DxyN - DRW Vx, Vy, nibble
    } else if (instruction.toString(16).substr(0, 1) === 'A') {
      this.drawDisplay(
        instruction.toString(16).substr(1, 1),
        instruction.toString(16).substr(2, 1),
        instruction.toString(16).substr(3, 1),
      );
    }
  }

  clearScreen(): void {
    this.display.clearPixels();
  }

  jump(address: string): void {
    this.cpuComponents.PC = parseInt(`0x${address}`, 16);
  }

  call(address: string): void {
    this.cpuComponents.SP += 1;

    this.cpuComponents.stack[
      this.cpuComponents.stack.length
    ] = this.cpuComponents.PC;

    this.cpuComponents.PC = parseInt(address, 16);
  }

  returnSubroutine(): void {
    this.cpuComponents.PC = this.cpuComponents.stack[
      this.cpuComponents.stack.length - 1
    ];

    this.cpuComponents.SP -= 1;
  }

  setRegister(register: string, value: string): void {
    this.cpuComponents.registers[parseInt(register, 16)] = parseInt(value, 16);
  }

  addValueToRegister(register: string, value: string): void {
    this.cpuComponents.registers[parseInt(register, 16)] += parseInt(value, 16);
  }

  setIndexRegister(value: string): void {
    this.cpuComponents.I = parseInt(value, 16);
  }

  drawDisplay(vx: string, vy: string, n: string): void {
    let x = this.cpuComponents.registers[parseInt(vx, 16)];
    let y = this.cpuComponents.registers[parseInt(vy, 16)];
    this.cpuComponents.registers[0xf] = 0;

    for (let i = 0; i < parseInt(n, 16); i += 1) {
      if (this.display.pixels[x][y] === 1) {
        this.cpuComponents.registers[0xf] = 1;
        this.display.pixels[x][y] = 0;
      } else {
        this.display.pixels[x][y] = 1;
      }

      if (x === DISPLAY_WIDTH - 1) {
        if (y === DISPLAY_HEIGHT - 1) {
          i = parseInt(n, 16);
        } else {
          y += 1;
        }
      } else {
        x += 1;
      }
    }
  }
}
