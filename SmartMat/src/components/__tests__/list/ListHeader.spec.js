import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import ListHeader from '@/components/list/ListHeader.vue'

describe('ListHeader.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ListHeader)
  })

  it('renders the ListHeader component correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('switches active button on click', async () => {
    const buttons = wrapper.findAll('button')

    expect(buttons[0].classes()).toContain('active')
    expect(buttons[1].classes()).not.toContain('active')

    await buttons[1].trigger('click')

    expect(buttons[0].classes()).not.toContain('active')
    expect(buttons[1].classes()).toContain('active')
  })

  it('emits "setActive" function event on button click', async () => {
    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    expect(wrapper.emitted()).toHaveProperty('setActive')
    expect(wrapper.emitted().setActive[0]).toEqual([0])
  })
})
