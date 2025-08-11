'use client';
import { updateCommits } from '@/actions/updateCommits';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { unwrap } from '@/lib/utils';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function UpdateCommitButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            const res = await updateCommits();
            console.log(res);
            const data = unwrap(res);
            console.log(data);
            toast.success(`Loaded ${data.toString()} commits`);
          } catch (err) {
            toast.error(
              'Something went wrong fetching your commits',
              err ?? 'Unknown issue occurred'
            );
          }
        })
      }
    >
      {isPending ? (
        <Spinner size="small" className="dark:text-black" />
      ) : (
        'Update Your Commits'
      )}
    </Button>
  );
}
