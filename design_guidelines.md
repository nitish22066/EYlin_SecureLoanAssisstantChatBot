# Eylin AI Loan Assistant - Design Guidelines

## Design Approach
**Selected Approach:** Reference-Based (Financial Services + Modern SaaS)
- Primary References: Stripe (clean fintech aesthetic), Linear (conversational UI), Notion (organized information architecture)
- Justification: Finance requires trust and clarity while maintaining approachability through modern, friendly design patterns

## Core Design Principles
1. **Trust Through Clarity:** Clean layouts, ample whitespace, clear hierarchy
2. **Conversational Warmth:** Friendly without being unprofessional
3. **Efficiency First:** Quick access to loan types, minimal friction in flows
4. **Accessibility:** Voice-enabled, multilingual, high contrast

## Typography
- **Primary Font:** Inter (Google Fonts) - clean, professional, excellent readability
- **Hierarchy:**
  - Hero/H1: text-4xl md:text-5xl, font-semibold
  - Section Headers/H2: text-3xl, font-semibold
  - Card Titles/H3: text-xl, font-medium
  - Body: text-base, font-normal
  - Small Labels: text-sm, font-medium
  - Voice indicator/timestamps: text-xs

## Layout System
**Spacing Units:** Tailwind 4, 6, 8, 12, 16, 24
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-16
- Card gaps: gap-6
- Button spacing: px-6 py-3

## Component Library

### Homepage (Track Selection)
- **Hero Section:** 60vh height, centered content with Eylin logo/avatar, welcome message, and dual-window visualization preview
- **Track Cards:** Side-by-side cards (grid-cols-1 md:grid-cols-2, gap-6), each showing:
  - Track icon/badge
  - Track name and description (4-5 lines)
  - Key benefits (3 bullet points)
  - CTA button ("Explore Track 1/2")
- **Feature Strip:** Below tracks, horizontal row showing: 🎙 Voice Enabled | 🌐 4 Languages | 📊 RAG-Verified Data

### Dual-Window Interface
- **Desktop Layout:** Split-screen (grid-cols-2, gap-4), each window independent scroll
- **Mobile Layout:** Tabs switching between Track 1 and Track 2
- **Window Header:** Track name, minimize/expand controls
- **Active Track:** Subtle border/shadow emphasis

### Conversation Pages (Car/Education/Business Loans)
- **Chat Container:** max-w-3xl centered, bg with subtle texture
- **Message Bubbles:**
  - User messages: right-aligned, rounded-2xl rounded-tr-md, p-4
  - Eylin messages: left-aligned, rounded-2xl rounded-tl-md, p-4, with Eylin avatar
  - Fixed width constraints: max-w-[75%]
- **Action Buttons in Chat:** Inline pill buttons for quick responses (e.g., "Yes, please", "Upload Documents")
- **Document Upload Zone:** Dashed border card, drag-drop enabled, shows file previews with check icons on success

### Loan Information Cards
- **Card Layout:** Rounded-xl, border, p-6, hover:shadow-lg transition
- **Card Structure:**
  - Loan type badge (top-right corner)
  - Loan icon/emoji (large, top-left)
  - Loan name (text-2xl, font-semibold, mb-2)
  - Brief description (2-3 lines, text-sm, opacity-70)
  - Key terms grid (2 columns): Amount | Interest Rate | Tenure
  - CTA button (full-width, mt-4)
- **Carousel Navigation:** Dots indicator below, arrow buttons on card hover

### Control Panel (Voice & Language)
- **Position:** Fixed top-right corner, z-50
- **Voice Toggle:** Microphone icon button, animated pulse when active
- **Language Dropdown:** Flag icons + language names, smooth dropdown animation
- **Implementation:** Floating panel with backdrop-blur-sm

### Sanction Letter Display
- **Document Preview:** Card with document icon, download button, and key details preview
- **Success Animation:** Confetti effect on approval
- **Download Button:** Primary CTA with download icon

### Navigation
- **Top Bar:** Eylin logo (left), breadcrumb trail (center), voice/language controls (right)
- **Return to Menu:** Persistent button, bottom-left corner, rounded-full with home icon
- **Progress Indicator:** Stepper or progress bar for multi-step flows (KYC, document upload)

### Forms & Inputs
- **Input Fields:** Rounded-lg, border-2, focus:border-accent, p-3, placeholder with helpful hints
- **File Upload:** Large drop zone with icon, supported formats listed below
- **Validation:** Inline error messages with icon, green checkmark on success

## Animations
- **Minimal & Purposeful:**
  - Message bubble fade-in (200ms)
  - Button hover scale (1.02)
  - Voice pulse animation when active
  - Smooth page transitions (300ms)
  - Success confetti (one-time on approval)

## Images
- **Hero Section:** Illustrated graphic showing dual-track concept with friendly characters using mobile banking (abstract, modern illustration style)
- **Loan Type Icons:** Use emoji or icon library illustrations (🚗 car, 🎓 education, 💼 business)
- **Success State:** Celebration illustration when loan approved
- **Empty States:** Friendly illustrations when no conversations active

## Accessibility
- **Voice Indicators:** Visual feedback when voice is active (pulsing microphone icon)
- **Language Labels:** Clear language names alongside flags
- **Keyboard Navigation:** All interactive elements tab-accessible
- **ARIA Labels:** Proper labels for chat messages, buttons, document uploads
- **Contrast:** Ensure text meets WCAG AA standards

## Responsive Behavior
- **Desktop (lg+):** Dual-window side-by-side, full conversation history visible
- **Tablet (md):** Tabbed interface, single track visible at a time
- **Mobile (base):** Full-width single column, collapsible headers, sticky voice/language controls

## Key UX Patterns
- **Progressive Disclosure:** Show loan details in steps, don't overwhelm with info
- **Contextual Help:** Tooltip icons explaining financial terms
- **Return Navigation:** Always visible "Return to Menu" option
- **Conversation Persistence:** Clear indication of which conversation/loan type user is in
- **Escalation UI:** Distinct visual treatment when case goes to manual review (gentle hand-off messaging with estimated timeline)