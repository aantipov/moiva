import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import libsConfigs from '../apps-config';
import { logRequest } from './utils';

export default (req: NowRequest, res: NowResponse): void => {
  const url = 'https://bundlephobia.com/api/size?record=true';
  const lib = libsConfigs.find(
    (libsConfig) => libsConfig.name === req.query.lib
  );

  logRequest('bundlephobia', req.query);

  if (!lib) {
    res.status(400).json({ error: 'Wrong lib parameter' });
    return;
  }

  axios
    .get(url, {
      params: {
        package: lib.name,
      },
    })
    .then((resp) => {
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json({ gzip: resp.data.gzip, raw: resp.data.size });
    })
    .catch(() => {
      res.status(500).json({ error: 'Something went wrong' });
    });
};
