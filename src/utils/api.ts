/* eslint-disable no-template-curly-in-string */

export type method = 'get' | 'post' | 'delete' | 'put' | 'head' | 'patch' | 'option';
export interface Api {
  url: string;
  method: string;
}

export default {
  user: {
    search: {
      url: '/search/users',
      method: 'get'
    }
  },
  repo: {
    item: {
      url: '/repo/${username}/${reponame}',
      method: 'get'
    },
    list: {
      url: '/users/${username}/repos',
      method: 'get'
    },
    // search: {
    //   url: '/search/repositories',
    //   method: 'get'
    // },
    search: {
      url: '/repos',
      method: 'get'
    },
    forks: {
      url: '/repos/${username}/${reponame}/forks',
      method: 'get'
    },
    stargazers: {
      url: '/repos/${username}/${reponame}/stargazers',
      method: 'get'
    }
  },
  download: {
    parse: {
      url: '/download/parse',
      method: 'post'
    }
  }
}
