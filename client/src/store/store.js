import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import conversationReducer from './conversationSlice';
import socketReducer from './socketSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        conversation: conversationReducer,
        socket: socketReducer,
    },
    
});

export default store;