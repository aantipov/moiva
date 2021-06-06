/**
 * Fetch stars for all the repos from the catalog
 * Use it as: deno run --allow-net --allow-read scripts/fetch-repo-stars.ts <batch-index>
 */

export {};

interface CategoryT {
  name: string;
  items: {
    repo: string;
  }[];
}

const decoder = new TextDecoder("utf-8");
const files = [...Deno.readDirSync("../../moiva-catalog/catalog")];
const reposIds = files
  .map(
    (file) =>
      JSON.parse(
        decoder.decode(
          Deno.readFileSync("../../moiva-catalog/catalog/" + file.name),
        ),
      ) as CategoryT,
  )
  .map((cat) => cat.items)
  .flat()
  .map((item) => item.repo);

const limit = 100;
const batchIndex = Number(Deno.args[0]);
const start = limit * batchIndex;
const end = start + limit; // not included

try {
  const res = await fetchReposStarsBatch();
  console.log(`Handled ${start}-${end} out of ${reposIds.length}`);
  console.log("[");
  res.nonCompleteRepos.forEach((repoId) => console.log(`"${repoId}",`));
  console.log("]");
  console.log("ERRORS");
  console.log("[");
  res.errors.forEach((repoId) => console.log(repoId));
  console.log("]");
} catch (e) {
  /* handle error */
  console.log("ERR3", e.status);
}

async function fetchReposStarsBatch() {
  const repoIdsBatch = reposIds.slice(start, end);
  // const repoIdsBatch = [];

  const errors = [];
  const nonCompleteRepos = [];

  for (const repoId of repoIdsBatch) {
    // await wait(1000);
    const res = await fetchRepoStars(repoId);

    if (!res) {
      errors.push(repoId);
    } else if (res.incomplete) {
      nonCompleteRepos.push(repoId);
    }
  }

  return { nonCompleteRepos, errors };
}

interface RespT {
  items: {
    month: string;
    stars: number;
  }[];
  case: number;
  totals: unknown[] | null;
}

async function fetchRepoStars(repoId: string) {
  const response = await fetch(
    `https://github-stars.moiva.workers.dev/?repo=${repoId}`,
    { headers: { "Content-Type": "application/json" } },
  );
  if (!response.ok) {
    console.error("ERR1", repoId, response.status);
    return false;
  }

  const res = (await response.json()) as RespT;

  const { items, totals, ...rest } = res;
  const first = items[0];
  // const last = items.slice(-1)[0];

  console.log(rest.case, totals?.length, first.stars, repoId);
  // console.log(items);

  return { incomplete: rest.case !== 5 };
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
