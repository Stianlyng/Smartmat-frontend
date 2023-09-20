import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import Navbar from '@/components/navbar/Navbar.vue'

describe('Navbar component renders', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Navbar, {
      global: {
        stubs: {
          'router-link': true
        }
      }
    })
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should toggle mobileNav when function is called', async () => {
    await wrapper.vm.toggleMobileNav()
    expect(wrapper.vm.mobileNav).toBe(true)

    await wrapper.vm.toggleMobileNav()
    expect(wrapper.vm.mobileNav).toBe(false)
  })

  it('should update scrolledNav state based on window scrollY', async () => {
    const initialY = window.scrollY

    //Mimicks scrolling down by 100px
    window.scrollY = 100
    await wrapper.vm.updateScroll()
    expect(wrapper.vm.scrolledNav).toBe(true)

    //Mimicks scrolling up
    window.scrollY = initialY
    await wrapper.vm.updateScroll()
    expect(wrapper.vm.scrolledNav).toBe(false)
  })

  it('should update mobile state based on window width', async () => {
    const initialWidth = window.innerWidth

    //Mimicks resizing window to mobile width
    window.innerWidth = 600
    await wrapper.vm.checkScreen()
    expect(wrapper.vm.mobile).toBe(true)

    //Mimicks resizing window to desktop width
    window.innerWidth = initialWidth
    await wrapper.vm.checkScreen()
    expect(wrapper.vm.mobile).toBe(false)
  })
})
