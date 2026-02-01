# Unisync

Unisync is a Next.js application designed to provide a seamless user experience with modern web technologies. This project uses Tailwind CSS for styling and TypeScript for type safety.

## Project Structure

```
next-env.d.ts
next.config.mjs
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
app/
  globals.css
  HeroCalendarMock.tsx
  layout.tsx
  page.tsx
  dashboard/
    page.tsx
  events/
    page.tsx
  explore/
    page.tsx
  profile/
    page.tsx
components/
  Footer.tsx
  GlassCard.tsx
  LoginModal.tsx
  NavBar.tsx
  Sidebar.tsx
  ThemeProvider.tsx
  ui/
    Button.tsx
    Card.tsx
    Input.tsx
    ThemeToggle.tsx
lib/
  data.ts
  utils.ts
```

## Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system. You can download it from [Node.js](https://nodejs.org/).
- **Package Manager**: This project uses `npm` as the package manager.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:3000` in your browser to view the application.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Runs the production build.

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **TypeScript**: Typed JavaScript for better developer experience.

## Folder Overview

- **app/**: Contains the main application pages and layouts.
- **components/**: Reusable UI components.
- **lib/**: Utility functions and data.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Feel free to contribute or raise issues to improve this project!