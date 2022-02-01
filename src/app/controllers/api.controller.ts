import { Context, Get, HttpResponseOK, render } from '@foal/core';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql
} from "@apollo/client/core";
import fetch from 'cross-fetch';
import { extractByPageId, RELATED_GQL_QUERY, searchWikiByTitle, SEARCH_GQL_QUERY, WIKI_GQL_QUERY } from '../services';
export class ApiController {

  client = new ApolloClient({
    link: new HttpLink({ uri: 'https://tmdb.sandbox.zoosh.ie/dev/graphql', fetch }),
    cache: new InMemoryCache(),
  });


  @Get('/search')
  async search(ctx: Context) {
    var resp;
    if(ctx?.request?.query?.title) {
      resp = await this.client.query({
        query: gql(SEARCH_GQL_QUERY),
        variables: {title : ctx.request.query.title}
      });
    } else {
      resp = null;
    }

    return render('./templates/search.html', {title: ctx?.request?.query?.title ?? "", movies: resp?.data?.searchMovies ?? []});
  };


  @Get('/wiki')
  async wiki(ctx: Context) {
    var tmdbId = ctx?.request?.query?.id;

    //get title from tmdb id
    try {
      var query = await this.client.query({
        query: gql(WIKI_GQL_QUERY),
        variables: {tmdbId : tmdbId}
      });
      var title = query.data.movie.name;
    } catch(e) {
      return render('./templates/wiki.html', {id: tmdbId, notFound: !!tmdbId});
    }


    //search for title in wikipedia
    if(tmdbId) {
      var resp = await searchWikiByTitle(title);
    } else {
      resp = null;
    }

    //get the article by id, extract the first paragraph
    var searchResults = resp?.query?.search;
    if(searchResults && searchResults.length) {
      var pageid = searchResults[0].pageid;
      var pageDetails = await extractByPageId(pageid);
      var extract = pageDetails.query.pages[pageid].extract.split('\n');
      
      if(extract && extract.length) {
        extract = extract[0];
      } else {
        extract = "";
      }
    }

    return render('./templates/wiki.html', {title, extract, pageid, id: tmdbId});
  };


  @Get('/related')
  async related(ctx: Context) {
    var tmdbId = ctx?.request?.query?.id;
    try {
      var query = await this.client.query({
        query: gql(RELATED_GQL_QUERY),
        variables: {tmdbId : tmdbId}
      });
      
      var title = query.data.movie.name;
      var similar = query.data.movie.similar;
    } catch(e) {
      return render('./templates/related.html', {title, similar, id: tmdbId});
    }

    return render('./templates/related.html', {title, similar, id: tmdbId});
  };


}
