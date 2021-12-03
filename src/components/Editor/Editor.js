import React, { useEffect } from 'react';
import Store, { useStore } from 'statium';
import { useParams } from 'react-router';

import LoadMask from '../LoadMask.js';
import ErrorList from '../ErrorList.js';
import TagInput from './TagInput.js';

import { emptyArticle, loadArticle, postArticle } from '../../actions/article.js';

const initialState = {
  busy: false,
  errors: null,
  article: emptyArticle,
};

const Editor = () => {
  const { slug } = useParams();

  // Note that the slug parameter comes from the URL, and changes dynamically
  // between renderings. Because of this, we cannot make it a Store state key
  // and pass as data key instead so that it will be available for all downstream
  // components without having to expose them to implementation detail of where
  // this parameter comes from.
  return (
    <Store tag="Editor" data={{ slug }} state={initialState}>
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <EditorForm />
            </div>
          </div>
        </div>
      </div>
    </Store>
  );
};

export const EditorForm = () => {
  const { data, state, set, dispatch } = useStore();
  const { busy, article, errors } = state;
  const { slug } = data;

  // We don't _really_ need to include dispatch function in the list of dependencies
  // for useEffect hook since the function identity is stable and will not ever change.
  // ESLint rules for hooks are not aware of that though, and will complain about
  // missing dependency.
  useEffect(() => {
    dispatch(loadArticle, { slug, loadComments: false, loadProfile: false });
  }, [slug, dispatch]);

  // One of the fields in this form is the tag editor that has special
  // functionality: pressing Enter key in it should take its current value
  // and add it as a tag to the list of article tags. We use keyUp event
  // to handle this in the TagInput component.
  // Unfortunately, the default action for pressing Enter key in a form field
  // (triggering the submit button and firing the submit event) is fired before
  // the keyUp event in the input element itself.
  // Rather than working around this in a complicated way and sacrifice
  // demo code readability, we limit the form submission to clicking
  // the submit button instead.
  return (
    <>
      <LoadMask loading={busy} />

      <ErrorList errors={errors || {}} />

      <form>
        <fieldset>
          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Article Title"
              value={article.title}
              onChange={e => set({ article: { ...article, title: e.target.value } })}
              />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="What this article is about?"
              value={article.description}
              onChange={e => set({ article: { ...article, description: e.target.value } })}
              />
          </fieldset>

          <fieldset className="form-group">
            <textarea
              className="form-control"
              rows="8"
              placeholder="Write your article here (in markdown)"
              value={article.body}
              onChange={e => set({ article: { ...article, body: e.target.value } }) }
               />
          </fieldset>

          <fieldset className="form-group">
            <TagInput />
          </fieldset>

          <button type="button" className="btn btn-lg btn-primary pull-xs-right"
            onClick={() => dispatch(postArticle)}
            disabled={!isReady(state)}
          >
            {slug ? "Update Article" : "Publish Article"}
          </button>
        </fieldset>
      </form>
    </>
  );
};

// The most basic check is having non-empty title and body
const isReady = ({ article }) => article && article.title && article.body;

export default Editor;
