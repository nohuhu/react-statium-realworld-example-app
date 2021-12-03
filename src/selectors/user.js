export const getUser = ({ state }) => state.user;

export const isCurrentUser = ({ state }) =>
  state.user && state.user?.username === state.profile?.username;

export const getUserImage = ({ state }) => state.user?.image;
export const getUserName = ({ state }) => state.user?.username;
export const getUserBio = ({ state }) => state.user?.bio;
export const getUserEmail = ({ state }) => state.user?.email;
