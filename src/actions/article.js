export const emptyArticle = {
  title: '',
  description: '',
  body: '',
  tagList: [],
};

export const loadArticle = async ({ state, set }, { slug, loadComments, loadProfile }) => {
  const { api } = state;

  if (slug) {
    try {
      await set({ busy: true });

      const article = await api.Articles.bySlug(slug);

      if (loadComments) {
        article.comments = await api.Articles.getComments(slug);
      }

      // We load author profile in article display page, to correctly render
      // the Following button -- need to know if the current user follows that
      // author or not. It doesn't make sense to make additional request when
      // the author is current user.
      if (loadProfile) {
        if (article.author.username !== state.user.username) {
          article.author = await api.Profile.get(article.author.username);
        }
      }

      await set({
        article,
        errors: null,
        busy: false,
      });
    }
    catch (e) {
      await set({
        errors: e.response?.data?.errors,
        busy: false,
      });
    }
  }
  else {
    await set({
      article: emptyArticle,
      busy: false,
    });
  }
};

export const postArticle = async ({ data, state, set }) => {
  const { api, article } = state;
  const { slug } = article;

  // When a new article is created, the slug is undefined
  const apiFn = slug ? api.Articles.update : api.Articles.create;

  await set({ busy: true });

  try {
    const updated = await apiFn(slug, article);

    await set({
      article: updated,
      busy: false,
    });

    data.navigate(`/editor/${updated.slug}`);
  }
  catch (e) {
    await set({
      errors: e.response?.data?.errors,
      busy: false,
    });
  }
};

export const deleteArticle = async ({ data, state, set }, slug) => {
  await set({ busy: true });

  try {
    // If no error is thrown, request was successful.
    await state.api.Articles.delete(slug);

    data.navigate('/');
  }
  catch (e) {
    await set({
      errors: e.response?.data?.errors,
      busy: false,
    });
  }
};

export const postComment = async ({ state, set }, { slug, comment }) => {
  const { api, article } = state;

  try {
    await api.Articles.postComment(slug, comment);

    // Refresh comments from the back end at this point
    article.comments = await api.Articles.getComments(slug);

    await set({ article: article });
  }
  catch (e) {
    await set({
      errors: e.response?.data?.errors,
    });
  }
};

export const deleteComment = async ({ state, set }, { slug, commentId }) => {
  const { api } = state;

  try {
    await api.Articles.deleteComment(slug, commentId);

    const { article } = state;
    article.comments = await api.Articles.getComments(slug);

    await set({ article });
  }
  catch (e) {
    await set({
      errors: e.response?.data?.errors,
    });
  }
};

export const addTag = async ({ state, set }, tag) => {
  const { article } = state;

  const tagSet = new Set(article.tagList).add(tag);

  await set({
    article: {
      ...article,
      tagList: [...tagSet],
    },
  });
};

export const removeTag = async ({ state, set }, tag) => {
  const { article } = state;

  const tagSet = new Set(article.tagList);
  tagSet.delete(tag);

  await set({
    article: {
      ...article,
      tagList: [...tagSet],
    },
  });
};

export const setTab = async ({ data, set }, to) => {
  // Allow this to be configurable in the parent Store depending on the component
  // that dispatches this action
  const { defaultLimit = 10 } = data;

  // We need to reset page and limit explicitly because these values are synchronized
  // with the URL search parameters, and are retained when URL changes via programmatic
  // navigation below.
  await set({
    page: 0,
    limit: defaultLimit,
  });

  data.navigate(to);
};

const doFavors = async (type, { state, set }, slug) => {
  const { favorited, favoritesCount } = await state.api.Articles[type](slug);
  await set({
    article: {
      ...state.article,
      favorited,
      favoritesCount,
    },
  });
};

export const favorite = (...args) => doFavors('favorite', ...args);
export const unfavorite = (...args) => doFavors('unfavorite', ...args);

