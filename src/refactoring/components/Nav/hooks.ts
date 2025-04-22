import { useState } from 'react';

export const useTogglePage = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  function switchPage() {
    setIsAdmin((prevIsAdmin) => !prevIsAdmin);
  }

  return {
    isAdmin,
    switchPage,
  };
};
