import CpuComponents from './CpuComponents';
import Rom from './Rom';

export default class Cpu {
  public components: CpuComponents;

  constructor(rom: Rom) {
    this.components = new CpuComponents(rom);
  }

  reset(): void {
    this.components.reset();
  }
}
