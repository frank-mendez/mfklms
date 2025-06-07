# Next.js Authentication System

A modern authentication system built with Next.js 14, featuring role-based access control, JWT authentication, and user management.

## Features

- ✅ Email/Password Authentication
- ✅ Role-based Authorization (Admin/User)
- ✅ JWT Session Handling
- ✅ Protected API Routes
- ✅ User Management (CRUD)
- ✅ PostgreSQL Database with Prisma ORM
- ✅ TypeScript Support

## Prerequisites

- Node.js 18+ 
- PostgreSQL
- npm or yarn

## Getting Started

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables:

```bash
# .env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

3. Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

4. Seed the admin user:

```bash
npm run seed
```

5. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Default Admin Credentials

- Email: admin@example.com
- Password: admin123

**Important**: Change these credentials before deploying to production!

## API Routes

- `GET /api/users` - List all users (Admin only)
- `POST /api/users` - Create new user
- `GET /api/users/[userId]` - Get user details
- `PATCH /api/users/[userId]` - Update user
- `DELETE /api/users/[userId]` - Delete user (Admin only)

## Tech Stack

- Next.js 14
- NextAuth.js
- Prisma
- PostgreSQL
- TypeScript
- bcryptjs

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)

## License

MIT