'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function DisableKeysAndContext() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl key combinations
      if (e.ctrlKey) {
        e.preventDefault();
      }

      // Disable Print Screen key
      if (e.key === 'PrintScreen') {
        e.preventDefault();
      }

      // Disable Function keys (F1 - F12)
      if (/^F\d{1,2}$/.test(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}

export default function ConditionalDisable() {
  const pathname = usePathname();

  // Render the DisableKeysAndContext component only on "/dashboard" routes
  if (!pathname.startsWith('/dashboard')) {
    return null;
  }

  return <DisableKeysAndContext />;
}
