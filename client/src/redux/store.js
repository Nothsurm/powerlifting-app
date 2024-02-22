import { configureStore, combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./theme/theme.js";
import { persistReducer, persistStore }  from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./api/apiSlice.js";
import authReducer from './features/auth/authSlice.js'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    theme: themeReducer,
    auth: authReducer,
})

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).concat(apiSlice.middleware),
    devTools: true,
})

export const persistor = persistStore(store)