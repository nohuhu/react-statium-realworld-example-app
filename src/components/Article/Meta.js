import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'statium';

import { canModify } from '../../selectors/article.js';
import { deleteArticle } from '../../actions/article.js';

import Userpic from '../Userpic.js';
import FavIcon from './FavIcon.js';
import FollowButton from '../FollowButton.js';

const Meta = () => {
  const { state, dispatch } = useStore();

  const editable = canModify({ state });
  const slug = state.article?.slug;
  const authorUsername = state.article?.author?.username;
  const authorImage = state.article?.author?.image;
  const followingAuthor = state.article?.author?.following;
  const createdAt = state.article?.createdAt;

  return (
    <div className="article-meta">
      <Link to={`/@${authorUsername}`}>
        <Userpic src={authorImage} alt={authorUsername} />
      </Link>

      <div className="info">
        <Link to={`/@${authorUsername}`} className="author">
          {authorUsername}
        </Link>

        <span className="date">
          {new Date(createdAt).toDateString()}
        </span>
      </div>

      <span>
        {!editable && (
          <>
            <FollowButton username={authorUsername} following={followingAuthor} />

            &nbsp;

            <FavIcon slug={slug} compact={false} />
          </>
        )}

        {editable && (
          <>
            &nbsp;

            <Link to={`/editor/${slug}`}
              className="btn btn-outline-secondary btn-sm">

              <i className="ion-edit" />&nbsp;Edit Article
            </Link>

            &nbsp;

            <button className="btn btn-outline-danger btn-sm"
              onClick={() => { dispatch(deleteArticle, slug); }}>

              <i className="ion-trash-a" />&nbsp;Delete Article
            </button>
          </>
        )}
      </span>
    </div>
  );
}

export default Meta;
