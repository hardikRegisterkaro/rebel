"use client";

import { useEffect, useRef } from "react";

const BRAND = "255 51 51";
const PILLARS = ["DECISION", "CUSTOMER", "TRUST & RISK", "MEMORY"] as const;

/** radius (as a fraction of the smaller edge), angular speed, phase, satellites. */
const ORBITS = [
  { r: 0.16, speed: 0.42, phase: 0.6, satellites: 2 },
  { r: 0.24, speed: -0.3, phase: 2.4, satellites: 3 },
  { r: 0.325, speed: 0.22, phase: 4.2, satellites: 2 },
  { r: 0.405, speed: -0.16, phase: 1.1, satellites: 3 },
] as const;

const GRAVITY_RADIUS = 150;
const GRAVITY_PULL = 14;
const NEAR_RADIUS = 120;
const PULSE_MS = 1600;

/**
 * The About hero's ambient visual: one white core — the lab — with four red
 * pillar nodes on their own orbits, each trailing light. The cursor bends the
 * orbits it passes near, and a click sends a pulse wave through the system.
 *
 * Single rAF loop that suspends whenever the canvas leaves the viewport, and
 * degrades to one static frame under `prefers-reduced-motion`.
 */
export function OrbitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let pointerX = -1;
    let pointerY = -1;
    const pulses: number[] = [];
    const packets: { orbit: number; outbound: boolean; start: number; dur: number }[] =
      [];
    let lastPacket = 0;

    // Ambient dust, in normalized coordinates so a resize never re-seeds it.
    const dust = Array.from({ length: 42 }, (_, i) => ({
      x: ((i * 37) % 100) / 100,
      y: ((i * 61) % 100) / 100,
      r: 0.5 + (((i * 17) % 10) / 10) * 0.9,
      phase: ((i * 29) % 70) / 10,
    }));

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** Position on an orbit at `angle`, bent toward a nearby cursor. */
    const positionOn = (orbit: (typeof ORBITS)[number], angle: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const size = Math.min(width, height);
      let x = cx + Math.cos(angle) * orbit.r * size;
      let y = cy + Math.sin(angle) * orbit.r * size * 0.94;

      if (pointerX >= 0) {
        const dx = pointerX - x;
        const dy = pointerY - y;
        const distance = Math.hypot(dx, dy);
        if (distance < GRAVITY_RADIUS && distance > 0.001) {
          const force = GRAVITY_PULL * (1 - distance / GRAVITY_RADIUS);
          x += (dx / distance) * force;
          y += (dy / distance) * force;
        }
      }
      return [x, y] as const;
    };

    const render = (seconds: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const size = Math.min(width, height);
      context.clearRect(0, 0, width, height);

      for (const speck of dust) {
        const twinkle = 0.06 + 0.1 * (0.5 + 0.5 * Math.sin(seconds * 0.8 + speck.phase));
        context.fillStyle = `rgb(255 255 255 / ${twinkle.toFixed(3)})`;
        context.beginPath();
        context.arc(speck.x * width, speck.y * height, speck.r, 0, Math.PI * 2);
        context.fill();
      }

      // Orbit rings, each brightening in a short arc around its pillar.
      for (const orbit of ORBITS) {
        const angle = orbit.phase + seconds * orbit.speed;
        context.lineWidth = 1;
        context.strokeStyle = "rgb(255 255 255 / 0.07)";
        context.beginPath();
        context.ellipse(cx, cy, orbit.r * size, orbit.r * size * 0.94, 0, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "rgb(255 255 255 / 0.18)";
        context.beginPath();
        context.ellipse(
          cx, cy, orbit.r * size, orbit.r * size * 0.94, 0, angle - 0.5, angle + 0.5,
        );
        context.stroke();
      }

      // Click pulse waves.
      for (let i = pulses.length - 1; i >= 0; i--) {
        const progress = (seconds * 1000 - pulses[i]) / PULSE_MS;
        if (progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        context.strokeStyle = `rgb(${BRAND} / ${(0.4 * (1 - progress)).toFixed(3)})`;
        context.lineWidth = 1.4;
        context.beginPath();
        context.ellipse(
          cx, cy, progress * 0.52 * size, progress * 0.52 * size * 0.94, 0, 0, Math.PI * 2,
        );
        context.stroke();
      }

      // Signal packets travelling between the core and its pillars.
      if (seconds - lastPacket > 0.7) {
        packets.push({
          orbit: packets.length % ORBITS.length,
          outbound: packets.length % 2 === 0,
          start: seconds,
          dur: 1.25,
        });
        lastPacket = seconds;
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const packet = packets[i];
        let progress = (seconds - packet.start) / packet.dur;
        if (progress >= 1) {
          packets.splice(i, 1);
          continue;
        }
        if (!packet.outbound) progress = 1 - progress;
        const orbit = ORBITS[packet.orbit];
        const [px, py] = positionOn(orbit, orbit.phase + seconds * orbit.speed);
        const fade = Math.sin(Math.min(1, Math.max(0, progress)) * Math.PI);
        context.fillStyle = `rgb(${BRAND} / ${(0.85 * fade).toFixed(2)})`;
        context.beginPath();
        context.arc(cx + (px - cx) * progress, cy + (py - cy) * progress, 2.2, 0, Math.PI * 2);
        context.fill();
      }

      // Pillar nodes: trail, spoke, node, label, satellites.
      ORBITS.forEach((orbit, index) => {
        const angle = orbit.phase + seconds * orbit.speed;
        const direction = Math.sign(orbit.speed);

        for (let k = 0; k < 7; k++) {
          const a0 = angle - direction * (k + 1) * 0.09;
          const a1 = angle - direction * k * 0.09;
          context.strokeStyle = `rgb(${BRAND} / ${(0.4 * (1 - k / 7)).toFixed(3)})`;
          context.lineWidth = 2 * (1 - k / 8);
          context.beginPath();
          context.ellipse(
            cx, cy, orbit.r * size, orbit.r * size * 0.94, 0,
            Math.min(a0, a1), Math.max(a0, a1),
          );
          context.stroke();
        }

        const [px, py] = positionOn(orbit, angle);

        context.strokeStyle = "rgb(255 255 255 / 0.07)";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(px, py);
        context.lineTo(cx, cy);
        context.stroke();

        let near = 0;
        if (pointerX >= 0) {
          const distance = Math.hypot(px - pointerX, py - pointerY);
          if (distance < NEAR_RADIUS) near = 1 - distance / NEAR_RADIUS;
        }

        context.fillStyle = `rgb(${BRAND} / ${(0.2 + 0.2 * near).toFixed(2)})`;
        context.beginPath();
        context.arc(px, py, 9 + near * 4, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = `rgb(${BRAND})`;
        context.beginPath();
        context.arc(px, py, 3.4 + near * 1.2, 0, Math.PI * 2);
        context.fill();

        // Label rides just outside the node, away from the core.
        context.font = '600 9px "JetBrains Mono", monospace';
        context.textAlign = px >= cx ? "left" : "right";
        context.textBaseline = "middle";
        context.fillStyle = `rgb(255 255 255 / ${(0.35 + 0.55 * near).toFixed(2)})`;
        context.fillText(
          PILLARS[index],
          px + (px - cx) * 0.11 + (px >= cx ? 6 : -6),
          py + (py - cy) * 0.11,
        );

        for (let s = 1; s <= orbit.satellites; s++) {
          const [sx, sy] = positionOn(
            orbit,
            angle + (s * Math.PI * 2) / (orbit.satellites + 1),
          );
          const twinkle = 0.35 + 0.3 * Math.sin(seconds * 1.8 + index + s);
          context.fillStyle = `rgb(255 255 255 / ${twinkle.toFixed(2)})`;
          context.beginPath();
          context.arc(sx, sy, 1.7, 0, Math.PI * 2);
          context.fill();
        }
      });

      // Core: the breathing white heart of the lab.
      const breath = 0.6 + 0.4 * Math.sin(seconds * 1.5);
      context.strokeStyle = `rgb(255 255 255 / ${(0.25 + 0.2 * breath).toFixed(2)})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(cx, cy, 13 + breath * 3, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = "rgb(255 255 255 / 0.94)";
      context.beginPath();
      context.arc(cx, cy, 4.4, 0, Math.PI * 2);
      context.fill();

      // Slow ambient ring emanating outward from the core.
      const ambient = (seconds % 4) / 4;
      context.strokeStyle = `rgb(255 255 255 / ${(0.14 * (1 - ambient)).toFixed(3)})`;
      context.beginPath();
      context.arc(cx, cy, 13 + ambient * 0.16 * size, 0, Math.PI * 2);
      context.stroke();
    };

    const draw = () => {
      render(performance.now() / 1000);
      frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointerX = -1;
      pointerY = -1;
    };
    const onClick = () => pulses.push(performance.now());

    const resizeObserver = new ResizeObserver(() => {
      fit();
      if (reduceMotion || !visible) render(performance.now() / 1000);
    });
    resizeObserver.observe(canvas);

    // Suspend the loop whenever the canvas scrolls out of view.
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible && !reduceMotion) frame = requestAnimationFrame(draw);
    });
    visibilityObserver.observe(canvas);

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("click", onClick);

    fit();
    if (reduceMotion) render(0);
    else frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 block size-full cursor-crosshair"
    />
  );
}
