# Nontronics Website

A static website built with React and Vite that can be deployed to any static hosting service.

## About

This is a static website that has been converted from Base44 to work independently. It can be deployed to any static hosting platform such as:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

## Development

**Prerequisites:** 

1. Node.js (v16 or higher)
2. npm or yarn

**Setup:**

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`

The app will be available at `http://localhost:5173`

## Building for Production

To build the static site:

```bash
npm run build
```

This will create a `dist` folder containing all the static files ready for deployment.

## Deployment

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify, or
3. Connect your Git repository and set the build command to `npm run build` and publish directory to `dist`

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

### Deploy to GitHub Pages

1. Build the project: `npm run build`
2. Push the `dist` folder contents to the `gh-pages` branch, or
3. Use GitHub Actions to automate the deployment

### Deploy to Any Static Host

Simply upload the contents of the `dist` folder to your web server's public directory.

## Project Structure

- `src/` - Source code
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `dist/` - Built static files (generated after build)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
