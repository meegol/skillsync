'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ResumeUploader.module.css';

type Status = 'idle' | 'reading' | 'parsing' | 'done' | 'error';

async function extractPdfText(file: File): Promise<string> {
  // Dynamically import pdfjs-dist to avoid SSR issues
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => ('str' in item ? item.str : '')).join(' ') + '\n';
  }
  return text;
}

export default function ResumeUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

  const processFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10 MB.');
      return;
    }

    setError('');
    setFileName(file.name);

    try {
      setStatus('reading');
      const text = await extractPdfText(file);

      setStatus('parsing');
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error('Parsing failed');
      const data = await res.json();

      localStorage.setItem('ss_profile', JSON.stringify(data.profile));
      setStatus('done');

      setTimeout(() => router.push('/profile'), 600);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setStatus('error');
    }
  }, [router]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const isLoading = status === 'reading' || status === 'parsing';

  const statusLabels: Record<Status, string> = {
    idle: 'Drop your resume here',
    reading: 'Reading PDF…',
    parsing: 'AI is analyzing your resume…',
    done: 'Done! Redirecting…',
    error: 'Try again',
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.dropzone} ${isDragOver ? styles.dragOver : ''} ${isLoading ? styles.loading : ''} ${status === 'done' ? styles.success : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        id="resume-upload-zone"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload resume PDF"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className={styles.fileInput}
          onChange={onFileChange}
          id="resume-file-input"
        />

        <div className={styles.content}>
          {isLoading ? (
            <>
              <div className={`spinner spinner-lg ${styles.spinner}`} />
              <p className={styles.statusText}>{statusLabels[status]}</p>
            </>
          ) : status === 'done' ? (
            <>
              <span className={styles.successIcon}>✓</span>
              <p className={styles.statusText}>{statusLabels.done}</p>
            </>
          ) : (
            <>
              <div className={styles.icon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <p className={styles.primaryText}>
                {isDragOver ? 'Drop it!' : 'Drop your resume here'}
              </p>
              <p className={styles.secondaryText}>or click to browse · PDF only · max 10 MB</p>
              {fileName && <p className={styles.fileName}>{fileName}</p>}
            </>
          )}
        </div>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
