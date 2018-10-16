// @flow
import { BeaconBlock, ActiveState, CrystallizedState } from "./BeaconBlock";
import { Attestation } from "./Attestation";
import { BeaconChain } from "./BeaconChain";
import { Validator } from "./Validator";
import { ValidatorService } from "./ValidatorService";
import { PoWChain } from "./PoWChain";
import { PoWBlock } from "./PoWBlock";
import { ShardChain } from "./ShardChain";
import { ShardBlock } from "./ShardBlock";
import { ShardService } from "./ShardService";

export const CYCLE_LENGTH = 4; // 64slots
export const SHARD_COUNT = 6;
export const VALIDATOR_COUNT = 48;
export const SLOT_DURATION = 1000; // 8000msec
export const MIN_COMMITTEE_SIZE = 128;
export const MIN_DYNASTY_LENGTH = 256; // slots
export const SHARD_TO_BEACON_DISTANCE = 6;

export const SLOT_HEIGHT = 2.5;
export {
  BeaconBlock,
  BeaconChain,
  Validator,
  ValidatorService,
  PoWChain,
  PoWBlock,
  ActiveState,
  CrystallizedState,
  Attestation,
  ShardChain,
  ShardBlock,
  ShardService,
};
