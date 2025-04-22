import { useState } from 'react';

export function useTogglePage() {
  const [isAdmin, setIsAdmin] = useState(false);

  function switchPage() {
    setIsAdmin((prevIsAdmin) => !prevIsAdmin);
  }

  return {
    isAdmin,
    switchPage,
  };
}
