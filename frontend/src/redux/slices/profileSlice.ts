import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Profile {
  _id?: string;
  userId?: string;
  skills: string[];
  age?: number;
  gender?: string;
  about?: string;
  github?: string;
  linkedin?: string;
  photoURL?: string;
}

interface ProfileState {
  profile: Profile | null;
  hasProfile: boolean;
}

const initialState: ProfileState = {
  profile: null,
  hasProfile: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
      state.hasProfile = true;
    },

    clearProfile(state) {
      state.profile = null;
      state.hasProfile = false;
    },

    updatePhoto(state, action: PayloadAction<string>) {
      if (state.profile) {
        state.profile.photoURL = action.payload;
      }
    },
  },
});

export const { setProfile, clearProfile, updatePhoto } = profileSlice.actions;

export default profileSlice.reducer;
