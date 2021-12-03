import React from 'react';
import Store from 'statium';

import { logout } from '../actions/user.js';

const Logout = () => (
  <Store tag="Logout" onMount={logout} />
);

export default Logout;
