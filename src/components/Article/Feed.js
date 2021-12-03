import React, { useEffect } from 'react';
import Store, { useStore } from 'statium';
import stateToUri from 'urlito';

import ArticleList from './List.js';
import ArticleLimitSelect from './LimitSelect.js';

export const loadArticles = async ({ state, set }, params) => {
  if (state.busy) {
    return;
  }

  const { page, limit, tab, selectedTag, username } = params;
  const { api } = state;

  await set({ busy: true });

  let response;

  if (selectedTag) {
    response = await api.Articles.byTag(selectedTag, page, limit);
  }
  else if (tab === 'feed') {
    response = await api.Articles.feed(page, limit);
  }
  else if (tab === 'authored') {
    response = await api.Articles.byAuthor(username, page, limit);
  }
  else if (tab === 'favorites') {
    response = await api.Articles.favoritedBy(username, page, limit);
  }
  else {
    response = await api.Articles.all(page, limit);
  }

  const { articles = [], articlesCount = 0 } = response;

  await set({
    articles,
    articlesCount,
    busy: false,
  });
};

const Feed = ({ tabs }) => {
  const { data: { defaultLimit } } = useStore();

  const initialState = {
    page: 0,
    limit: defaultLimit,
    articles: null,
    articlesCount: 0,
  };
  
  const [getStateFromUri, setStateToUri] = stateToUri(initialState, {
    page: {
      fromUri: value => parseInt(value, 10),
      toUri: value => String(value),
    },
    limit: {
      fromUri: value => parseInt(value, 10),
      toUri: value => String(value),
    },
  });
  
  return (
    <Store tag="Feed view"
      state={getStateFromUri}
      onStateChange={({ state }) => setStateToUri(state)}
    >
      <FeedView tabs={tabs} />
    </Store>
  );
};

const tabBarClassByTab = {
  authored: 'articles-toggle',
  favorites: 'articles-toggle',
  tag: 'feed-toggle',
  feed: 'feed-toggle',
  global: 'feed-toggle',
};

const FeedView = ({ tabs }) => {
  const { data, state, dispatch } = useStore();

  const { tab, selectedTag, username, defaultLimit } = data;
  const { page, limit, articles, articlesCount } = state;

  useEffect(() => {
    dispatch(loadArticles, { tab, selectedTag, username, page, limit });
  }, [tab, selectedTag, username, page, limit, dispatch]);

  return (
    <>
      <div className={tabBarClassByTab[tab] || 'feed-toggle'}>
        <ul className="nav nav-pills outline-active">
          {tabs}
          {articlesCount > defaultLimit && <ArticleLimitSelect />}
        </ul>
      </div>

      <ArticleList articles={articles} />
    </>
  );
};


export default Feed;
