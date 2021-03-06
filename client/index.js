// @flow
import * as TWEEN from "@tweenjs/tween.js";
import "../node_modules/three/examples/js/controls/OrbitControls";
import "../node_modules/three/examples/js/renderers/CSS2DRenderer";
import "../node_modules/three/examples/js/renderers/Projector";
import {
  PoWChain,
  PoWBlock,
  BeaconChain,
  Validator,
  ShardService,
  SLOT_HEIGHT,
  ValidatorService,
  SLOT_DURATION,
} from "../core";

import { initInformationPanel } from "../panel";

const DURATION = SLOT_DURATION;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = 0;
document.body.appendChild(labelRenderer.domElement);
const root = document.createElement("div");
document.body.appendChild(root);

const store = initInformationPanel(root);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 15;
camera.position.x = 3;
camera.lookAt(0, 0, 0);
const controls = new THREE.OrbitControls(camera);

const posSrc = camera.position;
const tween = new TWEEN.Tween(posSrc).to(posSrc, DURATION);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(3, 1, 10);
light.up.set(1, 1, 0);
scene.add(light);
const light2 = new THREE.DirectionalLight(0xffffff);
light2.position.set(-3, 9, -10);
light2.up.set(4, 1, 0);
scene.add(light2);

scene.background = new THREE.Color("#333");

let blocks = [];
type Node = {
  id: string,
  x: number,
  y: number,
  z: number,
  color: ?string,
  val: number,
  opacity: ?number,
};
const addCube = ({ id, x, y, z, color, val, opacity }: Node) => {
  const geometry = new THREE.BoxGeometry(val, val, val);
  const material = new THREE.MeshStandardMaterial({
    color: color || 0x00ff00,
    opacity: opacity || 0.8,
    transparent: true,
  });
  const block = new THREE.Mesh(geometry, material);
  block.position.set(x, y, z);
  blocks.push(block);

  const labelDiv = document.createElement("div");
  labelDiv.className = "label-hide";
  labelDiv.textContent = id;
  labelDiv.id = block.uuid;
  const label = new THREE.CSS2DObject(labelDiv);
  label.position.set(0, -0.25, 0.5);
  block.add(label);
  scene.add(block);
  block.name = id;
  return block;
};

const addArrow = (
  id,
  source,
  target,
  offset,
  color: string,
  arrowLength: ?number
) => {
  const hex = color || 0xff0000;
  const targetPos = convertToVector3(
    (target.userData && target.userData.nextPos) || target.position || target
  );
  const sourcePos = convertToVector3(
    (source.userData && source.userData.nextPos) || source.position || source
  );
  const dir = targetPos
    .clone()
    .sub(sourcePos)
    .normalize();
  let length = arrowLength || sourcePos.distanceTo(targetPos);
  if (offset) {
    targetPos.add(offset);
    sourcePos.add(offset);
  }
  const arrow = new THREE.ArrowHelper(
    dir,
    sourcePos,
    length,
    hex,
    length * 0.2,
    0.08
  );
  arrow.name = id;
  arrows.push(arrow);
  scene.add(arrow);
};

const shardService = new ShardService();
const mainChain = new PoWChain();
const validatorService = new ValidatorService(shardService);

const beaconChain = new BeaconChain(
  "beacon-chain",
  validatorService.validators,
  shardService.shards,
  mainChain
);
validatorService.setBeacon(beaconChain);
beaconChain.stateRecalc();

const nextPoWBlock = () => {
  setTimeout(() => {
    const block = new PoWBlock(mainChain.height + 1, mainChain.latestBlock);
    mainChain.processBlock(block);
    return nextPoWBlock();
  }, (Math.random() * 15 + 15) * 100);
};
nextPoWBlock();
let nodes = [];
let links = [];
let shardCubes = [];
let validatorCubes = [];
let powCubes = [];
let beaconCubes = [];
let arrows = [];
const validatorTweenGroup = new TWEEN.Group();
const beaconTweenGroup = new TWEEN.Group();

const updateNodes = () => {
  const allNodes = mainChain.getNodes().concat(beaconChain.getNodes());
  const newNodes = allNodes.filter(
    n1 => nodes.find(n2 => n2.id === n1.id) == null
  );
  const replaceNodes = allNodes.filter(n => n.shouldUpdate);
  replaceNodes.forEach(r => {
    const target = nodes.findIndex(n => n.id === r.id);
    nodes[target] = r;
  });
  nodes = nodes.concat(newNodes);
};

const drawNodes = () => {
  nodes.forEach(n => {
    // move cube which is already drawn
    if (n.shouldUpdate) {
      if (n.type === "validator") {
        const cube = validatorCubes.find(v => v.name === n.id);
        if (cube == null) {
          console.error(`validator cube ${n.id} is not found`);
          return;
        }
        const { x, y, z, index, shard, slot, actor } = n;
        const shardCube = shardCubes.find(s => s.name === `shard-${shard}`);
        if (shardCube == null) {
          console.error(`shard cube ${shard} is not found`);
          return;
        }
        const pos = shardCube.position.clone();
        pos.y -= 1;
        pos.z += slot * SLOT_HEIGHT;
        pos.x += index - 0.5;

        // add transparent cube
        const cubePos = cube.position.clone();
        const c = addCube({
          ...cubePos,
          val: 0.5,
          opacity: 0.1,
          color: cube.material.color,
          id: cube.name.replace("validator-", ""),
        });
        c.userData = { ...cube.userData };
        validatorCubes.push(c);

        new TWEEN.Tween(cube.position, validatorTweenGroup)
          .to(pos, DURATION)
          .start();
        cube.material.color = new THREE.Color(n.color);
        cube.userData = {
          ...cube.userData,
          nextPos: pos,
          slot,
          actor,
        };
        return;
      }
    }
    if (n.drawn) {
      return;
    }
    if (n.type === "beacon" && n.proposer != null) {
      const { proposer } = n;
      const validator = validatorCubes.find(
        v =>
          v.name === proposer.id &&
          v.userData.slot == n.height &&
          v.userData.actor === "proposer"
      );
      if (validator != null) {
        const pos = validator.userData.nextPos;
        n.x = pos.x;
        n.y = pos.y - 0.5;
        n.z = pos.z;
      }
    }
    const cube = addCube(n);
    if (n.type === "pow") {
      powCubes.push(cube);
    }
    if (n.type === "beacon") {
      if (n.proposer != null) {
        const pos = {
          x: 0,
          y: 0,
          z: n.height * SLOT_HEIGHT,
        };
        new TWEEN.Tween(cube.position, beaconTweenGroup)
          .to(pos, DURATION)
          .start();
        cube.userData.nextPos = pos;
        addArrow(
          `propose-${n.height}`,
          cube.position.clone().add(new THREE.Vector3(0, 0.5, 0)),
          Object.assign({}, pos)
        );
      }
      beaconCubes.push(cube);
      cube.userData = {
        ...cube.userData,
        type: "beaconBlock",
        id: cube.name,
        height: n.height,
        proposer: n.proposer,
        powChainReference: n.powChainReference,
      };

      // attestation signed data to beacon from validator
      const { activeState } = n;
      if (activeState != null) {
        activeState.pendingAttestations.forEach(a => {
          const attester = validatorCubes.find(
            v => v.name === a.attesterId && v.userData.slot === a.slot
          );
          if (attester != null) {
            const pos = cube.userData.nextPos;
            addArrow(
              `attestation-${a.attesterId}@${a.slot}`,
              Object.assign({}, attester.position),
              pos,
              null,
              "white"
            );
          }
        });
      }

      // ref to mainChain
      const powBlock = powCubes.find(c => c.name === n.powChainReference);
      if (powBlock != null) {
        addArrow(
          `pow-chain-ref-${n.id}`,
          cube.userData.nextPos,
          powBlock.position,
          null,
          "green"
        );
      }
    }
    if (n.type === "shard") {
      shardCubes.push(cube);
      cube.userData = {
        type: "shard",
        id: cube.name,
      };
    }
    if (n.type === "validator") {
      const { x, y, z, index, shard, slot, id, actor } = n;
      const shardCube = shardCubes.find(s => s.name === `shard-${shard}`);
      const pos = shardCube.position.clone();
      pos.y -= 1;
      pos.z += slot * SLOT_HEIGHT;
      pos.x += index - 0.5;

      new TWEEN.Tween(cube.position, validatorTweenGroup)
        .to(pos, DURATION)
        .start();
      cube.userData = {
        nextPos: pos,
        slot,
        index,
        shard,
        type: "validator",
        id,
        actor,
      };
      validatorCubes.push(cube);
    }

    n.drawn = true;
  });
  controls.update();
};

const updateLinks = () => {
  const allLinks = beaconChain.getLinks();
  const newLinks = allLinks.filter(
    l1 => links.find(l2 => l2.id === l1.id) == null
  );
  links = links.concat(newLinks);
};

const convertToVector3 = v => {
  if (!(v instanceof THREE.Vector3)) {
    const { x, y, z } = v;
    v = new THREE.Vector3(x, y, z);
  } else {
    v = v.clone();
  }
  return v;
};

const drawLinks = () => {
  links.forEach(l => {
    const { source, target, type, id } = l;
    if (type === "beacon") {
      const sourceCube = beaconCubes.find(c => c.name === source);
      const targetCube = beaconCubes.find(c => c.name === target);
      if (sourceCube != null && targetCube != null) {
        addArrow(
          id,
          sourceCube,
          targetCube,
          new THREE.Vector3(0, 0, -0.5),
          "#ffff00",
          1
        );
      }
    }
    if (type === "shard") {
      const sourceCube = shardCubes.find(c => c.name === source);
      const targetCube = shardCubes.find(c => c.name === target);
      if (sourceCube != null && targetCube != null) {
        addArrow(
          id,
          sourceCube,
          targetCube,
          new THREE.Vector3(0, 0, -0.5),
          "#00ff00",
          1
        );
      }
    }
  });
};

const render = () => {
  updateNodes();
  updateLinks();
  drawNodes();
  drawLinks();
};

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  TWEEN.update();
  validatorTweenGroup.update();
  beaconTweenGroup.update();
  labelRenderer.render(scene, camera);
};

render();
tween.start();
animate();

let count = 0;
let timer = setInterval(() => {
  beaconChain.proposeBlock();
  shardService.proposeAllShardsBlocks();
  validatorService.sendAttestationForCurrentSlot();
  render();
  count++;
  if (count > 10) {
    clearInterval(timer);
  }
}, DURATION + 100);

global.camera = camera;
global.blocks = blocks;
global.light = light;
global.validatorTweenGroup = validatorTweenGroup;
global.beaconCubes = beaconCubes;
global.THREE = THREE;

const raycaster = new THREE.Raycaster();
let activeLabelId = null;
window.addEventListener("mousemove", e => {
  if (e.buttons > 0) return;
  if (e.target === labelRenderer.domElement) {
    const mouse = new THREE.Vector2();
    mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(blocks, true);
    if (intersects.length > 0) {
      const target = intersects[0].object;
      store.dispatch({
        type: "nodes/SELECT",
        payload: {
          ...target.userData,
          nodeId: target.uuid,
          nodeName: target.name,
        },
      });
      if (target.userData.type === "beaconBlock") {
        new TWEEN.Tween(controls.target).to(target.position, 500).start();
      }

      if (activeLabelId != null) {
        toggleLabel(activeLabelId);
        activeLabelId = null;
      }
      toggleLabel(target.uuid);
    }
  }
});

const toggleLabel = id => {
  const label = document.getElementById(id);
  if (label == null) return;
  label.classList.toggle("label-hide");
  label.classList.toggle("label-show");
  activeLabelId = label.id;
};
