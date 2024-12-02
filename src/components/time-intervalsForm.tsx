'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { api } from '@/lib/axios'

const timeScheduleSchema = z.object({
  weekdays: z
    .array(
      z
        .object({
          weekDay: z.number(),
          enabled: z.boolean(),
          name: z.string(),
          startTime: z.string(),
          endTime: z.string(),
        })
        .refine(
          (data) => {
            if (!data.enabled) return true
            return data.startTime.length > 0 && data.endTime.length > 0
          },
          {
            message: 'Horários são obrigatórios quando o dia está selecionado',
            path: ['startTime'],
          },
        )
        .refine(
          (data) => {
            if (!data.enabled) return true
            if (!data.startTime || !data.endTime) return true
            return parseInt(data.startTime) < parseInt(data.endTime)
          },
          {
            message: 'O horário final deve ser maior que o inicial',
            path: ['endTime'],
          },
        ),
    )
    .refine((weekdays) => weekdays.some((day) => day.enabled), {
      message: 'Selecione pelo menos um dia da semana',
      path: ['weekdays'],
    }),
})

type TimeSchedule = z.infer<typeof timeScheduleSchema>

const timeSlots = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 7
  return `${hour.toString().padStart(2, '0')}:00`
})

const initialWeekdays = [
  {
    weekDay: 0,
    name: 'Segunda-feira',
    enabled: true,
    startTime: '',
    endTime: '',
  },
  {
    weekDay: 1,
    name: 'Terça-feira',
    enabled: true,
    startTime: '',
    endTime: '',
  },
  {
    weekDay: 2,
    name: 'Quarta-feira',
    enabled: false,
    startTime: '',
    endTime: '',
  },
  {
    weekDay: 3,
    name: 'Quinta-feira',
    enabled: false,
    startTime: '',
    endTime: '',
  },
  {
    weekDay: 4,
    name: 'Sexta-feira',
    enabled: true,
    startTime: '',
    endTime: '',
  },
  { weekDay: 5, name: 'Sábado', enabled: false, startTime: '', endTime: '' },
  { weekDay: 6, name: 'Domingo', enabled: false, startTime: '', endTime: '' },
]

export function WeekdayScheduleForm() {
  const form = useForm<TimeSchedule>({
    resolver: zodResolver(timeScheduleSchema),
    defaultValues: {
      weekdays: initialWeekdays,
    },
  })

  const hasSelectedDay = form.watch('weekdays')?.some((day) => day.enabled)

  async function onSubmit(data: TimeSchedule) {
    try {
      const intervals = data.weekdays
        .filter((day) => day.enabled)
        .map((day) => ({
          weekDay: day.weekDay, // Use day.weekDay em vez de index
          startTimeInMinutes: convertTimeStringToMinutes(day.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(day.endTime),
        }))

      await api.post('/users/time-intervals', { intervals })
    } catch (error) {
      console.error('Erro ao salvar intervalos:', error)
    }
  }
  function convertTimeStringToMinutes(timeString: string) {
    const [hours] = timeString.split(':').map(Number)
    return hours * 60
  }

  return (
    <Card className="w-full mx-auto bg-gray-800 border-zinc-600 max-w-[540px] max-h-screen">
      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 text-white"
          >
            {initialWeekdays.map((day, index) => (
              <div key={day.name}>
                <FormField
                  control={form.control}
                  name={`weekdays.${index}.enabled`}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between py-2 border-b border-zinc-600">
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              if (!checked) {
                                form.setValue(`weekdays.${index}.startTime`, '')
                                form.setValue(`weekdays.${index}.endTime`, '')
                              }
                            }}
                            className="w-5 h-5 border-zinc-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          />
                        </FormControl>
                        <Label className="text-zinc-100">{day.name}</Label>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`weekdays.${index}.startTime`}
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  disabled={
                                    !form.getValues(`weekdays.${index}.enabled`)
                                  }
                                >
                                  <SelectTrigger className="w-[110px] bg-zinc-700 border-zinc-600">
                                    <SelectValue placeholder="Início" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeSlots.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`weekdays.${index}.endTime`}
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  disabled={
                                    !form.getValues(`weekdays.${index}.enabled`)
                                  }
                                >
                                  <SelectTrigger className="w-[110px] bg-zinc-700 border-zinc-600">
                                    <SelectValue
                                      placeholder="Fim"
                                      className="text-white"
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeSlots.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <Button
              type="submit"
              disabled={!hasSelectedDay}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo passo →
            </Button>

            {!hasSelectedDay && (
              <p className="text-sm text-red-500 text-center mt-2">
                Selecione pelo menos um dia da semana
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
