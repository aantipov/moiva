import { fetchNpmDownloads } from '@/components/downloads/api';
import { fetchRepoStars } from '@/components/github-stars/api';
import { fetchNpmPackageReleases } from '@/components/npm-releases/api';
import { useChartApi, useGoogleTrendsApi } from '@/composables/useChartApi';
import { isLoading, npmPackagesNames, reposIds } from '@/store/libraries';

export default function useExtraDataApi(): void {
  useChartApi(npmPackagesNames, isLoading, fetchNpmDownloads);
  useChartApi(npmPackagesNames, isLoading, fetchNpmPackageReleases);
  useChartApi(reposIds, isLoading, fetchRepoStars);
  useGoogleTrendsApi();
}
