import express from 'express';

const app = express();
const port = 3000;

app.get('/database/:databaseId/documents', async (req, res) => {
  res.send('Hello World!');
});

app.get(
  '/database/:databaseId/documents/byId/:documentId',
  async (req, res) => {
    res.send('Hello World!');
  },
);

app.get(
  '/database/:databaseId/documents/bySlug/:documentSlug',
  async (req, res) => {
    res.send('Hello World!');
  },
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
