import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';

const startYear = 2015;
const cYear = new Date().getFullYear();
const years = Array.from(
  { length: cYear - startYear + 1 },
  (_v, k) => startYear + k
);

export default (req: NowRequest, res: NowResponse): void => {
  const { app } = req.query;

  const allYearsPromises = years
    .map(
      (year) =>
        `https://api.npmjs.org/downloads/range/${year}-01-01:${year}-12-31/${app}`
    )
    .map((url) => axios.get(url).then(({ data }) => data.downloads));

  Promise.all(allYearsPromises)
    .then((downloadsByYear) => {
      // @ts-ignore
      const downloads = downloadsByYear.flat();
      const downloadsByMonth = [];

      downloads.forEach(({ downloads, day }) => {
        const monthDay = day.slice(-2);
        const month = day.slice(-10, -3);

        if (monthDay === '01' || !downloadsByMonth.length) {
          downloadsByMonth.push({ downloads, month });
        } else {
          const last = downloadsByMonth.slice(-1)[0];
          last['downloads'] += downloads;
        }
      });

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=43200');
      res.status(200).json(downloadsByMonth);
    })
    .catch(() => {
      res.status(500).json({ error: 'Something went wrong' });
    });
};
