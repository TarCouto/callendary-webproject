'use client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { UserCircle2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import * as z from 'zod'
import { useSession } from 'next-auth/react'

const formSchema = z.object({
  photo: z.string(),
  about: z.string().min(2, {
    message: 'A descrição deve ter pelo menos 2 caracteres.',
  }),
})

export function FormPerfil() {
  const { data: session } = useSession()
  console.log('Session data:', session?.user)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo: '',
      about: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Card className="bg-gray-900 border-gray-700 p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 text-white"
        >
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto de perfil</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-gray-800">
                      {session?.user ? (
                        <AvatarImage src={session?.user?.image || ''} />
                      ) : (
                        <AvatarFallback className="bg-gray-800">
                          <UserCircle2 className="h-8 w-8 text-gray-400" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => {
                        // Aqui você implementaria a lógica de upload
                        // E depois atualizaria o valor do field com a URL da imagem
                        field.onChange('URL_DA_IMAGEM_AQUI')
                      }}
                    >
                      Selecionar foto
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobre você</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Fale um pouco sobre você. Isto será exibido em sua página pessoal."
                    className="bg-gray-800 border-gray-700 h-32 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Finalizar →
          </Button>
        </form>
      </Form>
    </Card>
  )
}
