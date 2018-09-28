// @flow

import { Validator, Drawables, BeaconBlock, Shard } from "./index";
import { CrystallizedState } from "./BeaconBlock";

const CYCLE_LENGTH = 3;

class BeaconChain implements Drawables {
  validators: Array<Validator>;
  id: string;
  blocks: Array<BeaconBlock>;
  shards: Array<Shard>;
  slot: number;
  cycle: number;

  constructor(id: string, validators: Array<Validator>, shards: Array<Shard>) {
    this.id = id;
    this.validators = validators;
    const genesis = new BeaconBlock(this.id + "-genesis", 0);
    this.blocks = [genesis];
    this.shards = shards;
    this.slot = 0;
    this.cycle = 0;
  }

  stateRecalc() {
    const shuffledValidators = this.shuffle().map((vsl, slot) =>
      vsl.map((vs, shard) =>
        vs.map((vi, index) => {
          const validator: Validator = this.getValidatorByIndex(vi);
          const isProposer = shard === 0 && index === 0;
          validator.assignShardAndSlot(
            shard,
            slot + this.slot,
            index,
            isProposer
          );
          return validator;
        })
      )
    );
    const cState = new CrystallizedState(shuffledValidators);
    const block = this.blocks[this.blocks.length - 1];
    block.crystallizedState = cState;
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
    const ctx = { x: 0, y: 0, z: 0 };
    const blockNodes = this.blocks.map(b => b.getNode());
    const shardNodes = this.shards.map((s, i) =>
      s.getNode(ctx, i, this.shards.length)
    );
    return blockNodes
      .concat(shardNodes)
      .concat(this.validators.map((v, i) => v.getNode(ctx, i)));
  }

  getLinks() {
    const unassignedValidators = this.validators.filter(v => !v.isAssigned());
    return unassignedValidators.map((v, i) => ({
      source: this.id,
      target: v.id,
    }));
  }
}

export { BeaconChain };
