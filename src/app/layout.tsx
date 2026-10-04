import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import NoticeBar from '../components/NoticeBar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Shahjahanpur Railway Open Scout Group — বাংলাদেশ স্কাউটস, ঢাকা রেলওয়ে জেলা',
  description:
    'Official digital platform of Shahjahanpur Railway Open Scout Group, Bangladesh Scouts, Dhaka Railway District. সুন্দর জীবনের জন্য স্কাউটিং — Scouting for a Better Life.',
  keywords: [
    'Shahjahanpur Railway Open Scout Group',
    'শাহজাহানপুর রেলওয়ে ওপেন স্কাউট গ্রুপ',
    'Bangladesh Scouts',
    'Dhaka Railway District',
    'Open Scout Group',
    'Scouting Bangladesh',
    'Rover Scout',
    'Scout Admission',
    'Events & Camps',
  ],
  authors: [{ name: 'Shahjahanpur Railway Open Scout Group' }],
  openGraph: {
    title: 'Shahjahanpur Railway Open Scout Group — সুন্দর জীবনের জন্য স্কাউটিং',
    description:
      'Official platform for scouting camps, leader directories, membership admission, and youth development under Bangladesh Scouts, Dhaka Railway District.',
    type: 'website',
    locale: 'bn_BD',
    siteName: 'Shahjahanpur Railway Open Scout Group',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#f4faf7] dark:bg-[#081311] text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white relative">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Navbar />
              <NoticeBar />
              <main className="flex-1">{children}</main>
              <Footer />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
