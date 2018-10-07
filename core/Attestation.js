// @flow

class Attestation {
  slot: number;
  shardId: string;
  // obliqueParentHashes: Array<string>;
  shardBlockId: string; //shard block hash
  attesterId: string;

  constructor(
    slot: number,
    shardId: string,
    shardBlockId: string,
    attesterId: string
  ) {
    this.slot = slot;
    this.shardId = shardId;
    this.shardBlockId = shardBlockId;
    this.attesterId = attesterId;
  }
}

export { Attestation };
