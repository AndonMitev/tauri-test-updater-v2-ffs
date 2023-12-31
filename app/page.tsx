'use client';

import UpdateToast from '@/components/UpdateToast';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import strongholdStorage from '@/lib/stronhold';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [counter, setCounter] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    (async () => {
      const { checkUpdate, installUpdate, onUpdaterEvent } = await import(
        '@tauri-apps/api/updater'
      );
      const { relaunch } = await import('@tauri-apps/api/process');
      const { shouldUpdate, manifest } = await checkUpdate();

      if (shouldUpdate) {
        // You could show a dialog asking the user if they want to install the update here.
        console.log(
          `Installing update ${manifest?.version}, ${manifest?.date}, ${manifest?.body}`
        );
        setShowToast(true);

        // // Install the update. This will also restart the app on Windows!
        // await installUpdate();

        // // On macOS and Linux you will need to restart the app manually.
        // // You could use this step to display another confirmation dialog.
        // await relaunch();
      }
    })();
  }, []);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <p>new update 0.1.27</p>
      <p>more content</p>
      <p>pump tauri config version</p>
      <button onClick={() => setCounter((counter) => (counter += 1))}>
        Click me
      </button>
      <p className='text-white'>Counter: {counter}</p>
      <Button
        onClick={async () => {
          await strongholdStorage.save('email', 'test_email');
        }}
      >
        Store in holdstrong
      </Button>
      <Button
        onClick={async () => {
          const email = await strongholdStorage.load('email');
          setEmail(email);
        }}
      >
        Read from holdstrong storage
      </Button>
      <Button onClick={async () => await strongholdStorage.reset()}>
        Clear storage
      </Button>
      <p>email: {email}</p>
      {showToast && <UpdateToast />}
    </main>
  );
}
