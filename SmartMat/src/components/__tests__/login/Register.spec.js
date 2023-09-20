import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Register from '../../login/Register.vue'
import { createPinia } from 'pinia'

describe('Register component renders', () => {
  const pinia = createPinia()
  const wrapper = mount(Register, {
    //Adds the pinia plugin to the wrapper to enable the use of the store
    global: {
      plugins: [pinia]
    }
  })

  it('renders the register component correctly', () => {
    const registerComponent = wrapper.find('.register')
    expect(registerComponent.exists()).toBe(true)
  })

  it('renders the register title correctly', () => {
    const title = wrapper.find('h1')
    expect(title.text()).toContain('Opprett ny bruker')
  })

  it('renders the registration form correctly', () => {
    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)
  })

  it('renders the "Har du allerede en bruker?" link correctly', () => {
    const link = wrapper.find('router-link[to="/login"]')
    expect(link.text()).toContain('Har du allerede en bruker?')
  })

  it('renders the forgot password link correctly', () => {
    const forgotPassword = wrapper.find('router-link[to="/forgot-password"]')
    expect(forgotPassword.text()).toContain('Glemt passord?')
  })
})
