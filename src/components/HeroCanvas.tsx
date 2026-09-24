'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * The one place 3D earns its keep: the showroom photograph rendered through a single shader
 * plane so the room can be *filmed* instead of shown. Pointer and scroll drive a shallow
 * parallax, the lens breathes, warm areas pulse like the shop's lighting, and the edges fall
 * off chromatically. One draw call, one texture, no models and no post-processing pass.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uTex;
  uniform vec2  uPlane;      // plane size in world units
  uniform vec2  uImage;      // texture pixel size
  uniform vec2  uPointer;    // -1..1, damped
  uniform float uTime;
  uniform float uScroll;     // 0..1 through the hero

  varying vec2 vUv;

  // cover-fit: keep the image's aspect and crop the overflowing axis
  vec2 coverUv(vec2 uv, vec2 plane, vec2 image) {
    float planeAspect = plane.x / plane.y;
    float imageAspect = image.x / image.y;
    vec2 s = planeAspect > imageAspect
      ? vec2(1.0, imageAspect / planeAspect)
      : vec2(planeAspect / imageAspect, 1.0);
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv, uPlane, uImage);

    // lens breathing + scroll push-in
    float breathe = 1.0 + 0.012 * sin(uTime * 0.22);
    float push = 1.0 + uScroll * 0.12;
    uv = (uv - 0.5) / (breathe * push) + 0.5;

    // parallax: background drifts against the pointer, foreground stays
    float depth = smoothstep(0.0, 1.0, 1.0 - uv.y);
    uv += uPointer * vec2(0.012, 0.008) * (0.45 + depth * 0.9);
    // sit the frame on the sign and the monogram rather than the counter
    uv.y -= 0.06;
    uv.y += uScroll * 0.04;

    // chromatic falloff, strongest at the frame edge
    vec2 c = uv - 0.5;
    float r2 = dot(c, c);
    float ca = 0.0016 + r2 * 0.006;
    vec3 col;
    col.r = texture2D(uTex, uv + c * ca).r;
    col.g = texture2D(uTex, uv).g;
    col.b = texture2D(uTex, uv - c * ca).b;

    // the shop's warm lamps, gently alive
    float warmth = smoothstep(0.35, 1.0, col.r * 0.6 + col.g * 0.4 - col.b * 0.2);
    col += warmth * vec3(0.055, 0.03, -0.01) * (0.55 + 0.45 * sin(uTime * 0.5));

    // vignette, plus extra weight along the floor so type sits on something solid
    // (edge0 < edge1 — GLSL smoothstep is undefined otherwise)
    float vig = 1.0 - smoothstep(0.12, 1.05, r2 * 1.7);
    col *= mix(0.55, 1.06, vig);
    col *= mix(1.0, 0.78, smoothstep(0.55, 1.0, 1.0 - vUv.y));

    // grade: pull a little colour out and crush the room back so it reads as the
    // atmosphere behind the headline rather than competing with it
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, vec3(luma), 0.16);
    col = pow(col, vec3(1.04)) * 1.0;

    // scroll darkening so the type below always wins
    col *= 1.0 - uScroll * 0.3;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plate({
  src,
  scrollRef,
  active,
}: {
  src: string;
  scrollRef: React.RefObject<number>;
  active: boolean;
}) {
  const tex = useTexture(src);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const pointer = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));
  const scroll = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uPlane: { value: new THREE.Vector2(1, 1) },
      uImage: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uScroll: { value: 0 },
    }),
    [tex],
  );

  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    const img = tex.image as { width: number; height: number } | undefined;
    if (img) uniforms.uImage.value.set(img.width, img.height);
  }, [tex, uniforms]);

  useFrame((state, delta) => {
    // Write through the live material: three copies the uniforms object when the material
    // is created, so mutating the one we passed in as a prop would never reach the GPU.
    const u = mat.current?.uniforms;
    if (!u) return;
    // Offscreen: stop advancing the animation, but keep the frame already drawn.
    if (!active) return;

    const d = Math.min(delta, 0.05);
    target.current.set(state.pointer.x, state.pointer.y);
    pointer.current.lerp(target.current, 1 - Math.pow(0.001, d));

    scroll.current += (scrollRef.current - scroll.current) * (1 - Math.pow(0.002, d));

    u.uTime.value = state.clock.elapsedTime;
    u.uPointer.value.copy(pointer.current);
    u.uScroll.value = scroll.current;
    u.uPlane.value.set(viewport.width, viewport.height);
    const img = tex.image as { width: number; height: number } | undefined;
    if (img) u.uImage.value.set(img.width, img.height);
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function HeroCanvas({
  src,
  scrollRef,
  active,
}: {
  src: string;
  scrollRef: React.RefObject<number>;
  /** False once the hero has scrolled away: the render loop stops, the context stays. */
  active: boolean;
}) {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ position: 'absolute', inset: 0 }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <Plate src={src} scrollRef={scrollRef} active={active} />
      </Suspense>
    </Canvas>
  );
}
