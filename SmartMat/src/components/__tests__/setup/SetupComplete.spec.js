import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import SetupComplete from '../../setup/SetupComplete.vue'

describe('SetupComplete.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SetupComplete)
  })

  it('renders the SetupComplete component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct header', () => {
    expect(wrapper.find('h1').text()).toBe('Da er du ferdig med oppsettet!')
  })

  it('displays the correct button text', () => {
    const button = wrapper.find('button')
    expect(button.text()).toBe('Fortsett')
  })
})
