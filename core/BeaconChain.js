// @flow

import {
  Attestation,
  ActiveState,
  Validator,
  CrystallizedState,
  BeaconBlock,
  ShardChain,
  CYCLE_LENGTH,
  SLOT_HEIGHT,
} from "./index";

class BeaconChain {
  validators: Array<Validator>;
  id: string;
  blocks: Array<BeaconBlock>;
  shards: Array<ShardChain>;
  slot: number;
  cycle: number;
  pendingAttestations: Array<Attestation>;
  mainChain: PoWChain;

  constructor(
    id: string,
    validators: Array<Validator>,
    shards: Array<ShardChain>,
    mainChain: PoWChain
  ) {
    this.id = id;
    this.validators = validators;
    const genesis = new BeaconBlock(this.id + "-genesis", 0);
    this.blocks = [genesis];
    this.shards = shards;
    this.mainChain = mainChain;
    this.slot = 0;
    this.cycle = 0;
    this.pendingAttestations = [];
  }

  stateRecalc(): BeaconBlock {
    console.log("recalc!!!", this.slot);
    const shuffledValidators = this.shuffle().map((vsl, slot) =>
      vsl.map((vs, shard) =>
        vs.map((vi, index) => {
          const validator: Validator = this.getValidatorByIndex(vi);
          const isProposer = shard === 0 && index === slot % vs.length;
          validator.assignShardAndSlot(
            shard,
            slot + this.slot + 1,
            index,
            isProposer
          );
          return validator;
        })
      )
    );
    const cState = new CrystallizedState(shuffledValidators, this.slot + 1);
    const block = this.latestBlock;
    block.crystallizedState = cState;
    return block;
  }

  get latestBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  proposeBlock(): BeaconBlock {
    const nextSlot = this.slot + 1;
    const nextCycle = Math.floor(this.slot / CYCLE_LENGTH);
    const lastBlock = this.latestBlock;
    const block = new BeaconBlock(
      this.id + "-" + this.slot,
      nextSlot,
      this.mainChain.latestBlock.id,
      lastBlock
    );
    this.blocks.push(block);
    if (this.cycle != nextCycle) {
      this.stateRecalc();
    } else {
      block.crystallizedState = lastBlock.crystallizedState;
    }
    block.activeState = new ActiveState(this.pendingAttestations);
    this.pendingAttestations = [];
    block.proposer = this.getProposer(this.slot);
    this.slot = nextSlot;
    this.cycle = nextCycle;
    return block;
  }

  getProposer(slot: number): Validator {
    let cState = null;
    for (let i = this.blocks.length - 1; i > 0; i--) {
      cState = this.blocks[i].crystallizedState;
      if (cState != null) {
        break;
      }
    }
    const committee = cState.getCommitteeForSlot(slot)[0];
    return committee[slot % committee.length];
  }

  shuffle(): Array<Array<Array<number>>> {
    let array = this.validators.map(v => v.index);
    // TODO: current shuffling method is dummy.
    for (let i = array.length - 1; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      const tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }
    const shuffled = array;

    const splitByShards = (validators: Array<number>): Array<Array<number>> => {
      const validatorsPerShard = Math.round(
        validators.length / this.shards.length
      );
      const vs = [];
      for (let i = 0; i < validators.length; i++) {
        const index = Math.floor(i / validatorsPerShard);
        if (vs[index] == null) {
          vs[index] = [validators[i]];
        } else {
          vs[index].push(validators[i]);
        }
      }
      return vs;
    };

    const validatorsBySlots = [];
    const ValidatorsPerSlot = Math.floor(shuffled.length / CYCLE_LENGTH);
    for (let i = 0; i < shuffled.length; i++) {
      const slot = Math.floor(i / ValidatorsPerSlot);
      let validatorsInTheSlot = validatorsBySlots[slot];
      if (validatorsInTheSlot != null) {
        validatorsInTheSlot.push(shuffled[i]);
      } else {
        validatorsInTheSlot = [shuffled[i]];
      }
      validatorsBySlots[
        Math.floor(i / ValidatorsPerSlot)
      ] = validatorsInTheSlot;
    }
    for (let k = 0; k < validatorsBySlots.length; k++) {
      validatorsBySlots[k] = splitByShards(validatorsBySlots[k]);
    }
    return validatorsBySlots;
  }

  getValidatorByIndex(index: number): ?Validator {
    return this.validators.find(v => v.index === index);
  }

  get latestBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  getNodes(): Array<any> {
    const lastBlock = this.latestBlock;
    const ctx = {
      x: 0,
      y: 0,
      z: this.slot * SLOT_HEIGHT,
      recalculated: lastBlock.crystallizedState.lastStateRecalc === this.slot,
    };
    const blockNodes = this.blocks.map(b => b.getNode());
    const shardNodes = this.shards.reduce(
      (acc, s, i) => acc.concat(s.getNode(ctx, i, this.shards.length)),
      []
    );
    return shardNodes
      .concat(blockNodes)
      .concat(this.validators.map((v, i) => v.getNode(ctx, i)));
  }

  receiveAttestation(attestation: Attestation) {
    this.pendingAttestations.push(attestation);
  }

  getLinks() {
    const beaconLinks = this.blocks.filter(b => b.parent != null).map(b => ({
      target: b.parent.id,
      source: b.id,
      id: b.parent.id + "-" + b.id,
      type: "beacon",
    }));
    const shardLinks = this.shards.reduce(
      (acc, s) => acc.concat(s.getLinks()),
      []
    );
    return beaconLinks.concat(shardLinks);

    /*
    const unassignedValidators = this.validators.filter(v => !v.isAssigned());
    return unassignedValidators.map((v, i) => ({
      source: this.id,
      target: v.id,
    }));
    */
  }
}

export { BeaconChain };
