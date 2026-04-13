import { useEffect, useRef } from "react";

type Particle = {
  angle: number;
  radius: number;
  offsetX: number;
  offsetY: number;
  velocityX: number;
  velocityY: number;
  size: number;
  alpha: number;
  color: string;
};

const PARTICLE_COUNT = 520;

export const AuthParticleBackground = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;

    if (!wrap || !canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let frameId = 0;
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let baseRadius = 0;
    let ringThickness = 0;
    let time = 0;
    const pointer = {
      x: 0,
      y: 0,
      active: false,
    };

    const particles: Particle[] = [];

    const setAmbientState = (energy: number) => {
      wrap.style.setProperty("--wave-energy", energy.toFixed(3));
      wrap.style.setProperty(
        "--glow-x",
        `${((centerX / Math.max(width, 1)) * 100).toFixed(2)}%`,
      );
      wrap.style.setProperty(
        "--glow-y",
        `${((centerY / Math.max(height, 1)) * 100).toFixed(2)}%`,
      );
    };

    const colorForAngle = (angle: number) => {
      const normalized = (Math.cos(angle) + 1) / 2;
      const r = Math.round(255 + (63 - 255) * normalized);
      const g = Math.round(102 + (115 - 102) * normalized);
      const b = Math.round(74 + (255 - 74) * normalized);
      return `rgb(${r} ${g} ${b})`;
    };

    const rebuildParticles = () => {
      particles.length = 0;

      for (let index = 0; index < PARTICLE_COUNT; index += 1) {
        const angle = (index / PARTICLE_COUNT) * Math.PI * 2;
        const spread = (Math.random() - 0.5) * ringThickness;

        particles.push({
          angle,
          radius: baseRadius + spread,
          offsetX: 0,
          offsetY: 0,
          velocityX: 0,
          velocityY: 0,
          size: 0.8 + Math.random() * 1.8,
          alpha: 0.2 + Math.random() * 0.75,
          color: colorForAngle(angle),
        });
      }
    };

    const resize = () => {
      const bounds = wrap.getBoundingClientRect();
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      width = bounds.width;
      height = bounds.height;
      centerX = width * 0.52;
      centerY = height * 0.47;
      baseRadius = Math.min(width, height) * 0.42;
      ringThickness = Math.min(width, height) * 0.26;

      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      rebuildParticles();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = wrap.getBoundingClientRect();

      const isInside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!isInside) {
        pointer.active = false;
        wrap.dataset.interactive = "false";
        return;
      }

      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
      wrap.dataset.interactive = "true";
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      wrap.dataset.interactive = "false";
    };

    const drawParticle = (
      x: number,
      y: number,
      size: number,
      alpha: number,
      color: string,
      stretchX: number,
      stretchY: number,
      speed: number,
    ) => {
      const capsuleWidth = size * (1.15 + Math.min(0.9, speed * 0.24));
      const capsuleHeight = Math.max(1, size * 0.42);

      context.save();
      context.translate(x, y);
      context.rotate(Math.atan2(stretchY, stretchX));
      context.fillStyle = color;
      context.globalAlpha = alpha;
      context.beginPath();
      context.roundRect(
        -capsuleWidth * 0.5,
        -capsuleHeight * 0.5,
        capsuleWidth,
        capsuleHeight,
        capsuleHeight,
      );
      context.fill();
      context.restore();
    };

    const tick = () => {
      time += 0.012;
      context.clearRect(0, 0, width, height);

      let totalEnergy = 0;

      for (const particle of particles) {
        const drift = Math.sin(time + particle.angle * 2.4) * 4;
        const x = centerX + Math.cos(particle.angle) * (particle.radius + drift) + particle.offsetX;
        const y = centerY + Math.sin(particle.angle) * (particle.radius + drift) + particle.offsetY;

        if (pointer.active) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const influenceRadius = 130;

          if (distance < influenceRadius) {
            const influence = 1 - distance / influenceRadius;
            const force = influence * 1.8;
            const safeDistance = Math.max(distance, 0.001);

            particle.velocityX += (dx / safeDistance) * force;
            particle.velocityY += (dy / safeDistance) * force;
            totalEnergy += influence;
          }
        }

        particle.velocityX += -particle.offsetX * 0.032;
        particle.velocityY += -particle.offsetY * 0.032;
        particle.velocityX *= 0.89;
        particle.velocityY *= 0.89;
        particle.offsetX += particle.velocityX;
        particle.offsetY += particle.velocityY;

        const speed = Math.hypot(particle.velocityX, particle.velocityY);

        drawParticle(
          x,
          y,
          particle.size + Math.min(1.5, totalEnergy * 0.002),
          particle.alpha,
          particle.color,
          Math.cos(particle.angle) + particle.velocityX,
          Math.sin(particle.angle) + particle.velocityY,
          speed,
        );
      }

      setAmbientState(Math.min(1, totalEnergy / 18));
      frameId = window.requestAnimationFrame(tick);
    };

    resize();
    setAmbientState(0);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="auth-particles-wrap" data-interactive="false">
      <canvas ref={canvasRef} className="auth-particles-canvas" />
      <div className="auth-particles-glow" />
      <div className="auth-particles-grid" />
      <div className="auth-particles-specks" />
    </div>
  );
};
