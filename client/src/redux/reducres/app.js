import { TEST } from "../actionTypes";
const initialState = {};
export default function(state = initialState, action) {
  switch (action.type) {
    case TEST: {
      return state;
    }
    default: {
      return state;
    }
  }
}
