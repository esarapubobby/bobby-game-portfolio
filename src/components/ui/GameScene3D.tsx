import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const GameScene3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Verify WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setIsSupported(false);
        return;
      }
    } catch {
      setIsSupported(false);
      return;
    }

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // Scene setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group holding the main 3D artifact
    const group = new THREE.Group();
    scene.add(group);

    // 1. Core Polyhedron (Low-poly faceted game crystal)
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c1218,
      roughness: 0.2,
      metalness: 0.85,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(coreMesh);

    // 2. Wireframe Edge Cage (Neon-lime outline mimicking Unity wireframe)
    const wireframeGeometry = new THREE.WireframeGeometry(coreGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0xa3e635, // Neon Lime
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
    });
    const wireframeLine = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    group.add(wireframeLine);

    // 3. Unity Transform Gizmo Rings
    const ringGeometry = new THREE.TorusGeometry(1.7, 0.015, 16, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xa3e635,
      transparent: true,
      opacity: 0.35,
    });
    const ringX = new THREE.Mesh(ringGeometry, ringMaterial);
    ringX.rotation.x = Math.PI / 2;
    group.add(ringX);

    const ringY = new THREE.Mesh(ringGeometry, ringMaterial);
    ringY.rotation.y = Math.PI / 2;
    group.add(ringY);

    // 4. Ambient Floating Dust Embers
    const emberCount = 35;
    const emberGeometry = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount * 3; i += 3) {
      emberPositions[i] = (Math.random() - 0.5) * 4;
      emberPositions[i + 1] = (Math.random() - 0.5) * 4;
      emberPositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    emberGeometry.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    const emberMaterial = new THREE.PointsMaterial({
      color: 0xa3e635,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const embers = new THREE.Points(emberGeometry, emberMaterial);
    scene.add(embers);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xa3e635, 2.5);
    directionalLight.position.set(3, 4, 3);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    backLight.position.set(-3, -3, -2);
    scene.add(backLight);

    // Pointer-based rotation tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });

    // Handle Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // IntersectionObserver to pause loop when scrolled away
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp to mouse position
      targetRotationY = mouseX * 0.75;
      targetRotationX = mouseY * 0.75;

      if (!prefersReducedMotion) {
        group.rotation.y += 0.005;
        group.rotation.x += 0.003;
      }

      group.rotation.y += (targetRotationY - (group.rotation.y % (Math.PI * 2))) * 0.04;
      group.rotation.x += (targetRotationX - (group.rotation.x % (Math.PI * 2))) * 0.04;

      // Gentle vertical hover floating
      group.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Rotate Gizmo rings in opposite directions
      ringX.rotation.z = elapsedTime * 0.4;
      ringY.rotation.z = -elapsedTime * 0.4;

      // Rotate embers slowly
      embers.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);

      // Clean disposal
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      emberGeometry.dispose();
      emberMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!isSupported) {
    // Static CSS Fallback
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-48 h-48 rounded-full border border-accent/40 bg-accent/10 flex items-center justify-center shadow-lg shadow-accent/20">
          <div className="w-32 h-32 rounded-full border border-white/20 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
    />
  );
};
