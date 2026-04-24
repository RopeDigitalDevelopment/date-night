import { useRef, useEffect, useState, useCallback } from 'react';
import { Place, Category } from '../types';

const COLORS = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77',
  '#4D96FF', '#C77DFF', '#F15BB5', '#00BBF9',
  '#00F5D4', '#FEE440', '#FF5733', '#A8DADC',
  '#E9C46A', '#F4A261', '#E76F51', '#7209B7',
];

interface Props {
  category: Category;
  places: Place[];
  onResult: (place: Place) => void;
  onBack: () => void;
}

export function SpinWheel({ category, places, onResult, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const animRef = useRef<number | null>(null);

  const logicalSize = Math.min(window.innerWidth - 40, 360);
  const dpr = window.devicePixelRatio || 1;

  const draw = useCallback((rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas || places.length === 0) return;
    const ctx = canvas.getContext('2d')!;
    const n = places.length;
    const cx = logicalSize / 2;
    const cy = logicalSize / 2;
    const radius = cx - 6;
    const arc = (2 * Math.PI) / n;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, logicalSize, logicalSize);

    // Wheel shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.restore();

    // Segments
    for (let i = 0; i < n; i++) {
      const startAngle = rotation + i * arc - Math.PI / 2;
      const endAngle = startAngle + arc;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(15,15,26,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      const midAngle = startAngle + arc / 2;
      const textR = radius * 0.62;
      ctx.save();
      ctx.translate(cx + textR * Math.cos(midAngle), cy + textR * Math.sin(midAngle));
      ctx.rotate(midAngle + Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.max(8, Math.min(13, 130 / n));
      ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.shadowColor = 'rgba(255,255,255,0.4)';
      ctx.shadowBlur = 3;
      ctx.fillStyle = 'rgba(0,0,0,0.9)';
      const name = places[i].displayName.text;
      const maxChars = n > 12 ? 8 : 13;
      const label = name.length > maxChars ? name.slice(0, maxChars - 1) + '…' : name;
      ctx.fillText(label, 0, 0);
      ctx.restore();
    }

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Center circle
    const grad = ctx.createRadialGradient(cx, cy - 4, 0, cx, cy, 28);
    grad.addColorStop(0, '#2d2d4a');
    grad.addColorStop(1, '#1a1a2e');
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center emoji
    ctx.font = '20px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 0;
    ctx.fillText(category.emoji, cx, cy + 1);

    // Pointer triangle at top
    ctx.beginPath();
    ctx.moveTo(cx - 13, 3);
    ctx.lineTo(cx + 13, 3);
    ctx.lineTo(cx, 26);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }, [places, category.emoji, logicalSize, dpr]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = logicalSize * dpr;
    canvas.height = logicalSize * dpr;
    canvas.style.width = `${logicalSize}px`;
    canvas.style.height = `${logicalSize}px`;
    draw(rotationRef.current);
  }, [places, draw, logicalSize, dpr]);

  const spin = () => {
    if (isSpinning || places.length === 0) return;
    setIsSpinning(true);
    setHasSpun(true);

    const extraSpins = 6 + Math.random() * 6;
    const target = rotationRef.current + extraSpins * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4500 + Math.random() * 800;
    const startTime = performance.now();
    const startRot = rotationRef.current;

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 5);
      const current = startRot + (target - startRot) * eased;
      rotationRef.current = current;
      draw(current);

      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setIsSpinning(false);
        const n = places.length;
        const arc = (2 * Math.PI) / n;
        const normalized = ((-current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const idx = Math.floor(normalized / arc) % n;
        onResult(places[idx]);
      }
    };

    animRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f1a]">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 pt-14 pb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/60 active:bg-white/15 transition-colors"
          aria-label="Back"
        >
          ←
        </button>
        <div>
          <h2 className="font-bold text-white text-xl">
            {category.emoji} {category.name}
          </h2>
          <p className="text-white/40 text-xs mt-0.5">
            {places.length} places found nearby
          </p>
        </div>
      </div>

      {/* Wheel */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-4">
        <canvas ref={canvasRef} className="rounded-full" />

        <button
          onClick={spin}
          disabled={isSpinning}
          className={`
            w-full max-w-xs py-4 rounded-2xl font-bold text-lg tracking-wide
            transition-all duration-150
            ${isSpinning
              ? 'bg-white/8 text-white/30 cursor-not-allowed'
              : `bg-gradient-to-r ${category.gradient} text-white shadow-lg active:scale-95`
            }
          `}
        >
          {isSpinning ? '✨  Spinning...' : hasSpun ? '🔄  Spin Again' : '🎯  Spin the Wheel!'}
        </button>
      </div>

      <div className="pb-8" />
    </div>
  );
}
