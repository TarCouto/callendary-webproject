import { FormPerfil } from '@/components/update-perfilForm'

export default async function ProfileSetupPage() {
  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Defina sua disponibilidade
          </h2>
          <p className="text-gray-400">
            Por último, uma breve descrição e uma foto de perfil.
          </p>
          <div className="flex flex-col items-start my-5">
            <span className="text-sm text-gray-300 mb-1">Passo 2 de 4</span>
            <div className="flex w-full space-x-1">
              <div className="h-1 bg-gray-200 flex-1 rounded-md"></div>
              <div className="h-1 bg-gray-200 flex-1 rounded-md"></div>
              <div className="h-1 bg-gray-200 flex-1 rounded-md"></div>
              <div className="h-1 bg-gray-200 flex-1 rounded-md"></div>
            </div>
          </div>
        </div>
        <FormPerfil />
      </div>
    </div>
  )
}
