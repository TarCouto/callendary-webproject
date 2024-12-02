import { Providers } from '@/components/providers'
import { ReactNode } from 'react'
// ajuste o caminho conforme necessário

export default async function StoreLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Providers>
      <div className="mx-auto grid w-full max-w-[1600px] grid-rows-app gap-5 px-8 py-8 antialiased overflow-hidden">
        {children}
      </div>
    </Providers>
  )
}
