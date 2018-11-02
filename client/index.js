//@flow

class Node {
  id: string;
  manager: NetworkManager;

  constructor(id: string, manager: NetworkManager) {
    this.id = id;
    this.manager = manager;
  }

  send(id: string, message: Message) {
    if (id === this.id) {
      throw new Error("cannot send to self");
    }
    const channel = this.manager.getChannel(id, this.id);
    if (channel == null) {
      throw new Error(`channel not found ${this.id} -> ${id}`);
    }

    channel.push(message);
  }

  nextTick() {}
}

class NetworkManager {
  nodes: Array<Node>;
  channels: Array<Channel>;
  playing: boolean;

  constructor() {
    this.nodes = [];
    this.channels = [];
    this.playing = false;
  }

  addNode(id: string): Node {
    if (this.nodes.find(n => n.id === id) != null) {
      throw new Error("already registered");
    }
    const node = new Node(id, this);
    this.nodes.push(node);
    return node;
  }

  addChannel(to: string, from: string): Channel {
    if (to === from) {
      throw new Error(`cannon make channel ${to} -> ${from}`);
    }
    const channel = new Channel(this, to, from);
    this.channels.push(channel);
    return channel;
  }

  getChannel(to: string, from: string): ?Channel {
    return this.channels.find(c => c.to === to && c.from === from);
  }

  nextTick() {
    this.channels.forEach(c => c.nextTick());
    this.nodes.forEach(n => n.nextTick());
  }

  start() {
    const tick = () => {
      setTimeout(() => {
        this.nextTick();
        if (this.playing) {
          tick();
        }
      }, 1000);
    };
    tick();
  }
}

// this is Unidirectional channel
class Channel {
  to: string;
  from: string;
  manager: NetworkManager;
  queue: Array<Message>;

  constructor(manager: NetworkManager, to: string, from: string) {
    this.to = to;
    this.from = from;
    this.manager = manager;
    this.queue = [];
  }

  nextTick() {}

  push(message: Message) {
    this.queue.push(message);
  }
}

type Message = {
  payload: string,
};

const manager = new NetworkManager();
const node1 = manager.addNode("node-1");
const node2 = manager.addNode("node-2");
manager.addChannel(node2.id, node1.id);
node1.send("node-2", { payload: "hogehoge" });
manager.start();
global.manager = manager;
