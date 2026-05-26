# Freelance Client Kit Studio

A local-first web app for freelancers and small service providers to create client-ready proposals, invoices, contract terms, emails, and delivery documents.

## Target Users

Freelance Client Kit Studio is designed for:

- Freelancers managing multiple client projects
- Small service providers preparing client documents
- Independent consultants who need lightweight proposal and invoice workflows
- Solo operators who prefer local browser storage over account-based tools

## Core Features

- Client management with local persistence
- Project management linked to clients
- Proposal generation from reusable templates
- Invoice generation with invoice number, tax, and totals
- Contract terms generation with a business-use disclaimer
- Client email templates with variable replacement
- Generated document library in Export Center
- Markdown, CSV, and browser print-based PDF export
- Static Upgrade page for future commercial packaging

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- LocalStorage
- Local JSON templates
- Lucide React icons

## Local Development

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Then open the local URL shown in your terminal.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The production output is generated in:

```txt
dist
```

## Vercel Deployment

Recommended Vercel settings:

```txt
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
Environment Variables: none
```

If direct visits to nested routes such as `/clients` or `/projects` return 404 on a static host, configure a single-page app rewrite to serve `index.html`.

## Data Storage

This app is local-first and uses LocalStorage only.

LocalStorage keys:

```txt
fck_clients
fck_projects
fck_documents
fck_settings
```

No client, project, or document data is sent to a backend server by this app. Data stays in the user's current browser unless the user clears browser storage.

## Current Limitations

- No backend service
- No database
- No login or user accounts
- No cloud sync
- No import or backup workflow
- No real payment integration
- PDF export uses the browser print dialog
- LocalStorage data is browser-specific and device-specific

## Roadmap

- Import and backup support
- Business profile and branding settings
- More premium proposal, invoice, contract, and email templates
- Improved print styling for client-ready PDFs
- Optional watermark controls
- Client-ready document themes
- Stripe, Lemon Squeezy, or Gumroad checkout integration
- Optional cloud sync and account-based storage
