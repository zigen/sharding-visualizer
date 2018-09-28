// @flow

import { Validator } from "./Validator";

class BeaconBlock {
  activeState: ActiveState;
  crystallizedState: ?CrystallizedState;
  id: string;
  height: number;
  isGenesis: boolean;

  constructor(id: string, height: number) {
    this.id = id;
    this.height = height;
    this.isGenesis = height === 0;
    this.crystallizedState = null;
  }

  getNode(ctx) {
    return {
      id: this.id,
      name: this.id,
      x: 0,
      y: 0,
      z: 0,
      color: "skyblue",
    };
  }
}

class ActiveState {
  pendingAttestations: Array<Attestation>;
  recentBlockHashes: Array<any>;
}

class CrystallizedState {
  validators: Array<ValidatorRecord>;
  shardAndCommitteeForSlots: Array<Array<Validator>>;
  constructor(shadAndCommitteeForSlots) {
    this.shardAndCommitteeForSlots = shadAndCommitteeForSlots;
  }
}

class Attestation {}

class ValidatorRecord {}

export { BeaconBlock, Attestation, CrystallizedState, ActiveState };
