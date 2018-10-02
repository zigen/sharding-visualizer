// @flow
import React from "react";
import { connect } from "react-redux";
import Validator from "./validator";

type Props = {
  node: ?any,
};
class Node extends React.Component<Props> {
  render() {
    const { node } = this.props;
    if (node == null) {
      return <div>no node selected</div>;
    }
    if (node.type === "validator") {
      return <Validator node={node} />;
    }
    return (
      <div>
        <div>type: {node.type}</div>
        <div>id: {node.id}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    node: state.nodes.selected,
  };
};
export default connect(
  mapStateToProps,
  null
)(Node);
