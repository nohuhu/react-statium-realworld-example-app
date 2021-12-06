import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Store from 'statium';

import getApi from './api.js';
import { setUser } from './actions/user.js';

import LoadMask from './components/LoadMask.jsx';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import Register from './pages/Register.jsx';
import Article from './pages/Article.jsx';
import Editor from './pages/Editor.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';

const initialState = {
  user: null,
  api: getApi(),
  appReady: false,
};

const App = () => {
  const navigate = useNavigate();

  return (
    <Store tag="App" data={{ navigate }} state={initialState} onMount={initialize}>
      {({ state }) => {
        if (!state.appReady) {
          return (
            <div className="container">
              <LoadMask loading={true} />
            </div>
          );
        }

        return (
          <>
            <Header />

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<Register />} />
              <Route path="/article/:slug" element={<Article />} />
              <Route path="/editor/:slug" element={<Editor />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/@:username/favorites" element={<Profile tab="favorites" />} />
              <Route path="/@:username" element={<Profile tab="authored" />} />
              <Route path="/tag/:selectedTag" element={<Home tab="tag" />} />
              <Route path="/feed" element={<Home tab="feed" />} />
              <Route path="/" element={<Home tab="global" />} />
            </Routes>

            <Footer />
          </>
        );
      }}
    </Store>
  );
}

const initialize = async ({ set, dispatch }) => {
  const token = window.localStorage.getItem('jwtToken');

  if (token) {
    try {
      const api = getApi(token);
      const user = await api.User.current();

      await dispatch(setUser, user);
    }
    catch (e) {
      // Token expired, etc. Default API is tokenless, so no need to set it again.
      await dispatch(setUser, null);
    }
  }

  // User was not logged in previously, or token has expired.
  // Default state represents non-logged in experience so we are ready at this point.
  await set({ appReady: true });
};

export default App;
