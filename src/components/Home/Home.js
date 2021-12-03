import React from 'react';
import Store, { useStore } from 'statium';
import { useParams } from 'react-router';

import LoadMask from '../LoadMask.js';
import Tab from '../Tab.js'

import Banner from './Banner.js';
import FeedView from '../Article/Feed.js';
import Tags from './Tags.js';

import { setTab } from '../../actions/article.js';

const defaultLimit = 10;

const initialState = {
  busy: false,
  tags: null,
};

const Home = ({ tab }) => {
  const { selectedTag } = useParams();
  const { state } = useStore();

  const tabs = (
    <>
      {state.user &&
        <Tab id="feed" to="/feed" name="Your Feed" currentTab={tab} setTab={setTab} />
      }

      <Tab id="global" to="/" name="Global Feed" currentTab={tab} setTab={setTab} />

      {selectedTag &&
        <Tab id="tag"
          to={`/tag/${selectedTag}`}
          name={`# ${selectedTag}`}
          currentTab={tab}
          setTab={setTab}
        />
      }
    </>
  );

  return (
    <Store tag="Home" data={{ tab, selectedTag, defaultLimit }} state={initialState}>
    {({ state: { user, busy } }) => (
      <div className="home-page">
        {!user && <Banner />}

        <div className="container page">
          <LoadMask loading={busy} />

          <div className="row">
            <div className="col-md-9">
              <FeedView tabs={tabs} />
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>

                <Tags />
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </Store>
  );
}

export default Home;
