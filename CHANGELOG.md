# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-03-19

### Added

- AI-powered natural language search with OpenAI function calling
- Stay discovery with filtering by price, location, tags, stay type, and guest count
- Multi-step checkout flow with date selection, guest configuration, and confirmation
- Server-side availability checking with database-level exclusion constraints
- OAuth authentication (Google, GitHub) and magic link via Supabase
- AI review moderation at submission time
- Server-side rate limiting on AI search (10 req/IP/min)
- Responsive design (desktop + mobile) with custom design tokens
- URL-based state management for shareable, bookmarkable searches
- Structured server action logging with duration tracking
- Unit tests (Vitest) and E2E tests (Playwright)
- CI pipeline (GitHub Actions) with lint, test, and build
- Vercel deployment
