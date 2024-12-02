'use client'

import { useState } from 'react'
import { handleGoogleSignIn } from '@/utils/authActions'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CalendarGoogle() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState('')

  console.log('Sessão:', session)
  console.log('Status:', status)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      await handleGoogleSignIn()
      setError('') // Limpa o erro após login bem-sucedido
    } catch {
      setError('Não foi possível conectar ao Google. Tente novamente.')
    }
  }

  function handleNextStep() {
    router.push('time-intervals')
  }

  return (
    <div className="p-6 bg-gray-500 text-white">
      <div className="flex justify-between mb-4">
        <h2>Google Calendar</h2>
        <form onSubmit={onSubmit}>
          <button
            type="submit"
            disabled={status === 'authenticated'} // Desabilita o botão se o status for autenticado
            className={`p-2 rounded-lg min-w-32 ${
              status === 'authenticated'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {status === 'authenticated' ? 'Já Conectado' : 'Conectar'}
          </button>
        </form>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        onClick={handleNextStep}
        disabled={status !== 'authenticated'} // Desabilita o botão se o usuário não estiver autenticado
        className={`bg-gray-600 w-full p-2 hover:bg-gray-700 text-white ${
          status !== 'authenticated' ? 'bg-gray-400 cursor-not-allowed' : ''
        }`}
      >
        Próximo Passo
      </button>
    </div>
  )
}
