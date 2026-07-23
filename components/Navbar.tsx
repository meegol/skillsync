'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = (localStorage.getItem('ss_theme') as 'dark' | 'light') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('ss_theme', nextTheme);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>SkillSync</span>
        </Link>

        <div className={styles.links}>
          <Link
            href="/"
            className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link
            href="/profile"
            className={`${styles.link} ${pathname === '/profile' ? styles.active : ''}`}
          >
            Profile
          </Link>
          <Link
            href="/jobs"
            className={`${styles.link} ${pathname === '/jobs' ? styles.active : ''}`}
          >
            Jobs
          </Link>

          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label="Toggle dark and light mode"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <Link href="/" className="btn btn-primary btn-sm">
            Upload Resume
          </Link>
        </div>
      </div>
    </nav>
  );
}
