import React from 'react';
import Store from 'statium';

const Article = ({ article, children, ...props }) => (
  <Store tag={`Article-${article.slug}`} state={{ article }} {...props}>
    {children}
  </Store>
);

export default Article;
