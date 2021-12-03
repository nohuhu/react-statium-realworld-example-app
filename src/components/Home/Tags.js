import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Store, { useStore } from 'statium';

import './Tags.css';

export const loadTags = async ({ state, set }) => {
  await set({ loadingTags: true });

  const { tags } = await state.api.Tags.all();

  await set({
    tags,
    loadingTags: false,
  });
};

const Pill = ({ tag, selectedTag }) => (
  <Link to={`/tag/${tag}`}
    className={`tag-default tag-pill ${tag === selectedTag ? 'active' : ''}`}>
    {tag}
  </Link>
);

const TagList = () => {
  const { data, state, dispatch } = useStore();

  useEffect(() => {
    dispatch(loadTags);
  }, [dispatch]);

  const { selectedTag } = data;
  const { loadingTags, tags } = state;

  if (loadingTags || !tags) {
    return <span>Loading tags...</span>;
  }

  return (
    <div className="tag-list">
      {!tags.length && <div className="post-preview">No tags are here... yet.</div>}
      {!!tags.length && tags.map(tag =>
        <Pill key={tag}
          tag={tag}
          selectedTag={selectedTag}
        />
      )}
    </div>
  );
}

const initialState = {
  loadingTags: false,
  tags: null,
};

const Tags = () => (
  <Store tag="Tags" state={initialState}>
    <TagList />
  </Store>
);

export default Tags;
