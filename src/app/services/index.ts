import fetch from 'cross-fetch';

export const WIKI_GQL_QUERY = `
query getMovie($tmdbId: ID!) {
  movie(id: $tmdbId) {
    name
  }
}
`;

export  const SEARCH_GQL_QUERY = `
query SearchMovies($title: String!) {
  searchMovies(query: $title) {
    id
    name
    score
    genres {
      name
    }
  }
}
`;

export const RELATED_GQL_QUERY = `
query getMovie($tmdbId: ID!) {
  movie(id: $tmdbId) {
    name
    similar(limit: 5) {
      name
      id
      score
      genres {
        name
      }
    }
  }
}
`;


export const extractByPageId = async (id: string) => {
    return JSON.parse(await (await fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=1&pageids=${id}`)).text())
  }

export const searchWikiByTitle = async (title: string) => {
    return JSON.parse(await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&formatversion=latest&srsearch=%22${title}%22%20articletopic:films`)).text());
}

