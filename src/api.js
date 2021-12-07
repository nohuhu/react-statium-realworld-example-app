const baseURL = 'https://api.realworld.io/api';

let headers = {
  'Content-Type': 'application/json',
};

const requests = {
  get: async url => {
    const response = await fetch(baseURL + url, {
      headers,
    });

    return response.json();
  },

  post: async (url, payload) => {
    const response = await fetch(baseURL + url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    return response.json();
  },

  put: async (url, payload) => {
    const response = await fetch(baseURL + url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });

    return response.json();
  },

  delete: async url => {
    const response = await fetch(baseURL + url, {
      method: 'DELETE',
      headers,
      body: '',
    });

    // Most of the DELETE requests respond with an empty body,
    // which causes exceptions on trying to parse it as JSON
    // if we simply return response.json() like in other methods.
    // There are two endpoints that do respond with meaningful
    // JSON payload so we check for it here.
    const text = await response.text();

    return text ? JSON.parse(text) : {};
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

  delete: slug => requests.delete(`/articles/${slug}`),

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

const getApi = token => {
  headers = {
    ...headers,
    ...token ? { authorization: `Token ${token}` } : {},
  };

  return API;
};

export default getApi;