import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import SetupWelcome from '../../setup/SetupWelcome.vue'

describe('SetupWelcome.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SetupWelcome)
  })

  it('renders the SetupWelcome component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct header', () => {
    expect(wrapper.find('h1').text()).toBe('Velkommen til SmartMat!')
  })

  it('displays the correct paragraph text', () => {
    expect(wrapper.find('p').text()).toContain(
      'Vi skal hjelpe deg med å sette opp din profil. Dette gjør vi for å kunne gi deg en best mulig opplevelse med SmartMat.'
    )
  })

  it('emits "nextStep" event when the "Neste" button is clicked', async () => {
    const nextButton = wrapper.find('button')
    await nextButton.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('nextStep')
  })
})
