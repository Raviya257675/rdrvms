---
applyTo: "apps/web/**/*.{ts,tsx}"
---
# Frontend implementation instructions
- React + TypeScript + Vite; functional components and typed API contracts.
- Accessibility: semantic HTML, keyboard navigation, focus, input labels, screen-reader errors and text status indicators.
- Use TanStack Query for server state; refetch after socket events; never make client cache the source of truth.
- Avoid storing auth secrets/precise coordinates in browser storage. Do not expose server secrets in `VITE_*`.
- Implement loading/empty/error/403/409/reconnect states and RTL/i18n-ready strings where feasible.
- Write React Testing Library and Playwright checks for critical journeys before marking complete.
