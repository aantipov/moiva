#!/usr/bin/env zx
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * This script is used to get the list of libraries that don't have AI data
 * px zx scripts/myscript.mjs
 */

const bunchNum = 14;
const bunshSize = 50;
const libsAll = require('../src/data/libraries.json');
const libsFiltered = libsAll.filter(
  (lib) => !!lib.npm && !!lib.isNpmCoreArtifact
);
console.log('COUNT', libsFiltered.length);
const libs = libsFiltered
  .slice(bunchNum * bunshSize, (bunchNum + 1) * bunshSize)
  .map((lib) => lib.npm);
console.log('START-END', bunchNum * bunshSize, (bunchNum + 1) * bunshSize);
const libsPromises = libs.map((lib) =>
  fetch(`https://moiva.io/npm-info/${encodeURIComponent(lib)}`)
    .then((res) => res.json())
    .then((pkg) => {
      console.log('SUCCESS', lib, pkg.npm.name, pkg.npm.publishedAt);
    })
    .catch((err) => console.error('ERROR', lib, err))
);
try {
  await Promise.all(libsPromises);
} catch (error) {
  console.error('final error', error);
}
// const libsJsonsNoAi = libsJsons.filter((lib) => !lib.ai).map((lib) => lib.name);
// console.log('Libs without AI data \n', libsJsonsNoAi);
console.log('FINISH');
