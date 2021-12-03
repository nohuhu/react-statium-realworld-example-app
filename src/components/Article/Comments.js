import React from 'react';
import { useStore } from 'statium';
import { Link } from 'react-router-dom';

import CommentInput from './CommentInput.js';
import CommentView from './CommentView.js';

const SignIn = () => (
  <p>
    <Link to="/login">Sign in</Link>
    &nbsp;
    or
    &nbsp;
    <Link to="/register">sign up</Link>
    &nbsp;
    to add comments on this article.
  </p>
);

const CommentList = ({ user, slug, articleAuthor, comments = [] }) => (
  <>
    {comments.map((comment, idx) =>
      <CommentView
        key={comment?.id ?? idx}
        user={user}
        slug={slug}
        comment={comment}
        articleAuthor={articleAuthor} />
    )}
  </>
);

const Comments = () => {
  const { state } = useStore();

  const user = state.user;
  const slug = state.article?.slug;
  const articleAuthor = state.article?.author;
  const comments = state.article?.comments;

  return (
    <div className="col-xs-12 col-md-8 offset-md-2">
      {user ? <CommentInput slug={slug} /> : <SignIn />}

      <CommentList user={user}
        slug={slug}
        articleAuthor={articleAuthor}
        comments={comments} />
    </div>
  );
};

export default Comments;
