import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import WastePieChart from '@/components/statistics/WastePieChart.vue'

describe('WastePieChart component renders', () => {
  let wrapper
  const testValues = [10, 20, 30, 40, 50]

  beforeEach(() => {
    wrapper = mount(WastePieChart, {
      props: {
        values: testValues
      }
    })
  })

  it('renders the WastePieChart component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('uses the correct prop values', () => {
    expect(wrapper.props().values).toEqual(testValues)
  })

  it('computes the series correctly', () => {
    expect(wrapper.vm.seriesComputed).toEqual(testValues)
  })
})
