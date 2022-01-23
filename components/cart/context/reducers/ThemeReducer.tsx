import { Switch } from "@mui/material";
import { useReducer } from "react";
import Cookies from "js-cookie";

const initialState = {
  darkMode:   Cookies.get("darkMode") === "ON"?true : false,
};

type ACTIONTYPES =
  | { type: "DARK_MODE_ON"; payload: boolean }
  | { type: "DARK_MODE_OFF"; payload: boolean };

function themeReducer(state: typeof initialState, action: ACTIONTYPES) {
  switch (action.type) {
    case "DARK_MODE_ON":
    //  console.log("value of state in dispatch when darkMode is set true",state)
      return { ...state, darkMode: true };
    case "DARK_MODE_OFF":
      //console.log("value of state in dispatch when darkMode is set false",state)
      return { ...state, darkMode: false };
    default:
      return state;
  }
}

const ThemeReducer = props => {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  return (
    <Switch
      checked={state.darkMode}
      onChange={() => {
        const newState= !state.darkMode;
        const actionType = newState ? "DARK_MODE_ON": "DARK_MODE_OFF";
        dispatch({ payload: newState,type: actionType });
        Cookies.set("darkMode", state.darkMode ? "ON" : "OFF");
        props.onChange(newState)
      }}
    ></Switch>
  );
}

export default ThemeReducer;
