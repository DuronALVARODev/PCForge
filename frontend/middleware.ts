import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Obtener el token de las cookies
  const accessToken = request.cookies.get('accessToken')
  const refreshToken = request.cookies.get('refreshToken')

  // Si no hay ningún token, redirigir al login
  if (!accessToken && !refreshToken) {
    return redirectToLogin(request)
  }

  // Si hay accessToken, intentar validarlo
  if (accessToken) {
    try {
      const response = await fetch('http://localhost:4000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Cookie': request.headers.get('cookie') || ''
        },
        credentials: 'include'
      })

      if (response.ok) {
        // Token válido, continuar
        return NextResponse.next()
      }
    } catch (error) {
      console.error('Error validando token:', error)
    }
  }

  // Si no hay accessToken válido pero hay refreshToken, intentar renovar
  if (refreshToken) {
    try {
      const response = await fetch('http://localhost:4000/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Cookie': request.headers.get('cookie') || ''
        },
        credentials: 'include'
      })

      if (response.ok) {
        // Token renovado exitosamente, continuar
        return NextResponse.next()
      }
    } catch (error) {
      console.error('Error renovando token:', error)
    }
  }

  // Si llegamos aquí, no hay tokens válidos, redirigir al login
  return redirectToLogin(request)
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url)
  
  // Preservar la URL actual para redirigir después del login
  if (request.nextUrl.pathname !== '/login') {
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
  }
  
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/pc-build/:path*'],
}