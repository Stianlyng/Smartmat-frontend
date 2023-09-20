import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ErrorPopup from '../ErrorPopup.vue'

describe('ErrorPopup component renders', () => {
  const errorMessage = 'Dette er en eksempelfeilmelding'
  const wrapper = mount(ErrorPopup, {
    props: {
      message: errorMessage
    }
  })

  it('renders the error popup component', () => {
    const popup = wrapper.find('.error-popup')
    expect(popup.exists()).toBe(true)
  })

  it('renders the error message correctly based on input', () => {
    const message = wrapper.find('.error-popup-message p')
    expect(message.text()).toContain(errorMessage)
  })
})
