import { createAction, createReducer } from "@reduxjs/toolkit";
import { emojiInterface } from "./emojitypes";

interface emoji extends emojiInterface{
  selected:boolean
}
interface initialStateInteface{
  emojis:emoji[],
  selectCount:number
}

export const initialemojisState: initialStateInteface ={
  emojis:[],
  selectCount:0
}

export const selectEmoji = createAction<emoji>('emoji/select')
export const addEmojis = createAction<emoji[]>('emoji/add')

export const emojisReducer = createReducer(initialemojisState,(builder)=>{
  builder
  .addCase(selectEmoji,(state,{payload})=>{
    state.emojis.map((emoji)=>{
      if (emoji.id === payload.id){
        emoji.selected = true
        state.selectCount += 1
      }
      else{
        emoji.selected = false
      }
    })
  })
  .addCase(addEmojis,(state,{payload})=>{
    state.emojis = payload
    state.emojis.map((emoji)=>{
      emoji.selected = false
    })
  })
})