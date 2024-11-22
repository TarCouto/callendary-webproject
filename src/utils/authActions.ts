export async function handleGoogleSignIn() {
  const { signIn } = await import('next-auth/react') // Import dinâmico para garantir que seja usado apenas no cliente
  await signIn('google')
}
