import * as THREE from "three";
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 7;
const subscribeCameraControl = elem => {
  let clicked = false;
  let prevMousePos = {};
  let prevCameraPos = {};
  elem.onmousedown = e => {
    clicked = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
    prevCameraPos = camera.position;
  };
  elem.onmousemove = e => {
    if (clicked) {
      camera.position.x =
        (e.clientX - prevMousePos.x) * -0.001 + prevCameraPos.x;
      camera.position.y =
        (e.clientY - prevMousePos.y) * 0.001 + prevCameraPos.y;
      camera.lookAt(cube.position);
    }
  };
  elem.onmouseup = e => {
    clicked = false;
    prevMousePos = {};
  };
};

const light = new THREE.DirectionalLight(0xffffff);
light.position.x = 3;
light.position.z = 5;
light.position.y = 5;
scene.add(light);

const blocks = [];
const edges = [];
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
const addBlock = (x, y, z, parent) => {
  const height = blocks.length;
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const block = new THREE.Mesh(geometry, material);
  block.position.set(x, y, z);
  blocks.push(block);
  scene.add(block);
  if (parent != null) {
    addLine(block, parent);
    return;
  }
  if (height > 0) {
    addLine(blocks[height], blocks[height - 1]);
  }
};

addBlock(0, 0, 0);
addBlock(0, 2, 0);
addBlock(0, 4, 0);
addBlock(2, 4, 0, blocks[blocks.length - 2]);
addBlock(2, 6, 0);

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

subscribeCameraControl(renderer.domElement);
animate();
global.camera = camera;
global.blocks = blocks;
global.light = light;
