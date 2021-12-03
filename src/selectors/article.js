export const getArticles = ({ state }) => state.articles;
export const getArticlesCount = ({ state }) => state.articlesCount;

export const canModify = ({ state }) => {
  const currentUser = state.user?.username;
  const articleUser = state.article?.author?.username;

  return currentUser && articleUser && currentUser === articleUser;
};
