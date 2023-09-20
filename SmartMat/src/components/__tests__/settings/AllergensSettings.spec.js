import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import AllergensSettings from '../../settings/AllergensSettings.vue'
import { createPinia } from 'pinia'

describe('AllergensSettings.vue', () => {
  let wrapper
  const pinia = createPinia()

  beforeEach(() => {
    wrapper = mount(AllergensSettings, {
      global: {
        plugins: [pinia]
      }
    })
  })

  it('renders the AllergensSettings component', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
