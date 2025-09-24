# EconoRise - AI-Powered Lending Platform

EconoRise is a comprehensive fintech platform that empowers global entrepreneurs through AI-powered loan assessments and real-time economic data insights. Built for the Hacknomics competition, it demonstrates how technology can democratize access to capital for underserved communities worldwide.

## Features

### 🏠 Landing Page
- Professional hero section with clear value proposition
- Feature highlights showcasing AI-powered insights and financial inclusion
- Team section introducing the expertise behind the platform
- Modern, accessible design with professional fintech aesthetic

### 📋 Loan Application System
- Multi-step application form with progress tracking
- Business description and transaction data collection
- AI-powered loan eligibility assessment using Mistral AI
- Comprehensive results display with risk factors and recommendations

### 📊 Lender Dashboard
- **Economic Indicators**: Real-time unemployment rates and consumer price index from FRED API
- **Market Data**: Latest financial market information from Nasdaq Data Link
- **Financial Health Analyzer**: Transaction pattern analysis with cash flow insights
- **Development Indicators**: World Bank population data for emerging markets
- Interactive charts and data visualizations

## Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui component library
- **Charts**: Recharts for data visualization
- **Backend Integration**: RESTful API integration with comprehensive error handling

## API Integration

The platform integrates with 5 backend APIs:

1. **POST /api/assess_eligibility** - AI-powered loan assessment using Mistral AI
2. **GET /api/get_economic_indicators** - FRED API economic data
3. **POST /api/get_financial_health** - Transaction analysis and financial health scoring
4. **GET /api/get_market_data** - Nasdaq Data Link market information
5. **GET /api/get_development_indicators** - World Bank development data

## Getting Started

### Prerequisites
- Node.js 18+ 
- Backend server running on `http://localhost:5000`

### Installation
1. Download the project files
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

### Backend Setup
Ensure your Flask backend is running on port 5000 with all API endpoints available. The frontend includes comprehensive error handling and API status monitoring.

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx              # Landing page
│   ├── apply/page.tsx        # Loan application
│   ├── dashboard/page.tsx    # Lender dashboard
│   └── layout.tsx            # Root layout
├── components/
│   ├── navigation.tsx        # Main navigation
│   ├── hero-section.tsx      # Landing page hero
│   ├── features-section.tsx  # Features showcase
│   ├── team-section.tsx      # Team information
│   ├── multi-step-form.tsx   # Loan application form
│   ├── assessment-results.tsx # AI assessment display
│   └── [dashboard-widgets]/  # Dashboard components
├── lib/
│   └── api.ts               # Centralized API integration
└── public/                  # Static assets
\`\`\`

## Design Philosophy

EconoRise follows modern fintech design principles:
- **Trust & Professionalism**: Clean layouts with sophisticated color palette
- **Accessibility**: Semantic HTML, proper ARIA labels, and screen reader support
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Data Visualization**: Clear, informative charts and progress indicators
- **User Experience**: Intuitive navigation and comprehensive feedback

## Mission

Democratizing access to capital through AI-powered insights and comprehensive economic data analysis, enabling fair and transparent lending decisions for entrepreneurs worldwide.

---

Built with ❤️ for Hacknomics - Empowering Global Entrepreneurs
