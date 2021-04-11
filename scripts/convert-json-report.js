/* eslint-disable */
const fs = require('fs');

const content = fs.readFileSync(
  '../reports/frameworks-2021-q1-raw.json',
  'utf8'
);
const data = JSON.parse(content);
const libs = [
  ['reduxjs/redux', 'redux'],
  ['mobxjs/mobx', 'mobx'],
  ['reactivex/rxjs', 'rxjs'],
  ['facebookexperimental/recoil', 'recoil'],
  ['davidkpiano/xstate', 'xstate'],
  ['vuejs/vuex', 'vuex'],
  ['ngrx/platform', '@ngrx/store'],
  ['tannerlinsley/react-query', 'react-query'],
  ['pmndrs/zustand', 'zustand'],
  ['datorama/akita', '@datorama/akita'],
  ['ngxs/store', '@ngxs/store'],
  ['mobxjs/mobx-state-tree', 'mobx-state-tree'],
  ['ctrlplusb/easy-peasy', 'easy-peasy'],
  ['effector/effector', 'effector'],
  ['storeon/storeon', 'storeon'],
  ['diegohaz/constate', 'constate'],
  ['vercel/swr', 'swr'],
  ['cerebral/overmind', 'overmind'],
];

const result = libs.map(([repo], i) => {
  const repoStars = (() => {
    const { april, totalCount, ...starsData } = data.stars[i];
    const { items, ...starsMonthly } = data.starsMonthly[i];
    if (starsData.repo !== repo || starsMonthly.repo !== repo) {
      throw new Error('invalid repo', repo, starsData.repo, starsMonthly.repo);
    }
    // Calc +stars, +stars %, totalAmount
    const starsPlus = items[0].stars + items[1].stars + items[2].stars;
    const starsStartAmount = totalCount - april - starsPlus;
    let starsPlusPercentage = (() => {
      const raw = (100 * starsPlus) / starsStartAmount;
      if (raw < 10) {
        return Math.round(raw * 10) / 10;
      }
      return Math.round(raw);
    })();

    return {
      repo,
      starsPlus,
      starsPlusPercentage,
      starsTotal: totalCount,
    };
  })();

  const ghData = (() => {
    const {
      github: { description, createdAt },
      contributors,
      commits,
      ...rest
    } = data.other[i];

    if (rest.repo !== repo) {
      throw new Error('invalid repo');
    }

    return {
      descr: description,
      createdAt,
      commits,
      contributors: contributors.contributors,
    };
  })();

  const npmData = (() => {
    const { npmDetails, npmReleases, npmDownloads, ...rest } = data.npm[i];

    if (rest.repo !== repo) {
      throw new Error('invalid repo');
    }

    const dwnlMonthly = Math.round(
      npmDownloads.slice(-3).reduce((sum, a) => sum + a.downloads, 0) / 3
    );
    const dwnlMonthlyPrev = Math.round(
      npmDownloads.slice(0, 3).reduce((sum, a) => sum + a.downloads, 0) / 3
    );
    const dwnlMonthlyIncreasePercentage = Math.round(
      (100 * (dwnlMonthly - dwnlMonthlyPrev)) / dwnlMonthlyPrev
    );

    return {
      license: npmDetails.license,
      dependencies: npmDetails.dependencies.length,
      tsSupport: (() => {
        const { hasBuiltinTypes, hasOtherTypes } = npmDetails;
        if (hasBuiltinTypes) {
          return 'BUNDLED';
        }
        if (hasOtherTypes) {
          return 'SEPARATE';
        }
        return null;
      })(),
      npmReleases,
      dwnlMonthly,
      dwnlMonthlyIncreasePercentage,
    };
  })();

  const radarData = (() => {
    val = data.radar[repo.toLowerCase()];
    return { techRadar: val || null };
  })();

  const bundleSizeData = (() => {
    const { bundleSize, ...rest } = data.bundleSize[i];

    if (rest.repo !== repo) {
      throw new Error('invalid repo');
    }

    return { bundleSize: bundleSize || null };
  })();

  const devUsage = (() => {
    const val = data.devUsage[repo.toLowerCase()];
    return { devUsage: val || null };
  })();

  const googleTrends = (() => {
    const val = data.googleTrends[repo.toLowerCase()];
    return { googleTrends: val || null };
  })();

  return {
    ...repoStars,
    ...ghData,
    ...npmData,
    ...radarData,
    ...bundleSizeData,
    ...devUsage,
    ...googleTrends,
  };
});

fs.writeFile(
  '../reports/frameworks-2021-q1.json',
  JSON.stringify(result),
  (err) => {
    if (err) return console.log(err);
    console.log('Data generated successfully');
  }
);

console.log(result);
