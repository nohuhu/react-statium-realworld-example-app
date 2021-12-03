import React from 'react';
import { useStore } from 'statium';

import Article from './Article.js';
import Preview from './Preview.js';
import Pager from './Pager.js';

const ArticleList = () => {
  const { state: { articles } } = useStore();

  if (!articles) {
    return (
      <div className="article-preview">
        Loading...
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="article-preview">
        There are no articles to view... yet.
      </div>
    );
  }

  return (
    <>
      {articles.map(article =>
        <Article key={article.slug} article={article}>
          <Preview />
        </Article>
      )}

      <Pager />
    </>
  );
};

export default ArticleList;