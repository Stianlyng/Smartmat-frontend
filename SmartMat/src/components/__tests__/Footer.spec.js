import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import Footer from '../Footer.vue'

describe('Footer.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Footer)
  })

  it('renders the footer in the DOM', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('has the correct links for the footer', () => {
    const links = wrapper.findAll('a')
    expect(links[0].text()).toBe('Personvern')
    expect(links[0].attributes().href).toBe('#')
    expect(links[1].text()).toBe('Brukervilkår')
    expect(links[1].attributes().href).toBe('#')
  })

  it('displays NTNU link correctly', () => {
    const ntnuLink = wrapper.find('a[href="https://www.ntnu.no/"]')
    expect(ntnuLink.exists()).toBeTruthy()
    expect(ntnuLink.text()).toBe('NTNU')
  })

  it('renders the SmartMat logo', () => {
    const logo = wrapper.find('img')
    expect(logo.attributes().src).toBe('/src/assets/img/SmartMat_logo_circle.png')
    expect(logo.attributes().alt).toBe('logo')
  })

  it('displays the project name and copyright information', () => {
    const projectName = wrapper.find('.footer-content-right-text p:nth-child(1)')
    expect(projectName.text()).toBe('SmartMat')
    const copyright = wrapper.find('.footer-content-right-text p:nth-child(2)')
    expect(copyright.text()).toBe('© 2023')
  })
})
