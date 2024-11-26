import IUser from "@/business/data/models/IUser";
import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/apiRoutes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

enum ProfileStatus {
  IDLE = "IDLE",
  LOADING = "LOADING",
}

export interface ProfileState {
  currentUser?: IUser;
  status: ProfileStatus;
}

const getCurrentProfile = createAsyncThunk<IUser>(
  "profile/getCurrentProfile",
  async () => {
    let responseData = await AxiosClient.get(APIRoutes.getProfile, {
      headers: {
        AuthRoutes: true,
      },
    });

    return responseData.data;
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    currentUser: undefined,
    status: ProfileStatus.IDLE,
  } as ProfileState,
  reducers: {
    resetProfile: (state) => {
      state.currentUser = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentProfile.pending, (state) => {
      state.status = ProfileStatus.LOADING;
    });
    builder.addCase(getCurrentProfile.fulfilled, (state, action) => {
      state.currentUser = action.payload;
      state.status = ProfileStatus.IDLE;
    });
    builder.addCase(getCurrentProfile.rejected, (state) => {
      state.status = ProfileStatus.IDLE;
    });
  },
});

export const profileReducer = profileSlice.reducer;
export const profileActions = {
  getCurrentProfile,
  ...profileSlice.actions,
};
