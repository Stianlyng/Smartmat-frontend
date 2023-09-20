import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ColumnComparison from '@/components/statistics/ColumnComparison.vue'
import { createPinia } from 'pinia'

describe('ColumnComparison.vue', () => {
  let wrapper
  const pinia = createPinia()

  beforeEach(() => {
    wrapper = shallowMount(
      ColumnComparison,
      {
        props: {
          value: '0'
        }
      },
      {
        //Adds the pinia plugin to the wrapper to enable the use of the store
        global: {
          plugins: [pinia]
        }
      }
    )
  })

  it('renders the ColumnComparison component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the correct data in the chart', () => {
    const chartOptions = wrapper.vm.chartOptions
    expect(chartOptions.xaxis.categories).toEqual(['Deg', 'Gjennomsnittet'])
  })
})
