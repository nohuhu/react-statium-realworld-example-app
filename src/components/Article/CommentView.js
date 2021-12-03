import React from 'react';
import { useStore } from 'statium';
import { Link } from 'react-router-dom';

import marked from 'marked';
import { sanitize } from 'dompurify';

import { deleteComment } from '../../actions/article.js';

import Userpic from '../Userpic.js';

const DeleteButton = ({ slug, commentId }) => {
  const { dispatch } = useStore();

  const onClick = () => {
    dispatch(deleteComment, { slug, commentId });
  };

  return (
    <span className="mod-options" onClick={onClick}>
      <i className="ion-trash-a" />
    </span>
  );
}

const CommentView = ({ user, slug, articleAuthor, comment }) => {
  const currentUsername = user?.username;
  const commentId = comment?.id;
  const commentAuthor = comment?.author?.username;
  const commentAuthorImage = comment?.author?.image;
  const createdAt = comment?.createdAt;

  const canDelete = currentUsername && (
    currentUsername === articleAuthor ||
    currentUsername === commentAuthor
  );

  const commentHtml = sanitize(marked(comment?.body ?? ''));

  return (
    <div className="card">
      <div className="card-block">
        <div className="card-text" dangerouslySetInnerHTML={{ __html: commentHtml }} />
      </div>

      <div className="card-footer">
        <Link to={`/@${commentAuthor}`} className="comment-author">
          <Userpic src={commentAuthorImage}
            className="comment-author-img"
            alt={commentAuthor} />
          &nbsp;
          {commentAuthor}
        </Link>

        <span className="date-posted">
          {new Date(createdAt).toDateString()}
        </span>

        {canDelete && <DeleteButton slug={slug} commentId={commentId} />}
      </div>
    </div>
  );
};

export default CommentView;
