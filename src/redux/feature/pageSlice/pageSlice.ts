import { getData, postData } from '@/services/data.manager';
import { pageState, responseInterface } from '@/shared';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface fetchPagedataParams {
  path: string;
  count: number;
}

export const fetchPagedata = createAsyncThunk<
  responseInterface,
  { params: fetchPagedataParams; signal?: AbortSignal }
>('fetchpagedata', async (args, thunkAPI) => {
  const { params } = args;
  thunkAPI.dispatch(resetPagestate());
  const result = await getData(
    'service/api/v1/page/content',
    params,
    thunkAPI.signal,
    true
  );
  // thunkAPI.dispatch(resetPagestate());
  return result;
});

interface fetchSectionsParams {
  path: string;
  count?: number;
  offset?: number;
  code: string;
}

type fetchSectionsResult = {
  from: 'gridPagination' | 'carouselPagination';
  result: responseInterface;
};

type fetchSectionsArgs = {
  params: fetchSectionsParams;
  from: 'gridPagination' | 'carouselPagination';
};

export const fetchSections = createAsyncThunk<
  fetchSectionsResult,
  fetchSectionsArgs
>('fetchSections', async (args, thunkAPI) => {
  const { params, from } = args;
  const result = await getData(
    '/service/api/v1/section/data',
    params,
    thunkAPI.signal
  );
  return { from, result };
});

interface toogleLikeparams {
  path: string;
  action: string;
}
export const toogleLike = createAsyncThunk<
  { result: responseInterface; path: string },
  toogleLikeparams
>('toggleLike', async (args) => {
  let result = await getData(`/service/api/auth/user/favourite/item`, {
    ...args,
  });
  return { result, path: args.path };
});



export const removeContinueWatching = createAsyncThunk<string,string>('removeContinueWatching',async (args)=>{
 await postData('/service/api/v1/delete/view/archive', { "viewType": "continue_watching", "pagePath":args })
  return args
})

const initialState: pageState = {
  loading: 'idle',
  pagination: 'idle',
  response: {
    sections: [],
    info: {
      pageType:'content'
    },
    banners: [],
    content: [],
    paginationData: [],
    pageButtons: {},
    shareInfo: {},
    tabsInfo: {
      hints: '',
      selectTab: '',
      showTabs: false,
      tabs: [],
    },
    streamStatus: {},
  },
};

const pageSlice = createSlice({
  name: 'pagedata',
  initialState: initialState,
  reducers: {
    resetPagestate: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPagedata.fulfilled, (state, { payload }) => {
        if (payload && payload.status === true) {
          state.loading = 'succeeded';
        } else {
          state.loading = 'failed';
          return;
        }
        state.response.banners = payload.response?.banners;
        state.response.info = payload.response?.info;
        let remove_tabs: string[] = [];
        payload.response?.data.map((data: any, index: number) => {
          if (data.paneType === 'section') {
            if (
              data.section.sectionData.data.length === 0 &&
              data.section.sectionData.hasMoreData === true &&
              data.section.sectionData.lastIndex < 0
            ) {
              state.response.paginationData.push({
                section_index: index,
                data: data,
              });
            } else {
              state.response.sections.push(data);
            }

            if (
              data.section.sectionData.params &&
              data.section.sectionData.params.showOnPlayer === 'true'
            ) {
              remove_tabs.push(data.section.sectionInfo.code);
            }
          } else if (data.paneType === 'content') {
            state.response.content.push(data);
          }
        });
        state.response.pageButtons = payload.response?.pageButtons;
        state.response.shareInfo = payload.response?.shareInfo;
        state.response.tabsInfo = payload.response?.tabsInfo;
        state.response.tabsInfo.tabs = state.response.tabsInfo.tabs.filter(
          (tab) => remove_tabs.indexOf(tab.code) <= -1
        );
        if (payload.response?.streamStatus) {
          state.response.streamStatus = payload.response?.streamStatus;
        }
      })
      .addCase(fetchPagedata.rejected, (state) => {
        state.loading = 'failed';
      })
      .addCase(fetchPagedata.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload.result.status === true) {
          state.pagination = 'succeeded';
        } else {
          state.pagination = 'failed';
          return;
        }
        if (payload.from === 'carouselPagination') {
          payload.result.response.map((section: any, index: number) => {
            let section_data = state.response.paginationData[index].data;
            section_data.section.sectionData = section;
            state.response.sections.push(section_data);
          });
          state.response.paginationData =
            state.response.paginationData.slice(4);
        } else if (payload.from === 'gridPagination') {
          state.response.sections.map((section) => {
            if (section.contentCode === payload.result.response[0].section) {
              section.section.sectionData.data.push(
                ...payload.result.response[0].data
              );
              section.section.sectionData.hasMoreData =
                payload.result.response[0].hasMoreData;
              section.section.sectionData.lastIndex =
                payload.result.response[0].lastIndex;
            }
          });
        }
      })
      .addCase(fetchSections.rejected, (state) => {
        state.pagination = 'failed';
      })
      .addCase(fetchSections.pending, (state) => {
        state.pagination = 'pending';
      })
      .addCase(toogleLike.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload.result.status === true) {
          state.response.sections.map((section) => {
            section.section.sectionData.data.map((card) => {
              if (card.target.path === payload.path) {
                card.hover.elements.map((element) => {
                  if (element.key === 'isFavourite') {
                    if (element.value === 'false') {
                      element.value = 'true';
                    } else {
                      element.value = 'false';
                    }
                  }
                });
              }
            });
          });
        }
      })
      .addCase(toogleLike.pending, () => {})
      .addCase(toogleLike.rejected, () => {})
      .addCase(removeContinueWatching.pending,()=>{})
      .addCase(removeContinueWatching.fulfilled,(state,action:PayloadAction<string>)=>{
        let sections = state.response.sections
        console.log(action)
        for(let i=0;i<sections.length;i++){
          console.log(action)
          if (sections[i].contentCode === "continue_watching") {
            let cards = sections[i].section.sectionData.data
            sections[i].section.sectionData.data = cards.filter((card)=>card.target.path !== action.payload)
            break;
          }
        }
      })
      .addCase(removeContinueWatching.rejected,()=>{})
  },
});

export default pageSlice.reducer;
export const { resetPagestate } = pageSlice.actions;
