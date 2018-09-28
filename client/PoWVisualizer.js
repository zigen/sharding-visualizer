// @flow
import * as THREE from "three";
import ForceGraph3D from "3d-force-graph";
import { PoWChain, BeaconChain, Validator, PoWBlock } from "../core";

const mainChain = new PoWChain();
const validators: Array<Validator> = [];

for (let i = 0; i < 10; i++) {
  validators.push(new Validator(`validator-${i}`));
}
const beaconChain = new BeaconChain("beacon", validators);

for (let i = 1; i < 10; i++) {
  mainChain.processBlock(new PoWBlock(i, mainChain.blocks[i]));
}
/*
mainChain.processBlock(new PoWBlock(5, mainChain.blocks[4]));
mainChain.processBlock(new PoWBlock(5, mainChain.blocks[4]));
mainChain.processBlock(new PoWBlock(6, mainChain.blocks[10]));
mainChain.processBlock(new PoWBlock(6, mainChain.blocks[11]));
*/

const data = {
  nodes: [],
  links: [],
};

document.addEventListener("DOMContentLoaded", () => {
  const root = document.createElement("div");
  root.id = "root";
  root.setAttribute("width", 300);
  root.setAttribute("height", 200);
  root.setAttribute("backgroundColor", "white");
  document.body.appendChild(root);

  data.nodes = data.nodes.concat(beaconChain.getNodes());
  data.nodes = data.nodes.concat(mainChain.getNodes());
  data.links = data.links.concat(mainChain.getLinks());
  console.log(data);

  const Graph = ForceGraph3D();
  const graph = Graph(root)
    .graphData(data)
    .cameraPosition({ x: 200, y: 400, z: 200 }, { x: 0, y: 50, z: 0 })
    //.d3Force("charge", null)
    .nodeThreeObject(n => {
      //const geometry = new THREE.DodecahedronGeometry(5);
      const geometry = new THREE.BoxGeometry(5, 5, 5);
      const material = new THREE.MeshLambertMaterial({
        color: n.color,
        transparent: true,
        opacity: 0.9,
      });
      const object = new THREE.Mesh(geometry, material);
      return object;
    })
    .width(700)
    .height(600)
    .backgroundColor("#ccc")
    .linkColor(d => {
      return "#2F4F4F";
    })
    .linkDirectionalArrowLength(d => {
      //console.log('linkDirectionalArrowLength d:', d);
      if (d.source.arrow == "yes") {
        return 3.5;
      } else {
        return 4;
      }
    })
    .linkDirectionalArrowRelPos(1);
});
