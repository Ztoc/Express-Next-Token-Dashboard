import { combineReducers } from "redux";
import multicall from "./slices/multicall/reducer";
import user from "./slices/user/reducer";
import burn from "./slices/burn/reducer";
import mint from "./slices/mint/reducer";
import swap from "./slices/swap/reducer";
import transactions from "./slices/transactions/reducer";
const rootReducer = combineReducers({
  multicall,
  user,
  burn,
  mint,
  swap,
  transactions,
});

export default rootReducer;
