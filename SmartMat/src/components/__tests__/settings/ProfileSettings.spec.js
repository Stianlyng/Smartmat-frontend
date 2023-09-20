import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import ProfileSettings from '../../settings/ProfileSettings.vue'
import { createPinia } from 'pinia'
import { useRouter } from 'vue-router'

describe('ProfileSettings.vue', () => {
  let wrapper
  const pinia = createPinia()

  beforeEach(() => {
    wrapper = mount(ProfileSettings, {
      global: {
        plugins: [pinia]
      },
      shallow: true
    })
  })

  it('renders the ProfileSettings component', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
