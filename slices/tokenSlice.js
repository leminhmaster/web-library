import {createSlice} from "@reduxjs/toolkit";

const tokenSlice = createSlice( {
    name: 'token',
    initialState: {
        token: null
    },
    reducers: {
        setJwtToken: (state, action) => {
            state.token = action.payload
        }
    },
    extraReducers: {}
});
export const {setJwtToken} = tokenSlice.actions
export default tokenSlice.reducer;