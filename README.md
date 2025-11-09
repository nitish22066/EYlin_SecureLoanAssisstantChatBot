# 🏦 EYLIN - AI-Powered Loan Assistant

<div align="center">

![EYLIN Logo](https://img.shields.io/badge/EYLIN-AI%20Loan%20Assistant-blue?style=for-the-badge&logo=robot)

**An intelligent, conversational loan processing system with advanced enterprise integrations**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-404D59?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 Live Demo](#demo) 

</div>

---

### ✨ Key Features

- 🤖 **Intelligent Conversational AI** - Natural language loan processing
- 🔐 **Secure Authentication System** - Age and occupation-based verification
- 📄 **Smart Document Processing** - Automated upload and verification
- ⏱️ **Realistic Processing Delays** - Simulated verification timing (20s for car loans, 40s for others)
- 💾 **Application Management** - Save, retrieve, and manage loan applications
- 🎨 **Modern UI/UX** - Responsive design with Tailwind CSS and Radix UI
- 🔒 **Enterprise Security** - Protected routes and session management

## 🏗️ Architecture

### Core Technologies
```
Frontend:  React + TypeScript + Vite + Tailwind CSS
Backend:   Node.js + Express + TypeScript
Database:  In-memory storage (production-ready for external DB)
Auth:      Express sessions with bcrypt
UI:        Radix UI + Shadcn components
```

### Advanced Integrations (Optional)
```
🔐 OSO Framework     - Policy-based authorization
🤖 LangChain AI      - Intelligent document analysis  
⛓️ Ethereum/Web3    - Blockchain loan records
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eylin-loan-assistant.git
   cd eylin-loan-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5000
   ```

### 🎯 Demo Credentials
```
Username: demo
Password: demo123
Age: 28
Occupation: Software Engineer
```

## 💼 Supported Loan Types

| Loan Type | Purpose | Typical Amount |
|-----------|---------|----------------|
| 🚗 **Car Loan** | Vehicle Purchase | ₹5L - ₹20L |
| 🏠 **Home Loan** | Property Purchase | ₹10L - ₹2Cr |
| 📚 **Education Loan** | Study Abroad/Domestic | ₹2L - ₹50L |
| 👔 **Personal Loan** | Personal Expenses | ₹1L - ₹25L |
| 🏢 **Business Loan** | Business Investment | ₹5L - ₹1Cr |
| 🎓 **Skill Course Loan** | Professional Development | ₹50K - ₹5L |

## 🎨 User Interface

### Login Experience
- **Desktop & Mobile Responsive** design
- **Comprehensive Chatbot Information** panel
- **Secure Authentication** with validation
- **Feature Showcase** highlighting EYLIN capabilities

### Conversation Flow
- **Natural Language Processing** for loan inquiries
- **Document Upload Interface** with drag-and-drop
- **Real-time Status Updates** during verification
- **Intelligent Escalation Detection** for complex cases

### Application Management
- **Save Application** functionality
- **View Conversation History** 
- **Application Status Tracking**
- **PDF Generation** for loan documents

## 🔧 API Endpoints

### Authentication
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/me         # Current user info
```

### Conversations
```http
POST /api/conversations           # Create new conversation
GET  /api/conversations/:id       # Get conversation
POST /api/conversations/:id/messages # Send message
```

### Applications
```http
POST /api/applications/save       # Save loan application
GET  /api/applications           # Get user applications
```

### Advanced Integrations (When Enabled)
```http
POST /api/auth/check-permission   # OSO authorization check
POST /api/ai/analyze-loan         # AI-powered loan analysis
POST /api/blockchain/create-loan-record # Blockchain loan record
GET  /api/blockchain/loan/:id     # Get blockchain loan data
POST /api/web3/generate-wallet    # Generate Ethereum wallet
```

## 🛡️ Security Features

- ✅ **Session-based Authentication**
- ✅ **Password Hashing** with bcrypt
- ✅ **Protected Route Guards**
- ✅ **Input Validation** with Zod schemas
- ✅ **CORS Configuration**
- ✅ **Rate Limiting** ready
- ✅ **SQL Injection Prevention**

## 📊 Conversation Intelligence

### Smart Response System
- **Context-Aware Responses** based on loan type
- **Escalation Detection** for complex queries
- **Document Request Logic** tailored to loan requirements
- **Verification Timing** optimized for user experience

### Sample Conversation Flow
```
User: "I need a car loan for ₹7 lakhs"
EYLIN: "🚗 That's exciting! Could you share your monthly income?"

User: "Around ₹85,000 per month"
EYLIN: "Great! Let's proceed with your KYC. Please upload your PAN Card and Salary Slip"

[20-second verification delay for car loans]

EYLIN: "✅ Documents verified! You're eligible for ₹7,00,000 at 8.5% interest"
```

## 🚀 Advanced Features

### Enterprise Integrations

#### 🔐 OSO Authorization
```typescript
// Policy-based access control
allow(user, "read", loan_application) if
  loan_application.userId = user.id;

allow(user, "process", loan_application) if
  user.role = "loan_agent";
```

#### 🤖 AI-Powered Analysis
```typescript
// Intelligent loan assessment
const analysis = await loanAgent.processLoanApplication({
  income: 85000,
  loanAmount: 700000,
  loanType: "car-loan"
});
// Returns: creditScore, riskLevel, recommendation
```

#### ⛓️ Blockchain Integration
```typescript
// Immutable loan records
const txHash = await ethereumService.createLoanRecord({
  loanId: "CAR-2024-001",
  borrowerAddress: "0x...",
  amount: 700000,
  interestRate: 8.5
});
```

## 📁 Project Structure

```
📦 eylin-loan-assistant/
├── 📁 client/                 # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable UI components
│   │   ├── 📁 pages/          # Page components
│   │   ├── 📁 contexts/       # React contexts
│   │   └── 📁 lib/            # Utilities
├── 📁 server/                 # Node.js backend
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API routes
│   ├── storage.ts            # Data layer
│   ├── oso-config.ts         # Authorization policies
│   ├── ai-agents.ts          # AI agent configuration
│   └── ethereum-service.ts   # Blockchain integration
├── 📁 shared/                 # Shared types/schemas
└── 📁 docs/                   # Documentation
```

## 🔧 Configuration

### Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Session Secret
SESSION_SECRET=your-secret-key

# Advanced Integrations (Optional)
OPENAI_API_KEY=your-openai-key
ETH_RPC_URL=https://sepolia.infura.io/v3/your-key
ETH_CONTRACT_ADDRESS=0x...
```

### Package Installation for Advanced Features
```bash
# Install enterprise integrations
npm install oso langchain ethers web3

# Uncomment imports in server/routes.ts
# Configure environment variables
```
