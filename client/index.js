import * as TWEEN from "@tweenjs/tween.js";
import "../node_modules/three/examples/js/controls/OrbitControls";
import "../node_modules/three/examples/js/renderers/CSS2DRenderer";
import { BeaconChain, Validator, Shard } from "../core";

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = 0;
document.body.appendChild(labelRenderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;
camera.position.x = 3;
camera.lookAt(0, 0, 0);
const controls = new THREE.OrbitControls(camera);

const posSrc = camera.position;
const tween = new TWEEN.Tween(posSrc).to({ x: 7, y: 8 }, 500);

const setCameraToLatestBlock = () => {
  const latestBlock = blocks[blocks.length - 1];
  const { x, y, z } = latestBlock.cube.position;
  camera.position.set(x, y, z + 5);
  camera.up.set(x, y, z - 10);
};

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(3, 1, 10);
light.up.set(1, 1, 0);
scene.add(light);

/*
const addLine = (b1, b2) => {
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
  });
  const geometry = new THREE.Geometry();
  geometry.vertices.push(b1.position, b2.position);
  const line = new THREE.Line(geometry, material);
  edges.push(line);
  scene.add(line);
};
*/

scene.background = new THREE.Color("#333");

let blocks = [];
const addCube = ({ id, x, y, z, color, val }) => {
  const geometry = new THREE.BoxGeometry(val, val, val);
  const material = new THREE.MeshStandardMaterial({
    color: color || 0x00ff00,
    opacity: 0.8,
    transparent: true,
  });
  const block = new THREE.Mesh(geometry, material);
  block.position.set(x, y, z);
  blocks.push(block);

  const labelDiv = document.createElement("div");
  labelDiv.className = "label";
  labelDiv.textContent = id;
  labelDiv.style.color = "white";
  labelDiv.style.marginTop = "-1em";
  labelDiv.style.fontSize = "0.7em";
  const label = new THREE.CSS2DObject(labelDiv);
  label.position.set(0, -0.25, 0.5);
  block.add(label);
  scene.add(block);
  block.name = id;
  return block;
};

const validators: Array<Validator> = [];
const shards: Array<Shard> = [];
for (let i = 0; i < 30; i++) {
  validators.push(new Validator(i));
}
for (let i = 0; i < 5; i++) {
  shards.push(new Shard(`shard-${i}`, i));
}

const beaconChain = new BeaconChain("beacon-chain", validators, shards);
beaconChain.stateRecalc();

let nodes = [];
let links = [];
let shardCubes = [];
const validatorTweenGroup = new TWEEN.Group();

nodes = nodes.concat(beaconChain.getNodes());
nodes.forEach(n => {
  const cube = addCube(n);
  if (n.type === "shard") {
    shardCubes.push(cube);
  }
  if (n.type === "validator") {
    const { x, y, z, index, shard, slot } = n;
    const shardCube = shardCubes.find(s => s.name === `shard-${shard}`);
    const pos = shardCube.position.clone();
    pos.y -= 1;
    pos.z += slot * 2;
    pos.x += index - 0.5;
    new TWEEN.Tween(cube.position, validatorTweenGroup).to(pos, 500).start();
  }
});

controls.update();
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  TWEEN.update();
  validatorTweenGroup.update();
  labelRenderer.render(scene, camera);
};
tween.start();

animate();
global.camera = camera;
global.blocks = blocks;
global.light = light;
