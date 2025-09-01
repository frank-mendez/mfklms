# MFK Management Loan System (MFKLMS)

A comprehensive loan management system built with Next.js 14, designed for microfinance operations and lending institutions. Features complete loan lifecycle management, borrower tracking, repayment scheduling, stash contributions, and detailed financial reporting with role-based access control.

## Features

### 🏦 Loan Management

- ✅ Complete Loan Lifecycle Management (Creation, Disbursement, Monitoring, Closure)
- ✅ Borrower Profile Management with Contact Information
- ✅ Flexible Loan Terms (Principal, Interest Rate, Duration)
- ✅ Automated Repayment Schedule Generation
- ✅ Loan Status Tracking (Active, Closed, Defaulted)

### 💰 Financial Operations

- ✅ Repayment Processing and Tracking
- ✅ Transaction Management (Disbursements & Repayments)
- ✅ Stash Contribution System for Owners/Investors
- ✅ Financial Summary and Dashboard Analytics
- ✅ Late Payment and Default Management

### 👥 User & Access Management

- ✅ Role-based Authorization (SuperAdmin/Admin/User)
- ✅ Email/Password Authentication with JWT
- ✅ User Management (CRUD Operations)
- ✅ Activity Logging and Audit Trail
- ✅ Protected API Routes and Data Security

### 🛠 Technical Features

- ✅ PostgreSQL Database with Prisma ORM
- ✅ TypeScript Support for Type Safety
- ✅ Comprehensive Testing Suite
- ✅ Pre-commit Quality Checks
- ✅ Automated Build Validation

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

### Testing

- `npm test` - Run tests in watch mode
- `npm run test:ci` - Run tests once for CI/commit hooks
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode

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

## Testing & Quality Assurance

This project includes a comprehensive testing setup with automated quality checks to ensure code reliability and maintain high standards.

### Testing Framework

- **Jest** - Testing framework with Next.js integration
- **Testing Library** - React component testing utilities
- **Coverage Reports** - Detailed test coverage analysis
- **Pre-commit Hooks** - Automated quality gates

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (no watch)
npm run test:ci

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

Current test coverage includes:

- **Components**: React component behavior and user interactions
- **Utils**: Business logic and utility functions
- **React Query Hooks**: API integration and data fetching
- **Calculation Logic**: Loan repayment calculations and validations

Coverage reports are generated in the `coverage/` directory and include:

- HTML reports (`coverage/index.html`)
- LCOV format for CI integration
- Console summary with detailed metrics

### Pre-commit Quality Checks

Every commit automatically runs:

1. **🔨 Build Validation**

   - TypeScript compilation
   - Next.js build process
   - ESLint code quality checks
   - Dependency resolution verification

2. **🧪 Test Execution**

   - All Jest unit tests
   - Coverage threshold validation
   - Test failure detection

3. **✅ Commit Protection**
   - Blocks commits if build fails
   - Prevents commits with failing tests
   - Ensures code quality standards

```bash
# The pre-commit hook runs automatically, but you can test manually:
npm run build && npm run test:ci
```

### Test Structure

```
├── components/
│   └── __tests__/          # Component tests
├── utils/
│   └── __tests__/          # Utility function tests
├── react-query/
│   └── __tests__/          # API hook tests
└── jest.config.js          # Jest configuration
└── jest.setup.js           # Test environment setup
```

### Writing Tests

The project uses Jest with Testing Library for comprehensive testing:

```typescript
// Component test example
import { render, screen, fireEvent } from "@testing-library/react";
import MyComponent from "../MyComponent";

test("renders and handles user interaction", () => {
  render(<MyComponent />);
  const button = screen.getByRole("button");
  fireEvent.click(button);
  expect(screen.getByText("Updated")).toBeInTheDocument();
});

// Utility function test example
import { calculateTotal } from "../calculations";

test("calculates total correctly", () => {
  expect(calculateTotal(100, 0.12)).toBe(112);
});
```

### Continuous Integration

The testing setup is designed for CI/CD integration:

- Tests run automatically on every commit
- Coverage reports can be integrated with CI platforms
- Build validation prevents deployment of broken code
- Standardized test commands across environments

### Quality Standards

- **Coverage Threshold**: Minimum coverage requirements enforced
- **Test-Driven Development**: Write tests alongside new features
- **Component Testing**: User-focused testing approach
- **Business Logic Testing**: Critical calculations and validations covered

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

### 👥 User Management

- `GET /api/users` - List all users (Admin only)
- `POST /api/users` - Create new user
- `GET /api/users/[userId]` - Get user details
- `PATCH /api/users/[userId]` - Update user
- `DELETE /api/users/[userId]` - Delete user (Admin only)

### 🏦 Loan Management

- `GET /api/loans` - List all loans
- `POST /api/loans` - Create new loan
- `GET /api/loans/[loanId]` - Get loan details
- `PATCH /api/loans/[loanId]` - Update loan
- `DELETE /api/loans/[loanId]` - Delete loan

### 👤 Borrower Management

- `GET /api/borrowers` - List all borrowers
- `POST /api/borrowers` - Create new borrower
- `GET /api/borrowers/[borrowerId]` - Get borrower details
- `PATCH /api/borrowers/[borrowerId]` - Update borrower
- `DELETE /api/borrowers/[borrowerId]` - Delete borrower

### 💰 Repayment Management

- `GET /api/repayments` - List all repayments
- `POST /api/repayments` - Create new repayment
- `GET /api/repayments/[repaymentId]` - Get repayment details
- `PATCH /api/repayments/[repaymentId]` - Update repayment
- `DELETE /api/repayments/[repaymentId]` - Delete repayment
- `POST /api/repayments/[repaymentId]/send-sms` - Send SMS notification

### 📊 Financial Management

- `GET /api/transactions` - List all transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/[transactionId]` - Get transaction details
- `PATCH /api/transactions/[transactionId]` - Update transaction
- `DELETE /api/transactions/[transactionId]` - Delete transaction

### 💎 Stash Management

- `GET /api/stashes` - List all stash contributions
- `POST /api/stashes` - Create new stash contribution
- `GET /api/stashes/[stashId]` - Get stash details
- `PATCH /api/stashes/[stashId]` - Update stash contribution
- `DELETE /api/stashes/[stashId]` - Delete stash contribution

### 👑 Owner Management

- `GET /api/owners` - List all owners/investors
- `POST /api/owners` - Create new owner
- `GET /api/owners/[ownerId]` - Get owner details
- `PATCH /api/owners/[ownerId]` - Update owner
- `DELETE /api/owners/[ownerId]` - Delete owner

### 📈 Analytics & Reports

- `GET /api/dashboard/financial-summary` - Get financial dashboard data
- `GET /api/activities` - List system activities/audit logs
- `GET /api/activities/[id]` - Get specific activity details

### 🔐 Authentication

- `POST /api/auth/credentials` - Login with email and password
- `POST /api/auth/register` - Register new user account

## Tech Stack

### Core Framework

- Next.js 14
- NextAuth.js
- Prisma
- PostgreSQL
- TypeScript
- bcryptjs

## Tech Stack

### 🚀 Core Framework

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **NextAuth.js** - Authentication and session management
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS

### 🗄️ Database & ORM

- **PostgreSQL** - Primary database
- **Prisma ORM** - Database toolkit and query builder
- **Database Migrations** - Version-controlled schema changes

### 🔐 Security & Authentication

- **JWT Tokens** - Secure session handling
- **bcryptjs** - Password hashing
- **Role-based Access Control** - Multi-level permissions
- **Activity Logging** - Comprehensive audit trails

### 🧪 Testing & Quality

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)

## License

MIT
