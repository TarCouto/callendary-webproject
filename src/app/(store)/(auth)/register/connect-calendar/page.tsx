import GoogleComponentClient from '@/components/CalendarGoogle'
import { SessionProvider } from 'next-auth/react'

export default function CalendarGoogle() {
  return (
    <div className="max-w-[540px] mx-auto mt-[96px] p-4">
      <div className="text-white">
        <h1 className="text-[24px]">Conecte sua agenda!</h1>
        <p className="text-[13px] mt-3">
          Conecte seu calendario para verificar automaticamente as horas
          oucpoadas e os novos eventos a medida em que sao agendados
        </p>
      </div>
      <div className="flex flex-col items-start my-5">
        <span className="text-sm text-gray-300 mb-1">Passo 2 de 4</span>
        <div className="flex w-full space-x-1">
          <div className="h-1 bg-gray-200 flex-1 rounded-md"></div>
          <div className="h-1 bg-gray-200 flex-1 rounded-md"></div>
          <div className="h-1 bg-gray-600 flex-1 rounded-md"></div>
          <div className="h-1 bg-gray-600 flex-1 rounded-md"></div>
        </div>
      </div>
      <SessionProvider>
        <GoogleComponentClient />
      </SessionProvider>
    </div>
  )
}
