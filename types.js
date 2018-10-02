export type BaseNode = {
  id: string,
  x: number,
  y: number,
  z: number,
  color: ?string,
  val: number,
  opacity: ?number,
};
export type ValidatorNode = {} & BaseNode;
