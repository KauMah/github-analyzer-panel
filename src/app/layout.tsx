import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from './providers';
import Navbar from '../components/layout/navbar';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GithubAnalyzer Dashboard',
  description: 'Visualize your Github data',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-200 to-green-200 dark:from-blue-950 dark:to-green-950">
              <Navbar />
              {children}
            </div>
          </Providers>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
