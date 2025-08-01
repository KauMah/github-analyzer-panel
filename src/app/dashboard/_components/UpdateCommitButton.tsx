'use client';
import { updateCommits } from '@/actions/updateCommits';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

export default function UpdateCommitButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await updateCommits();
        })
      }
    >
      Update Your Commits
    </Button>
  );
}
