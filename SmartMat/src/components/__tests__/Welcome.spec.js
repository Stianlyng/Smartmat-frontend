import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Welcome from '../home/Welcome.vue'

describe('Welcome', () => {
  it('renders properly', () => {
    const wrapper = mount(Welcome)
    expect(wrapper.text()).toContain(
      'Vær med å gjør en forskjell for miljøet og få en bedre hverdag!'
    )
  })
})
