// Detailed cartoon-crowd sprite for Skiper39's CrowdCanvas.
//
// Why generated: the Skiper registry ships only code, so the demo sprite
// (`/images/peeps/all-peeps.png`) is user-supplied and has no public URL.
// These OpenPeeps-style faces (white skin, ink line-art, hats, glasses,
// beards) are drawn to resemble the reference preview while staying in
// this site's ink + lime palette. The GSAP crowd engine itself is 100%
// original Skiper39 code.
"use client";

export const CROWD_COLS = 8;
export const CROWD_ROWS = 6;
const CELL_W = 150;
const CELL_H = 200;

const INK = "#211f15";
const SKIN = "#ffffff";
const LIME = "#c7f23c";

interface CrowdPalette {
  /** main + secondary body colors */
  bodyA: string;
  bodyB: string;
  /** legs, shoes */
  leg: string;
  /** detail lines on bodies (collars, zippers, stripes) */
  detailOnLight: string;
  /** ground shadow */
  shadow: string;
}

function lightPalette(): CrowdPalette {
  return {
    bodyA: "#211f15",
    bodyB: "#3a382c",
    leg: "#211f15",
    detailOnLight: SKIN,
    shadow: "rgba(21,20,15,0.10)",
  };
}

function darkPalette(): CrowdPalette {
  return {
    bodyA: "#efe9d8",
    bodyB: "#8f8a78",
    leg: "#e3dcc8",
    detailOnLight: INK,
    shadow: "rgba(247,243,233,0.10)",
  };
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rand = () => number;

function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.fill();
}

function circle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/* ------------------------------- face ------------------------------- */

function drawEyes(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  hx: number,
  hy: number,
) {
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  const kind = Math.floor(rand() * 6);
  if (kind === 0) {
    // dots
    circle(ctx, hx - 9, hy - 2, 3.2);
    circle(ctx, hx + 9, hy - 2, 3.2);
  } else if (kind === 1) {
    // happy arcs
    ctx.beginPath();
    ctx.arc(hx - 9, hy + 1, 5, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(hx + 9, hy + 1, 5, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  } else if (kind === 2) {
    // round glasses
    ctx.beginPath();
    ctx.arc(hx - 9.5, hy - 2, 7.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(hx + 9.5, hy - 2, 7.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(hx - 2, hy - 3);
    ctx.lineTo(hx + 2, hy - 3);
    ctx.stroke();
    circle(ctx, hx - 9.5, hy - 2, 2);
    circle(ctx, hx + 9.5, hy - 2, 2);
  } else if (kind === 3) {
    // sunglasses
    ctx.fillStyle = INK;
    rr(ctx, hx - 16, hy - 8, 14, 11, 4);
    rr(ctx, hx + 2, hy - 8, 14, 11, 4);
    ctx.fillRect(hx - 3, hy - 6, 6, 3);
  } else if (kind === 4) {
    // sleepy lines
    ctx.beginPath();
    ctx.moveTo(hx - 14, hy - 2);
    ctx.lineTo(hx - 5, hy - 2);
    ctx.moveTo(hx + 5, hy - 2);
    ctx.lineTo(hx + 14, hy - 2);
    ctx.stroke();
  } else {
    // wink
    circle(ctx, hx - 9, hy - 2, 3.2);
    ctx.beginPath();
    ctx.arc(hx + 9, hy + 1, 5, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // brows (often)
  if (rand() > 0.45 && kind !== 3) {
    ctx.beginPath();
    ctx.moveTo(hx - 14, hy - 12);
    ctx.lineTo(hx - 5, hy - 13);
    ctx.moveTo(hx + 5, hy - 13);
    ctx.lineTo(hx + 14, hy - 12);
    ctx.stroke();
  }
}

function drawMouth(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  hx: number,
  hy: number,
) {
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  const kind = Math.floor(rand() * 5);
  if (kind === 0) {
    // smile
    ctx.beginPath();
    ctx.arc(hx, hy + 5, 9, Math.PI * 0.18, Math.PI * 0.82);
    ctx.stroke();
  } else if (kind === 1) {
    // open smile
    ctx.beginPath();
    ctx.ellipse(hx, hy + 11, 7, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = SKIN;
    rr(ctx, hx - 5, hy + 5, 10, 4, 2);
  } else if (kind === 2) {
    // flat
    ctx.beginPath();
    ctx.moveTo(hx - 7, hy + 10);
    ctx.lineTo(hx + 7, hy + 10);
    ctx.stroke();
  } else if (kind === 3) {
    // mustache + smile
    ctx.beginPath();
    ctx.ellipse(hx - 7, hy + 8, 9, 4.5, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(hx + 7, hy + 8, 9, 4.5, 0.35, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // beard + smile cutout
    ctx.beginPath();
    ctx.arc(hx, hy + 2, 20, Math.PI * 0.12, Math.PI * 0.88);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = SKIN;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(hx, hy + 6, 9, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();
  }
}

/* ---------------------------- hair & hats ---------------------------- */

function drawHair(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  hx: number,
  hy: number,
  r: number,
  accent: string,
) {
  ctx.fillStyle = INK;
  ctx.strokeStyle = INK;
  const kind = Math.floor(rand() * 8);
  if (kind === 0) {
    // short cap
    ctx.beginPath();
    ctx.arc(hx, hy - 4, r + 1, Math.PI, 0);
    ctx.fill();
  } else if (kind === 1) {
    // spiky
    ctx.beginPath();
    const spikes = 5;
    for (let i = 0; i <= spikes; i++) {
      const a = Math.PI + (i / spikes) * Math.PI;
      const sx = hx + Math.cos(a) * (r + 2);
      const sy = hy - 4 + Math.sin(a) * (r + 2);
      const tx = hx + Math.cos(a - Math.PI / (spikes * 2)) * (r + 12);
      const ty = hy - 4 + Math.sin(a - Math.PI / (spikes * 2)) * (r + 12);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
      ctx.lineTo(tx, ty);
    }
    ctx.closePath();
    ctx.fill();
  } else if (kind === 2) {
    // afro cluster
    const blobs: Array<[number, number, number]> = [
      [0, -22, 15],
      [-16, -14, 13],
      [16, -14, 13],
      [-10, -30, 12],
      [10, -30, 12],
    ];
    for (const [dx, dy, br] of blobs) circle(ctx, hx + dx, hy + dy, br);
  } else if (kind === 3) {
    // bun
    ctx.beginPath();
    ctx.arc(hx, hy - 4, r + 1, Math.PI * 0.95, Math.PI * 2.05);
    ctx.fill();
    circle(ctx, hx, hy - r - 12, 9);
  } else if (kind === 4) {
    // beanie (sometimes lime)
    ctx.fillStyle = rand() > 0.6 ? accent : INK;
    ctx.beginPath();
    ctx.arc(hx, hy - 8, r + 2, Math.PI, 0);
    ctx.fill();
    rr(ctx, hx - r - 2, hy - 16, (r + 2) * 2, 12, 6);
    circle(ctx, hx, hy - r - 14, 7);
  } else if (kind === 5) {
    // side cap + brim
    ctx.beginPath();
    ctx.arc(hx, hy - 6, r + 1, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
    ctx.fillStyle = rand() > 0.6 ? accent : INK;
    rr(ctx, hx + 4, hy - 16, 30, 9, 4);
  } else if (kind === 6) {
    // long drape
    ctx.beginPath();
    ctx.arc(hx, hy - 4, r + 2, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
    rr(ctx, hx - r - 6, hy - 12, 12, 52, 6);
    rr(ctx, hx + r - 6, hy - 12, 12, 52, 6);
  } else {
    // bald: side wisps only
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(hx - r + 3, hy + 2, 7, Math.PI * 0.4, Math.PI * 1.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(hx + r - 3, hy + 2, 7, Math.PI * -0.1, Math.PI * 0.6);
    ctx.stroke();
  }
}

/* -------------------------------- body -------------------------------- */

function drawBody(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  pal: CrowdPalette,
  cx: number,
  base: number,
  shirt: string,
  raisedArm: boolean,
) {
  const detail = shirt === LIME ? INK : pal.detailOnLight;
  const top = base - 132;
  // legs + shoes
  ctx.fillStyle = pal.leg;
  rr(ctx, cx - 18, base - 48, 15, 48, 7);
  rr(ctx, cx + 3, base - 48, 15, 48, 7);
  rr(ctx, cx - 22, base - 12, 22, 11, 5);
  rr(ctx, cx + 0, base - 12, 22, 11, 5);
  // torso
  ctx.fillStyle = shirt;
  rr(ctx, cx - 30, top, 60, 92, 22);
  // collar / details
  const kind = Math.floor(rand() * 4);
  if (kind === 0) {
    // crew collar
    ctx.strokeStyle = detail;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, top + 10, 11, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
  } else if (kind === 1) {
    // jacket zipper
    ctx.strokeStyle = detail;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(cx, top + 12);
    ctx.lineTo(cx, top + 80);
    ctx.stroke();
    ctx.fillStyle = detail;
    rr(ctx, cx - 22, top + 8, 12, 10, 2);
    rr(ctx, cx + 10, top + 8, 12, 10, 2);
  } else if (kind === 2) {
    // stripes
    ctx.fillStyle = detail;
    rr(ctx, cx - 30, top + 34, 60, 7, 3);
    rr(ctx, cx - 30, top + 52, 60, 7, 3);
  } else {
    // hoodie pocket
    ctx.strokeStyle = detail;
    ctx.lineWidth = 3.5;
    rr(ctx, cx - 18, top + 52, 36, 22, 6);
    ctx.stroke();
  }
  // arms
  ctx.fillStyle = shirt === LIME ? INK : shirt;
  rr(ctx, cx - 41, top + 8, 13, 54, 6);
  if (raisedArm) {
    ctx.save();
    ctx.translate(cx + 34, top + 12);
    ctx.rotate(-0.6);
    rr(ctx, -6, -46, 13, 52, 6);
    ctx.fillStyle = SKIN;
    circle(ctx, 0, -50, 9);
    ctx.restore();
  } else {
    rr(ctx, cx + 28, top + 8, 13, 54, 6);
  }
  // hands (skin)
  ctx.fillStyle = SKIN;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  circle(ctx, cx - 34, top + 66, 8);
  ctx.stroke();
  if (!raisedArm) {
    circle(ctx, cx + 34, top + 66, 8);
    ctx.stroke();
  }
}

/* ------------------------------- person ------------------------------- */

function drawPerson(
  ctx: CanvasRenderingContext2D,
  rand: Rand,
  pal: CrowdPalette,
  cx: number,
  base: number,
) {
  const limeShirt = rand() > 0.82;
  const shirt = limeShirt ? LIME : rand() > 0.5 ? pal.bodyA : pal.bodyB;
  const accent = LIME;
  const raisedArm = rand() > 0.78;

  // ground shadow
  ctx.fillStyle = pal.shadow;
  ctx.beginPath();
  ctx.ellipse(cx, base + 4, 34, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  drawBody(ctx, rand, pal, cx, base, shirt, raisedArm);

  // neck + head
  const hx = cx;
  const hy = base - 158;
  const r = 26;
  ctx.fillStyle = SKIN;
  rr(ctx, hx - 8, hy + r - 6, 16, 14, 5);
  circle(ctx, hx, hy, r);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(hx, hy, r, 0, Math.PI * 2);
  ctx.stroke();
  // ears
  ctx.fillStyle = SKIN;
  circle(ctx, hx - r, hy + 2, 6);
  circle(ctx, hx + r, hy + 2, 6);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(hx - r, hy + 2, 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(hx + r, hy + 2, 6, 0, Math.PI * 2);
  ctx.stroke();

  drawEyes(ctx, rand, hx, hy);
  drawMouth(ctx, rand, hx, hy);
  drawHair(ctx, rand, hx, hy, r, accent);
}

export function buildCrowdSprite(dark = false): HTMLCanvasElement {
  const pal = dark ? darkPalette() : lightPalette();
  const canvas = document.createElement("canvas");
  canvas.width = CROWD_COLS * CELL_W;
  canvas.height = CROWD_ROWS * CELL_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const rand = mulberry32(20261010);

  for (let row = 0; row < CROWD_ROWS; row++) {
    for (let col = 0; col < CROWD_COLS; col++) {
      drawPerson(
        ctx,
        rand,
        pal,
        col * CELL_W + CELL_W / 2,
        row * CELL_H + CELL_H - 10,
      );
    }
  }
  return canvas;
}
