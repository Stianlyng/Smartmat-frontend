import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InfoSection from '../../home/InfoSection.vue'

describe('InfoSection component renders', () => {
  const wrapper = mount(InfoSection)

  it('renders the information section correctly', () => {
    const infoSection = wrapper.find('.info-section')
    expect(infoSection.exists()).toBe(true)
  })

  it('renders the information title properly', () => {
    expect(wrapper.text()).toContain('Hvorfor er det viktig å redusere matavfall?')
  })

  it('renders the correct information paragraph-headers', () => {
    const paragraphs = wrapper.findAll('.info-section-paragraph')

    const headers = [
      'Klimaendringer',
      'Ressursbruk',
      'Økonomisk kostnad',
      'Sult og underernæring',
      'Etisk ansvar'
    ]

    paragraphs.forEach((paragraph, index) => {
      const header2 = paragraph.find('h2')
      expect(header2.text()).toBe(headers[index])
    })
  })

  it('renders the information images correctly', () => {
    const images = wrapper.findAll('.info-section-image')

    const expectedTexts = ['Miljø', 'Sparing', 'Medfølelse']
    const expectedSources = ['environment.svg', 'savings.svg', 'thought.svg']

    images.forEach((image, index) => {
      expect(image.attributes('src')).toContain(expectedSources[index])
      expect(image.attributes('alt')).toBe(expectedTexts[index])
    })
  })
})
