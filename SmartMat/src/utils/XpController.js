import { createApp, h } from 'vue'
import XpPopup from '../components/XpPopup.vue'

//This function is used to throw an error popup from anywhere in the app
function throwXpPopup() {
  const app = document.querySelector('#xp-container')
  const xpInstance = createApp({
    render: () => h(XpPopup)
  }).mount(app.appendChild(document.createElement('div')))
}

export { throwXpPopup }
