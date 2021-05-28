import { fetchNpmDownloads } from '@/components/downloads/api';
import { fetchRepoStars } from '@/components/github-stars/api';
import { fetchNpmPackageReleases } from '@/components/npm-releases/api';
import { fetchContributors } from '@/components/github-contributors/api';
import { fetchRepoCommits } from '@/components/commits/api';
import { fetchRepoLanguages } from '@/components/languages/api';
import { fetchBundlephobiaData } from '@/components/bundle-size/api';
import { useChartApi, useGoogleTrendsApi } from '@/composables/useChartApi';
import { isLoading, npmPackagesNames, reposIds } from '@/store/libraries';

export default function useExtraDataApi(): void {
  useChartApi(npmPackagesNames, isLoading, fetchNpmDownloads);
  useChartApi(npmPackagesNames, isLoading, fetchNpmPackageReleases);
  useChartApi(npmPackagesNames, isLoading, fetchBundlephobiaData);
  useChartApi(reposIds, isLoading, fetchRepoStars);
  useChartApi(reposIds, isLoading, fetchContributors);
  useChartApi(reposIds, isLoading, fetchRepoCommits);
  useChartApi(reposIds, isLoading, fetchRepoLanguages);
  useGoogleTrendsApi();
}
