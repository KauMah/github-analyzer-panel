import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
  SignOutButton,
} from '@clerk/nextjs';

import { ThemeSwitch } from '@/components/layout/theme-switcher';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 dark:from-blue-950 dark:to-green-950">
      <div className="border-b border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
              GithubAnalyzer
            </h1>

            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem className="pb-1">
                  <ThemeSwitch />
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <SignedOut>
                    <div className="flex gap-2 pb-1">
                      <SignInButton>
                        <div className="cursor-pointer">Sign In</div>
                      </SignInButton>
                      <SignUpButton>
                        <div className="cursor-pointer">Sign Up</div>
                      </SignUpButton>
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex gap-2 pb-1">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to GithubAnalyzer
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Visualize and analyze your GitHub data in one place
          </p>
        </div>
      </main>
    </div>
  );
}
