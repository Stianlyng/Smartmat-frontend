import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Statistics from '@/components/statistics/Statistics.vue'
import { createPinia } from 'pinia'

describe('Statistics component renders', () => {
  let wrapper
  const pinia = createPinia()

  beforeEach(() => {
    wrapper = mount(Statistics, {
      //Adds the pinia plugin to the wrapper to enable the use of the store
      global: {
        plugins: [pinia]
      }
    })
  })

  it('renders the Statistics component', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
