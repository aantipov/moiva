/**
 * Fetch all repos from the catalog and check if the repos names are up-to-date
 * Use it as: deno run --allow-net --allow-read find-repo-newnames.ts <batch> <token>
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

const renamings: { old: string; new: string }[] = [];
const limit = 100;
const batchIndex = Number(Deno.args[0]);
const token = Deno.args[1];
const start = limit * batchIndex;
const end = start + limit; // not included

try {
  await fetchReposRealNamesBatch();
  console.log("Renames HITs", renamings);
  console.log(`Handled ${start}-${end} out of ${reposIds.length}`);
} catch (e) {
  /* handle error */
  console.log("ERR", e.status);
}

// function writeToFile(newItems) {
//   const updatedItemsStr =
//     '\n\n' + newItems.map((item) => `"${item}"`).join(',\n') + ',';
//   fs.appendFile('gh-list-renamed.txt', updatedItemsStr, (err) => {
//     if (err) return console.log(err);
//     console.log('Data writen successfully');
//   });
// }

async function fetchReposRealNamesBatch() {
  const repoIdsBatch = reposIds.slice(start, end);
  return await Promise.all(repoIdsBatch.map(fetchRepoRealName));
}

async function fetchRepoRealName(oldRepoId: string) {
  const response = await fetch(`http://api.github.com/repos/${oldRepoId}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${token}`,
    },
  });
  if (!response.ok) {
    console.error("ERR", oldRepoId, response.status);
    if (response.status === 404 || response.status === 451) {
      return false;
    }
    throw response;
  }

  const { full_name: fullName } = await response.json();

  if (fullName !== oldRepoId) {
    renamings.push({ old: oldRepoId, new: fullName });
  }
  return fullName;
}
