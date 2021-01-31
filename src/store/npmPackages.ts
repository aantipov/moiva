import { reactive, computed, ref, readonly } from 'vue';
import { NpmPackageT, fetchNpmPackage } from '@/apis';

const npmPackages = reactive<NpmPackageT[]>([]);
const loadingNpmPackagesR = reactive<string[]>([]);

export const isLoadingNpmPackages = computed(() => loadingNpmPackagesR.length);
export const loadingNpmPackages = readonly(loadingNpmPackagesR);
export const npmPackagesNames = computed(() =>
  npmPackages.map((pkg) => pkg.name)
);

export function addNpmPackage(pkgName: string): void {
  if (
    !pkgName ||
    npmPackagesNames.value.includes(pkgName) ||
    loadingNpmPackages.includes(pkgName)
  ) {
    return;
  }

  loadingNpmPackagesR.push(pkgName);

  fetchNpmPackage(pkgName)
    .then((npmPackage): void => {
      // TODO handle a case of null
      npmPackages.push(npmPackage as NpmPackageT);
    })
    .catch((err) => {
      // let errMsg = `Sorry, we couldn't fetch data for ${libName}`;
      // if (err === ERROR_CODE_NO_GITHUB_DATA) {
      //   errMsg += ': the package information doesnt contain GitHub data';
      // }
      // errorFetchingNewLib.value = errMsg;
    })
    .finally(() => {
      const index = loadingNpmPackagesR.indexOf(pkgName);
      loadingNpmPackagesR.splice(index, 1);
    });
}

export function removeNpmPackage(pkgName: string): void {
  const index = npmPackagesNames.value.indexOf(pkgName);
  npmPackages.splice(index, 1);
}
