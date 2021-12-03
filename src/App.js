import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Store from 'statium';

import getApi from './api.js';
import { setUser } from './actions/user.js';

import LoadMask from './components/LoadMask.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import Home from './components/Home/Home.js';
import Login from './components/Login.js';
import Logout from './components/Logout.js';
import Register from './components/Register.js';
import Article from './components/Article/ArticlePage.js';
import Editor from './components/Editor/Editor.js';
import Profile from './components/Profile.js';
import Settings from './components/Settings.js';

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

      await set({ api });
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
