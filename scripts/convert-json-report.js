/* eslint-disable */
const fs = require('fs');
const rawFile = '../reports/testing-2021-q1-raw.json';
const file = '../reports/testing-2021-q1.json';
const includeBundleSize = false;

const content = fs.readFileSync(rawFile, 'utf8');
const data = JSON.parse(content);
const libs = [
  ['facebook/jest', 'jest'],
  ['avajs/ava', 'ava'],
  ['mochajs/mocha', 'mocha'],
  ['jasmine/jasmine', 'jasmine-core'],
  ['substack/tape', 'tape'],
  ['qunitjs/qunit', 'qunit'],
  ['chaijs/chai', 'chai'],
  ['sinonjs/sinon', 'sinon'],
  ['karma-runner/karma', 'karma'],
  ['testing-library/dom-testing-library', '@testing-library/dom'],
  ['testing-library/jest-dom', '@testing-library/jest-dom'],
  ['cucumber/cucumber-js', '@cucumber/cucumber'],
  ['enzymejs/enzyme', 'enzyme'],
  ['testing-library/react-testing-library', '@testing-library/react'],
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

  let bundleSizeData = {};

  if (includeBundleSize) {
    bundleSizeData = (() => {
      const { bundleSize, ...rest } = data.bundleSize[i];

      if (rest.repo !== repo) {
        throw new Error('invalid repo');
      }

      return { bundleSize: bundleSize || null };
    })();
  }

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

fs.writeFile(file, JSON.stringify(result), (err) => {
  if (err) return console.log(err);
  console.log('Data generated successfully');
});

console.log(result);
