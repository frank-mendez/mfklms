
import { UserRole } from "@prisma/client/wasm"

declare module "next-auth" {
  interface User {
    role: UserRole
  }
  
  interface Session {
    user: User & {
      id: string
      role: UserRole
    }
  }
}