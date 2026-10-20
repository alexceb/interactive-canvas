import * as THREE from 'three';
import type { ModelShape } from './model.types';

// Mounts a static WebGL preview and returns cleanup, or exits if WebGL is unavailable.
export function createModelScene(element: HTMLElement, shape: ModelShape) {
  let renderer: THREE.WebGLRenderer;

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    element.dataset.unavailable = 'true';
    return;
  }

  element.dataset.unavailable = 'false';

  // Cap pixel density to limit GPU work on high-resolution displays.
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

  // Draws at the host layout size so board zoom does not increase render resolution.
  const render = () => {
    const { width, height } = element.getBoundingClientRect();

    const w = element.clientWidth || width;
    const h = element.clientHeight || height;

    if (!w || !h) return;
    renderer.setSize(w, h);

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };

  // Shows the fallback during context loss and allows WebGL to attempt restoration.
  const lost = (event: Event) => {
    event.preventDefault();
    element.dataset.unavailable = 'true';
  };

  // Hides the fallback and redraws after Three.js restores its renderer internals.
  const restored = () => {
    element.dataset.unavailable = 'false';
    render();
  };

  renderer.domElement.addEventListener('webglcontextlost', lost);
  renderer.domElement.addEventListener('webglcontextrestored', restored);

  const observer = new ResizeObserver(render);
  // Static models redraw on resize or context restoration instead of using an animation loop.
  observer.observe(element);

  render();

  // Stop callbacks and release GPU resources when the owning React effect is cleaned up.
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
