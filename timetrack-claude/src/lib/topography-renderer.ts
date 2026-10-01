// Fundo de relevo ao vivo: curvas de nível de um terreno que muda devagar,
// desenhadas em WebGL 2 por um único fragment shader. Sem React.

const VERTEX_SHADER = `#version 300 es
// Um triângulo que cobre a tela inteira, sem buffers.
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

// Ruído simplex 3D: Ashima Arts / webgl-noise (licença MIT), https://github.com/ashima/webgl-noise.
// Ajuste: raio 0.5 no lugar de 0.6 e fator 80.0 no lugar de 42.0. O raio 0.6 deixa pequenos
// degraus ao longo da grade interna, e uma linha que cai num degrau vira um risco reto.
const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uPixelRatio;
uniform vec2 uOffset;
uniform vec2 uSlope;
uniform vec4 uColor;

out vec4 outColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 80.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

const float FREQ = 1.0 / 600.0;

// Duas oitavas, com o tempo como terceira dimensão.
float fbm(vec2 p, float z) {
  return 0.5 * (snoise(vec3(p * FREQ, z)) + 0.25 * snoise(vec3(p * FREQ * 2.1, z * 1.3)));
}

void main() {
  vec2 q = gl_FragCoord.xy / uPixelRatio;  // pixels CSS
  vec2 p = q + uOffset;                    // desenho próprio de cada cena
  float z = uTime * 0.005;                 // a forma muda devagar

  // Distorção do domínio para curvas orgânicas.
  vec2 warp = vec2(fbm(p + vec2(311.0, 97.0), z), fbm(p + vec2(-523.0, 431.0), z)) * 60.0;
  float height = fbm(p + warp, z);
  height += dot(uSlope, q);    // inclinação: evita platôs sem linhas
  height += uTime * 0.0012;    // as linhas escorrem de leve, sempre em movimento

  float level = height / 0.062;
  float dist = abs(fract(level + 0.5) - 0.5) / max(fwidth(level), 1e-5);
  float halfWidth = 1.15 * uPixelRatio * 0.5;
  float line = 1.0 - smoothstep(halfWidth - 0.5, halfWidth + 0.5, dist);

  outColor = vec4(uColor.rgb * uColor.a, uColor.a) * line;
}`;

const MAX_PIXEL_RATIO = 1.5;
const MAX_DELTA = 0.1;
const FADE_MS = 450;
const SLOPE = 0.0011;
const MAX_OFFSET = 30000;

type Scene = { offset: [number, number]; slope: [number, number] };

// djb2: cada id ganha sempre o mesmo desenho.
function hash(text: string) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h;
}

function sceneFor(id: string): Scene {
  const h = hash(id);
  const angle = ((Math.imul(h, 2654435761) >>> 0) / 2 ** 32) * Math.PI * 2;
  return {
    offset: [((h & 0xffff) / 0xffff) * MAX_OFFSET, ((h >>> 16) / 0xffff) * MAX_OFFSET],
    slope: [Math.cos(angle) * SLOPE, Math.sin(angle) * SLOPE],
  };
}

// Lê "rgb(r g b / a)" ou "rgba(r, g, b, a)" como o navegador devolve em getComputedStyle.
function parseColor(css: string): [number, number, number, number] {
  const match = css.match(/rgba?\(([^)]+)\)/);
  if (!match) return [0.5, 0.5, 0.5, 0.12];
  const [r, g, b, a = "1"] = match[1].split(/[\s,/]+/).filter(Boolean);
  return [Number(r) / 255, Number(g) / 255, Number(b) / 255, Number(a)];
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("Relevo: shader não compilou.", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export class TopographyRenderer {
  private readonly gl: WebGL2RenderingContext;
  private readonly canvas: HTMLCanvasElement;
  private readonly uniforms: Record<"time" | "pixelRatio" | "offset" | "slope" | "color", WebGLUniformLocation | null>;
  private readonly resizeObserver: ResizeObserver;
  private readonly themeObserver: MutationObserver;
  private readonly reducedMotion: MediaQueryList;

  private time = 0;
  private times = new Map<string, number>();
  private sceneId: string | null = null;
  private scene: Scene = sceneFor("");
  private moving = false;
  private frame = 0;
  private lastTimestamp: number | null = null;
  private pixelRatio = 1;
  private color: [number, number, number, number] = [0, 0, 0, 0];

  // Devolve null sem WebGL 2: quem chama mostra o fundo estático.
  static create(canvas: HTMLCanvasElement): TopographyRenderer | null {
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return null;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Relevo: programa não ligou.", gl.getProgramInfoLog(program));
      return null;
    }
    return new TopographyRenderer(canvas, gl, program);
  }

  private constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, program: WebGLProgram) {
    this.canvas = canvas;
    this.gl = gl;

    gl.useProgram(program);
    gl.bindVertexArray(gl.createVertexArray());
    gl.clearColor(0, 0, 0, 0);
    this.uniforms = {
      time: gl.getUniformLocation(program, "uTime"),
      pixelRatio: gl.getUniformLocation(program, "uPixelRatio"),
      offset: gl.getUniformLocation(program, "uOffset"),
      slope: gl.getUniformLocation(program, "uSlope"),
      color: gl.getUniformLocation(program, "uColor"),
    };

    this.readColor();
    this.resize();

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
      this.draw();
    });
    this.resizeObserver.observe(canvas);

    // A cor das linhas vem do CSS e muda com o tema.
    this.themeObserver = new MutationObserver(() => {
      this.readColor();
      this.draw();
    });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });

    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reducedMotion.addEventListener("change", this.updateLoop);
  }

  // Troca o desenho (id) e liga ou desliga o movimento. Parar congela as linhas onde estão.
  setScene(id: string, moving: boolean) {
    if (id !== this.sceneId) {
      if (this.sceneId !== null) this.times.set(this.sceneId, this.time);
      this.sceneId = id;
      this.scene = sceneFor(id);
      this.time = this.times.get(id) ?? 0;
      if (!this.reducedMotion.matches) {
        this.canvas.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_MS, easing: "ease-out" });
      }
    }
    this.moving = moving;
    this.updateLoop();
    this.draw();
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.resizeObserver.disconnect();
    this.themeObserver.disconnect();
    this.reducedMotion.removeEventListener("change", this.updateLoop);
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  private updateLoop = () => {
    const shouldRun = this.moving && !this.reducedMotion.matches;
    if (shouldRun && !this.frame) {
      this.lastTimestamp = null;
      this.frame = requestAnimationFrame(this.tick);
    } else if (!shouldRun && this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
  };

  private tick = (timestamp: number) => {
    // Delta limitado: ao voltar de outra aba, as linhas não dão salto.
    if (this.lastTimestamp !== null) {
      this.time += Math.min((timestamp - this.lastTimestamp) / 1000, MAX_DELTA);
    }
    this.lastTimestamp = timestamp;
    this.draw();
    this.frame = requestAnimationFrame(this.tick);
  };

  private readColor() {
    this.color = parseColor(getComputedStyle(this.canvas).color);
  }

  private resize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    this.canvas.width = Math.max(1, Math.round(width * ratio));
    this.canvas.height = Math.max(1, Math.round(height * ratio));
    this.pixelRatio = width > 0 ? this.canvas.width / width : ratio;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private draw() {
    const { gl, uniforms, scene } = this;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uniforms.time, this.time);
    gl.uniform1f(uniforms.pixelRatio, this.pixelRatio);
    gl.uniform2f(uniforms.offset, scene.offset[0], scene.offset[1]);
    gl.uniform2f(uniforms.slope, scene.slope[0], scene.slope[1]);
    gl.uniform4f(uniforms.color, ...this.color);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
