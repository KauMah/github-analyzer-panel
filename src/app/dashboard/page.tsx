import ChildProcessTest from '../../components/child-process-test';
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <ChildProcessTest />
      </Suspense>
    </div>
  );
}
