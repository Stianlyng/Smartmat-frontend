import { createApp, h } from 'vue'
import LoadingPopup from '../components/LoadingPopup.vue'

//This function is used to show a loading popup from anywhere in the app
function showLoadingPopup() {
  const loadingComponent = createApp({
    render() {
      return h(LoadingPopup)
    }
  })

  const root = document.createElement('div')
  document.body.appendChild(root)

  loadingComponent.mount(root)
}

function hideLoadingPopup() {
  const loadingElement = document.querySelector('.loading-popup')

  if (loadingElement) {
    loadingElement.remove()
  }
}

export { showLoadingPopup, hideLoadingPopup }
