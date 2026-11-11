// Snake Pro 3D renderer.
// The rules all live in game.js. Every frame game.js hands this file a plain "view" object
// (where the snake, items and rocks are) and this file turns it into a lit 3D scene with
// three.js (WebGL). If WebGL isn't available, game.js keeps using its 2D drawing instead.
import * as THREE from './vendor/three.min.js';

const MAX_SEGMENTS = 1400;  // body spheres (three per snake square)
const MAX_ROCKS = 400;

function createRenderer(glCanvas, cols, rows) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;
  renderer.shadowMap.enabled = true;

  const api = { ok: true, quality: 'high' };
  glCanvas.addEventListener('webglcontextlost', e => { e.preventDefault(); api.ok = false; });

  // ---------- Scene, camera, lights ----------
  const scene = new THREE.Scene();
  const fogColor = new THREE.Color('#06110c');
  scene.background = fogColor;
  scene.fog = new THREE.Fog(fogColor, 40, 80);
  const camera = new THREE.PerspectiveCamera(26, 1, 0.5, 300);

  scene.add(new THREE.HemisphereLight('#dff3ff', '#1d2b22', 1.15));
  const sun = new THREE.DirectionalLight('#fff4dc', 1.9);
  sun.position.set(-7, 20, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 50 });
  sun.shadow.bias = -0.0008;
  scene.add(sun);

  // Board coordinates: game squares (x, y) map to world X/Z, with Y pointing up.
  const wx = x => x - cols / 2, wz = y => y - rows / 2;

  // ---------- The board: a checkered slab on a stone plinth, with walls ----------
  const boardTex = document.createElement('canvas');
  boardTex.width = boardTex.height = 512;
  const boardMap = new THREE.CanvasTexture(boardTex);
  boardMap.colorSpace = THREE.SRGBColorSpace;
  boardMap.anisotropy = 4;
  let boardKey = '';
  function paintBoard(c0, c1, line) {
    const key = c0 + c1 + line;
    if (key === boardKey) return;
    boardKey = key;
    const g = boardTex.getContext('2d'), cs = 512 / cols;
    g.fillStyle = c0; g.fillRect(0, 0, 512, 512);
    g.fillStyle = c1;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if ((x + y) % 2) g.fillRect(x * cs, y * cs, cs, cs);
    g.strokeStyle = line; g.lineWidth = 1;
    for (let i = 0; i <= cols; i++) { g.beginPath(); g.moveTo(i * cs, 0); g.lineTo(i * cs, 512); g.moveTo(0, i * cs); g.lineTo(512, i * cs); g.stroke(); }
    boardMap.needsUpdate = true;
  }
  const sideMat = new THREE.MeshStandardMaterial({ color: '#1b2a22', roughness: 0.9 });
  const topMat = new THREE.MeshStandardMaterial({ map: boardMap, roughness: 0.85 });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(cols, 0.6, rows), [sideMat, sideMat, topMat, sideMat, sideMat, sideMat]);
  slab.position.y = -0.3;
  slab.receiveShadow = true;
  scene.add(slab);
  const plinthMat = new THREE.MeshStandardMaterial({ color: '#0f1c16', roughness: 1 });
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(cols + 3, 1.2, rows + 3), plinthMat);
  plinth.position.y = -1.2;
  plinth.receiveShadow = true;
  scene.add(plinth);

  // Walls: solid stone blocks when walls kill, a low glowing rim when edges wrap.
  const wallSolid = new THREE.MeshStandardMaterial({ color: '#b8860b', roughness: 0.55, metalness: 0.2 });
  const wallGlow = new THREE.MeshBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.45 });
  const walls = [];
  for (const [w, d, x, z] of [[cols + 1, 0.5, 0, -(rows / 2 + 0.25)], [cols + 1, 0.5, 0, rows / 2 + 0.25], [0.5, rows, -(cols / 2 + 0.25), 0], [0.5, rows, cols / 2 + 0.25, 0]]) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, 1, d), wallSolid);
    m.position.set(x, 0, z);
    m.castShadow = true; m.receiveShadow = true;
    scene.add(m); walls.push(m);
  }
  let wallKey = '';
  function setWalls(style, color) {
    const key = style + color;
    if (key === wallKey) return;
    wallKey = key;
    const glow = style !== 'solid';
    if (glow) wallGlow.color.set(color); else wallSolid.color.set(color);
    for (const m of walls) {
      m.material = glow ? wallGlow : wallSolid;
      const h = glow ? 0.18 : 0.75;
      m.scale.y = h; m.position.y = h / 2;
      m.castShadow = !glow;
    }
  }

  // ---------- Snake: instanced spheres along the path + a head with eyes ----------
  const bodyMat = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.05 });
  const body = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 12), bodyMat, MAX_SEGMENTS);
  body.castShadow = true;
  body.frustumCulled = false;
  body.count = 0;
  scene.add(body);
  const head = new THREE.Group();
  const headMat = new THREE.MeshStandardMaterial({ roughness: 0.32, metalness: 0.05 });
  const headBall = new THREE.Mesh(new THREE.SphereGeometry(0.5, 28, 20), headMat);
  headBall.castShadow = true;
  head.add(headBall);
  const eyeWhite = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.2 });
  const pupilMat = new THREE.MeshStandardMaterial({ color: '#0b1320', roughness: 0.15 });
  const eyes = [];
  for (const side of [-1, 1]) {
    const eye = new THREE.Group();
    eye.add(new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), eyeWhite));
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), pupilMat);
    pupil.position.set(0.09, 0.02, 0);
    eye.add(pupil);
    eye.position.set(0.28, 0.25, side * 0.2);
    head.add(eye); eyes.push(pupil);
  }
  const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.06), new THREE.MeshBasicMaterial({ color: '#f43f5e' }));
  tongue.position.set(0.6, 0.02, 0);
  head.add(tongue);
  scene.add(head);
  const shield = new THREE.Mesh(new THREE.SphereGeometry(0.85, 20, 14), new THREE.MeshBasicMaterial({ color: '#38bdf8', wireframe: true, transparent: true, opacity: 0.55 }));
  scene.add(shield);

  // ---------- Rocks ----------
  const rockMat = new THREE.MeshStandardMaterial({ color: '#6b7a90', roughness: 0.95, flatShading: true });
  const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.48, 0), rockMat, MAX_ROCKS);
  rocks.castShadow = true; rocks.receiveShadow = true;
  rocks.frustumCulled = false;
  rocks.count = 0;
  scene.add(rocks);

  // ---------- Items: emoji billboards with a coloured glow on the floor ----------
  const emojiTex = new Map();
  function emojiTexture(e) {
    let t = emojiTex.get(e);
    if (t) return t;
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '100px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    g.fillText(e, 64, 70);
    t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    emojiTex.set(e, t);
    return t;
  }
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = glowCanvas.height = 64;
  {
    const g = glowCanvas.getContext('2d'), rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255,255,255,0.9)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
  }
  const glowTex = new THREE.CanvasTexture(glowCanvas);
  const glowGeo = new THREE.CircleGeometry(1, 24);
  const itemPool = new Map();   // game item object → its 3D parts
  function itemParts(it) {
    let p = itemPool.get(it.ref);
    if (p) return p;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: emojiTexture(it.emoji), transparent: true, depthWrite: false }));
    const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ map: glowTex, color: it.glow, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.rotation.x = -Math.PI / 2;
    scene.add(sprite, glow);
    p = { sprite, glow, ring: null };
    if (it.kind === 'portal') {
      p.ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.08, 10, 36), new THREE.MeshBasicMaterial({ color: '#c084fc' }));
      p.ring.rotation.x = -Math.PI / 2;
      scene.add(p.ring);
    }
    itemPool.set(it.ref, p);
    return p;
  }
  function dropItem(ref, p) {
    scene.remove(p.sprite, p.glow);
    p.sprite.material.dispose(); p.glow.material.dispose();
    if (p.ring) { scene.remove(p.ring); p.ring.geometry.dispose(); p.ring.material.dispose(); }
    itemPool.delete(ref);
  }

  // ---------- Secret level: a field of stars around the board ----------
  const starGeo = new THREE.BufferGeometry();
  const starPos = [];
  for (let i = 0; i < 500; i++) {
    const a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI, r = 45 + Math.random() * 20;
    starPos.push(r * Math.sin(b) * Math.cos(a), r * Math.cos(b) * 0.6 + 5, r * Math.sin(b) * Math.sin(a));
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#ffffff', size: 0.45, fog: false }));
  stars.visible = false;
  scene.add(stars);

  // ---------- Camera framing ----------
  // The camera looks down at 68° and backs off until the whole board and walls fit the
  // square view. It never rotates, so "up" on screen is always "up" on the board and
  // swipe directions keep their meaning.
  const elev = 68 * Math.PI / 180;
  const target = new THREE.Vector3(0, 0, 0.5);
  const camDir = new THREE.Vector3(0, Math.sin(elev), Math.cos(elev));
  let camDist = 30;
  const tmp = new THREE.Vector3();
  function fitCamera() {
    camera.aspect = 1; camera.updateProjectionMatrix();
    const corners = [];
    for (const x of [-cols / 2 - 0.5, cols / 2 + 0.5]) for (const z of [-rows / 2 - 0.5, rows / 2 + 0.5]) for (const y of [0, 0.75]) corners.push(new THREE.Vector3(x, y, z));
    for (let d = 14; d < 120; d += 0.1) {
      camera.position.copy(camDir).multiplyScalar(d).add(target);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      if (corners.every(c => { tmp.copy(c).project(camera); return Math.abs(tmp.x) <= 0.995 && Math.abs(tmp.y) <= 0.99; })) { camDist = d; return; }
    }
  }
  fitCamera();

  // ---------- Size & adaptive quality ----------
  let cssSize = 0, pixelRatio = 1;
  api.setSize = (size, dpr) => {
    if (size === cssSize && dpr === pixelRatio) return;
    cssSize = size; pixelRatio = api.quality === 'low' ? 1 : Math.min(dpr, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(size, size, false);
  };
  // If frames are consistently slow, drop shadows and render fewer pixels.
  let slowFrames = 0, lastT = 0;
  function watchSpeed(now) {
    if (lastT && api.quality === 'high') {
      const dt = now - lastT;
      slowFrames = dt > 26 && dt < 250 ? slowFrames + 1 : Math.max(0, slowFrames - 2);
      if (slowFrames > 90) {
        api.quality = 'low';
        renderer.shadowMap.enabled = false;
        sideMat.needsUpdate = topMat.needsUpdate = plinthMat.needsUpdate = bodyMat.needsUpdate = headMat.needsUpdate = rockMat.needsUpdate = wallSolid.needsUpdate = true;
        const s = cssSize; cssSize = 0; api.setSize(s, 1);
      }
    }
    lastT = now;
  }

  // ---------- Per-frame drawing ----------
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), pos = new THREE.Vector3(), scl = new THREE.Vector3();
  const col = new THREE.Color();
  const look = new THREE.Vector3();
  api.render = view => {
    if (!api.ok || !cssSize) return;
    const now = view.now;
    watchSpeed(now);

    paintBoard(view.board[0], view.board[1], view.secret ? '#3b1d6e' : 'rgba(255,255,255,0.05)');
    setWalls(view.wallStyle, view.wallColor);
    stars.visible = view.secret;
    scene.background.set(view.secret ? '#120a26' : view.sky);
    scene.fog.color.copy(scene.background);

    // Body: three overlapping spheres per square, so it reads as one smooth tube that tapers to the tail.
    const pts = view.snake, n = pts.length;
    let k = 0;
    const radius = i => 0.43 - 0.15 * (n > 1 ? i / (n - 1) : 0);
    q.identity();
    for (let i = n - 1; i >= 1 && k < MAX_SEGMENTS - 3; i--) {
      const a = pts[i], b = pts[i - 1];
      col.setStyle(view.colors[i]);
      const linked = Math.abs(a.x - b.x) + Math.abs(a.y - b.y) < 1.5;   // not across a wrap-around edge
      for (let s = 0; s < (linked ? 3 : 1); s++) {
        const f = s / 3, r = radius(i - f);
        m4.compose(pos.set(wx(a.x + (b.x - a.x) * f), r, wz(a.y + (b.y - a.y) * f)), q, scl.set(r, r, r));
        body.setMatrixAt(k, m4); body.setColorAt(k, col); k++;
      }
    }
    body.count = k;
    body.instanceMatrix.needsUpdate = true;
    if (body.instanceColor) body.instanceColor.needsUpdate = true;
    const ghostAlpha = view.ghost;
    for (const mat of [bodyMat, headMat]) {
      const tr = ghostAlpha < 1;
      if (mat.transparent !== tr) { mat.transparent = tr; mat.needsUpdate = true; }
      mat.opacity = ghostAlpha;
    }

    // Head, facing the way the snake is moving.
    const h = pts[0];
    head.position.set(wx(h.x), 0.47, wz(h.y));
    head.rotation.y = Math.atan2(-view.dir.y, view.dir.x);
    headMat.color.setStyle(view.headColor);
    tongue.visible = view.tongue;
    for (const p of eyes) {
      p.material = pupilMat;
      p.scale.setScalar(view.dead ? 0.6 : 1);
    }
    pupilMat.color.set(view.dead ? '#ef4444' : '#0b1320');
    shield.visible = view.shield;
    if (view.shield) {
      shield.position.copy(head.position);
      shield.rotation.y = now / 900;
      shield.scale.setScalar(1 + 0.06 * Math.sin(now / 160));
    }

    // Rocks pop up when they appear, each with its own fixed tumble.
    rocks.count = Math.min(view.rocks.length, MAX_ROCKS);
    for (let i = 0; i < rocks.count; i++) {
      const r = view.rocks[i];
      const seed = (r.x * 73 + r.y * 151) % 360;
      e3.set(seed, seed * 1.7, seed * 0.3);
      const s = r.s * (0.92 + (seed % 10) / 60);
      m4.compose(pos.set(wx(r.x + 0.5), 0.36 * s, wz(r.y + 0.5)), q.setFromEuler(e3), scl.set(s, s * 0.85, s));
      rocks.setMatrixAt(i, m4);
    }
    rocks.instanceMatrix.needsUpdate = true;

    // Items.
    const seen = new Set();
    for (const it of view.items) {
      seen.add(it.ref);
      const p = itemParts(it);
      const s = it.scale;
      p.sprite.visible = !it.blink;
      p.sprite.position.set(wx(it.x), 0.75 + it.bob, wz(it.y));
      p.sprite.scale.set(1.4 * s, 1.4 * s, 1);
      if (it.kind === 'portal') p.sprite.material.rotation = -now / 250;
      p.glow.position.set(wx(it.x), 0.02, wz(it.y));
      p.glow.scale.setScalar(1.1 * s * it.pulse);
      p.glow.material.color.set(it.glow);
      if (p.ring) { p.ring.position.set(wx(it.x), 0.12, wz(it.y)); p.ring.rotation.z = now / 300; }
    }
    for (const [ref, p] of itemPool) if (!seen.has(ref)) dropItem(ref, p);

    // Camera: a gentle drift toward the head and a shake on hits (both off with reduce motion).
    look.set(wx(h.x) * 0.06, 0, wz(h.y) * 0.06).add(target);
    camera.position.copy(camDir).multiplyScalar(camDist).add(look);
    if (view.shake > 0.2) camera.position.add(tmp.set((Math.random() - 0.5) * view.shake * 0.03, (Math.random() - 0.5) * view.shake * 0.03, 0));
    camera.lookAt(look);
    camera.updateMatrixWorld();

    renderer.render(scene, camera);
  };

  // Where a point on the board appears on screen, in CSS pixels from the board's top-left.
  // game.js uses it to draw scores, particles and timers on top of the 3D scene.
  api.project = (x, y, height = 0) => {
    tmp.set(wx(x), height, wz(y)).project(camera);
    return { x: (tmp.x + 1) / 2 * cssSize, y: (1 - tmp.y) / 2 * cssSize };
  };
  api.canvas = glCanvas;
  return api;
}

const glCanvas = document.getElementById('board3d');
window.Snake3D = glCanvas ? createRenderer(glCanvas, 20, 20) : null;
window.dispatchEvent(new Event('snake3d-ready'));
