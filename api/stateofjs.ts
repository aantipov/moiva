import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError, ErrorT } from './utils';
import { StateOfJST } from '../src/apis';

initSentry();

export default (req: NowRequest, res: NowResponse): void => {
  const url = 'https://api.stateofjs.com/graphql';
  const { lib } = req.query;

  logRequest('github', req.query);

  if (!lib || typeof lib !== 'string') {
    reportError(new Error('API STATEOFJS: Wrong parameters'));
    res.status(400).json({ error: 'Wrong parameters' });
    return;
  }

  axios
    .post(url, {
      query: `
          {
            survey(survey: state_of_js) {
              tools_rankings(ids: ${lib}) {
                experience {
                  usage {
                    percentage
                    year
                  }
                  interest {
                    percentage
                    year
                  }
                }
              }
            }
          }
      `,
    })
    .then((resp) => {
      const { errors, data } = resp.data;

      if (errors) {
        console.error(`API STATEOFJS: (lib: ${lib})`, errors);
        reportError(errors);
        res.status(500).json({ errors: resp.data.errors });
        return;
      }

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res
        .status(200)
        .json(data.survey['tools_rankings'].experience[0] as StateOfJST);
    })
    .catch((e) => {
      const status =
        (e.response && (e.response.code || e.response.status)) || 500;

      if (e.response && e.response.data && e.response.data.errors) {
        reportError(e.response.data.errors);
        res.status(status).json({
          errors: e.response.data.errors,
        } as ErrorT);
        return;
      }

      reportError(e);
      res.status(status).json({
        error: { message: 'Something went wrong' },
      } as ErrorT);
    });
};
