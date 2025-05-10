import { AppDispatcher } from "./Dispatcher";
import { State } from "./Store";

export const AddActionTypes = {
  TOGGLE_ADD: "TOGGLE_ADD",
};

export const StoreActionTypes = {
  LOAD_STATE: "LOAD_STATE",
};

export const AddActions = {
  toggleLike: (plantId: string) => {
    AppDispatcher.dispatch({
      type: AddActionTypes.TOGGLE_ADD,
      payload: plantId,
    });
  },
};

export const StoreActions = {
  loadState: (state: State) => {
    AppDispatcher.dispatch({
      type: StoreActionTypes.LOAD_STATE,
      payload: state,
    });
  },
};
