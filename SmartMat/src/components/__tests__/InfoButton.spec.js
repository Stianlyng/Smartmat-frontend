import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import InfoButton from '../InfoButton.vue'

describe('InfoButton.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(InfoButton, {
      props: {
        message: 'Test message'
      }
    })
  })

  it('renders the InfoButton component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('shows the info popup when the info button is clicked', async () => {
    const infoButton = wrapper.find('.info-button')
    expect(wrapper.find('.info-popup').exists()).toBe(false)

    await infoButton.trigger('click')
    expect(wrapper.find('.info-popup').exists()).toBe(true)
  })

  it('hides the info popup when the close button is clicked', async () => {
    const infoButton = wrapper.find('.info-button')
    await infoButton.trigger('click')

    const closeButton = wrapper.find('.info-popup-close')
    await closeButton.trigger('click')
    expect(wrapper.find('.info-popup').exists()).toBe(false)
  })
})
