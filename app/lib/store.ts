import { configureStore } from "@reduxjs/toolkit"
import reducer from "./redux/reducer";


export const makeStore = () => {
    return configureStore({
        reducer: reducer,
    });
}