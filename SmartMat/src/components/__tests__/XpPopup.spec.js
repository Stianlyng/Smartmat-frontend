import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import XpPopup from '@/components/XpPopup.vue'

describe('XpPopup renders correctly', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(XpPopup)
  })

  it('renders the XpPopup component', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
