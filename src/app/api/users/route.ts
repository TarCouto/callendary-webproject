import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('id')

  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function POST(req: Request) {
  try {
    const { username, name } = await req.json()

    if (!username || !name) {
      return new Response(
        JSON.stringify({ error: 'Username and name are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { username } })

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Username already exists' }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const newUser = await prisma.user.create({
      data: { username, name },
    })

    const response = NextResponse.json(newUser, { status: 201 })

    response.cookies.set('userId', newUser.id, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Failed to create user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
