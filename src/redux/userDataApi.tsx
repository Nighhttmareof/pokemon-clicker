import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserDataInterface } from "@/API/userInfo";
import { FinalItem } from './itemsApi';

interface SpendMoneyResponse {
    success: boolean;
    money: number;
  }

export const userDataApi = createApi({
    reducerPath: 'userDataApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:9999/users',
    }),
    endpoints: (builder) => ({
        getUser: builder.query<UserDataInterface, number>({
            query: (id) => `${id}`,
        }),
        spendMoney: builder.mutation<SpendMoneyResponse, { user: UserDataInterface; amount: number }>({
            query: ({ user, amount }) => ({
                url: `/${user.id}`,
                method: 'PUT',
                body: { ...user, money: amount },
            }),
        }),
        setItemsToUser: builder.mutation<UserDataInterface, {user: UserDataInterface; items:FinalItem[]}>({
            query: ({user, items}) => ({
                url: `/${user.id}`,
                method: 'PUT',
                body: { ...user, items: [...items] },  
            })
        }),
        setUser: builder.mutation<UserDataInterface, {user:UserDataInterface, money?:number, items?:FinalItem[]}>({
            query: ({user, money, items}) => ({
                url: `/${user.id}`,
                method: 'PUT',
                body: {...user, money: money, items:items },
            })
        })
    }),
});

export const { useLazyGetUserQuery, useSpendMoneyMutation, useSetItemsToUserMutation, useSetUserMutation } = userDataApi;
