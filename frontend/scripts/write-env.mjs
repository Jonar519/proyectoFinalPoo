import fs from 'node:fs';
import path from 'node:path';

const apiBaseUrl = (process.env.API_BASE_URL || 'https://proyectofinalpoo.onrender.com').replace(/\/$/, '');
const target = path.join(process.cwd(), 'src', 'environments', 'environment.production.ts');

const content = `export const environment = {
  production: true,
  apiBaseUrl: '${apiBaseUrl.replace(/'/g, "\\'")}'
};
`;

fs.writeFileSync(target, content, 'utf8');
console.log(`[write-env] apiBaseUrl = ${apiBaseUrl}`);
