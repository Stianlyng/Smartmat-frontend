import { createApp, h } from 'vue'
import ErrorPopup from '../components/ErrorPopup.vue'

//This function is used to throw an error popup from anywhere in the app
function throwErrorPopup(message) {
  const app = document.querySelector('#error-container')
  const errorInstance = createApp({
    render: () => h(ErrorPopup, { message })
  }).mount(app.appendChild(document.createElement('div')))
}

export { throwErrorPopup }
