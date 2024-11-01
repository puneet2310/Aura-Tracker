import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    user: null,
    userAcadGoals: [],
    userAcadAura: 0,
}
const userSlice = createSlice({ // createSlice is a function that takes an object as an argument
    name: 'user',
    initialState,
    reducers:{
        addUser: (state, action) => {
            state.user = action.payload;
        },
        addUserAcadGoals: (state, action) => {
            state.userAcadGoals = [...state.userAcadGoals, action.payload];
            console.log("User Acad Goals from store: ", state.userAcadGoals);
        },
        updateUserAcadGoals: (state, action) => {
            const { id, updates } = action.payload;
            state.userAcadGoals = state.userAcadGoals.map(goal =>
                goal.id === id ? { ...goal, ...updates } : goal
            );
        },
        addUserAcadAura: (state, action) => {
            state.userAcadAura = action.payload;
        },

        resetUserState: () => initialState,
    }
});

export const { addUser, addUserAcadGoals, addUserAcadAura} = userSlice.actions; // export the actions to the store

export default userSlice.reducer;