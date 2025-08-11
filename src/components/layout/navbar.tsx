import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../ui/navigation-menu';
import { ThemeSwitch } from './theme-switcher';

export default function Navbar() {
  return (
    <div className="border-b border-blue-200 bg-gray-100/40 backdrop-blur-sm dark:border-blue-800 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <h1 className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-green-400">
              GithubAnalyzer
            </h1>
          </Link>
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-4">
              <SignedIn>
                <NavigationMenuItem>
                  <Link href="/dashboard">Dashboard</Link>
                </NavigationMenuItem>
              </SignedIn>
              <NavigationMenuItem>
                <ThemeSwitch />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <SignedOut>
                  <div className="flex items-center gap-2">
                    <SignInButton forceRedirectUrl={'/dashboard'}>
                      <div className="cursor-pointer">Sign In</div>
                    </SignInButton>
                    <SignUpButton forceRedirectUrl={'/dashboard'}>
                      <div className="cursor-pointer">Sign Up</div>
                    </SignUpButton>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center gap-2">
                    <UserButton />
                    <SignOutButton>
                      <div className="cursor-pointer">Sign Out</div>
                    </SignOutButton>
                  </div>
                </SignedIn>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
}
