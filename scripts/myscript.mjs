#!/usr/bin/env zx
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * This script is used to get the list of libraries that don't have AI data
 * px zx scripts/myscript.mjs
 */

const libsAll = require('.../src/data/libraries.json');
const libsFiltered = libsAll.filter(
  (lib) => !!lib.npm && !!lib.isNpmCoreArtifact
);
const libs = libsFiltered.slice(0, 50).map((lib) => lib.npm);
const libsPromises = libs.map((lib) =>
  fetch(`https://moiva.io/npm-info/${encodeURIComponent(lib)}`)
);
const libsResponses = await Promise.all(libsPromises);
const libsJsons = await Promise.all(libsResponses.map((res) => res.json()));
const libsJsonsNoAi = libsJsons.filter((lib) => !lib.ai).map((lib) => lib.name);
console.log('Libs without AI data \n', libsJsonsNoAi);
