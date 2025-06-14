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
} from '@/components/ui/navigation-menu';

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-950 dark:to-green-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to GithubAnalyzer
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Visualize and analyze your GitHub data in one place
          </p>
          {/* <Suspense fallback={<p>Loading...</p>}>
            <ChildProcessTest />
          </Suspense> */}
        </div>
      </main>
    </div>
  );
}
