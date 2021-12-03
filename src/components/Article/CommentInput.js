import React from 'react';
import Store from 'statium';

import { postComment } from '../../actions/article.js';

import LoadMask from '../LoadMask.js';
import Userpic from '../Userpic.js';
import ErrorList from '../ErrorList.js';

const initialState = {
  postingComment: false,
  comment: '',
  errors: null,
};

const postCommentAndClearInput = async ({ state, set, dispatch }, slug) => {
  await set({ postingComment: true });

  try {
    await dispatch(postComment, { slug, comment: state.comment });

    await set({
      comment: '',
      postingComment: false,
    });
  }
  catch (e) {
    await set({
      errors: e.response?.data?.errors,
      postingComment: false,
    });
  }
};

const CommentInput = ({ slug }) => (
  <Store tag="Comment-form" state={initialState}>
  {({ state: { user, comment, postingComment, errors }, set, dispatch }) => {
    const onClick = async e => {
      e.preventDefault();
      dispatch(postCommentAndClearInput, slug);
    };

    return (
      <form className="card comment-form">
        <LoadMask loading={postingComment} />

        { errors && <ErrorList errors={errors} /> }

        <div className="card-block">
          <textarea className="form-control"
            placeholder="Write a comment"
            value={comment}
            onChange={e => set({ comment: e.target.value }) }
            rows="3" />
        </div>

        <div className="card-footer">
          <Userpic src={user?.image}
            className="comment-author-img"
            alt={user?.username} />

          <button className="btn btn-sm btn-primary" type="button"
            disabled={postingComment || comment === ''}
            onClick={onClick}
          >
            Post comment
          </button>
        </div>
      </form>
    )
  }}
  </Store>
);

export default CommentInput;
