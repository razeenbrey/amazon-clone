import React, { createContext, useContext, useMemo, useState } from 'react';
import SignInModal from '../components/SignInModal/SignInModal';
import { useShop } from './ShopContext';

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [signInOpen, setSignInOpen] = useState(false);
  const { user, setUser } = useShop();

  function signOut() {
    setUser(null);
    setSignInOpen(false);
  }

  const value = useMemo(
    () => ({
      openSignIn: () => setSignInOpen(true),
      closeSignIn: () => setSignInOpen(false),
    }),
    []
  );

  return (
    <UiContext.Provider value={value}>
      {children}
      <SignInModal
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSubmit={(u) => setUser(u)}
        user={user}
        onSignOut={signOut}
      />
    </UiContext.Provider>
  );
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi requires UiProvider');
  return ctx;
}
