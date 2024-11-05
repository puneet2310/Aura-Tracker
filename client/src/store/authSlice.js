import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    status: false,
    userData: null
}
const authSlice = createSlice({ // createSlice is a function that takes an object as an argument
    name: 'auth',
    initialState,
    reducers:{
        login: (state, action) => {
            state.status = true; // ap logged in ho gye
            state.userData = action.payload
        },
        logout: (state) => {
            state.status = false; // ap logged out ho gye
            state.userData = null
        }
    }
});

export const {login, logout} = authSlice.actions; // Export the actions to be used in components

export default authSlice.reducer; // Export the reducer function to be included in the store