import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const path = Array.isArray(req.query.path)
      ? req.query.path.join('/')
      : req.query.path;

    const url = `${process.env.PRICE_FEEDER_API_ORIGIN}/api/${path}`;

    const response = await fetch(url).then((res) => res.json());

    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err?.message || 'Something went wrong',
    });
  }
}
