attribute vec3 morphing;
uniform float uProgress;
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vPosition = position;
  vec3 final = mix(position,morphing,uProgress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( final, 1.0 );
}