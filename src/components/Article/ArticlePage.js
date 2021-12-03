import React, { useEffect } from 'react';
import Store, { useStore } from 'statium';
import { useParams } from 'react-router';

import marked from 'marked';
import { sanitize } from 'dompurify';

import Meta from './Meta.js';
import TagList from './TagList.js';
import Comments from './Comments.js';

import LoadMask from '../LoadMask.js';
import ErrorList from '../ErrorList.js';

import { loadArticle } from '../../actions/article.js';

const ArticlePage = () => {
  const { slug } = useParams();

  const initialState = {
    busy: true,
    article: null,
    errors: null,
  };

  // Note that the slug parameter comes from the URL, and changes dynamically
  // between renderings. Because of this, we cannot make it a Store state key
  // and pass as data key instead so that it will be available for all downstream
  // components without having to expose them to implementation detail of where
  // this parameter comes from.
  return (
    <Store tag="ArticlePage" data={{ slug }} state={initialState}>
    {({ state: { busy, errors } }) => (
      <>
        <LoadMask loading={busy} />

        {errors && <ErrorList errors={errors} />}

        <ArticleView />
      </>
    )}
    </Store>
  );
};

const ArticleView = () => {
  const { data, state, dispatch } = useStore();
  const { article } = state;
  const { slug } = data;

  // We don't _really_ need to include dispatch function in the list of dependencies
  // for useEffect hook since the function identity is stable and will not ever change.
  // ESLint rules for hooks are not aware of that though, and will complain about
  // missing dependency.
  useEffect(() => {
    dispatch(loadArticle, { slug, loadComments: true, loadProfile: true });
  }, [slug, dispatch]);

  if (!article) {
    return null;
  }

  const bodyHtml = sanitize(marked(article.body));

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>

          <Meta />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </div>

        <TagList tagList={article.tagList} />

        <hr />

        <div className="article-actions">
          {/* Yes article-meta is repeated here, see 
              https://gothinkster.github.io/realworld/docs/specs/frontend-specs/templates */}
          <Meta />
        </div>

        <div className="row">
          <Comments />
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;

