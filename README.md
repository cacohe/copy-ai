# Copywriter Generator

AI-powered copywriting tool that generates marketing content for multiple platforms using LLM.

## Features

- **Multi-platform Support**: Generate content for Twitter, Instagram, LinkedIn, Facebook, and more
- **AI-Powered**: Uses LLM APIs (OpenAI, Gemini, DeepSeek, etc.) for intelligent content generation
- **User Authentication**: Secure login/register with Supabase
- **History Management**: Save and manage generated content history
- **Multi-language**: Support for English and Chinese
- **Theme Support**: Dark and light mode

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Radix UI, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI compatible APIs (configurable)

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# LLM API
AI_API_KEY=your_api_key
AI_API_ENDPOINT=your_endpoint
AI_MODEL_NAME=your_model_name
AI_API_FORMAT=openai  # or gemini
```

3. Set up Supabase database:

Run the SQL commands in `supabase.sql` in your Supabase dashboard.

4. Run development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── (auth)/        # Auth API (login, register, logout)
│   │   └── (dashboard)/   # Dashboard API (generate, history)
│   ├── dashboard/         # Dashboard page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── common/            # Shared components
│   ├── dashboard/         # Dashboard components
│   ├── login/             # Login page components
│   ├── ui/                # UI components (Radix-based)
│   └── welcome/            # Landing page components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── supabase/          # Supabase clients
│   └── llm-client.ts      # LLM API client
├── services/             # Business logic services
└── types/                # TypeScript type definitions
```

## License

MIT
