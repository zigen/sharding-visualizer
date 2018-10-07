// @flow
import { ShardService, BeaconChain, Attestation } from "./";

class Validator {
  id: string;
  index: number;
  assignments: Array<any>;
  _node: any;
  shardService: ShardService;
  beaconChain: BeaconChain;

  constructor(index: number, shardService: ShardService) {
    this.id = `validator-${index}`;
    this.index = index;
    this.assignments = [];
    this.shardService = shardService;
  }

  setBeacon(beaconChain: BeaconChain) {
    this.beaconChain = beaconChain;
  }

  get latestAssignment() {
    return this.assignments[this.assignments.length - 1];
  }

  getAssignedShardForSlot(slot: number) {
    return this.assignments.find(a => a.slot === slot);
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

  attest() {
    const assignment = this.latestAssignment;
    const { slot } = assignment;
    const shardIndex = assignment.shard;
    const shardId = `shard-${shardIndex}`;
    const shardChain = this.shardService.getShardChain(shardId);
    const shardBlock = shardChain.latestBlock;
    const attestation = new Attestation(slot, shardId, shardBlock.id, this.id);

    // an attestation is processed randomly since network delay.
    // this simulates the circumstance easily.
    setTimeout(() => {
      this.beaconChain.receiveAttestation(attestation);
    }, Math.random() * 3000);
  }

  getNode(ctx, _index: number) {
    const { slot, shard, index, actor } = this.latestAssignment;
    const node = {
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
      actor,
      shouldUpdate: ctx.recalculated,
    };
    this._node = Object.assign({}, node);
    return node;
  }
}

export { Validator };
