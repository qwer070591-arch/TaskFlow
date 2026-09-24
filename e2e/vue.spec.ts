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

test('filters, creates, and moves tasks through the Kanban board', async ({ page }) => {
  await page.goto('/tasks')

  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('\u4efb\u52d9')
  await expect(page.getByRole('region', { name: '\u770b\u677f' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /^\u5f85\u8655\u7406/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: /^\u9032\u884c\u4e2d/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: /^\u5be9\u6838\u4e2d/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: /^\u5df2\u5b8c\u6210/ })).toBeVisible()

  const onboardingReview = page.getByRole('article').filter({ hasText: '\u884c\u52d5\u7248\u8a2d\u8a08\u5be9\u67e5' })
  await expect(onboardingReview).toBeVisible()

  await page.getByLabel('\u641c\u5c0b\u4efb\u52d9').fill('\u884c\u52d5\u7248\u8a2d\u8a08\u5be9\u67e5')
  await expect(page.getByRole('article')).toHaveCount(1)
  await page.getByLabel('\u641c\u5c0b\u4efb\u52d9').fill('')

  await page.getByRole('combobox', { name: '\u5c08\u6848', exact: true }).selectOption('project-mobile-onboarding')
  await expect(page.getByRole('article')).toHaveCount(4)
  await page.getByRole('combobox', { name: '\u5c08\u6848', exact: true }).selectOption('all')

  await page.getByRole('combobox', { name: '\u512a\u5148\u5ea6', exact: true }).selectOption('high')
  await expect(page.getByRole('article')).toHaveCount(4)
  await page.getByRole('combobox', { name: '\u512a\u5148\u5ea6', exact: true }).selectOption('all')

  await page.getByRole('combobox', { name: '\u8ca0\u8cac\u4eba', exact: true }).selectOption('member-lin')
  await expect(page.getByRole('article')).toHaveCount(4)
  await page.getByRole('combobox', { name: '\u8ca0\u8cac\u4eba', exact: true }).selectOption('all')

  const createButton = page.getByRole('button', { name: '\u65b0\u589e\u4efb\u52d9' })
  await createButton.click()
  const dialog = page.getByRole('dialog', { name: '\u65b0\u589e\u4efb\u52d9' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: '\u5efa\u7acb\u4efb\u52d9' }).click()
  await expect(dialog.getByRole('alert')).toBeVisible()

  await dialog.getByLabel('\u4efb\u52d9\u540d\u7a31').fill('\u7e3e\u6548\u9a57\u8b49\u4efb\u52d9')
  await dialog.getByLabel('\u6240\u5c6c\u5c08\u6848').selectOption('project-brand-site')
  await dialog.getByLabel('\u8ca0\u8cac\u4eba').selectOption('member-lin')
  await dialog.getByLabel('\u512a\u5148\u5ea6').selectOption('high')
  await dialog.getByLabel('\u622a\u6b62\u65e5\u671f').fill('2026-10-10')
  await dialog.getByLabel('\u72c0\u614b').selectOption('review')
  await dialog.getByRole('button', { name: '\u5efa\u7acb\u4efb\u52d9' }).click()
  await expect(dialog).toBeHidden()
  await expect(page.getByRole('article').filter({ hasText: '\u7e3e\u6548\u9a57\u8b49\u4efb\u52d9' })).toBeVisible()

  const componentTask = page.getByRole('article').filter({ hasText: '\u6574\u5408\u65b0\u7248\u5143\u4ef6\u6a23\u5f0f' })
  await componentTask.getByRole('button', { name: /\u8b8a\u66f4.*\u72c0\u614b/ }).click()
  const statusMenu = componentTask.getByRole('menu')
  await expect(statusMenu.getByRole('menuitem', { name: '\u79fb\u81f3\u5df2\u5b8c\u6210' })).toBeVisible()
  await statusMenu.getByRole('menuitem', { name: '\u79fb\u81f3\u5df2\u5b8c\u6210' }).click()
  await expect(
    page.locator('.column').filter({ has: page.getByRole('heading', { name: '\u9032\u884c\u4e2d' }) }).getByText('2', { exact: true }),
  ).toBeVisible()
  await expect(
    page.locator('.column').filter({ has: page.getByRole('heading', { name: '\u5df2\u5b8c\u6210' }) }).getByText('5', { exact: true }),
  ).toBeVisible()

  await createButton.click()
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(createButton).toBeFocused()
})

test('keeps the application shell within the mobile viewport on the tasks route', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/tasks')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('\u4efb\u52d9')
  const hasHorizontalOverflow = await page.locator('html').evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  )
  expect(hasHorizontalOverflow).toBe(false)
})

test('moves a task with the native drag and drop handlers', async ({ page }) => {
  await page.goto('/tasks')

  const task = page.getByRole('article').filter({ hasText: '\u6574\u7406\u4f7f\u7528\u8005\u8a2a\u8ac7\u91cd\u9ede' })
  const reviewColumn = page.locator('.column').filter({ hasText: /^\u5be9\u6838\u4e2d/ })
  await task.dispatchEvent('dragstart')
  await reviewColumn.dispatchEvent('drop')

  await task.getByRole('button', { name: /\u8b8a\u66f4.*\u72c0\u614b/ }).click()
  await expect(task.getByRole('menuitem', { name: '\u79fb\u81f3\u5be9\u6838\u4e2d' })).toBeDisabled()
  await expect(
    page.locator('.column').filter({ has: page.getByRole('heading', { name: '\u5be9\u6838\u4e2d' }) }).getByText('3', { exact: true }),
  ).toBeVisible()
})
