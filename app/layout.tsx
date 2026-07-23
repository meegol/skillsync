import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillSync — AI-Powered Job Matching",
  description:
    "Upload your resume and let AI find your perfect job matches. SkillSync analyzes your skills and experience to surface the most relevant opportunities.",
  keywords: ["job matching", "AI resume", "job search", "career", "skills"],
  openGraph: {
    title: "SkillSync — AI-Powered Job Matching",
    description: "Upload your resume. AI finds your perfect jobs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
