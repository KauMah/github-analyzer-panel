import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { spawn } from 'child_process';

export default async function ChildProcessTest() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    const clerk = await clerkClient();
    const tokenResponse = await clerk.users.getUserOauthAccessToken(
      userId ?? '',
      'github'
    );
    const token = tokenResponse.data[0]?.token;
    const username = user?.raw?.username;

    if (!username || !token) {
      throw new Error('Username or token not available');
    }
    const commitText = await runBinary(username ?? '', token ?? '');

    return <div>{commitText ? 'Process worked' : 'Process failed'}</div>;
  } catch (error) {
    return <p>Something went wrong rendering your component </p>;
  }
}

async function runBinary(username: string, token: string) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn('src/binary/github_analyzer', [username, token]);
    // const child = spawn('ls', []);

    let output = '';

    child.stdout.on('data', (data) => {
      output += data;
      // console.log(data.toString());
    });

    child.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    child.on('close', (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`Failed to process with error code - ${code}`));
    });
  });
}
