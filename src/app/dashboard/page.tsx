import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import UpdateCommitButton from './_components/UpdateCommitButton';

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  const commits = await prisma.commit.findMany({
    where: { username: user?.username ?? '' },
  });
  return (
    <div className="h-full">
      <h1>Dashboard</h1>
      <p>{`You're ${user?.username}, with the id ${userId}`}</p>
      <p>{`You have ${commits.length} commits to your name`}</p>
      <UpdateCommitButton />
    </div>
  );
}
