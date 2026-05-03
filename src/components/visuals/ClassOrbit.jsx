import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

export default function ClassOrbit() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.12, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearAlpha(0);
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const palette = {
      violet: new THREE.Color('#7C3AED'),
      blue: new THREE.Color('#2563EB'),
      cyan: new THREE.Color('#22D3EE'),
      pink: new THREE.Color('#EC4899'),
      white: new THREE.Color('#E0F2FE'),
    };

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 4),
      new THREE.MeshStandardMaterial({
        color: palette.violet,
        roughness: 0.18,
        metalness: 0.24,
        emissive: palette.blue,
        emissiveIntensity: 0.28,
      })
    );
    group.add(core);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.17, 2),
      new THREE.MeshBasicMaterial({
        color: '#22D3EE',
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      })
    );
    group.add(wire);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: '#E0E7FF',
      roughness: 0.18,
      metalness: 0.3,
      transparent: true,
      opacity: 0.78,
      emissive: '#2563EB',
      emissiveIntensity: 0.16,
    });

    const rings = [
      { radius: 1.72, tube: 0.022, rotation: [1.28, 0.12, 0.6] },
      { radius: 2.16, tube: 0.018, rotation: [0.32, 1.08, -0.24] },
      { radius: 2.6, tube: 0.014, rotation: [1.68, 0.42, 1.12] },
      { radius: 3.05, tube: 0.01, rotation: [0.92, 1.5, 0.2] },
    ].map((ring) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(ring.radius, ring.tube, 16, 144),
        ringMaterial.clone()
      );
      mesh.rotation.set(...ring.rotation);
      group.add(mesh);
      return mesh;
    });

    const dots = [
      { color: palette.cyan, size: 0.19, angle: 0, radius: 1.72, y: 0.1 },
      { color: palette.pink, size: 0.14, angle: 2.1, radius: 2.16, y: -0.2 },
      { color: palette.blue, size: 0.16, angle: 4.2, radius: 2.58, y: 0.16 },
      { color: palette.white, size: 0.09, angle: 5.25, radius: 1.38, y: -0.46 },
      { color: palette.violet, size: 0.12, angle: 1.2, radius: 2.94, y: 0.32 },
    ].map((dot) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(dot.size, 24, 24),
        new THREE.MeshStandardMaterial({
          color: dot.color,
          roughness: 0.12,
          metalness: 0.18,
          emissive: dot.color,
          emissiveIntensity: 0.45,
        })
      );
      mesh.userData = dot;
      group.add(mesh);
      return mesh;
    });

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(180 * 3);
    for (let i = 0; i < starPositions.length; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 8;
      starPositions[i + 1] = (Math.random() - 0.5) * 5;
      starPositions[i + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: '#E0F2FE',
        size: 0.025,
        transparent: true,
        opacity: 0.7,
      })
    );
    scene.add(stars);

    scene.add(new THREE.AmbientLight('#C7D2FE', 1.35));

    const keyLight = new THREE.DirectionalLight('#ffffff', 2.4);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight('#22D3EE', 4.2, 9);
    fillLight.position.set(-3, -1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight('#EC4899', 2.9, 8);
    rimLight.position.set(2.5, -2.4, 2);
    scene.add(rimLight);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .fromTo(group.scale, { x: 0.72, y: 0.72, z: 0.72 }, { x: 1, y: 1, z: 1, duration: 1.3 })
      .fromTo(group.rotation, { y: -0.7, x: 0.32 }, { y: 0.15, x: 0.08, duration: 1.3 }, '<')
      .fromTo(renderer.domElement, { opacity: 0 }, { opacity: 1, duration: 0.9 }, '<');

    const pulse = gsap.to([core.scale, wire.scale], {
      x: 1.1,
      y: 1.1,
      z: 1.1,
      duration: 1.65,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    let frameId = 0;
    const clock = new THREE.Clock();

    const render = () => {
      const time = clock.getElapsedTime();

      core.rotation.x = time * 0.28;
      core.rotation.y = time * 0.38;
      wire.rotation.x = -time * 0.2;
      wire.rotation.y = time * 0.52;
      stars.rotation.y = time * 0.035;
      stars.rotation.x = Math.sin(time * 0.3) * 0.04;
      rings.forEach((ring, index) => {
        ring.rotation.z += 0.004 + index * 0.0011;
        ring.rotation.x += 0.0018 + index * 0.0005;
      });

      dots.forEach((dot, index) => {
        const data = dot.userData;
        const angle = data.angle + time * (0.46 + index * 0.08);
        dot.position.set(
          Math.cos(angle) * data.radius,
          Math.sin(angle * 1.3) * 0.32 + data.y,
          Math.sin(angle) * data.radius * 0.54
        );
      });

      group.rotation.y += 0.0026;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intro.kill();
      pulse.kill();
      renderer.dispose();
      core.geometry.dispose();
      core.material.dispose();
      wire.geometry.dispose();
      wire.material.dispose();
      starGeometry.dispose();
      stars.material.dispose();
      rings.forEach((ring) => {
        ring.geometry.dispose();
        ring.material.dispose();
      });
      dots.forEach((dot) => {
        dot.geometry.dispose();
        dot.material.dispose();
      });
      host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="h-full min-h-[220px] w-full"
      aria-hidden="true"
    />
  );
}
