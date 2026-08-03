"use client";

import { useEffect, useRef } from "react";

const CELL = 34;
const WALL = "rgb(255 255 255 / 0.13)";
const BRAND = "255 51 51";

type Direction = "n" | "e" | "s" | "w";
type Cell = Record<Direction, boolean> & { visited: boolean };

const STEPS: ReadonlyArray<readonly [Direction, number, number, Direction]> = [
  ["n", -1, 0, "s"],
  ["e", 0, 1, "w"],
  ["s", 1, 0, "n"],
  ["w", 0, -1, "e"],
];

/**
 * The hero's ambient visual: a perfect maze that continuously solves itself,
 * and re-solves toward whatever cell the cursor is over. Click to re-generate.
 *
 * Runs entirely on canvas with a single rAF loop that suspends whenever the
 * canvas leaves the viewport, and degrades to one static frame under
 * `prefers-reduced-motion`.
 */
export function MazeCanvas() {
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
    let cols = 0;
    let rows = 0;
    let offsetX = 0;
    let offsetY = 0;
    let maze: Cell[] = [];

    const index = (row: number, col: number) => row * cols + col;
    const center = (row: number, col: number) =>
      [
        offsetX + col * CELL + CELL / 2,
        offsetY + row * CELL + CELL / 2,
      ] as const;

    /* ── Generation: randomized depth-first search ────────────────────── */
    const generate = () => {
      maze = Array.from({ length: rows * cols }, () => ({
        n: true,
        e: true,
        s: true,
        w: true,
        visited: false,
      }));
      const stack: [number, number][] = [[0, 0]];
      maze[0].visited = true;

      while (stack.length > 0) {
        const [row, col] = stack[stack.length - 1];
        const options = STEPS.filter(([, dr, dc]) => {
          const nr = row + dr;
          const nc = col + dc;
          return (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            !maze[index(nr, nc)].visited
          );
        });

        if (options.length === 0) {
          stack.pop();
          continue;
        }

        const [direction, dr, dc, opposite] =
          options[Math.floor(Math.random() * options.length)];
        const nr = row + dr;
        const nc = col + dc;
        maze[index(row, col)][direction] = false;
        maze[index(nr, nc)][opposite] = false;
        maze[index(nr, nc)].visited = true;
        stack.push([nr, nc]);
      }
    };

    /* ── Solving: breadth-first search through open walls ─────────────── */
    const solve = (
      startRow: number,
      startCol: number,
      targetRow: number,
      targetCol: number,
    ) => {
      const previous = new Array<number>(rows * cols).fill(-1);
      const seen = new Array<boolean>(rows * cols).fill(false);
      const start = index(startRow, startCol);
      const target = index(targetRow, targetCol);
      const queue = [start];
      seen[start] = true;

      for (let head = 0; head < queue.length; head++) {
        const current = queue[head];
        if (current === target) break;
        const row = Math.floor(current / cols);
        const col = current % cols;

        for (const [direction, dr, dc] of STEPS) {
          if (maze[current][direction]) continue;
          const nr = row + dr;
          const nc = col + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          const next = index(nr, nc);
          if (seen[next]) continue;
          seen[next] = true;
          previous[next] = current;
          queue.push(next);
        }
      }

      if (!seen[target]) return [] as number[];
      const path: number[] = [];
      for (let node = target; node !== -1; node = previous[node]) {
        path.push(node);
        if (node === start) break;
      }
      return path.reverse();
    };

    /* ── Layout ───────────────────────────────────────────────────────── */
    const build = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      cols = Math.max(5, Math.floor((width - 28) / CELL));
      rows = Math.max(5, Math.floor((height - 28) / CELL));
      offsetX = (width - cols * CELL) / 2;
      offsetY = (height - rows * CELL) / 2;
      generate();
      walker = null;
      lastHoverKey = -1;
      // Assigning canvas.width above wipes the surface, so the static frame has
      // to be repainted here — under reduced motion there is no rAF loop to
      // paint it back on the next tick.
      if (reduceMotion) renderStatic();
    };

    /* ── Interaction ──────────────────────────────────────────────────── */
    const pointer = { x: -999, y: -999, active: false };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onClick = () => {
      generate();
      walker = null;
      lastHoverKey = -1;
      if (reduceMotion) renderStatic();
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("click", onClick);

    const resizeObserver = new ResizeObserver(build);
    resizeObserver.observe(canvas);

    let onScreen = true;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && frame === 0 && !reduceMotion) {
          frame = requestAnimationFrame(draw);
        }
      },
      { rootMargin: "120px" },
    );
    visibilityObserver.observe(canvas);

    /* ── Drawing ──────────────────────────────────────────────────────── */
    type Walker = { path: number[]; segment: number; progress: number };
    let walker: Walker | null = null;
    let hoverPath: number[] = [];
    let lastHoverKey = -1;
    let time = 0;
    let dash = 0;
    let frame = 0;

    const makeWalker = (from: number): Walker => {
      const total = rows * cols;
      let best: number[] | null = null;
      for (let attempt = 0; attempt < 16; attempt++) {
        const target = Math.floor(Math.random() * total);
        if (target === from) continue;
        const path = solve(
          Math.floor(from / cols),
          from % cols,
          Math.floor(target / cols),
          target % cols,
        );
        if (path.length >= 7) {
          best = path;
          break;
        }
        if (path.length > 1 && !best) best = path;
      }
      return { path: best ?? [from, from], segment: 0, progress: 0 };
    };

    const strokePath = (path: number[]) => {
      context.beginPath();
      path.forEach((node, i) => {
        const [x, y] = center(Math.floor(node / cols), node % cols);
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.stroke();
    };

    const drawOrigin = (x: number, y: number) => {
      context.fillStyle = "rgb(255 255 255 / 0.45)";
      context.beginPath();
      context.arc(x, y, 2.6, 0, Math.PI * 2);
      context.fill();
    };

    const drawHead = (x: number, y: number) => {
      context.fillStyle = `rgb(${BRAND})`;
      context.beginPath();
      context.arc(x, y, 4, 0, Math.PI * 2);
      context.fill();
      const glow = 0.55 + 0.3 * Math.sin(time * 4);
      context.strokeStyle = `rgb(${BRAND} / ${glow.toFixed(2)})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(x, y, 8.5, 0, Math.PI * 2);
      context.stroke();
    };

    const drawReadout = (length: number, col: number, row: number) => {
      context.fillStyle = "rgb(180 180 180 / 0.72)";
      context.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.textBaseline = "alphabetic";
      context.fillText(
        `solved · ${String(length).padStart(2, "0")} nodes  →  [${col},${row}]`,
        offsetX + 2,
        offsetY + rows * CELL - 8,
      );
    };

    const drawWalls = () => {
      context.strokeStyle = WALL;
      context.lineWidth = 1;
      context.setLineDash([]);
      context.beginPath();
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cell = maze[index(row, col)];
          const left = offsetX + col * CELL;
          const top = offsetY + row * CELL;
          const right = left + CELL;
          const bottom = top + CELL;
          if (cell.n) {
            context.moveTo(left, top);
            context.lineTo(right, top);
          }
          if (cell.w) {
            context.moveTo(left, top);
            context.lineTo(left, bottom);
          }
          if (col === cols - 1 && cell.e) {
            context.moveTo(right, top);
            context.lineTo(right, bottom);
          }
          if (row === rows - 1 && cell.s) {
            context.moveTo(left, bottom);
            context.lineTo(right, bottom);
          }
        }
      }
      context.stroke();
    };

    const draw = () => {
      frame = 0;
      if (!onScreen) return;
      if (maze.length === 0) {
        build();
        if (maze.length === 0) {
          frame = requestAnimationFrame(draw);
          return;
        }
      }

      time += 0.006;
      dash -= 0.7;
      context.clearRect(0, 0, width, height);
      drawWalls();
      context.lineCap = "round";
      context.lineJoin = "round";

      if (pointer.active) {
        // Cursor drives the target: re-solve from the origin on cell change.
        walker = null;
        const col = clamp(Math.floor((pointer.x - offsetX) / CELL), cols - 1);
        const row = clamp(Math.floor((pointer.y - offsetY) / CELL), rows - 1);
        const key = row * cols + col;
        if (key !== lastHoverKey) {
          hoverPath = solve(0, 0, row, col);
          lastHoverKey = key;
        }

        if (hoverPath.length > 1) {
          context.strokeStyle = `rgb(${BRAND} / 0.16)`;
          context.lineWidth = 2.2;
          context.setLineDash([]);
          strokePath(hoverPath);

          context.strokeStyle = `rgb(${BRAND} / 0.92)`;
          context.lineWidth = 2;
          context.setLineDash([3, 9]);
          context.lineDashOffset = dash;
          strokePath(hoverPath);
          context.setLineDash([]);

          drawOrigin(...center(0, 0));
          drawHead(...center(row, col));
          drawReadout(hoverPath.length, col, row);
        }
      } else {
        // Idle: a continuous self-solving walk between random cells.
        lastHoverKey = -1;
        if (!walker || walker.path.length < 2) walker = makeWalker(0);

        walker.progress += 0.045;
        while (walker.progress >= 1) {
          walker.progress -= 1;
          walker.segment++;
          if (walker.segment >= walker.path.length - 1) {
            walker = makeWalker(walker.path[walker.path.length - 1]);
            break;
          }
        }

        const path = walker.path;
        const segment = Math.min(walker.segment, path.length - 2);
        const [ax, ay] = center(
          Math.floor(path[segment] / cols),
          path[segment] % cols,
        );
        const [bx, by] = center(
          Math.floor(path[segment + 1] / cols),
          path[segment + 1] % cols,
        );
        // Smoothstep so the head eases in and out of every cell.
        const t = walker.progress * walker.progress * (3 - 2 * walker.progress);
        const headX = ax + (bx - ax) * t;
        const headY = ay + (by - ay) * t;

        context.setLineDash([]);
        context.strokeStyle = `rgb(${BRAND} / 0.14)`;
        context.lineWidth = 2.2;
        strokePath(path);

        const [originX, originY] = center(
          Math.floor(path[0] / cols),
          path[0] % cols,
        );
        context.strokeStyle = `rgb(${BRAND} / 0.92)`;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(originX, originY);
        for (let i = 1; i <= segment; i++) {
          const [x, y] = center(Math.floor(path[i] / cols), path[i] % cols);
          context.lineTo(x, y);
        }
        context.lineTo(headX, headY);
        context.stroke();

        drawOrigin(originX, originY);
        drawHead(headX, headY);
        const last = path[path.length - 1];
        drawReadout(path.length, last % cols, Math.floor(last / cols));
      }

      frame = requestAnimationFrame(draw);
    };

    /** Reduced motion: one frame of walls plus a single solved route. */
    const renderStatic = () => {
      if (maze.length === 0) return;
      context.clearRect(0, 0, width, height);
      drawWalls();
      context.lineCap = "round";
      context.lineJoin = "round";
      const path = solve(0, 0, rows - 1, cols - 1);
      context.strokeStyle = `rgb(${BRAND} / 0.9)`;
      context.lineWidth = 2;
      strokePath(path);
      drawOrigin(...center(0, 0));
      drawHead(...center(rows - 1, cols - 1));
      drawReadout(path.length, cols - 1, rows - 1);
    };

    build();
    if (!reduceMotion) frame = requestAnimationFrame(draw);

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

const clamp = (value: number, max: number) =>
  Math.max(0, Math.min(max, Number.isFinite(value) ? value : 0));
