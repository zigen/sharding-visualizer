// @flow
import React from "react";
import { connect } from "react-redux";
import { type ValidatorNode } from "../../types";

type Props = {
  node: ValidatorNode,
};
class Validator extends React.Component<Props> {
  render() {
    const { slot, type, id } = this.props.node;
    return (
      <div>
        <div>type: {type}</div>
        <div>id: {id}</div>
        <div>slot: {slot}</div>
      </div>
    );
  }
}

export default Validator;
