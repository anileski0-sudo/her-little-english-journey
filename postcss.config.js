import { fileURLToPath } from 'node:url';

// Resolve the Tailwind config next to this file, regardless of the working directory.
const config = fileURLToPath(new URL('./tailwind.config.js', import.meta.url));

export default { plugins: { tailwindcss: { config }, autoprefixer: {} } };
