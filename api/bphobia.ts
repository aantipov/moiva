import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';

initSentry();

export default (req: NowRequest, res: NowResponse): void => {
  const url = 'https://bundlephobia.com/api/size?record=true';
  const { lib } = req.query;

  logRequest('bundlephobia', req.query);

  if (!lib || typeof lib !== 'string') {
    reportError(new Error('API BUNDLEPHOBIA: Wrong lib parameter'));
    res.status(400).json({ error: 'Wrong lib parameter' });
    return;
  }

  axios
    .get(url, { params: { package: lib } })
    .then((resp) => {
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json({ gzip: resp.data.gzip, raw: resp.data.size });
    })
    .catch((e) => {
      const { status, data } = e.response;
      let errorCode = 'Urgent';

      if ((status === 500 || status === 403) && data && data.error) {
        errorCode = data.error.code;
        console.error('API BUNDLEPHOBIA ERROR', {
          status,
          code: data.error.code,
          message: data.error.message,
          lib,
        });
      } else {
        reportError(e);
        console.error('API BUNDLEPHOBIA ERROR', e.response);
      }

      res
        .status(status || 500)
        .json({ error: 'Something went wrong', code: errorCode });
    });
};
