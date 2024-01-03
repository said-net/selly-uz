import { configureStore } from "@reduxjs/toolkit";
import configManager from "./config.manager";
import authManager from "./auth.manager";

export default configureStore({
    reducer: {
        config: configManager,
        auth: authManager
    }
})