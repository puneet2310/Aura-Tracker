import {createSlice} from '@reduxjs/toolkit';
import { get } from 'mongoose';

const initialState = {
    acadGoals: [],
    isLoading: false,
    error: null
}

const acadSlice = createSlice({
    name: 'acad',
    initialState,
    reducers:{
        setAcadGoals: (state, action) => {
            state.acadGoals = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        getAcadGoals: (state, action) => {
            state.acadGoals = action.payload;
            
        }
    }
});