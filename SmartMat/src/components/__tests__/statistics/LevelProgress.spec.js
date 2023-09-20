import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import LevelProgress from '@/components/statistics/LevelProgress.vue'

describe('LevelProgress component renders', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(LevelProgress, {
      props: {
        value: '75',
        level: '2'
      }
    })
  })

  it('renders the LevelProgress component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the chart label', () => {
    const chartOptions = wrapper.vm.chartOptions
    expect(chartOptions.labels).toEqual(['På vei til nivå 3'])
  })

  it('renders the correct data in the chart', () => {
    const series = wrapper.vm.series
    expect(series).toEqual(['75'])
  })
})
