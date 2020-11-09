import { NowRequest, NowResponse } from "@vercel/node";
import axios from "axios";

const startYear = 2015;
const cYear = new Date().getFullYear();
const years = Array.from(
  { length: cYear - startYear + 1 },
  (v, k) => startYear + k
);

export default (req: NowRequest, res: NowResponse) => {
  const promises = years
    .map(
      (year) =>
        `https://api.npmjs.org/downloads/range/${year}-01-01:${year}-12-31/vue,react`
    )
    .map((url) =>
      axios.get(url).then(({ data }) => ({
        vue: data.vue.downloads,
        react: data.react.downloads,
      }))
    );

  Promise.all(promises).then((responces) => {
    const combinedDownloads = responces.reduce(
      (accum, { vue, react }) => ({
        vue: accum.vue.concat(vue),
        react: accum.react.concat(react),
      }),
      { vue: [], react: [] }
    );

    const list = combinedDownloads.vue.map(({ downloads, day }, key) => {
      return {
        vue: downloads,
        react: combinedDownloads.react[key].downloads,
        date: day,
      };
    });

    const newList = [];

    list.forEach(({ vue, react, date }) => {
      const day = date.slice(-2);
      const month = date.slice(-10, -3);

      if (day === "01" || !newList.length) {
        newList.push({ vue, react, month });
      } else {
        const last = newList.slice(-1)[0];
        last["vue"] += vue;
        last["react"] += react;
      }
    });

    res.setHeader("Cache-Control", "max-age=0, s-maxage=43200");
    res.status(200).json(newList);
  });
};
