'use client';

import React from 'react';

export const SignOutButton: React.FC = () => {
  const handleSignOut = async () => {
    const { gapi } = await import('gapi-script');
    const auth = await gapi.auth2.getAuthInstance();
    await auth.signOut();
    await auth.signIn()
  };

  return (
    <button type="button" className="common-input" onClick={handleSignOut}>
     log in
    </button>
  );
};

export default SignOutButton;

