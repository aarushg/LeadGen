# Tools Library Quick Reference

## Accessing the Tools

### 1. Tools Library Dashboard
- **URL**: `/dashboard/tools`
- **Features**:
  - View all 23 Tools Library tools
  - Search by name, type, or feature
  - Filter by tool category
  - Compare multiple tools side-by-side

### 2. Individual Tool Pages
- **URL**: `/dashboard/tools/[tool-id]`
- **Example**: `/dashboard/tools/62daad5f-217c-48fa-b8c2-9fc559fed99e`
- **Features**:
  - Complete implementation guide
  - Pricing and setup information
  - Step-by-step implementation roadmap
  - Integration options
  - Pros and cons analysis
  - Real-world use cases
  - Success metrics
  - Links to official documentation

### 3. Unified Tools Library Surface
- **Primary URL**: `/dashboard/tools`
- **Analytics URL**: `/dashboard/tools/analytics`
- **Features**:
  - Single tools surface in UI (Tools Library)
  - Full Tools Library coverage (23/23)
  - Plus one bonus in-app tool: Apollo.io
  - Legacy `/dashboard/tools-features` routes redirect to Tools Library

### 4. Tools API
- **Endpoint**: `GET /api/tools`
- **Response**: Array of all 23 Tools Library tools with basic information

- **Endpoint**: `GET /api/tools/[id]/implementation`
- **Response**: Detailed implementation guide for specific tool

## Tool Categories (Tools Library)

### Marketing Automation (4 tools)
- Salesforce Marketing Cloud
- HubSpot Marketing Hub
- Mailchimp
- Overloop

### CRM & Pipeline (4 tools)
- Pipedrive
- Zendesk Sell
- Agile CRM
- Intercom

### B2B Data & Intelligence (6 tools)
- UpLead
- Hunter
- AeroLeads
- D&B Hoovers
- Leadfeeder
- Dealfront

### Lead Scoring & Qualification (2 tools)
- SalesWings
- LeadsBridge

### Lead Generation & Outreach (7 tools)
- LeadFuze
- Demio
- CallPage
- OptinMonster
- Sumo
- RollWorks
- Extole

### Bonus In-App Tool (not part of Tools Library)
- Apollo.io

## Common Use Cases by Tool Type

### I want to...

**Find and verify B2B emails**
→ Hunter, AeroLeads, UpLead

**Identify website visitors**
→ Leadfeeder, Dealfront

**Automate email outreach**
→ Overloop, HubSpot Marketing Hub, Mailchimp

**Manage sales pipeline**
→ Pipedrive, Zendesk Sell, Agile CRM

**Score and prioritize leads**
→ SalesWings, Leadfeeder, Dealfront

**Host webinars for lead gen**
→ Demio

**Sync ad leads to CRM**
→ LeadsBridge

**Account-based marketing**
→ RollWorks, D&B Hoovers

**Get referral programs**
→ Extole

**Pop-ups and list building**
→ OptinMonster, Sumo

## API Integration Support

### Full API Support
All 23 Tools Library tools support API integration or Zapier integration for custom workflows.

### Direct API
- Salesforce Marketing Cloud
- Hunter
- UpLead
- Leadfeeder
- AeroLeads
- LeadFuze
- LeadsBridge
- SalesWings
- OptinMonster
- Dealfront
- Demio
- Overloop
- D&B Hoovers
- Agile CRM
- CallPage
- Sumo
- Extole
- RollWorks
- Pipedrive
- Zendesk Sell
- HubSpot Marketing Hub
- Mailchimp
- Intercom

## Getting Started Guide

### For Sales Teams
1. Start with CRM: **Pipedrive** or **Zendesk Sell**
2. Add email verification: **Hunter** or **UpLead**
3. Add outbound automation: **Overloop**
4. Add lead scoring: **SalesWings**

### For Marketers
1. Start with email: **Mailchimp** or **HubSpot Marketing Hub**
2. Add list building: **OptinMonster** or **Sumo**
3. Add visitor tracking: **Leadfeeder** or **Dealfront**
4. Add webinars: **Demio**

### For Agencies
1. Start with CRM: **Pipedrive** or **Agile CRM**
2. Add proposal generation (in-app feature)
3. Add data enrichment: **Hunter** or **UpLead**
4. Add business intelligence: **D&B Hoovers**

### For E-commerce
1. Start with email: **Mailchimp**
2. Add pop-ups: **OptinMonster**
3. Add referral programs: **Extole**
4. Add automation: **HubSpot Marketing Hub**

## Contact & Support

For questions about specific tools, visit their official documentation links available on each tool's detailed page in the app.

Coverage summary:
- Tools Library: 23/23 implemented
- In-app AI tool experiences: 24 total (23 Tools Library + Apollo.io bonus)

For LeadGen app questions, check the main README.md
