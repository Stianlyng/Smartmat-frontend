import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import NavFooter from '@/components/NavFooter.vue'

describe('NavFooter renders correctly', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(NavFooter)
  })

  it('renders the NavFooter component', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
