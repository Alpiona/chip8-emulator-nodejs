import fs from 'fs';
import Cpu from './classes/Cpu';
import Rom from './classes/Rom';
import Display from './classes/Display';
import Instruction from './classes/Instruction';
import { COLOR } from './constants/General';

const romContent = fs.readFileSync(process.argv.slice(2)[0]);

const rom = new Rom(romContent);
const cpu = new Cpu(rom);
const display = new Display();
const instruction = new Instruction(cpu.components, display);

display.screen.fillRegion(blessed.colors.match(COLOR), '█', 5, 7, 4, 7);
display.screen.render();

while (true) {
  instruction.nextInstruction();
}
