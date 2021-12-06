import React from 'react';
import { mount } from 'test/enzyme.js'

import { alertsKey, AlertProvider, Alerts } from './Alerts.jsx';
import { displayAlert } from '../actions/alerts.js';

const alerts = [{
  id: 0,
  type: 'error',
  text: 'foo bar',
  dismissible: false,
}, {
  id: 1,
  text: 'blerg bonz',
}, {
  id: 2,
  type: 'success',
  text: 'throbbe zong',
}];

describe("Alerts", () => {
  let tree;

  beforeEach(() => {
    tree = mount(
      <AlertProvider>
        <Alerts />
      </AlertProvider>
    );
  });

  describe("rendering", () => {
    it("should render empty alert list by default", () => {
      expect(tree.find('AlertProvider')).toMatchSnapshot();
    });

    it("should render alert widgets correctly", async () => {
      await tree.find('Store[tag="Alerts"]').instance().set({
        [alertsKey]: alerts,
      });

      tree.update();

      expect(tree.find('AlertProvider')).toMatchSnapshot();
    });
  });

  describe("behavior", () => {
    beforeEach(async () => {
      await tree.find('Store[tag="Alerts"]').instance().dispatch(
        displayAlert,
        {
          type: "success",
          text: "plugh krabbe",
          timeout: 50,
        }
      );

      tree.update();
    });

    it("should display alert when action is dispatched", async () => {
      expect(tree.find('AlertWidget')).toMatchSnapshot();
    });

    it("should close dismissible alert on timeout", async () => {
      // Dismiss timeout is set to 50 ms
      await sleep(100);

      expect(tree.find('Alerts').contains('AlertWidget')).toBe(false);
    });

    it("should close dismissible alert on button click", async () => {
      tree.find('AlertWidget button').simulate('click');

      // Give the handler enough time to fire
      await sleep(10);

      expect(tree.find('Alerts').contains('AlertWidget')).toBe(false);
    });
  });
});