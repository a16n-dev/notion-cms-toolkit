import { writeFileSync } from 'fs';

import { buildNotionConnector } from './core/connector/notionConnectorV1';
import 'dotenv/config';

const cacheHandler = async (url: string, name?: string) => {
  return {
    url,
    name,
  };
};

const connector = buildNotionConnector(
  process.env.NOTION_API_KEY!,
  cacheHandler,
);

(async () => {
  const data = await connector.getConnectedDatabases();

  writeFileSync('data.json', JSON.stringify(data, undefined, 2));
})();
