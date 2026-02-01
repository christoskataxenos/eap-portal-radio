import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' });

export const metadata: Metadata = {
  title: 'ΕΑΠ-νοια | Radio & Portal',
  description: 'Commit στην ενημέρωση, Push στην τρέλα.',
};

import Navbar from '@/components/Navbar';
import RadioPlayer from '@/components/RadioPlayer';
import EasterEggs from '@/components/EasterEggs';

// ... (Metadata stays same)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el">
      <body className={`${inter.variable} ${firaCode.variable}`}>
        <EasterEggs />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full" style={{ paddingBottom: '120px' }}>
            {children}
          </main>
          <RadioPlayer />
        </div>
      </body>
    </html>
  );
}
