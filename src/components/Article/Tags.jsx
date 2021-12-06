import React from 'react';
import { Link } from 'react-router-dom';

const Tags = ({ tags = [] }) => (
  <ul className="tag-list">
    {tags.map(tag => (
      <Link key={tag} className="tag-default tag-pill tag-outline"
        to={`/tag/${tag}`}>
        {tag}
      </Link>
    ))}
  </ul>
);

export default Tags;
