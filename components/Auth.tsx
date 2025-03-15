import React, { FormEvent, useState } from 'react';
import { signUp, signIn } from '../utils/api';

interface AuthProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

export default function Auth({ token, setToken }: AuthProps) {
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    const data = await signUp(signupEmail, signupPassword, signupName);
    console.log('Sign Up:', data);
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    const data = await signIn(signinEmail, signinPassword);
    console.log('Sign In:', data);
    if (data?.token) setToken(data.token);
  };

  return (
    <div className="card bg-base-100 shadow-xl w-full p-4 gap-4">
      <h3 className="text-xl font-bold">Sign Up</h3>
      <form onSubmit={handleSignUp} className="form-control gap-2">
        <input
          type="email"
          placeholder="Email"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={signupName}
          onChange={(e) => setSignupName(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>

      <h3 className="text-xl font-bold mt-6">Sign In</h3>
      <form onSubmit={handleSignIn} className="form-control gap-2">
        <input
          type="email"
          placeholder="Email"
          value={signinEmail}
          onChange={(e) => setSigninEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={signinPassword}
          onChange={(e) => setSigninPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Sign In</button>
      </form>
    </div>
  );
}
