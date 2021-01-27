import { reactive, computed } from 'vue';

interface SelectedRepoT {
  repoId: string;
  repoName: string;
}

const selectedRepos = reactive<SelectedRepoT[]>([]);

export const reposIds = computed(() =>
  selectedRepos.map((repo) => repo.repoId)
);

export function addRepoId(repoId: string): void {
  selectedRepos.push({
    repoId,
    repoName: repoId.slice(repoId.indexOf('/') + 1),
  });
}

export function removeRepoId(repoId: string): void {
  if (reposIds.value.includes(repoId)) {
    selectedRepos.splice(reposIds.value.indexOf(repoId), 1);
  }
}
