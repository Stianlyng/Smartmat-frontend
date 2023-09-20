import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import SetupAllergies from '../../setup/SetupAllergies.vue'

describe('SetupAllergies.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SetupAllergies, {
      global: {
        mocks: {
          useUserStore: () => ({
            getUsername: 'testuser'
          })
        }
      }
    })
  })

  it('renders the SetupAllergies component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the initial question', () => {
    expect(wrapper.find('h1').text()).toBe('Har du noen allergier?')
  })

  it('moves to the first allergy question when "Ja" button is clicked', async () => {
    const yesButton = wrapper.find('.button-row .setup__button:nth-child(2)')
    await yesButton.trigger('click')
    expect(wrapper.find('h1').text()).toBe('Er du allergisk mot laktose?')
  })

  it('emits "nextStep" event when "Nei" button is clicked on the initial question', async () => {
    const noButton = wrapper.find('.button-row .setup__button:nth-child(1)')
    await noButton.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('nextStep')
  })
})
