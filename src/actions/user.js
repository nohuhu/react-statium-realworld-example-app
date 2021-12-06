import getApi from '../api.js';
import { displayAlert } from './alerts.js';

export const setUser = async ({ set }, user) => {
  const token = user?.token;

  // This will return non-authenticated API if token is undefined
  const api = getApi(token);
  
  await set({ api, user });

  if (token) {
    window.localStorage.setItem('jwtToken', token);
  }
  else {
    window.localStorage.removeItem('jwtToken');
  }
};

export const login = async ({ state, set, dispatch }) => {
  await set({ busy: true });

  const { api, email, password } = state;

  try {
    const response = await api.User.login(email, password);
    const user = response?.user ?? null;

    await dispatch(setUser, user);
  }
  catch (e) {
    await set({
      busy: false,
      serverErrors: {
        'Login failed': ['Invalid e-mail or password'],
      },
    });
  }
};

// Reset the user object upstream. This will clean up the JWT token as well.
export const logout = async ({ data, dispatch }) => {
  await dispatch(setUser, null);

  data.navigate('/login');
};

export const register = async ({ data, state, set, dispatch }) => {
  const { api, username, email, password } = state;

  try {
    // Prevent user interaction while the API call is being made
    await set({ busy: true });

    const user = await api.User.register(username, email, password);

    // We get here only after the new user record has been created on the server
    await dispatch(setUser, user);
    await set({ busy: false });

    await dispatch(displayAlert, {
      type: "success",
      text: `Successfully created user ${username}!`,
    })

    data.navigate('/');
  }
  catch (e) {
    await set({
      serverErrors: e?.response?.data?.errors ?? { error: `Unspecified server error: ${e}` },
      busy: false,
    });
  }
};

export const saveUserSettings = async ({ state, set, dispatch }) => {
  const { api, image, username, bio, email, password } = state;

  await set({ busy: true });

  try {
    const user = await api.User.save({
      image,
      username,
      bio,
      email,
      password,
    });

    // Update the user object upstream
    await dispatch(setUser, user);

    await set({ busy: false });
  }
  catch (e) {
    await set({
      serverErrors: e?.response?.data?.errors ?? { error: `Unspecified server error: ${e}` },
      busy: false,
    });
  }
};
