'use client';

import styles from './SkillBadge.module.css';

interface SkillBadgeProps {
  skill: string;
  onRemove?: () => void;
  variant?: 'default' | 'matched';
  size?: 'sm' | 'md';
}

export default function SkillBadge({
  skill,
  onRemove,
  variant = 'default',
  size = 'md',
}: SkillBadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${styles[size]}`}
    >
      {skill}
      {onRemove && (
        <button
          onClick={onRemove}
          className={styles.removeBtn}
          aria-label={`Remove ${skill}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
