import { getData } from "@/services/data.manager";
import {
  v1bucketsInterface,
  responseInterface,
  searchv1Interface,
  searchtabInterface,
} from "@/shared";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const initialState: searchv1Interface = {
  searchtext: "",
  pagination:'idle',
  pagesize:36,
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
  pageSize: number;
  page:number;
}

export const fetchSearchv1Bucket = createAsyncThunk<
  responseInterface,
  searchparamsInterface
  >("fetchSearchv1Bucket", async (params,thunkAPI) => {
    const result = await getData("/service/api/v1/get/search/query", params, thunkAPI.signal);
  return result;
});

export const fetchSearchv1Suggestions = createAsyncThunk<responseInterface, string>(
  "fetchSearchv1Suggestions",
  async (query) => {
    let params = {
      query,
    };
    const result = await getData("/service/api/v1/search/suggestions", params);
    return result;
  }
);

interface searchpaginationparamsInterface extends searchparamsInterface {
  // last_doc: string;
}

export const searchv1BucketPagiation = createAsyncThunk<
  responseInterface,
  searchpaginationparamsInterface
>("searchv1BucketPagiation", async (params) => {
  const result = await getData("/search/api/v1/get/search/query", params);
  return result;
});

const searchV1Slice = createSlice({
  name: "searchv1",
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
        state.showSections = false
      }
      else {
        state.showSections = action.payload;
      }
    },
    togglesearchSuggestions: (state, action: PayloadAction<boolean>) => {
      state.suggestions.show = action.payload;
    },
    handlesearchSelectTab: (
      state,
      action: PayloadAction<searchtabInterface>
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
      .addCase(fetchSearchv1Suggestions.pending, (state) => {
        state.suggestions.isloading = "pending";
      })
      .addCase(fetchSearchv1Suggestions.fulfilled, (state, action) => {
        state.suggestions.isloading = "fulfilled";
        const { payload } = action;
        if (state.searchtext.length === 0) return;
        if (payload.status === true && state.suggestions.show === true) {
          state.suggestions.data = payload.response.splice(0, 10);
        }
      })
      .addCase(fetchSearchv1Suggestions.rejected, (state) => {
        state.suggestions.isloading = "rejected";
      })

      .addCase(fetchSearchv1Bucket.pending, (state) => {
        state.searchResultstate = "pending";
      })
      .addCase(fetchSearchv1Bucket.fulfilled, (state, action) => {
        const { payload } = action;
        state.searchResultstate = "fulfilled";
        if (payload.status === true) {
          let response = payload.response as v1bucketsInterface["searchResults"][]
          for(let i=0;i<response.length;i++){
            let tabsourcetype = response[i].sourceType
            let tabfound = false

            for(let j=0;j<state.tabsdata.length;j++){
              if(tabsourcetype === state.tabsdata[j].searchResults.sourceType){
                state.tabsdata[j].searchResults.data.push(...response[i].data)
                tabfound = true
                break;
              }
            }

            if(tabfound === false){
              console.log('-->llll')
              let tab_data: v1bucketsInterface = {
                searchResults: {
                  sourceType: response[i].sourceType,
                  displayName: response[i].displayName,
                  count: response[i].count,
                  data: response[i].data,
                },
              };
              state.tabsdata.push(tab_data);
            }
          }
          
        } else {
          // let tab_data: bucketsInterface = {
          //   last_doc: "1",
          //   last_search_order: "done",
          //   searchResults: {
          //     sourceType: state.activeTab.code,
          //     displayName: "",
          //     count: 0,
          //     data: [],
          //     pagination: "idle",
          //   },
          //   error: {
          //     message: payload.error?.message,
          //     code: payload.error?.code,
          //     details: payload.error?.details,
          //     type: payload.error?.type
          //   }
          // };
          // state.tabsdata.push(tab_data);
        }
      })
      .addCase(fetchSearchv1Bucket.rejected, (state) => {
        state.searchResultstate = "rejected";
      })

      .addCase(searchv1BucketPagiation.pending, (state) => {
        // state.tabsdata.map((tab_data) => {
        //   // if (tab_data.searchResults.sourceType === state.activeTab.code) {
        //   //   tab_data.searchResults.pagination = "pending";
        //   // }
        // });
        state.pagination = "pending"
      })
      .addCase(searchv1BucketPagiation.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload.status !== true) return;
        // for (let i = 0; i < tabs.length; i++) {
        //   if (
        //     tabs[i].searchResults.sourceType ===
        //     response.searchResults.sourceType
        //   ) {
        //     tabs[i].searchResults.count = response.searchResults.count;
        //     tabs[i].searchResults.data.push(...response.searchResults.data);
        //     // tabs[i].searchResults.pagination = "fulfilled";
        //     break;
        //   }
        // }
        let response = payload.response as v1bucketsInterface[]
        for (let i = 0; i < response.length; i++) {
          let tabsourcetype = response[i].searchResults.sourceType
          let tabfound = false

          for (let j = 0; j < state.tabsdata.length; j++) {
            if (tabsourcetype === state.tabsdata[j].searchResults.sourceType) {
              state.tabsdata[j].searchResults.data.push(...response[i].searchResults.data)
              tabfound = true
              break;
            }
          }

          if (tabfound === false) {
            let tab_data: v1bucketsInterface = {
              searchResults: {
                sourceType: response[i].searchResults.sourceType,
                displayName: response[i].searchResults.displayName,
                count: response[i].searchResults.count,
                data: response[i].searchResults.data,
              },
            };
            state.tabsdata.push(tab_data);
          }
        }
        state.pagination = "succeeded"
      })
      .addCase(searchv1BucketPagiation.rejected, (state) => {
        // state.tabsdata.map((tab_data) => {
        //   if (tab_data.searchResults.sourceType === state.activeTab.code) {
        //     // tab_data.searchResults.pagination = "rejected";
        //   }
        // });
        state.pagination = "failed"
      });
  }
});

export default searchV1Slice.reducer;
export const {
  setsearchText,
  emptysearchSuggestions,
  togglesearchSections,
  togglesearchSuggestions,
  handlesearchSelectTab,
  resetSearchSlice,
} = searchV1Slice.actions;
