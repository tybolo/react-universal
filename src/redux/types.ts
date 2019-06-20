export interface ReposParams {
  q?: string;
  page?: number;
  per_page?: number;
}

export interface RepoParams {
  username: string;
  reponame: string;
}

export interface RepoItem {
  id: string;
  name: string;
}

export interface Repos {
  isFetching: boolean;
  data: ReposParams;
  totalCount: number;
  items: RepoItem[];
  item?: RepoItem;
}

export interface State {
  repos: Repos;
}
