'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import ResumeUploader from '@/components/ResumeUploader';
import styles from './page.module.css';

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false,
});

const STEPS = [
  {
    icon: '📄',
    title: 'Upload Resume',
    desc: 'Drop your PDF resume. Text is extracted directly in your browser without saving raw documents.',
  },
  {
    icon: '🧠',
    title: 'Extract Profile & Skills',
    desc: 'The app structures your tech stack, job title, and experience into a clean searchable profile.',
  },
  {
    icon: '🎯',
    title: 'Match Live Listings',
    desc: 'Queries live job feeds and scores each posting based on skill keyword overlap.',
  },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <ParticleBackground />

      <div className={`orb orb-purple ${styles.orb1}`} />
      <div className={`orb orb-blue ${styles.orb2}`} />
      <div className={`orb orb-cyan ${styles.orb3}`} />

      <Navbar />

      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <div className="container-sm">
          <div className={`badge badge-purple ${styles.heroBadge} animate-fade-in`}>
            Skill Matching & Resume Scanner
          </div>

          <h1 className={`${styles.headline} animate-fade-in-up delay-100`}>
            Find Remote & Local Jobs{' '}
            <span className="text-gradient">Matched To Your Resume</span>
          </h1>

          <p className={`${styles.subheadline} animate-fade-in-up delay-200`}>
            Upload your resume PDF to extract your skills and instantly rank live job postings by relevance score.
          </p>

          <div className={`${styles.uploaderWrapper} animate-fade-in-up delay-300`}>
            <ResumeUploader />
          </div>

          <p className={`${styles.hint} animate-fade-in-up delay-400`}>
            PDF files are parsed in-browser using pdfjs-dist.
          </p>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            {[
              { value: 'Multi-Source', label: 'Live API Feeds' },
              { value: '< 5s', label: 'Resume Parse Time' },
              { value: 'Global & PH', label: 'Remote Opportunities' },
              { value: '100%', label: 'Free & Open Source' },
            ].map((s, i) => (
              <div key={i} className={`${styles.statCard} glass-card animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className={styles.howItWorks}>
        <div className="container">
          <h2 className={`${styles.sectionTitle} animate-fade-in-up`}>
            How <span className="text-gradient">SkillSync</span> Works
          </h2>
          <p className={styles.sectionSub}>Simple workflow from PDF upload to ranked job matches.</p>

          <div className={styles.stepsGrid}>
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={`${styles.stepCard} glass-card animate-fade-in-up`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className={styles.stepNumber}>{i + 1}</div>
                <div className={styles.stepEmoji}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={styles.cta}>
        <div className="container-sm">
          <div className={`${styles.ctaCard} glass-card`}>
            <h2 className={styles.ctaTitle}>
              Test with your <span className="text-gradient">resume</span>
            </h2>
            <p className={styles.ctaDesc}>
              Upload a PDF to extract your skills and see matching job openings.
            </p>
            <button
              className="btn btn-primary btn-lg animate-pulse-glow"
              onClick={() => document.getElementById('resume-upload-zone')?.click()}
            >
              Upload Resume PDF
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <span className={styles.footerLogo}>⚡ SkillSync</span>
            <span className={styles.footerText}>
              Next.js 15 · Groq · Supabase · Vercel
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
