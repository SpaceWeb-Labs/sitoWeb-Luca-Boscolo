import { describe, expect, it } from 'vitest'
import { siteConfig } from './site.config'

describe('siteConfig', () => {
  it('has required fields', () => {
    expect(siteConfig.name).toBeTruthy()
    expect(siteConfig.sections.length).toBeGreaterThan(0)
  })
})
