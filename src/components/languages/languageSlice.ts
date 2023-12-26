import { contentLanguageInterface } from "@/shared";
import { createAction, createReducer } from "@reduxjs/toolkit";

export type languageType = contentLanguageInterface & { isSelected: boolean }
interface languageStateInterface {
  languages: languageType[]
  selectedCount:number
}


const initialState: languageStateInterface = {
  languages: [],
  selectedCount:0
}

export const selectallAction = createAction('languages/selectall')
export const clearallAction = createAction('languages/clearall')
export const togglelanguageAction = createAction<languageType>('languages/togglelanguage')

export const languageReducer = createReducer(initialState,(builder)=>{
  builder
    .addCase(selectallAction,(state)=>{
        state.languages.map((language)=>{
          language.isSelected = true
        })
        state.selectedCount = state.languages.length
    })
    .addCase(clearallAction,(state)=>{
        state.languages.map((language) => {
          language.isSelected = false
        })
        state.selectedCount = 0
    })
    .addCase(togglelanguageAction,(state,action)=>{
        state.languages.map((language)=>{
          if(language.code === action.payload.code){
            language.isSelected = !language.isSelected
          }
        })
        state.selectedCount = state.languages.filter((language=>language.isSelected)).length
    })
    .addDefaultCase(()=>{
      //default case
    })
})