import { configureStore } from '@reduxjs/toolkit'
import { userDataApi } from '../userDataApi';
import userSlice from '../userSlice';
import { pokemonsApi } from '../pokemonsApi';
import { itemsApi } from '../itemsApi';

const store = configureStore({
  reducer: {
    userSlice: userSlice,
    [userDataApi.reducerPath]: userDataApi.reducer,
    [pokemonsApi.reducerPath]: pokemonsApi.reducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userDataApi.middleware, pokemonsApi.middleware, itemsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;