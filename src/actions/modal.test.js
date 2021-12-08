import { modalKey } from "../symbols.js";
import { modal } from "./modal.js";

describe("modal action", () => {
  let state, set;

  beforeEach(() => {
    state = {};
    set = jest.fn();
  });

  it("should throw an exception if another modal is already displayed", async () => {
    state = {
      [modalKey]: {}
    };

    expect(() => {
      modal({ state, set }, {})
    }).toThrow('Displaying multiple modals simultaneously is not supported');
  });
});