import type { NextApiRequest, NextApiResponse } from 'next';

const buildUrl = (name: string) =>
  `https://api.reservoir.tools/search/collections/v1?name=${name}&limit=10`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name = req.query.name;

  if (!name || typeof name !== 'string') {
    res.status(200).send({
      collections: [],
    });
    return;
  }

  if (!process.env.RESERVOIR_API_KEY) {
    res.status(401).send({
      error: 'Missing Reservoir API key',
    });
  }

  const url = buildUrl(name);

  const results = await fetch(url, {
    headers: {
      'x-api-key': process.env.RESERVOIR_API_KEY,
    },
  }).then((res) => res.json());

  res.status(200).send({
    collections: results?.collections || [],
  });
}
