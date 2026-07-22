'use client';

import type { Job } from '@/types';
import MatchRing from './MatchRing';
import SkillBadge from './SkillBadge';
import styles from './JobCard.module.css';

interface JobCardProps {
  job: Job;
  index: number;
}

function formatSalary(salary: Job['salary']): string {
  if (!salary || (!salary.min && !salary.max)) return '';
  const cur = salary.currency ?? '$';
  const fmt = (n: number) =>
    n >= 1000 ? `${cur}${Math.round(n / 1000)}k` : `${cur}${n}`;
  if (salary.min && salary.max && salary.min !== salary.max) {
    return `${fmt(salary.min)} – ${fmt(salary.max)}`;
  }
  return fmt(salary.min ?? salary.max ?? 0);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function JobCard({ job, index }: JobCardProps) {
  const salary = formatSalary(job.salary);

  return (
    <article
      className={`${styles.card} glass-card animate-fade-in-up`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={styles.header}>
        {/* Company initial avatar */}
        <div className={styles.avatar}>
          {job.company.charAt(0).toUpperCase()}
        </div>

        <div className={styles.headerInfo}>
          <h3 className={styles.title}>{job.title}</h3>
          <p className={styles.company}>{job.company}</p>
        </div>

        <MatchRing score={job.matchScore} size={60} />
      </div>

      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {job.location}
        </span>

        {salary && (
          <span className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            {salary}
          </span>
        )}

        <span className={styles.metaItem}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {timeAgo(job.postedDate)}
        </span>

        {job.isRemote && (
          <span className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '2px 10px' }}>
            Remote
          </span>
        )}
      </div>

      <p className={styles.description}>{job.description}…</p>

      {job.matchedSkills.length > 0 && (
        <div className={styles.skillsRow}>
          <span className={styles.skillsLabel}>Matched:</span>
          <div className={styles.skills}>
            {job.matchedSkills.slice(0, 6).map((s) => (
              <SkillBadge key={s} skill={s} variant="matched" size="sm" />
            ))}
            {job.matchedSkills.length > 6 && (
              <span className={styles.more}>+{job.matchedSkills.length - 6}</span>
            )}
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.category}>{job.category}</span>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-primary btn-sm ${styles.applyBtn}`}
          id={`apply-${job.id}`}
        >
          Apply Now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </article>
  );
}
