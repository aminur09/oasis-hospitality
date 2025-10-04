import dotenv from 'dotenv';
dotenv.config();

import { createServer } from './server';

const PORT = parseInt(process.env.PORT || '4000', 10);

async function main() {
  const app = await createServer();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});