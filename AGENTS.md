# TaskFlow Project Guidelines

## Project Overview

TaskFlow is a frontend portfolio project for a modern project-management SaaS dashboard.

The application is intended to demonstrate production-oriented frontend development, UI/UX design, responsive layouts, state management, routing, testing, and accessibility.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Vitest
- Playwright
- ESLint
- Prettier

## Project Scope

This project is frontend-only.

Use mock data for projects, tasks, team members, activities, and dashboard analytics.

Do not add a backend, database, authentication service, payment service, Firebase, Supabase, or similar infrastructure unless explicitly requested.

## Architecture

- Use Vue Single File Components with `<script setup lang="ts">`.
- Use Vue Router for application navigation.
- Use Pinia for shared application state.
- Keep page-level components inside `src/views`.
- Keep reusable UI components inside `src/components`.
- Keep reusable state logic inside `src/stores` or appropriate composables.
- Keep mock application data separate from presentation components.
- Define TypeScript interfaces/types for core domain models.
- Prefer small reusable components over large monolithic views.

## Core Domain Models

The main application concepts are:

- Project
- Task
- Team Member
- Activity

Tasks should support:

- status
- priority
- due date
- assignee
- project relationship

Task statuses:

- Todo
- In Progress
- Review
- Done

Task priorities:

- Low
- Medium
- High

## UI Direction

Use a clean, modern, professional SaaS dashboard style.

Prefer:

- light neutral backgrounds
- white surfaces
- subtle borders
- restrained shadows
- blue or indigo accent colors
- clear visual hierarchy
- consistent spacing
- readable typography
- accessible contrast

Do not reuse the visual style of unrelated projects.

## Layout

The primary desktop layout should use:

- sidebar navigation
- top header
- main content area

The application must also support tablet and mobile layouts.

On smaller screens, the sidebar should become an appropriate mobile navigation pattern such as a drawer.

## UX Requirements

Always consider:

- loading states
- empty states
- error states
- success feedback
- hover states
- focus states
- keyboard interaction
- touch target sizes
- responsive behavior

Interactive controls should use appropriate semantic HTML.

## Accessibility

Prefer native semantic elements before adding ARIA.

Ensure:

- keyboard navigation
- visible focus indicators
- appropriate labels
- accessible forms
- meaningful button/link semantics
- accessible modal and drawer behavior

## Development Rules

Before making significant changes:

1. Inspect the existing implementation.
2. Identify the affected files.
3. Briefly explain the intended change.
4. Prefer the smallest reasonable implementation.

Do not:

- rewrite working architecture without a clear reason
- install unnecessary dependencies
- modify unrelated files
- remove working functionality without explicit reason
- claim browser behavior was verified unless it was actually tested

## Styling

Maintain a consistent design system.

Prefer shared:

- spacing tokens
- typography
- colors
- border radius
- shadows
- component states

Avoid scattered arbitrary values when a reusable design token is appropriate.

## Testing and Validation

After meaningful changes, run the appropriate checks.

At minimum consider:

- TypeScript type checking
- ESLint / lint checks
- production build
- relevant Vitest tests

For important user flows, use Playwright.

Important flows include:

- navigation
- project filtering
- project detail
- task creation/editing
- Kanban interactions
- task status changes
- responsive navigation

## Scope Control

Do not implement future features unless explicitly requested.

The initial project focuses on:

- Dashboard
- Projects
- Project Detail
- Tasks / Kanban
- Team
- Settings

Avoid expanding scope unnecessarily.

## Final Report

After completing a task, report:

- files changed
- implementation completed
- validation performed
- test/build results
- remaining limitations
