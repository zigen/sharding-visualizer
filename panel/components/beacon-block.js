// @flow
import React from "react";
import { connect } from "react-redux";
import { type BeaconBlockNode } from "../../types";

type Props = {
  node: BeaconBlockNode,
};
class BeaconBlock extends React.Component<Props> {
  render() {
    const { slot, type, proposer, id } = this.props.node;
    return (
      <div>
        <div>type: {type}</div>
        <div>id: {id}</div>
        <div>slot: {slot}</div>
        <div>proposer: {proposer != null ? proposer.id : "genesis"}</div>
      </div>
    );
  }
}

export default BeaconBlock;
