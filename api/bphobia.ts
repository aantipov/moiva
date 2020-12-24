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
      console.error('ERROR', e.response);
      reportError(e);
      const { status, data } = e.response;
      let errorCode = 'Urgent';

      if (status === 500 && data && data.error) {
        errorCode = data.error.code;
      }

      res.status(500).json({ error: 'Something went wrong', code: errorCode });
    });
};
