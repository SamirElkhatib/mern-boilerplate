import { TEST } from "../actionTypes";

export const testApp = () => {
  return dispatch => {
    dispatch({ type: TSET });
  };
};
