// store.js
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Import your reducers here
import rootReducer from "./rootReducer";

const persistConfig = {
  key: "root", // Key under which the state will be saved in storage
  storage, // Use localStorage as the storage mechanism
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
