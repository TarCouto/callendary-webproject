import { ReactNode } from 'react'
// import { Header } from '@/components/header'
// import { CartProvider } from '@/contexts/cart-contexts'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    // <CartProvider>
    <div className="mx-auto grid  w-full max-w-[1600px] grid-rows-app gap-5 px-8 py-8 antialiased overflow-hidden">
      {/* <Header /> */}
      {children}
    </div>
  )
}
