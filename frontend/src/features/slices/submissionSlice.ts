import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSubmissions } from "../thunks/getSubmissionThunk";

interface Submission {
    submission_id: number;
    submission_text: string;
    submission_file: string | null;
    submit_date: string;
}


interface SubmissionsState {
    submissions: Submission[];
    loading: boolean;
    error: string | null;
}

const initialState: SubmissionsState = {
    submissions: [],
    loading: false,
    error: null,
};


const submissionsSlice = createSlice({
    name: "submissions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubmissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubmissions.fulfilled, (state, action: PayloadAction<Submission[]>) => {
                state.loading = false;
                state.submissions = action.payload;
            })
            .addCase(fetchSubmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "An error occurred while fetching submissions.";
            });
    },
});

export default submissionsSlice.reducer;
