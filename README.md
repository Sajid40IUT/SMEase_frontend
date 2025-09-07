# SMEease - SME Automation Platform

A comprehensive SME (Small and Medium Enterprise) automation platform built with React, Express, and PostgreSQL.

## Features

- **Employee Management**: Complete CRUD operations for employee data
- **Inventory Management**: Product tracking with supplier management
- **Payroll System**: Payroll periods and payslip generation
- **Sales Tracking**: Employee-product sales monitoring
- **Tax Documentation**: Tax document management
- **Dashboard**: Real-time analytics and overview

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sajid40IUT/SMEase-Frontend-backend-.git
   cd SMEase-Frontend-backend-
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd SMEease_backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Update the .env file with your database credentials
   ```

5. **Set up the database**
   ```bash
   cd SMEease_backend
   npx prisma generate
   npx prisma db push
   npx tsx scripts/migrateData.ts
   ```

6. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd SMEease_backend
   npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## Deployment

### Railway + Vercel + Supabase

This project is configured for deployment on:
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Supabase

### Environment Variables

#### Frontend (Vercel)
```
VITE_API_URL=https://your-railway-backend.railway.app
```

#### Backend (Railway)
```
DATABASE_URL=your-supabase-database-url
DIRECT_URL=your-supabase-direct-url
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Deployment Steps

1. **Deploy Backend to Railway**
   - Connect your GitHub repository
   - Set root directory to `SMEease_backend`
   - Add environment variables
   - Deploy

2. **Deploy Frontend to Vercel**
   - Connect your GitHub repository
   - Set framework to Vite
   - Add environment variables
   - Deploy

3. **Set up Supabase Database**
   - Create a new Supabase project
   - Run the database migration
   - Update Railway with database credentials

## Project Structure

```
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   ├── screens/                  # Page components
│   ├── lib/                      # Utilities and API configuration
│   └── App.tsx                   # Main app component
├── SMEease_backend/              # Backend source code
│   ├── src/                      # Backend source code
│   │   ├── controllers/          # API controllers
│   │   ├── routes/               # API routes
│   │   └── app.ts                # Express app setup
│   ├── prisma/                   # Database schema and migrations
│   └── scripts/                  # Database migration scripts
├── public/                       # Static assets
└── package.json                  # Frontend dependencies
```

## API Endpoints

- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/suppliers` - Get all suppliers
- `GET /api/sales` - Get all sales
- `GET /api/payroll-periods` - Get payroll periods
- `GET /api/payslips` - Get payslips
- `GET /api/tax-documents` - Get tax documents

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.