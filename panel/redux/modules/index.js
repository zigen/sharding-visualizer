// @flow

const InitialState = {
  selected: null,
  nodes: [],
};
const nodesReducer = (state = InitialState, action) => {
  return { ...state, selected: action.payload };
};

const reducers = {
  nodes: nodesReducer,
};

export default reducers;
