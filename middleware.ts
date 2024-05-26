// middleware.ts

import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    if (process.env.ENABLE_BASIC_AUTH !== '1') {
      return NextResponse.next()
    }
  }
  const authHeader = request.headers.get('authorization')
  const username = process.env.BASIC_AUTH_USERNAME
  const password = process.env.BASIC_AUTH_PASSWORD

  if (authHeader && username && password) {
    const [type, credentials] = authHeader.split(' ')
    if (type === 'Basic') {
      const decoded = Buffer.from(credentials, 'base64').toString('utf8')
      const [inputUsername, inputPassword] = decoded.split(':')

      // 認証情報のチェック
      if (inputUsername === username && inputPassword === password) {
        return NextResponse.next()
      }
    }
  }

  // 認証失敗時のレスポンス
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: '/:path*', // Basic認証を適用するルートを指定
}
