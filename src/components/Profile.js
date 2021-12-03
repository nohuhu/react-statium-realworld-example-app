import React, { useEffect } from 'react';
import Store, { useStore } from 'statium';
import { Link, useParams } from 'react-router-dom';

import Tab from './Tab.js';
import LoadMask from './LoadMask.js';
import Userpic from './Userpic.js';
import FeedView from './Article/Feed.js';
import FollowButton from './FollowButton.js';

import { loadProfile } from '../actions/profile.js';
import { setTab } from '../actions/article.js';

const defaultLimit = 5;

// We don't allow displaying more than 15 article stubs on the Profile page.
// This is an arbitrary limitation to showcase reusing and dynamically configuring
// the Article/LimitSelect component via Store data.
const limitOptions = [
  { value: 5 },
  { value: 10 },
  { value: 15 },
];

const initialState = {
  busy: false,
  profile: null,
};

const Profile = ({ tab }) => {
  const { username } = useParams();

  return (
    <Store tag="Profile"
      data={{
        username,
        tab,
        defaultLimit,
        articleLimitOptions: limitOptions,
      }}
      state={initialState}
    >
    {( { state: { busy } }) => (
      <div className="profile-page">
        <LoadMask loading={busy} />

        <ProfileView />
      </div>
    )}
    </Store>
  );
};

const ProfileView = () => {
  const { data, state, dispatch } = useStore();

  const { tab, username } = data;
  const { busy, profile } = state;
  const { image, bio, following } = profile || {};

  useEffect(() => {
    dispatch(loadProfile, username);
  }, [username, dispatch]);

  if (!profile) {
    return null;
  }
  
  const tabs = (
    <>
      <Tab id="authored"
          to={`/@${username}`}
          name="My Articles"
          currentTab={tab}
          setTab={setTab} />
      
      <Tab id="favorites"
        to={`/@${username}/favorites`}
        name="Favorited Articles"
        currentTab={tab}
        setTab={setTab} />
    </>
  );

  return (
    <>
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <Userpic className="user-img" src={image} alt={username} />

              <h4>
                <Link to={`/@${username}`}>{username}</Link>
              </h4>
              <p>{bio}</p>

              {!busy && username === profile.username &&
                <Link to="/settings"
                  className="btn btn-sm btn-outline-secondary action-btn">
                  <i className="ion-gear-a" />
                  &nbsp;
                  Edit Profile Settings
                </Link>
              }

              {!busy && username !== profile.username &&
                <FollowButton username={username} following={following} />
              }
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <FeedView tabs={tabs} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
