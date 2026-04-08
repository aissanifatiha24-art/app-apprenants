// frontend/src/features/users/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch apprenants
export const fetchApprenants = createAsyncThunk(
  "users/fetchApprenants",
  async () => {
    const response = await api.get("/users/apprenants");
    return response.data;
  },
);

// Fetch formateurs
export const fetchFormateurs = createAsyncThunk(
  "users/fetchFormateurs",
  async () => {
    const response = await api.get("/users/formateurs");
    return response.data;
  },
);

// Create apprenant
export const createApprenant = createAsyncThunk(
  "users/createApprenant",
  async (userData, { dispatch }) => {
    const response = await api.post("/users/apprenants", userData);
    await dispatch(fetchApprenants());
    return response.data;
  },
);

// Create formateur
export const createFormateur = createAsyncThunk(
  "users/createFormateur",
  async (userData, { dispatch }) => {
    const response = await api.post("/users/formateurs", userData);
    await dispatch(fetchFormateurs());
    return response.data;
  },
);

// Import Excel
export const importUsersFromExcel = createAsyncThunk(
  "users/importUsersFromExcel",
  async (formData, { dispatch }) => {
    const response = await api.post("/users/import-excel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    await dispatch(fetchApprenants());
    await dispatch(fetchFormateurs());
    return response.data;
  },
);

// Delete single user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async ({ id, role }, { dispatch }) => {
    await api.delete(`/users/${role}s/${id}`);
    if (role === "apprenant") {
      await dispatch(fetchApprenants());
    } else {
      await dispatch(fetchFormateurs());
    }
    return { id, role };
  },
);

// Delete multiple users - AJOUTER CETTE FONCTION
export const deleteMultipleUsers = createAsyncThunk(
  "users/deleteMultipleUsers",
  async (userIds, { dispatch }) => {
    const response = await api.post("/users/delete-multiple", { userIds });
    await dispatch(fetchApprenants());
    await dispatch(fetchFormateurs());
    return response.data;
  },
);

// Toggle user status
export const toggleUserStatus = createAsyncThunk(
  "users/toggleUserStatus",
  async ({ id, role, actif }, { dispatch }) => {
    const response = await api.put(`/users/${role}s/${id}/status`, { actif });
    if (role === "apprenant") {
      await dispatch(fetchApprenants());
    } else {
      await dispatch(fetchFormateurs());
    }
    return response.data;
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    apprenants: [],
    formateurs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch apprenants
      .addCase(fetchApprenants.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApprenants.fulfilled, (state, action) => {
        state.loading = false;
        state.apprenants = action.payload;
      })
      .addCase(fetchApprenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch formateurs
      .addCase(fetchFormateurs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFormateurs.fulfilled, (state, action) => {
        state.loading = false;
        state.formateurs = action.payload;
      })
      .addCase(fetchFormateurs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create apprenant
      .addCase(createApprenant.pending, (state) => {
        state.loading = true;
      })
      .addCase(createApprenant.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createApprenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create formateur
      .addCase(createFormateur.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFormateur.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createFormateur.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Import Excel
      .addCase(importUsersFromExcel.pending, (state) => {
        state.loading = true;
      })
      .addCase(importUsersFromExcel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(importUsersFromExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete single user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete multiple users - AJOUTER CES CAS
      .addCase(deleteMultipleUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMultipleUsers.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteMultipleUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Toggle user status
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleUserStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
