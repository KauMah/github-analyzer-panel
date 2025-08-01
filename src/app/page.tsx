export default async function Home() {
  return (
    <div className="h-full">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
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
