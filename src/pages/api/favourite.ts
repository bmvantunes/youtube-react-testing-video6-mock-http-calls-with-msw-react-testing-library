// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Photo } from '../../models/Photo';

const makeResponseSlow = async () => new Promise((a) => setTimeout(a, 1000));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Photo>
) {
  await makeResponseSlow();
  const photo = req.body as Photo;
  const newPhoto = { ...photo, favourite: !photo.favourite };
  res.status(200).json(newPhoto);
}
