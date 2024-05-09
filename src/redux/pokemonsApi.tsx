
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BasePokemon {
    name: string;
    url: string;
}

interface BasePokemons {
    results: BasePokemon[]
}

export const pokemonsApi = createApi({
    reducerPath: 'pokemonsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://pokeapi.co/api/v2',
    }),
    endpoints: (builder) => ({
        getPokemons: builder.query<BasePokemons, {}>({
            query: () => `/pokemon?limit=100000&offset=0.`,
        }),
        selectPokemon: builder.query<BasePokemon, string>({
            query: (name) => `pokemon/${name}`,
        }),
    }),
});

export const { useGetPokemonsQuery, useSelectPokemonQuery } = pokemonsApi;