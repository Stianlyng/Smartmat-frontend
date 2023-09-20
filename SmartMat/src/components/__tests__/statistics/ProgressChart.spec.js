import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressChart from '@/components/statistics/ProgressChart.vue'

describe('ProgressChart component renders', () => {
  let wrapper

  beforeEach(() => {
    const now = new Date('2023-05-02T00:00:00Z')
    Date.now = () => now.getTime()

    wrapper = mount(ProgressChart, {
      props: {
        values: [10, 20, 30, 40, 50]
      }
    })
  })

  const originalDateNow = Date.now

  afterEach(() => {
    Date.now = originalDateNow
  })

  it('renders the ProgressChart component', () => {
    console.log(wrapper.html())
    expect(wrapper.exists()).toBe(true)
  })

  it('uses the correct prop values', () => {
    expect(wrapper.props().values).toEqual([10, 20, 30, 40, 50])
  })

  it('populates the lastMonths ref correctly', () => {
    const labels = wrapper.vm.chartOptions.labels
    expect(labels).toEqual(['Mai', 'Apr', 'Mar', 'Feb'])
  })
})
