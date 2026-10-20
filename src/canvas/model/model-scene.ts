import * as THREE from 'three';
import type { ModelShape } from './model.types';

export function createModelScene(element: HTMLElement, shape: ModelShape) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    element.dataset.unavailable = 'true';
    return;
  }
  element.dataset.unavailable = 'false';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  element.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(3, 2.5, 4.8);
  camera.lookAt(0, 0, 0);
  const geometry =
    shape === 'cube'
      ? new THREE.BoxGeometry(1.55, 1.55, 1.55, 1, 1, 1)
      : new THREE.TorusGeometry(0.95, 0.33, 32, 80);
  const material = new THREE.MeshStandardMaterial({
    color: shape === 'cube' ? '#a392d4' : '#c3ce8e',
    roughness: 0.32,
    metalness: 0.15,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.set(
    shape === 'cube' ? 0.1 : 0.35,
    shape === 'cube' ? -0.2 : -0.35,
    shape === 'cube' ? -0.08 : 0.2,
  );
  scene.add(mesh);
  scene.add(new THREE.HemisphereLight('#ffffff', '#5b536f', 3));
  const light = new THREE.DirectionalLight('#ffffff', 4);
  light.position.set(-3, 5, 4);
  scene.add(light);
  const rim = new THREE.DirectionalLight('#d4dcff', 2);
  rim.position.set(3, 1, -2);
  scene.add(rim);

  const render = () => {
    const { width, height } = element.getBoundingClientRect();
    // The parent is transformed; CSS dimensions keep resolution independent of board zoom.
    const w = element.clientWidth || width;
    const h = element.clientHeight || height;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };
  const lost = (event: Event) => {
    event.preventDefault();
    element.dataset.unavailable = 'true';
  };
  const restored = () => {
    element.dataset.unavailable = 'false';
    render();
  };
  renderer.domElement.addEventListener('webglcontextlost', lost);
  renderer.domElement.addEventListener('webglcontextrestored', restored);
  const observer = new ResizeObserver(render);
  observer.observe(element);
  render();
  return () => {
    observer.disconnect();
    renderer.domElement.removeEventListener('webglcontextlost', lost);
    renderer.domElement.removeEventListener('webglcontextrestored', restored);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
