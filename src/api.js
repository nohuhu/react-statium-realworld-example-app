import _axios from 'axios';

let axios;

const defaultConfig = {
  baseURL: 'https://api.realworld.io/api',
};

const requests = {
  get: async url => {
    const response = await axios.get(url);

    return response?.data ?? {};
  },

  post: async (url, payload) => {
    const response = await axios.post(url, payload);

    return response?.data ?? {};
  },

  put: async (url, payload) => {
    const response = await axios.put(url, payload);

    return response?.data ?? {};
  },

  delete: async url => {
    const response = await axios.delete(url);

    return response?.data ?? {};
  },
};

const User = {
  current: async () => {
    const response = await requests.get('/user');

    return response?.user ?? null;
  },

  login: (email, password) => requests.post('/users/login', { user: { email, password } }),

  register: async (username, email, password) => {
    const response = await requests.post('/users', {
      user: {
        username,
        email,
        password
      },
    });

    return response?.user ?? null;
  },

  save: async user => {
    const response = await requests.put('/user', { user });

    return response?.user ?? null;
  },
}

// Shameless copypasta from react-redux realworld example
const limitedUrl = (page, limit) =>
  `limit=${limit}&offset=${page ? page * limit : 0}`;

const Articles = {
  all: (page, limit) => requests.get('/articles?' + limitedUrl(page, limit)),

  feed: (page, limit) => requests.get('/articles/feed?' + limitedUrl(page, limit)),

  byTag: (tag, page, limit) =>
    requests.get(`/articles?tag=${encodeURIComponent(tag)}&` + limitedUrl(page, limit)),

  bySlug: async slug => {
    const response = await requests.get(`/articles/${slug}`);

    return response?.article ?? null;
  },

  byAuthor: async (username, page, limit) =>
    requests.get('/articles?author=' + encodeURIComponent(username) + '&' +
      limitedUrl(page, limit)),

  favoritedBy: async (username, page, limit) =>
    requests.get('/articles?favorited=' + encodeURIComponent(username) + '&' +
      limitedUrl(page, limit)),

  create: async (slug, article) => {
    const response = await requests.post('/articles', { article });

    return response?.article ?? null;
  },

  update: async (slug, data) => {
    const article = { ...data };
    delete article.slug;

    const response = await requests.put(`/articles/${slug}`, { article });

    return response?.article ?? null;
  },

  delete: async slug => {
    const response = await requests.delete(`/articles/${slug}`);

    return response?.article ?? null;
  },

  getComments: async slug => {
    const response = await requests.get(`/articles/${slug}/comments`);

    return response?.comments ?? [];
  },

  postComment: async (slug, text) => {
    const response = await requests.post(`/articles/${slug}/comments`, {
      comment: {
        body: text,
      },
    });

    return response?.comment ?? null;
  },

  deleteComment: async (slug, commentId) =>
    requests.delete(`/articles/${slug}/comments/${commentId}`),

  favorite: async slug => {
    const response = await requests.post(`/articles/${slug}/favorite`);

    return response?.article ?? null;
  },

  unfavorite: async slug => {
    const response = await requests.delete(`/articles/${slug}/favorite`);

    return response?.article ?? null;
  },
};

const Tags = {
  all: () => requests.get('/tags'),
};

const Profile = {
  get: async username => {
    const response = await requests.get(`/profiles/${username}`);

    return response?.profile ?? null;
  },

  follow: async username => {
    const response = await requests.post(`/profiles/${username}/follow`);

    return response?.profile ?? null;
  },

  unfollow: async username => {
    const response = await requests.delete(`/profiles/${username}/follow`);

    return response?.profile ?? null;
  },
};

const API = {
  User,
  Articles,
  Tags,
  Profile,
};

const getApi = (token) => {
  axios = _axios.create({
    ...defaultConfig,
    headers: {
      ...token ? { authorization: `Token ${token}` } : {},
    },
  });

  return API;
};

export default getApi;