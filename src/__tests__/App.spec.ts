import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'

import App from '../App.vue'

describe('App', () => {
  it('renders the application shell and dashboard route', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/dashboard', component: { template: '<h1>\u5100\u8868\u677f</h1>' } }],
    })

    await router.push('/dashboard')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.get('nav[aria-label="\u4e3b\u8981\u5c0e\u822a"]').text()).toContain('\u5c08\u6848')
    expect(wrapper.get('h1').text()).toBe('\u5100\u8868\u677f')
  })
})
