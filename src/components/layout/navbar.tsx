import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
  SignOutButton,
} from '@clerk/nextjs';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../ui/navigation-menu';
import { ThemeSwitch } from './theme-switcher';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="border-b border-blue-200 dark:border-blue-800 bg-gray-200/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            GithubAnalyzer
          </h1>
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-4">
              <NavigationMenuItem>
                <Link href="/dashboard">Dashboard</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <ThemeSwitch />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <SignedOut>
                  <div className="flex items-center gap-2">
                    <SignInButton>
                      <div className="cursor-pointer">Sign In</div>
                    </SignInButton>
                    <SignUpButton>
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
