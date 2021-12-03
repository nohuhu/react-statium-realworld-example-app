import React from 'react';
import { bind } from 'statium';
import { Link } from 'react-router-dom';

import Userpic from '../Userpic.js';
import TagList from './TagList.js';
import FavIcon from './FavIcon.js';

const Preview = ({ slug, title, description, authorUser, authorPic, createdAt, tagList }) => (
  <div className="article-preview">
    <div className="article-meta">
      <Link to={`/@${authorUser}`}>
        <Userpic src={authorPic} alt={authorUser} />
      </Link>

      <div className="info">
        <Link className="author" to={`/@${authorUser}`}>
          {authorUser}
        </Link>

        <span className="date">
          {new Date(createdAt).toDateString()}
        </span>
      </div>

      <div className="pull-xs-right">
        <FavIcon slug={slug} />
      </div>
    </div>

    <Link to={`/article/${slug}`} className="preview-link">
      <h1>
        {title}
      </h1>

      <p>
        {description}
      </p>

      <span>
        Read more...
      </span>

      <TagList tagList={tagList} />
    </Link>
  </div>
);

export default bind(({ state: { article } }) => ({
  title: article?.title,
  description: article?.description,
  slug: article?.slug,
  tagList: article?.tagList,
  authorUser: article?.author?.username,
  authorPic: article?.author?.image,
  createdAt: article?.createdAt,
  favorited: article?.favorited,
  favoritesCount: article?.favoritesCount,
}))(Preview);
