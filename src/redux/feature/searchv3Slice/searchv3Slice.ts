import { getData } from "@/services/data.manager";
import {
  v3bucketsInterface,
  responseInterface,
  searchv3Interface,
  searchtabInterface,
} from "@/shared";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initialState: searchv3Interface = {
  searchtext: "",
  suggestions: {
    isloading: "idle",
    data: [],
    error: "",
    show: false,
  },
  showSections: true,
  activeTab: {
    displayName: "All",
    code: "all",
  },
  tabsdata: [],
  searchResultstate: "idle",
};

export interface searchparamsInterface {
  query: string;
  last_search_order: string;
  page_size: number;
  bucket: string;
}

export const fetchSearchBucket = createAsyncThunk<
  responseInterface,
  searchparamsInterface
>("fetchSearchBucket", async (params) => {
  const result = await getData("/search/api/v3/get/search/query", params);
  return result;
});

export const fetchSearchSuggestions = createAsyncThunk<
  responseInterface,
  string
>("fetchSearchsuggestions", async (query) => {
  let params = {
    // eslint-disable-next-line camelcase
    last_search_order: "typesense",
    query,
  };
  const result = await getData("/search/api/v1/search/suggestions", params);
  return result;
});

interface searchpaginationparamsInterface extends searchparamsInterface {
  last_doc: string;
}

export const searchBucketPagiation = createAsyncThunk<
  responseInterface,
  searchpaginationparamsInterface
>("searchBucketPagiation", async (params) => {
  const result = await getData("/search/api/v3/get/search/query", params);
  return result;
});

const searchV3Slice = createSlice({
  name: "searchv3",
  initialState,
  reducers: {
    setsearchText: (state, action: PayloadAction<string>) => {
      state.searchtext = action.payload;
    },
    emptysearchSuggestions: (state) => {
      state.suggestions.data = [];
    },
    togglesearchSections: (state, action: PayloadAction<boolean>) => {
      if (state.tabsdata.length >= 0) {
        state.showSections = false;
      } else {
        state.showSections = action.payload;
      }
    },
    togglesearchSuggestions: (state, action: PayloadAction<boolean>) => {
      state.suggestions.show = action.payload;
    },
    handlesearchSelectTab: (
      state,
      action: PayloadAction<searchtabInterface>,
    ) => {
      const { payload } = action;
      state.activeTab = payload;
    },
    resetSearchSlice: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchSuggestions.pending, (state) => {
        state.suggestions.isloading = "pending";
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.suggestions.isloading = "fulfilled";
        const { payload } = action;
        if (state.searchtext.length === 0) return;
        if (payload.status === true && state.suggestions.show === true) {
          state.suggestions.data = payload.response.splice(0, 10);
        }
      })
      .addCase(fetchSearchSuggestions.rejected, (state) => {
        state.suggestions.isloading = "rejected";
      })

      .addCase(fetchSearchBucket.pending, (state) => {
        state.searchResultstate = "pending";
      })
      .addCase(fetchSearchBucket.fulfilled, (state, action) => {
        const { payload } = action;
        state.searchResultstate = "fulfilled";
        if (payload.status === true) {
          let response = payload.response as v3bucketsInterface & {
            lastDoc: string;
            lastSearchOrder: "typesense" | "done";
          };
          let tabdata: v3bucketsInterface = {
            lastDoc: response.lastDoc,
            lastSearchOrder: response.lastSearchOrder,
            searchResults: {
              sourceType: response.searchResults.sourceType,
              displayName: response.searchResults.displayName,
              count: response.searchResults.count,
              data: response.searchResults.data,
              pagination: "idle",
            },
          };
          state.tabsdata.push(tabdata);
        } else {
          let tabdata: v3bucketsInterface = {
            lastDoc: "1",
            lastSearchOrder: "done",
            searchResults: {
              sourceType: state.activeTab.code,
              displayName: "",
              count: 0,
              data: [],
              pagination: "idle",
            },
            error: {
              message: payload.error?.message,
              code: payload.error?.code,
              details: payload.error?.details,
              type: payload.error?.type,
            },
          };
          state.tabsdata.push(tabdata);
        }
      })
      .addCase(fetchSearchBucket.rejected, (state) => {
        state.searchResultstate = "rejected";
      })

      .addCase(searchBucketPagiation.pending, (state) => {
        state.tabsdata.map((tabdata) => {
          if (tabdata.searchResults.sourceType === state.activeTab.code) {
            tabdata.searchResults.pagination = "pending";
          }
        });
      })
      .addCase(searchBucketPagiation.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload.status !== true) return;

        let response = payload.response as v3bucketsInterface & {
          lastDoc: string;
          lastSearchOrder: "typesense" | "done";
        };
        let tabs = state.tabsdata;

        for (let i = 0; i < tabs.length; i++) {
          if (
            tabs[i].searchResults.sourceType ===
            response.searchResults.sourceType
          ) {
            tabs[i].lastDoc = response.lastDoc;
            tabs[i].lastSearchOrder = response.lastSearchOrder;
            tabs[i].searchResults.count = response.searchResults.count;
            tabs[i].searchResults.data.push(...response.searchResults.data);
            tabs[i].searchResults.pagination = "fulfilled";
            break;
          }
        }
      })
      .addCase(searchBucketPagiation.rejected, (state) => {
        state.tabsdata.map((tabdata) => {
          if (tabdata.searchResults.sourceType === state.activeTab.code) {
            tabdata.searchResults.pagination = "rejected";
          }
        });
      });
  },
});

export default searchV3Slice.reducer;
export const {
  setsearchText,
  emptysearchSuggestions,
  togglesearchSections,
  togglesearchSuggestions,
  handlesearchSelectTab,
  resetSearchSlice,
} = searchV3Slice.actions;
