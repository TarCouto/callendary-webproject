import { prisma } from '@/lib/prisma'
import { auth } from '@root/auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const timeIntercalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z
        .number()
        .min(0)
        .max(24 * 60),
      endTimeInMinutes: z
        .number()
        .min(0)
        .max(24 * 60),
    }),
  ),
})

export async function POST(req: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  console.log('Received body:', body)
  const { intervals } = timeIntercalsBodySchema.parse(body)
  const userId = session?.user?.id
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'User ID not found' }, { status: 400 })
  }
  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user: {
            connect: { id: userId },
          },
        },
      })
    }),
  )

  return NextResponse.json({}, { status: 201 })
}
