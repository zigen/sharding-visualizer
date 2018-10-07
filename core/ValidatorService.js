// @flow

import { BeaconChain, Validator, VALIDATOR_COUNT, ShardService } from "./";

class ValidatorService {
  validators: Array<Validator>;
  beaconChain: BeaconChain;
  constructor(shardService: ShardService) {
    this.validators = [];
    for (let i = 0; i < VALIDATOR_COUNT; i++) {
      this.validators.push(new Validator(i, shardService));
    }
  }

  setBeacon(beaconChain: BeaconChain) {
    this.beaconChain = beaconChain;
    this.validators.forEach(v => v.setBeacon(beaconChain));
  }

  sendAttestationForCurrentSlot() {
    const slot = this.beaconChain.slot;
    const validators = this.getAssignedValidatorsForSlot(slot);
    validators.forEach(v => v.attest());
  }

  getAssignedValidatorsForSlot(slot: number) {
    return this.validators.filter(v => v.getAssignedShardForSlot(slot) != null);
  }
}

export { ValidatorService };
