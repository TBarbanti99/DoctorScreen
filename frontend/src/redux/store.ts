
import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './slices/UserSlice';
import { integrationReducer } from './slices/IntegrationSlice';
import { dashboardReducer } from './slices/DashboardSlice';
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

const userPersistConfig = {
    key: "user",
    storage
};

const integrationPersistConfig = {
    key: "integration",
    storage
};

const dashboardPersistConfig = {
    key: "dashboard",
    storage
};

const userPersistReducer = persistReducer(userPersistConfig, userReducer);
const integrationPersistReducer = persistReducer(integrationPersistConfig, integrationReducer);
const dashboardPersistReducer = persistReducer(dashboardPersistConfig, dashboardReducer);

export const store = configureStore({
    reducer: {
        user: userPersistReducer,
        integration: integrationPersistReducer,
        dashboard: dashboardPersistReducer // Use persisted dashboard reducer
    },
});

export const persistor = persistStore(store);
