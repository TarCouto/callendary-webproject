import { cookies } from 'next/headers'

export async function getUserFromCookie() {
  // Captura os cookies disponíveis no contexto
  const cookieStore = await cookies() // 'cookies()' retorna ReadonlyRequestCookies

  // Lê o valor do cookie 'userId'
  const userId = cookieStore.get('userId') // Acessa o cookie como um objeto

  if (!userId) {
    throw new Error('Cookie "userId" não encontrado.')
  }

  return userId.value // Retorna o valor do cookie
}
