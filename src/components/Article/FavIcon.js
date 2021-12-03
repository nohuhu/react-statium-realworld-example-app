import React from 'react';
import { useStore } from 'statium';

import { favorite, unfavorite } from '../../actions/article.js';

const FavIcon = ({ slug, compact = true }) => {
  const { state, dispatch } = useStore();

  const user = state.user;
  const favorited = state.article?.favorited;
  const favoritesCount = state.article?.favoritesCount;

  const cls = `btn btn-sm ${favorited ? 'btn-primary' : 'btn-outline-primary'}`;
  const title =
    !user ? "Cannot favorite when not signed in" : !favorited ? "Love this!" : "Nah, not so good";

  const content = compact
    ? <span>{favoritesCount}</span>
    : (
        <>
          <span>{!favorited ? "Favorite Article" : "Unfavorite Article"}</span>
          <span> ({favoritesCount})</span>
        </>
      );

  return (
    <button className={cls}
      title={title}
      disabled={!user}
      onClick={e => dispatch(favorited ? unfavorite : favorite, slug)}>
      <i className="ion-heart" /> {content}
    </button>
  );
}

export default FavIcon;
