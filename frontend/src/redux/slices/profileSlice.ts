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
  hasProfile: boolean | null;
}

const initialState: ProfileState = {
  profile: null,
  hasProfile: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
      state.hasProfile = true;
    },

    setNoProfile(state) {
      state.profile = null;
      state.hasProfile = false;
    },

    clearProfile(state) {
      state.profile = null;
      state.hasProfile = null;
    },

    updatePhoto(state, action: PayloadAction<string>) {
      if (state.profile) {
        state.profile.photoURL = action.payload;
      }
    },
  },
});

export const { setProfile, setNoProfile, clearProfile, updatePhoto } =
  profileSlice.actions;

export default profileSlice.reducer;
