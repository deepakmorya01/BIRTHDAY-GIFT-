import { useRef, useEffect } from 'react';
import './Waves.css';

interface WavesProps {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  friction?: number;
  tension?: number;
  maxCursorMove?: number;
  xGap?: number;
  yGap?: number;
}

interface Point {
  x: number;
  y: number;
  wy: number;
  offset: number;
}

interface Lines {
  points: Point[];
  currentDepth: number;
  targetDepth: number;
}

const DEFAULTS = {
  lineColor: 'rgba(255,255,255,0.08)',
  backgroundColor: 'transparent',
  waveSpeedX: 0.008,
  waveSpeedY: 0.004,
  waveAmpX: 18,
  waveAmpY: 10,
  friction: 0.93,
  tension: 0.008,
  maxCursorMove: 60,
  xGap: 20,
  yGap: 42,
};

const Waves = ({
  lineColor = DEFAULTS.lineColor,
  backgroundColor = DEFAULTS.backgroundColor,
  waveSpeedX = DEFAULTS.waveSpeedX,
  waveSpeedY = DEFAULTS.waveSpeedY,
  waveAmpX = DEFAULTS.waveAmpX,
  waveAmpY = DEFAULTS.waveAmpY,
  friction = DEFAULTS.friction,
  tension = DEFAULTS.tension,
  maxCursorMove = DEFAULTS.maxCursorMove,
  xGap = DEFAULTS.xGap,
  yGap = DEFAULTS.yGap,
}: WavesProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const linesRef = useRef<Lines[]>([]);
  const mouseRef = useRef<{ x: number; y: number; lx: number; ly: number }>({
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    let width = 0;
    let height = 0;
    let pathCount = 0;

    const buildLines = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      pathCount = Math.ceil(height / yGap) + 2;
      const horizontalCount = Math.ceil(width / xGap) + 4;

      linesRef.current = Array.from({ length: pathCount }, (_, j) => ({
        points: Array.from({ length: horizontalCount }, (_, i) => ({
          x: (i - 2) * xGap,
          y: j * yGap + yGap * 0.5,
          wy: j * yGap + yGap * 0.5,
          offset: 0,
        })),
        currentDepth: 0,
        targetDepth: 0,
      }));

      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('width', String(width));
      svg.setAttribute('height', String(height));
      svg.innerHTML = '';

      for (let i = 0; i < pathCount; i++) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', lineColor);
        path.setAttribute('stroke-width', '1');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        svg.appendChild(path);
      }
    };

    buildLines();

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = clientX - rect.left;
      mouseRef.current.y = clientY - rect.top;
    };

    const onMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => {
      mouseRef.current.x = 0;
      mouseRef.current.y = 0;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    const onResize = () => buildLines();
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    let rafId = 0;
    const render = () => {
      const m = mouseRef.current;
      m.lx += (m.x - m.lx) * 0.1;
      m.ly += (m.y - m.ly) * 0.1;

      const paths = svg.querySelectorAll('path');
      const lines = linesRef.current;

      for (let j = 0; j < lines.length; j++) {
        const line = lines[j];
        const depth = j / (lines.length - 1);
        line.targetDepth = depth * waveAmpY;
        line.currentDepth += (line.targetDepth - line.currentDepth) * tension;

        const points = line.points;
        let pathData = '';

        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          const targetWy =
            p.y +
            Math.sin(i * 0.4 + (rafTime * waveSpeedX)) * waveAmpX +
            Math.sin(j * 0.6 + (rafTime * waveSpeedY)) * line.currentDepth;

          const dx = p.x - m.lx;
          const dy = p.y - m.ly;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const force = (1 - dist / 140) * maxCursorMove;
            p.offset += force * 0.06;
          }
          p.offset *= friction;

          p.wy += (targetWy - p.wy) * friction;

          pathData +=
            i === 0 ? `M ${p.x.toFixed(2)} ${p.wy.toFixed(2)}` : ` L ${p.x.toFixed(2)} ${p.wy.toFixed(2)}`;
        }

        const pathEl = paths[j] as SVGPathElement | undefined;
        if (pathEl) pathEl.setAttribute('d', pathData);
      }

      rafTime += 1;
      rafId = requestAnimationFrame(render);
    };

    let rafTime = 0;
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();
    };
  }, [
    lineColor,
    waveSpeedX,
    waveSpeedY,
    waveAmpX,
    waveAmpY,
    friction,
    tension,
    maxCursorMove,
    xGap,
    yGap,
  ]);

  return (
    <div ref={containerRef} className="waves-container" style={{ background: backgroundColor }}>
      <svg ref={svgRef} className="waves-svg" preserveAspectRatio="none" />
    </div>
  );
};

export default Waves;
