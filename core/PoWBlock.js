// @flow
import { SLOT_DURATION, SLOT_HEIGHT } from "./index";
let index = 0;
class PoWBlock {
  id: string;
  height: number;
  parent: ?PoWBlock;
  _index: number;
  timestamp: number;
  constructor(height: number, parent: ?PoWBlock = null) {
    this._index = 0;
    this.id = index === 0 ? "pow-genesis" : `pow-${index}`;
    index++;
    this.height = height;
    this.parent = parent;
    this.timestamp = Date.now();
  }
  getNode(index: number, genesisTime: number) {
    this._index = index;
    const isGenesis = this.height === 0;
    const z =
      ((this.timestamp - genesisTime) * SLOT_HEIGHT) / SLOT_DURATION - 1; // this is terrible workaround since I didn't manage time properly
    return {
      id: this.id,
      name: this.id,
      y: 0,
      x: 8,
      z: z,
      color: isGenesis ? "red" : "skyblue",
      type: "pow",
    };
  }
}

export { PoWBlock };
