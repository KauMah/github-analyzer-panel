import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import { Providers } from './providers';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@radix-ui/react-navigation-menu';
import { ThemeSwitch } from '../components/layout/theme-switcher';
import Navbar from '../components/layout/navbar';

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
            <Navbar />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
