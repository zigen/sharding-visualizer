// @flow

import { Attestation, Validator, CYCLE_LENGTH, SLOT_HEIGHT } from "./index";

class BeaconBlock {
  activeState: ActiveState;
  crystallizedState: ?CrystallizedState;
  id: string;
  height: number;
  isGenesis: boolean;
  proposer: Validator;
  parent: ?BeaconBlock;
  powChainReference: string;

  constructor(
    id: string,
    height: number,
    powRef: string,
    parent: ?BeaconBlock = null
  ) {
    this.id = id;
    this.height = height;
    this.isGenesis = height === 0;
    this.crystallizedState = null;
    this.parent = parent;
    this.powChainReference = powRef;
  }

  get isProposed() {
    return this.crystallizedState != null;
  }

  getNode(ctx) {
    let color = "skyblue";
    let proposer = null;
    if (this.isProposed) {
      color = "#ddd";
      if (this.proposer) {
        proposer = this.proposer;
      }
    }
    if (this.isGenesis) {
      color = "red";
    }
    return {
      id: this.id,
      name: this.id,
      x: 0,
      y: 0,
      z: this.height * SLOT_HEIGHT,
      height: this.height,
      color,
      opacity: this.isProposed ? 0.8 : 0.2,
      type: "beacon",
      proposer,
      activeState: this.activeState,
      crystallizedState: this.crystallizedState,
      powChainReference: this.powChainReference,
    };
  }
}

class ActiveState {
  pendingAttestations: Array<Attestation>;
  recentBlockHashes: Array<any>;
  constructor(attestations: Array<Attestation>) {
    this.pendingAttestations = attestations;
  }
}

class CrystallizedState {
  validators: Array<ValidatorRecord>;
  shardAndCommitteeForSlots: Array<Array<Validator>>;
  lastStateRecalc: number;

  constructor(
    shadAndCommitteeForSlots: Array<Array<Validator>>,
    lastStateRecalc: number
  ) {
    this.shardAndCommitteeForSlots = shadAndCommitteeForSlots;
    this.lastStateRecalc = lastStateRecalc;
  }

  getCommitteeForSlot(slot: number) {
    return this.shardAndCommitteeForSlots[slot % CYCLE_LENGTH];
  }
}

export { BeaconBlock, CrystallizedState, ActiveState };
