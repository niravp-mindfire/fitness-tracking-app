import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { apiUrl } from '../../utils/apiUrl';

interface ChallengeState {
  challenges: any[];
  currentChallenge: any | null;
  loading: boolean;
  error: string | null;
  totalCount: number; 
}

const initialState: ChallengeState = {
  challenges: [],
  currentChallenge: null,
  loading: false,
  error: null,
  totalCount: 0,
};

// Thunks for fetching, adding, updating, and deleting challenges

export const fetchChallenges = createAsyncThunk(
    'challenges/fetchChallenges',
    async (params: any, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`${apiUrl.CHALLENGES}`, { params });
        return {
          challenges: response.data.data.challenges,
          totalCount: response.data.data.total,
        };
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const fetchChallengeById = createAsyncThunk(
  'challenges/fetchChallengeById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl.CHALLENGES}/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createChallenge = createAsyncThunk(
  'challenges/createChallenge',
  async (challengeData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${apiUrl.CHALLENGES}`, challengeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateChallenge = createAsyncThunk(
  'challenges/updateChallenge',
  async ({ id, challengeData }: { id: string; challengeData: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${apiUrl.CHALLENGES}/${id}`, challengeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteChallenge = createAsyncThunk(
  'challenges/deleteChallenge',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${apiUrl.CHALLENGES}/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const challengeSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    resetCurrentChallenge: (state) => {
      state.currentChallenge = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = action.payload.challenges;
        state.totalCount = action.payload.totalCount;  // Update totalCount
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchChallengeById.fulfilled, (state, action) => {
        state.currentChallenge = action.payload;
      });
  },
});

export const { resetCurrentChallenge } = challengeSlice.actions;

export default challengeSlice.reducer;
