import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Welcome from '../../home/Welcome.vue'

describe('Welcome component renders', () => {
  const wrapper = mount(Welcome)
  it('renders the Welcome message properly', () => {
    expect(wrapper.text()).toContain(
      'Vær med å gjør en forskjell for miljøet og få en bedre hverdag!'
    )
  })

  it('renders the router link message properly', () => {
    expect(wrapper.text()).toContain('Klikk her for å komme i gang')
  })

  it('renders the logo for SmartMat correctly', () => {
    const logo = wrapper.find('.logo')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('src')).toContain('SmartMat_logo_transparent.png')
    expect(logo.attributes('alt')).toBe('SmartMat')
  })

  it('renders the scroll indicator image displays correctly', () => {
    const scrollIndicator = wrapper.find('.scroll-indicator img')
    expect(scrollIndicator.exists()).toBe(true)
    expect(scrollIndicator.attributes('src')).toContain('down-indicator.png')
    expect(scrollIndicator.attributes('alt')).toBe('Scroll down')
  })
})
