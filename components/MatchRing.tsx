'use client';

import styles from './MatchRing.module.css';

interface MatchRingProps {
  score: number; // 0–100
  size?: number;
}

function getColor(score: number): string {
  if (score >= 70) return '#10b981'; // green
  if (score >= 40) return '#f59e0b'; // amber
  return '#6366f1';                  // indigo
}

export default function MatchRing({ score, size = 64 }: MatchRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getColor(score);

  return (
    <div className={styles.wrapper} style={{ width: size, height: size }}>
      <svg width={size} height={size} className={styles.svg}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={6}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 6px ${color}90)`,
            transition: 'stroke-dashoffset 0.6s ease',
          }}
        />
      </svg>
      <span className={styles.label} style={{ color }}>
        {score}%
      </span>
    </div>
  );
}
