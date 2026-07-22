'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import JobCard from '@/components/JobCard';
import type { Job, UserProfile, JobFilter } from '@/types';
import styles from './page.module.css';

const SORT_OPTIONS = [
  { value: 'match', label: 'Best Match' },
  { value: 'date', label: 'Most Recent' },
  { value: 'salary', label: 'Highest Salary' },
];

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<JobFilter>({ remote: null, location: '', minMatch: 0 });
  const [sort, setSort] = useState('match');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedJobs = localStorage.getItem('ss_jobs');
    const storedProfile = localStorage.getItem('ss_profile');

    if (!storedJobs || !storedProfile) {
      router.push('/');
      return;
    }

    setJobs(JSON.parse(storedJobs));
    setProfile(JSON.parse(storedProfile));
  }, [router]);

  const filtered = useMemo(() => {
    let result = [...jobs];

    if (filter.remote !== null) {
      result = result.filter((j) => j.isRemote === filter.remote);
    }
    if (filter.location) {
      const loc = filter.location.toLowerCase();
      result = result.filter((j) => j.location.toLowerCase().includes(loc));
    }
    if (filter.minMatch > 0) {
      result = result.filter((j) => j.matchScore >= filter.minMatch);
    }

    if (sort === 'match') result.sort((a, b) => b.matchScore - a.matchScore);
    if (sort === 'date') result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    if (sort === 'salary') result.sort((a, b) => (b.salary?.max ?? 0) - (a.salary?.max ?? 0));

    return result;
  }, [jobs, filter, sort]);

  const refreshJobs = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const res = await fetch('/api/fetch-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      setJobs(data.jobs);
      localStorage.setItem('ss_jobs', JSON.stringify(data.jobs));
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const avgMatch = jobs.length
    ? Math.round(jobs.reduce((acc, j) => acc + j.matchScore, 0) / jobs.length)
    : 0;

  const highMatch = jobs.filter((j) => j.matchScore >= 70).length;

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
        <div className="container">

          {/* ─── Header ─── */}
          <div className={`${styles.pageHeader} animate-fade-in-up`}>
            <div>
              <h1 className={styles.pageTitle}>
                Your Job Matches
              </h1>
              <p className={styles.pageSubtitle}>
                Showing results for <strong>{profile.jobTitle}</strong> · {profile.location}
              </p>
            </div>
            <button
              id="refresh-jobs-btn"
              className="btn btn-outline"
              onClick={refreshJobs}
              disabled={loading}
            >
              {loading ? <><div className="spinner" /> Refreshing…</> : '↻ Refresh'}
            </button>
          </div>

          {/* ─── Stats Row ─── */}
          <div className={`${styles.statsRow} animate-fade-in-up delay-100`}>
            <div className={`glass-card ${styles.statChip}`}>
              <span className={styles.statVal}>{jobs.length}</span>
              <span className={styles.statLbl}>Total Jobs</span>
            </div>
            <div className={`glass-card ${styles.statChip}`}>
              <span className={styles.statVal} style={{ color: '#10b981' }}>{highMatch}</span>
              <span className={styles.statLbl}>Strong Matches (70%+)</span>
            </div>
            <div className={`glass-card ${styles.statChip}`}>
              <span className={styles.statVal}>{avgMatch}%</span>
              <span className={styles.statLbl}>Avg Match Score</span>
            </div>
          </div>

          <div className={styles.layout}>
            {/* ─── Sidebar ─── */}
            <aside className={`glass-card ${styles.sidebar} animate-fade-in-up delay-200`}>
              <h2 className={styles.sidebarTitle}>Filters</h2>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Work Type</label>
                <div className={styles.filterBtns}>
                  {[
                    { label: 'All', value: null },
                    { label: 'Remote', value: true },
                    { label: 'On-site', value: false },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      id={`filter-remote-${String(opt.value)}`}
                      className={`btn btn-sm ${filter.remote === opt.value ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setFilter((f) => ({ ...f, remote: opt.value }))}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="location-filter" className={styles.filterLabel}>Location Filter</label>
                <input
                  id="location-filter"
                  className="form-input"
                  placeholder="e.g. London"
                  value={filter.location}
                  onChange={(e) => setFilter((f) => ({ ...f, location: e.target.value }))}
                />
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="match-filter" className={styles.filterLabel}>
                  Min Match Score: <strong>{filter.minMatch}%</strong>
                </label>
                <input
                  id="match-filter"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={filter.minMatch}
                  className={styles.rangeInput}
                  onChange={(e) => setFilter((f) => ({ ...f, minMatch: Number(e.target.value) }))}
                />
              </div>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setFilter({ remote: null, location: '', minMatch: 0 })}
                style={{ width: '100%', marginTop: 4 }}
              >
                Clear Filters
              </button>

              <div className={styles.divider} />

              <div className={styles.filterGroup}>
                <label htmlFor="sort-select" className={styles.filterLabel}>Sort By</label>
                <select
                  id="sort-select"
                  className="form-input"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.divider} />

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => router.push('/profile')}
                style={{ width: '100%' }}
              >
                ← Edit Profile
              </button>
            </aside>

            {/* ─── Jobs Grid ─── */}
            <section className={styles.jobsSection}>
              {filtered.length === 0 ? (
                <div className={`glass-card ${styles.empty}`}>
                  <span style={{ fontSize: '3rem' }}>🔍</span>
                  <h3>No jobs match your filters</h3>
                  <p>Try adjusting the filters or refreshing the results.</p>
                </div>
              ) : (
                <>
                  <p className={styles.resultCount}>
                    {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
                  </p>
                  <div className={styles.jobsGrid}>
                    {filtered.map((job, i) => (
                      <JobCard key={job.id} job={job} index={i} />
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
