import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name: "user",
    initialState: {
        data: null,
        admin: null, // This will be our check for admin login
    },
    reducers: {
        login: (state, action) => {
            state.data = action.payload.user;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.data = null;
            localStorage.removeItem("user");
        },
        lsLogin: (state) => {
            const lsUser = localStorage.getItem("user");
            if (lsUser) {
                state.data = JSON.parse(lsUser);
            }
            // Check for admin in local storage
            const lsAdmin = localStorage.getItem("admin");
            if (lsAdmin) {
                state.admin = JSON.parse(lsAdmin);
            }
        },
        // SIMPLIFIED ADMIN LOGIN
        adminLogin: (state, action) => {
            state.admin = action.payload.user;
            localStorage.setItem("admin", JSON.stringify(action.payload.user));
        },
        adminLogout: (state) => {
            state.admin = null;
            localStorage.removeItem("admin");
        }
    }
});

export const { login, logout, lsLogin, adminLogin, adminLogout } = UserSlice.actions;
export default UserSlice.reducer;