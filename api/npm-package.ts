import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';
import { ERROR_CODE_NO_GITHUB_DATA } from '../src/constants';

initSentry();

export default (req: NowRequest, res: NowResponse): void => {
  const { lib } = req.query;

  logRequest('npmPackage', req.query);

  if (!lib || typeof lib !== 'string') {
    console.error('API NPM PACKAGE: Wrong lib parameter');
    reportError(new Error('API NPM PACKAGE: Wrong lib parameter'));
    res.status(400).json({ error: 'Wrong lib parameter' });
    return;
  }

  axios
    .get(`https://registry.npmjs.com/${encodeURIComponent(lib)}/latest`)
    .then((resp) => {
      const {
        data: {
          name,
          description,
          dependencies = {},
          license,
          version,
          repository,
        },
      } = resp;
      if (
        !repository ||
        repository.type !== 'git' ||
        repository.url.indexOf('github.com') === -1
      ) {
        console.error(`API NPM PACKAGE: wrong GitHub link for ${lib}`);

        res.status(500).json({
          error: {
            message: 'Package doesnt have Github data',
            code: ERROR_CODE_NO_GITHUB_DATA,
          },
        });

        return;
      }

      const endRepoUrlIndex = repository.url.slice(-4) === '.git' ? -4 : 400;

      const repoUrl =
        'https://' +
        repository.url.slice(
          repository.url.indexOf('github.com'),
          endRepoUrlIndex
        );

      const result = {
        name,
        description,
        dependencies: Object.keys(dependencies),
        license,
        version,
        repo: repoUrl,
      };

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(result);
    })
    .catch((e) => {
      console.error('API NPM PACKAGE: ', e);
      reportError(e);

      if (e.response && e.response.status === 404) {
        res.status(404).json({ error: 'Not Found' });
        return;
      }

      res
        .status((e.response && e.response.status) || 500)
        .json({ error: 'Something went wrong' });
    });
};
