import React, { useEffect, useRef } from 'react';

export default function DigitalUniverseCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle nodes definition
    const nodeCount = Math.min(Math.floor((width * height) / 20000), 65);
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        colorType: i % 3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02
      });
    }

    let t = 0;

    const render = () => {
      t += 1;
      ctx.clearRect(0, 0, width, height);

      const isLight = document.documentElement.classList.contains('light');
      
      // Dynamic color tokens for light vs dark mode
      const gridStroke = isLight ? 'rgba(0, 50, 100, 0.035)' : 'rgba(255, 255, 255, 0.025)';
      const cyanColor = isLight ? '#0284c7' : '#00f0ff';
      const violetColor = isLight ? '#6366f1' : '#8b5cf6';
      const blueColor = isLight ? '#2563eb' : '#3b82f6';

      // 1. Perspective Grid
      ctx.strokeStyle = gridStroke;
      ctx.lineWidth = 1;
      const gridSize = 90;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Luminous Flowing Data Stream Curves
      const curves = [
        { y: height * 0.3, amp: 45, freq: 0.0018, speed: 0.008, color: isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(0, 240, 255, 0.15)' },
        { y: height * 0.55, amp: 65, freq: 0.0012, speed: 0.006, color: isLight ? 'rgba(99, 102, 241, 0.10)' : 'rgba(139, 92, 246, 0.12)' },
        { y: height * 0.78, amp: 55, freq: 0.0015, speed: 0.007, color: isLight ? 'rgba(219, 39, 119, 0.08)' : 'rgba(217, 70, 239, 0.09)' }
      ];

      curves.forEach(c => {
        ctx.beginPath();
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 1.5;
        for (let x = 0; x <= width; x += 15) {
          const y = c.y + Math.sin(x * c.freq + t * c.speed) * c.amp + Math.cos(x * 0.0008 + t * 0.005) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // 3. Connect nodes that are close
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * (isLight ? 0.18 : 0.22);
            ctx.beginPath();
            ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${alpha})` : `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 4. Update & Render Floating Data Nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;

        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        const currentRadius = n.radius + Math.sin(n.pulse) * 0.7;
        const color = n.colorType === 0 ? cyanColor : n.colorType === 1 ? violetColor : blueColor;

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(0.8, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
}
