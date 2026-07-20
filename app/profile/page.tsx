'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SkillBadge from '@/components/SkillBadge';
import type { UserProfile } from '@/types';
import styles from './page.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('ss_profile');
    if (stored) {
      setProfile(JSON.parse(stored));
    } else {
      router.push('/');
    }
  }, [router]);

  const updateField = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setProfile((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && profile && !profile.skills.includes(s)) {
      updateField('skills', [...profile.skills, s]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    if (profile) {
      updateField('skills', profile.skills.filter((s) => s !== skill));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addSkill();
  };

  const findJobs = async () => {
    if (!profile) return;
    setLoading(true);
    setError('');

    localStorage.setItem('ss_profile', JSON.stringify(profile));

    try {
      const res = await fetch('/api/fetch-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to fetch jobs');
      }

      const data = await res.json();
      localStorage.setItem('ss_jobs', JSON.stringify(data.jobs));
      router.push('/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className={styles.loadingPage}>
        <Navbar />
        <div className={styles.loadingCenter}>
          <div className="spinner spinner-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={`orb orb-purple ${styles.orb1}`} />
      <div className={`orb orb-blue ${styles.orb2}`} />

      <main className={styles.main}>
        <div className="container-sm">

          <div className={`animate-fade-in-up ${styles.header}`}>
            <div className={styles.avatar}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className={styles.title}>Review Your Profile</h1>
              <p className={styles.subtitle}>
                We extracted this from your resume. Edit anything before searching.
              </p>
            </div>
          </div>

          {/* ─── Basic Info ─── */}
          <div className={`glass-card ${styles.section} animate-fade-in-up delay-100`}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label htmlFor="name-input" className={styles.label}>Full Name</label>
                <input
                  id="name-input"
                  className="form-input"
                  value={profile.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="title-input" className={styles.label}>Job Title</label>
                <input
                  id="title-input"
                  className="form-input"
                  value={profile.jobTitle}
                  onChange={(e) => updateField('jobTitle', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="location-input" className={styles.label}>Location</label>
                <input
                  id="location-input"
                  className="form-input"
                  value={profile.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="experience-input" className={styles.label}>Years of Experience</label>
                <input
                  id="experience-input"
                  type="number"
                  min={0}
                  max={50}
                  className="form-input"
                  value={profile.experience}
                  onChange={(e) => updateField('experience', Number(e.target.value))}
                />
              </div>
            </div>
            <div className={styles.field} style={{ marginTop: 16 }}>
              <label htmlFor="summary-input" className={styles.label}>Professional Summary</label>
              <textarea
                id="summary-input"
                className={`form-input ${styles.textarea}`}
                value={profile.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* ─── Skills ─── */}
          <div className={`glass-card ${styles.section} animate-fade-in-up delay-200`}>
            <h2 className={styles.sectionTitle}>
              Skills
              <span className={styles.skillCount}>{profile.skills.length}</span>
            </h2>
            <div className={styles.skillsGrid}>
              {profile.skills.map((skill) => (
                <SkillBadge
                  key={skill}
                  skill={skill}
                  onRemove={() => removeSkill(skill)}
                />
              ))}
            </div>
            <div className={styles.addSkillRow}>
              <input
                id="add-skill-input"
                className="form-input"
                placeholder="Add a skill (e.g. TypeScript)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="btn btn-outline" onClick={addSkill} id="add-skill-btn">
                + Add
              </button>
            </div>
          </div>

          {/* ─── CTA ─── */}
          {error && (
            <p className={styles.error} role="alert">⚠ {error}</p>
          )}

          <div className={`${styles.ctaRow} animate-fade-in-up delay-300`}>
            <button className="btn btn-ghost" onClick={() => router.push('/')}>
              ← Upload Different Resume
            </button>
            <button
              id="find-jobs-btn"
              className="btn btn-primary btn-lg"
              onClick={findJobs}
              disabled={loading || profile.skills.length === 0}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Finding Jobs…
                </>
              ) : (
                <>
                  Find My Jobs
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
