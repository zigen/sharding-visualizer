// @flow
import { PoWBlock } from "./";

class PoWChain {
  blocks: Array<PoWBlock>;
  id: string;
  height: number;
  constructor() {
    this.id = "PoW_Chain";
    const genesis = new PoWBlock(0, null);
    this.blocks = [genesis];
    this.height = 0;
  }

  processBlock(block: PoWBlock) {
    this.blocks.push(block);
    if (block.height === this.height + 1) {
      this.height = block.height;
    }
  }

  getNodes() {
    const blocksCount = [];
    return this.blocks.map(b => {
      const count = blocksCount[b.height];
      blocksCount[b.height] = count != null ? count + 1 : 1;
      const parentIndex = (b.parent && b.parent.index) || 0;
      return b.getNode(blocksCount[b.height] + parentIndex);
    });
  }

  getLinks() {
    return this.blocks
      .map(b => {
        if (b.parent == null) {
          return false;
        }
        return {
          source: b.id,
          target: b.parent.id,
        };
      })
      .filter(Boolean);
  }
}

export { PoWChain };
