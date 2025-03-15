export async function signInWithOAuth(provider: string) {
  // ...your OAuth flow here...
  console.log(`Signing in with ${provider}...`);
  // E.g., redirect to provider’s auth URL or handle with NextAuth
}

// Reuse this in signIn and signUp pages for “Sign In with OAuth” or “Sign Up with OAuth”.
