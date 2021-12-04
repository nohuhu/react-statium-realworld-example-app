import React from 'react';

const Tags = ({ tags = [] }) => (
  <ul className="tag-list">
    {tags.map(tag => (
      <li className="tag-default tag-pill tag-outline" key={tag}>
        {tag}
      </li>
    ))}
  </ul>
);

export default Tags;
