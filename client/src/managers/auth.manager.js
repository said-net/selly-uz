import { createSlice } from "@reduxjs/toolkit";

const authManager = createSlice({
    name: 'auth',
    initialState: {
        _id: '',
        id: '',
        name: '',
        phone: '',
        supplier: false,
        admin: false,
        seller: false,
        operator: false,
        courier: false,
        refresh: false,
        active: false,
        telegram: ''
    },
    reducers: {
        setRefreshAuth: state => {
            state.refresh = !state.refresh;
        },
        setInfoAuth: (state, { payload }) => {
            state._id = payload._id;
            state.id = payload.id;
            state.name = payload.name;
            state.phone = payload.phone;
            state.supplier = payload.supplier;
            state.active = payload.active;
            state.courier = payload.courier;
            state.seller = payload.seller;
            state.operator = payload.operator;
            state.admin = payload.admin;
            state.telegram = payload.telegram;
        }
    }
});
export const { setRefreshAuth, setInfoAuth } = authManager.actions;
export default authManager.reducer