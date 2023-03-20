import {  } from 'vue'

export default {
  setup({ slots }) {
    return () => {
      //const actions = slots.actions();
      console.log(slots)
    return h(
      'os-tag',
      "deneme"
    )
  }
  },  
}