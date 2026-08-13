import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role?: string
      roleNumber?: string
      accessToken?: string
      refreshToken?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role?: string
    roleNumber?: string
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    refreshTokenExpires?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    roleNumber?: string
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    refreshTokenExpires?: number
  }
}
