// @flow

interface Drawable {
  id: string;
  getNode(): any;
}

interface Drawables {
  id: string;
  getNodes(): Array<any>;
  getLinks(): Array<any>;
}

export type { Drawable, Drawables };
