// @flow
import { Drawable } from "./Drawable";
let index = 0;
class PoWBlock implements Drawable {
  id: string;
  height: number;
  parent: ?PoWBlock;
  _index: number;
  constructor(height: number, parent: ?PoWBlock = null) {
    this._index = 0;
    this.id = index === 0 ? "genesis" : `pow-${index}`;
    index++;
    this.height = height;
    this.parent = parent;
  }
  getNode(index: number) {
    this._index = index;
    const isGenesis = this.height === 0;
    return {
      id: this.id,
      name: this.id,
      fy: this.height * 50,
      fx: index * 10,
      fz: 0,
      color: isGenesis ? "red" : "skyblue",
    };
  }
}

export { PoWBlock };
