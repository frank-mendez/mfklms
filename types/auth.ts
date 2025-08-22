
import { UserRole } from "@prisma/client/wasm"

declare module "next-auth" {
  interface User {
    role: UserRole
    firstName?: string | null
    lastName?: string | null
  }
  
  interface Session {
    user: User & {
      id: string
      role: UserRole
      firstName?: string | null
      lastName?: string | null
    }
  }
}