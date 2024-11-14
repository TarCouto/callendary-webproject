import { prisma } from '@/lib/prisma'
import { setCookie } from 'nookies'

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
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    // Verifique se o username já existe no banco de dados
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Username already exists' }),
        {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    // Cria o novo usuário
    const newUser = await prisma.user.create({
      data: {
        username,
        name,
      },
    })

    // Configura o cookie com o ID do usuário criado
    setCookie({ res: req }, 'userId', newUser.id, {
      maxAge: 7 * 24 * 60 * 60, //
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })

    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Failed to create user' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
