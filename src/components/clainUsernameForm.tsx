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
import React from 'react'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

export function ClainUsernameForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })

  const router = useRouter()
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { username } = values

    await router.push(`/register?username=${username}`)

    console.log(values)
  }

  return (
    <div className="space-y-5 bg-gray-900 p-4 shadow-lg min-w-[400px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 bg-gray-800 p-4 w-full"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="seu-usuario"
                    className="text-white"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-white">
                  Coloque seu usuario
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-gray-900 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Reservar Usuario
          </Button>
        </form>
      </Form>
    </div>
  )
}
