# 🚚 Moving Service Platform

A comprehensive web platform connecting customers with professional moving companies in Hong Kong. Built with Next.js 15, TypeScript, and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E)

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Development](#-development)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### For Customers
- 📝 Submit detailed moving requests with photos
- 💰 Receive and compare quotes from multiple companies
- 📱 Phone number verification for secure accounts
- 💳 Secure payment processing (deposit + final payment)
- ⭐ Rate and review moving companies
- 🎁 Referral program with rewards

### For Moving Companies (Partners)
- 📊 Comprehensive business dashboard
- 🔔 Real-time job notifications
- 💼 Browse and bid on moving requests
- 📈 Track earnings and performance
- 👤 Manage company profile and services
- 💵 Automated settlement reports

### For Administrators
- 👥 User and partner management
- 📋 Order monitoring and intervention
- 💰 Payment and refund management
- 📊 Platform analytics and reporting
- ✅ Partner verification and approval
- 📧 Notification system monitoring

## 🛠 Tech Stack

- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Authentication**: Phone/SMS verification with JWT
- **File Storage**: Supabase Storage
- **Notifications**: Twilio (SMS) + SendGrid (Email)
- **Payment**: Stripe (ready for integration)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/moving-service.git
cd moving-service
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
```

4. **Configure your `.env.local` file** (see [Environment Variables](#-environment-variables))

5. **Set up the database** (see [Database Setup](#-database-setup))

6. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔑 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# Database Connection (Required)
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url

# Authentication (Required)
JWT_SECRET=your_jwt_secret_key_here

# Third-party Services (Optional - uses mock in development)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
SENDGRID_API_KEY=your_sendgrid_api_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Admin Settings
ADMIN_EMAILS=admin@example.com

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄 Database Setup

1. **Create a new Supabase project**

2. **Run the SQL migrations in order**:
```bash
# In Supabase SQL editor, run these files:
1. supabase/schema.sql          # Creates all tables
2. supabase/rls-policies.sql    # Sets up Row Level Security
3. supabase/storage-setup.sql   # Creates storage buckets
```

3. **Enable Row Level Security (RLS)** on all tables

4. **Configure Storage buckets**:
   - `quote-photos` - for customer moving photos
   - `partner-logos` - for company logos
   - `review-photos` - for review images

## 💻 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
```

### Development Features

In development mode, the following services are mocked:
- **SMS Verification**: Any 6-digit code is accepted
- **Email Notifications**: Logged to console
- **Payment Processing**: Simulated transactions

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/moving-service)

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```dockerfile
# Dockerfile included for containerized deployment
docker build -t moving-service .
docker run -p 3000:3000 moving-service
```

## 📁 Project Structure

```
moving-service/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # Customer dashboard
│   ├── partner/           # Partner portal
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
│   └── admin/            # Admin components
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── *-service.ts      # Service layers
├── types/                 # TypeScript types
├── public/               # Static assets
└── supabase/             # Database schemas
```

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Phone verification

### Quote Management
- `POST /api/quotes/request` - Submit quote request
- `GET /api/quotes/[id]` - Get quote details
- `POST /api/quotes/[id]/accept` - Accept a quote

### Order Management
- `GET /api/orders` - List user orders
- `POST /api/orders/[id]/cancel` - Cancel order
- `POST /api/orders/[id]/payment` - Process payment

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)

---

Made with ❤️ by the Moving Service Platform Team
