import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { logRequest, initSentry, reportError } from './utils';
import { ERROR_CODE_NO_GITHUB_DATA } from '../src/constants';
import { catalogNpmToLib } from '../src/libraries-catalog';

initSentry();

export default (req: NowRequest, res: NowResponse): void => {
  const { pkg } = req.query;

  logRequest('npmPackage', req.query);

  if (!pkg || typeof pkg !== 'string') {
    console.error('API NPM PACKAGE: Wrong pkg parameter');
    reportError(new Error('API NPM PACKAGE: Wrong pkg parameter'));
    res.status(400).json({ error: 'Wrong lib parameter' });
    return;
  }

  axios
    .get(`https://registry.npmjs.com/${encodeURIComponent(pkg)}/latest`)
    .then((resp) => {
      const {
        data: {
          name,
          description,
          dependencies = {},
          license,
          version,
          repository,
          typings,
          types,
        },
      } = resp;

      const hasCatalogLibGithub =
        catalogNpmToLib[pkg] && catalogNpmToLib[pkg].repoId;
      const hasPackageGithub =
        repository &&
        repository.type === 'git' &&
        repository.url.indexOf('github.com') !== -1;

      if (!hasCatalogLibGithub && !hasPackageGithub) {
        console.error(
          `API NPM PACKAGE: wrong GitHub link for ${pkg}`,
          resp.data && resp.data.repository
        );

        res.status(500).json({
          error: {
            message: 'Package doesnt have Github data',
            code: ERROR_CODE_NO_GITHUB_DATA,
          },
        });

        return;
      }

      let repoUrl: string;

      if (hasCatalogLibGithub) {
        repoUrl = `https://github.com/${catalogNpmToLib[pkg].repoId}`;
      } else {
        const endRepoUrlIndex = repository.url.slice(-4) === '.git' ? -4 : 400;

        repoUrl =
          'https://' +
          repository.url.slice(
            repository.url.indexOf('github.com'),
            endRepoUrlIndex
          );
      }

      const result = {
        name,
        description,
        dependencies: Object.keys(dependencies),
        license,
        version,
        repo: repoUrl,
        hasBuiltinTypes: !!typings || !!types,
      };

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
      res.status(200).json(result);
    })
    .catch((e) => {
      if (pkg.startsWith('@types') && e.response && e.response.status === 401) {
        // It's normal to get 401 for non-existent types package
        res.status(404).json({ error: 'Not Found' });
        return;
      }

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
