import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: 'tokenData',
    initialState: null,
    reducers: {
        setUser: (__, action) => {
            return action.payload
        }    
    },
})

export const { setUser } = userSlice.actions;
export default userSlice.reducer;