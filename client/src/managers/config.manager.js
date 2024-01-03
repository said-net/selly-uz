import { createSlice } from "@reduxjs/toolkit";

const configManager = createSlice({
    name: 'config',
    initialState: {
        animation: !localStorage.getItem('animate') || localStorage.getItem('animate') === 'ok' ? true : false,
        load: false,
        refresh: false
    },
    reducers: {
        setAnimation: (state, { payload }) => {
            if (!payload) {
                state.animation = false;
                localStorage.setItem('animate', 'off');
            } else {
                state.animation = true;
                localStorage.setItem('animate', 'ok');
            }
        },
        setLoad: (state, { payload }) => {
            state.load = payload
        },
        setRefresh: state => {
            state.refresh = !state.refresh
        }
    }
});
export const { setAnimation, setLoad, setRefresh } = configManager.actions;
export default configManager.reducer