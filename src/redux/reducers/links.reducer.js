
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    minksData: [],
};

let minkSlice = createSlice({
    name: 'minks',
    initialState: initialState,
    reducers: {
        initMinksData: (state, action) => {
            state.minksData = action.payload;
            // console.log(state.minksData);
        },
        addNewMink: (state, action) => {
            state.minksData = [...state.minksData, action.payload];
        },
        deleteMink: (state, action) => {
            console.log(action.payload);

            const index = state.minksData.findIndex(minkItem => minkItem._id === action.payload);

            let newMinksData = [...state.minksData];

            if(index !== -1){
                newMinksData.splice(index, 1);
            }else{
                console.warn('Cannot remove link that is not in Mink State');
            }

            state.minksData = [...newMinksData];
        },
        updateMink: (state, action) => {
            console.log(action.payload);
            const index = state.minksData.findIndex(minkItem => minkItem._id === action.payload.id);

            let newMinksData = [...state.minksData]; // {xyz}, {xyz}, {xyz}, {xyz}

            if(index !== -1){
                newMinksData[index].short_link = action.payload.short_link_update;
            }else {
                console.error('Cannot update link that is not in Mink State');
            }

            state.minksData = [...newMinksData];
            console.log(state.minksData);
        }
    }
});

export const { initMinksData, addNewMink, deleteMink, updateMink} = minkSlice.actions;
export default minkSlice.reducer;