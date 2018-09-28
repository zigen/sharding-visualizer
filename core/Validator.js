// @flow
import { Drawable } from "./Drawable";

class Validator implements Drawable {
  id: string;
  index: number;
  assignments: Array<any>;

  constructor(index: number) {
    this.id = `validator-${index}`;
    this.index = index;
    this.assignments = [];
  }

  get latestAssignment() {
    return this.assignments[this.assignments.length - 1];
  }

  assignShardAndSlot(
    shard: number,
    slot: number,
    index: number,
    isProposer: boolean
  ) {
    this.assignments.push({
      shard,
      slot,
      index,
      actor: isProposer ? "proposer" : "attester",
    });
  }

  getNode(ctx, _index) {
    const { slot, shard, index, actor } = this.latestAssignment;
    return {
      id: this.id,
      name: "Validator",
      val: 0.5,
      z: ctx.z,
      x: ctx.x + (_index % 5) - 2,
      y: ctx.y + Math.floor(_index / 5) * -0.6 - 1,
      color: actor === "proposer" ? "green" : "pink",
      type: "validator",
      slot,
      shard,
      index,
    };
  }
}

export { Validator };
