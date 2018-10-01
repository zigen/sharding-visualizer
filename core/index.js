// @flow
import {
  BeaconBlock,
  Attestation,
  ActiveState,
  CrystallizedState,
} from "./BeaconBlock";
import { BeaconChain } from "./BeaconChain";
import { Validator } from "./Validator";
import { PoWChain } from "./PoWChain";
import { PoWBlock } from "./PoWBlock";
import { Shard } from "./Shard";
import { Drawable, Drawables } from "./Drawable";

export const CYCLE_LENGTH = 3; // 64slots
export const SHARD_COUNT = 5;
export const VALIDATOR_COUNT = 30;
export const SLOT_DURATION = 8000; // msec
export const MIN_COMMITTEE_SIZE = 128;
export const MIN_DYNASTY_LENGTH = 256; // slots

export const SLOT_HEIGHT = 2.5;
export {
  BeaconBlock,
  BeaconChain,
  Validator,
  PoWChain,
  PoWBlock,
  ActiveState,
  CrystallizedState,
  Attestation,
  Drawable,
  Drawables,
  Shard,
};
