# Kikakoi

A platform for referencing companies linked to investment funds or influential networks, aiming to inform the public and provide an open API for research and analysis.

## 📰 Context & Purpose

This project aims to:
- **Document and make accessible** the list of companies funded by investment funds such as Otium, whose influence and strategic choices can have political, social, or ideological impact.
- **Enable research and citizen monitoring** of the links between companies, finance, and networks of influence (e.g., Project 2025, Périclès, etc.).
- **Provide a public API** so that other projects, media, or citizens can reuse and enrich this data.

## ✊ Political Motivation

- Offer a transparency tool on the economic and ideological networks shaping French society.
- Allow everyone to make informed choices
- Support citizen monitoring and the fight against the opacity of major funds and their ramifications.

## 🏗️ Technical Architecture

### API (NestJS + TypeScript)
- `Company` entity: company name, investment fund, source (link), sector
- Documented RESTful API (Swagger/OpenAPI)
- Smart search (full-text/fuzzy)
- PostgreSQL + TypeORM + Migrations

### Frontend (React + TypeScript)
- Search and display of companies
- Use of the public API
- Modern stack (Vite, React Query, Tailwind)

### Public API
- Swagger documentation
- Automatic TypeScript type generation for clients

## 🚀 Quick Start

```bash
pnpm install
pnpm db:up
pnpm dev
```

## 📚 Who is it for?
- Citizens, journalists, researchers, developers, associations, activist collectives. 