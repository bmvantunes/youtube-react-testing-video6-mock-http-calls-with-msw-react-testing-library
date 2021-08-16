// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Photo } from '../../models/Photo';

const makeResponseSlow = async () => new Promise((a) => setTimeout(a, 1000));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Photo[] | { message: string }>
) {
  await makeResponseSlow();

  // res
  //   .status(500)
  //   .json({ message: 'This is a message from my server about the error' });
  // return;

  res.status(200).json([
    {
      id: 1,
      title: `${
        req.query.name.toString() || 'Unknown'
      }: accusamus beatae ad facilis cum similique qui sunt`,
      thumbnailUrl: `http://lorempixel.com/150/150?${Math.random()}`,
      favourite: false,
    },
    {
      id: 2,
      title: 'reprehenderit est deserunt velit ipsam',
      thumbnailUrl: `http://lorempixel.com/150/150?${Math.random()}`,
      favourite: false,
    },
    {
      id: 3,
      title: 'officia porro iure quia iusto qui ipsa ut modi',
      thumbnailUrl: `http://lorempixel.com/150/150?${Math.random()}`,
      favourite: false,
    },
    {
      id: 4,
      title: 'culpa odio esse rerum omnis laboriosam voluptate repudiandae',
      thumbnailUrl: `http://lorempixel.com/150/150?${Math.random()}`,
      favourite: false,
    },
    {
      id: 5,
      title: 'natus nisi omnis corporis facere molestiae rerum in',
      thumbnailUrl: `http://lorempixel.com/150/150?${Math.random()}`,
      favourite: false,
    },
  ]);
}
