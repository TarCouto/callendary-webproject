'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { api } from '@/lib/axios'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'O nome de usuário deve ter pelo menos 2 caracteres.',
  }),
  fullName: z.string().min(2, {
    message: 'O nome completo deve ter pelo menos 2 caracteres.',
  }),
})

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      fullName: '',
    },
  })
  const { setValue, handleSubmit, control } = form

  useEffect(() => {
    const username = searchParams.get('username')
    if (username) {
      setValue('username', username)
    }
  }, [searchParams, setValue])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    try {
      await api.post('/users', {
        name: values.fullName,
        username: values.username,
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="max-w-[540px] mx-auto mt-[96px] p-4">
      <div className="text-white">
        <h1 className="text-[24px]">Bem-vindo ao Ignite Call!</h1>
        <p className="text-[13px] mt-3">
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </p>
      </div>
      <div className="flex flex-col items-start my-5">
        <span className="text-sm text-gray-300 mb-1">Passo 1 de 4</span>
        <div className="flex w-full space-x-1">
          <div className="h-1 bg-gray-200 flex-1 rounded-md"></div>
          <div className="h-1 bg-gray-600 flex-1 rounded-md"></div>
          <div className="h-1 bg-gray-600 flex-1 rounded-md"></div>
          <div className="h-1 bg-gray-600 flex-1 rounded-md"></div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 text-white"
        >
          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome de usuário</FormLabel>
                <FormControl>
                  <Input placeholder="cal.com/seu-usuario" {...field} />
                </FormControl>
                <FormDescription>
                  Esse será seu nome de usuário público.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded min-w-full"
          >
            Próximo passo
          </Button>
        </form>
      </Form>
    </div>
  )
}
