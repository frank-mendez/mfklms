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
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database with initial data
npm run db:seed

# Or run all database setup steps at once
npm run db:setup
```

## Available Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Management

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Run database seeder
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:reset` - Reset database and run migrations
- `npm run db:setup` - Complete database setup (generate + push + seed)
- `npm run db:deploy` - Deploy migrations (production)

### Production Deployment

- `npm run build:production` - Production build with database setup
- `npm run deploy` - Full deployment pipeline

4. Seed the admin user:

```bash
npm run db:seed
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

## Deployment

### Vercel Deployment

This project is configured for automatic deployment to Vercel with database migration and seeding.

1. **Connect your repository to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the Next.js framework

2. **Set up environment variables in Vercel:**

   ```env
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_SECRET="your-production-secret"
   NEXTAUTH_URL="https://your-app.vercel.app"
   ```

3. **Deploy:**
   - Push to your main branch
   - Vercel will automatically:
     - Install dependencies
     - Generate Prisma client
     - Run database migrations
     - Seed the database
     - Build and deploy the application

The `vercel.json` configuration ensures that:

- Database migrations run during build
- Initial data is seeded automatically
- API routes have appropriate timeout settings
- Prisma is properly configured for serverless

### Manual Database Operations on Vercel

If you need to run database operations manually after deployment:

```bash
# Reset and reseed database (be careful in production!)
npm run db:reset

# Just run seeding
npm run db:seed

# Run migrations only
npm run db:deploy
```

### Production Environment Variables

Make sure to set these in your Vercel dashboard:

- `DATABASE_URL` - Your production PostgreSQL connection string
- `NEXTAUTH_SECRET` - A secure random string for JWT signing
- `NEXTAUTH_URL` - Your deployed application URL

## API Routes

- `GET /api/users` - List all users (Admin only)
- `POST /api/users` - Create new user
- `GET /api/users/[userId]` - Get user details
- `PATCH /api/users/[userId]` - Update user
- `DELETE /api/users/[userId]` - Delete user (Admin only)

- `POST /api/auth/credentials` - Login with email and password

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
