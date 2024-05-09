
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ItemFirstView {
    name: string;
    url: string;
}

export interface ItemsFirst {
    results: ItemFirstView[];
}

export interface FinalItem {
    id: number,
    category: {name: string, url: string},
    cost: number,
    name: string,
    sprites: {default: string},
    flavor_text_entries: {language: {name:string}, text:string}[],
}




export const itemsApi = createApi({
    reducerPath: 'itemsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://pokeapi.co/api/v2',
    }),
    endpoints: (builder) => ({
        getItems: builder.query<ItemsFirst, []>({
            query: () => `/item?limit=126&offset=0`,
        }),
        getItemByUrl: builder.query({
            query: (name) => `/item/${name}`,
        })
    }),
});

export const { useGetItemsQuery, useLazyGetItemByUrlQuery } = itemsApi;