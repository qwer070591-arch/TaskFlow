import { test, expect } from '@playwright/test'

test('redirects to the dashboard and navigates between placeholder views', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('region', { name: '工作摘要' }).getByRole('article')).toHaveCount(4)
  await expect(page.getByRole('heading', { name: '任務趨勢' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '任務狀態' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '專案進度' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '即將到期任務' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '最近動態' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '團隊工作量' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('儀表板')

  const destinations = [
    { label: '專案', path: '/projects' },
    { label: '任務', path: '/tasks' },
    { label: '團隊', path: '/team' },
    { label: '設定', path: '/settings' },
  ]

  for (const destination of destinations) {
    await page.getByRole('link', { name: destination.label }).click()
    await expect(page).toHaveURL(new RegExp(`${destination.path}$`))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(destination.label)
  }
})

test('opens and closes the mobile navigation drawer with focus restoration', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/dashboard')

  await expect(page.getByRole('heading', { name: '任務趨勢' })).toBeVisible()
  const hasHorizontalOverflow = await page.locator('html').evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  )
  expect(hasHorizontalOverflow).toBe(false)

  const menuButton = page.getByRole('button', { name: '開啟導覽選單' })
  await menuButton.click()

  const drawer = page.getByRole('dialog', { name: '主要導覽' })
  await expect(drawer).toBeVisible()
  await expect(page.getByRole('button', { name: '關閉導覽選單' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(menuButton).toBeFocused()
})

test('filters projects and creates a project from the accessible modal', async ({ page }) => {
  await page.goto('/projects')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('專案')
  await expect(page.getByRole('region', { name: '專案列表' }).getByRole('article')).toHaveCount(5)

  await page.getByLabel('搜尋專案').fill('品牌')
  await expect(page.getByRole('heading', { name: '品牌網站改版' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '行動版新手引導' })).toHaveCount(0)

  await page.getByLabel('搜尋專案').fill('')
  await page.getByLabel('專案狀態').selectOption('completed')
  await expect(page.getByRole('heading', { name: '設計系統盤點' })).toBeVisible()
  await expect(page.getByRole('region', { name: '專案列表' }).getByRole('article')).toHaveCount(1)

  await page.getByLabel('專案狀態').selectOption('all')
  const createButton = page.getByRole('button', { name: '新增專案' })
  await createButton.click()

  const dialog = page.getByRole('dialog', { name: '新增專案' })
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(createButton).toBeFocused()

  await createButton.click()
  await dialog.getByRole('button', { name: '建立專案' }).click()
  await expect(dialog.getByText('請輸入專案名稱。')).toBeVisible()
  await expect(dialog.getByText('請選擇開始日期。')).toBeVisible()

  await dialog.getByLabel('專案名稱').fill('合作夥伴入口網站')
  await dialog.getByLabel('專案描述').fill('提供合作夥伴管理品牌素材的單一入口。')
  await dialog.getByLabel('開始日期').fill('2026-10-01')
  await dialog.getByLabel('截止日期').fill('2026-11-14')
  await dialog.getByLabel('Jason Lin').check()
  await dialog.getByRole('button', { name: '建立專案' }).click()

  await expect(page.getByRole('status')).toHaveText('已新增專案「合作夥伴入口網站」。')
  await expect(page.getByRole('heading', { name: '合作夥伴入口網站' })).toBeVisible()
})

test('keeps the projects layout within the mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/projects')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('專案')
  const hasHorizontalOverflow = await page.locator('html').evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  )
  expect(hasHorizontalOverflow).toBe(false)
})

test('opens project detail, returns to projects, and handles an invalid project id', async ({ page }) => {
  await page.goto('/projects')
  await page.getByRole('link', { name: '查看專案' }).first().click()

  await expect(page).toHaveURL(/\/projects\/project-brand-site$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('品牌網站改版')
  await expect(page.getByRole('region', { name: '專案總覽' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '專案任務' })).toBeVisible()
  await expect(page.getByText('整合新版元件樣式')).toBeVisible()
  await expect(page.getByRole('heading', { name: '專案成員' })).toBeVisible()
  await expect(
    page.getByRole('region', { name: '專案成員' }).getByRole('heading', { name: 'Jason Lin' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: '最近活動' })).toBeVisible()
  await expect(page.getByText('完成「首頁互動原型」')).toBeVisible()

  await page.getByRole('link', { name: '返回專案' }).click()
  await expect(page).toHaveURL(/\/projects$/)

  await page.goto('/projects/not-found')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('找不到此專案')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/projects/project-brand-site')
  const hasHorizontalOverflow = await page.locator('html').evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  )
  expect(hasHorizontalOverflow).toBe(false)
})
