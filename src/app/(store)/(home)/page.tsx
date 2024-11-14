import { ClainUsernameForm } from '@/components/clainUsernameForm'
import { Metadata } from 'next'
import Image from 'next/image'
/**
 * Cache & Memoization
 */

// async function getFeaturedProducts(): Promise<Product[]> {
//   const response = await api('/products/featured', {
//     next: {
//       revalidate: 60 * 60, // 1 hour
//     },
//   })

//   const products = await response.json()

//   return products
// }

export const metadata: Metadata = {
  title: 'Home',
}

export default function Home() {
  return (
    <div className="flex flex-col  max-w-[1220px] items-center antialiased overflow-hidden lg:max-h-[900px]">
      <div className="bg-transparente shadow-2xl max-w-[1220px] w-full   max-h-[900px]">
        <div className="mx-auto max-w-7xl py-0 sm:py-0 lg:pl-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 lg:pr-0 pt-16 shadow-2xl sm:rounded-3xl sm:px-5 md:pt-24 lg:flex lg:gap-x-20 lg:pl-24 lg:pt-0 lg:max-h-[900px]">
            <svg
              viewBox="0 0 1024 1024"
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            >
              <circle
                r={512}
                cx={512}
                cy={512}
                fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-6xl">
                Agendamento descomplicado
              </h2>
              <p className="mt-6 text-pretty text-lg/8 text-gray-300">
                Conecte seu calendário e permita que as pessoas marquem
                agendamentos no seu tempo livre.
              </p>
              <div className="mt-8 flex items-center justify-center gap-x-4 lg:justify-start">
                <ClainUsernameForm />
              </div>
            </div>
            <div className="relative  h-80 lg:mt-28 w-full">
              <Image
                alt="App screenshot"
                src="/hero.svg"
                quality={100}
                width={300}
                height={300}
                className=" w-[50rem] max-w-full rounded-md bg-white/5 ring-1 ring-white/10 mt-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
