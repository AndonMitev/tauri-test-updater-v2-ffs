'use client';

import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { UpdateManifest } from '@tauri-apps/api/updater';
import { useEffect, useState } from 'react';

const UpdateToast = () => {
  const [manifest, setManifest] = useState<null | UpdateManifest>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getManifest = async () => {
      const { checkUpdate } = await import('@tauri-apps/api/updater');
      const { shouldUpdate, manifest } = await checkUpdate();
      if (shouldUpdate) {
        setManifest(manifest as UpdateManifest);
      }
    };

    getManifest();
  }, []);

  const handleUpdate = async () => {
    const { installUpdate, onUpdaterEvent } = await import(
      '@tauri-apps/api/updater'
    );
    console.log(1);
    const { relaunch } = await import('@tauri-apps/api/process');
    console.log(2);
    await installUpdate();
    console.log(3);
    await relaunch();
    console.log(4);
  };

  return (
    <Button
      variant='outline'
      onClick={() => {
        toast({
          title: 'New update available',
          description: manifest?.body,
          action: (
            <ToastAction altText='Goto schedule to undo' onClick={handleUpdate}>
              Update
            </ToastAction>
          )
        });
      }}
    >
      Update Application
    </Button>
  );
};

export default UpdateToast;
