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
    title: 'Upload Your Resume',
    desc: 'Drop your PDF resume. We extract text instantly in your browser — nothing is stored without your permission.',
  },
  {
    icon: '🤖',
    title: 'AI Parses Your Skills',
    desc: 'Llama 3.1 reads your resume and builds a rich skill & experience profile in seconds.',
  },
  {
    icon: '🎯',
    title: 'Get Matched Jobs',
    desc: 'We query live job boards and rank every listing by how well it matches your unique profile.',
  },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <ParticleBackground />

      {/* Background orbs */}
      <div className={`orb orb-purple ${styles.orb1}`} />
      <div className={`orb orb-blue ${styles.orb2}`} />
      <div className={`orb orb-cyan ${styles.orb3}`} />

      <Navbar />

      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <div className="container-sm">
          <div className={`badge badge-purple ${styles.heroBadge} animate-fade-in`}>
            ⚡ Powered by Llama 3.1 + Adzuna API
          </div>

          <h1 className={`${styles.headline} animate-fade-in-up delay-100`}>
            Your Dream Job,{' '}
            <span className="text-gradient">Synced to Your Skills</span>
          </h1>

          <p className={`${styles.subheadline} animate-fade-in-up delay-200`}>
            Upload your resume once. AI extracts your skills, experience, and goals —
            then surfaces the most relevant opportunities from across the web.
          </p>

          <div className={`${styles.uploaderWrapper} animate-fade-in-up delay-300`}>
            <ResumeUploader />
          </div>

          <p className={`${styles.hint} animate-fade-in-up delay-400`}>
            🔒 Your resume is processed locally in your browser. We never share your data.
          </p>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            {[
              { value: '1M+', label: 'Jobs Indexed' },
              { value: '< 10s', label: 'Average Match Time' },
              { value: '25+', label: 'Countries Supported' },
              { value: '100%', label: 'Free to Use' },
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
          <p className={styles.sectionSub}>Three steps between you and your perfect job.</p>

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
              Ready to find your{' '}
              <span className="text-gradient">perfect match?</span>
            </h2>
            <p className={styles.ctaDesc}>
              Join thousands of professionals who found their next role with SkillSync.
              Upload your resume and get matched in under 30 seconds.
            </p>
            <button
              className="btn btn-primary btn-lg animate-pulse-glow"
              onClick={() => document.getElementById('resume-upload-zone')?.click()}
            >
              Upload Resume — It's Free
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
              Built with Next.js · Groq AI · Adzuna API · Deployed on Vercel
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
