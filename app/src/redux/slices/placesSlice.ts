import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Place {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  address: string;
}

interface PlacesState {
  currentPosition: { lat: number; lng: number } | null;
  places: Place[];
  selectedPlace: Place | null;
  error: string | null;
}

const initialState: PlacesState = {
  currentPosition: null,
  places: [],
  selectedPlace: null,
  error: null,
};

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    setCurrentPosition(state, action: PayloadAction<{ lat: number; lng: number }>) {
      state.currentPosition = action.payload;
    },
    setPlaces(state, action: PayloadAction<Place[]>) {
      state.places = action.payload;
    },
    setSelectedPlace(state, action: PayloadAction<Place | null>) {
      state.selectedPlace = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    // Clear results when a map page opens, so one page never shows another page's places or error
    resetPlaces() {
      return initialState;
    },
  },
});

export const { setCurrentPosition, setPlaces, setSelectedPlace, setError, resetPlaces } = placesSlice.actions;
export default placesSlice.reducer;
