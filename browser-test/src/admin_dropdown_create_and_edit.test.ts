import {createTestContext, loginAsAdmin, waitForPageJsLoad} from './support'

describe('create dropdown question with options', () => {
  const ctx = createTestContext()

  fit('add remove buttons work correctly', async () => {
    const {page, adminQuestions} = ctx

    await loginAsAdmin(page)

    await page.click('text=Questions')
    await waitForPageJsLoad(page)

    await page.click('#create-question-button')
    await page.click('#create-dropdown-question')
    await waitForPageJsLoad(page)

    // Verify question preview has default text.
    expect(await page.innerText('.cf-applicant-question-text')).toContain(
      'Sample question text',
    )
    expect(await page.innerText('.cf-applicant-question-help-text')).toContain(
      '',
    )

    // Fill in basic info
    const questionName = 'favorite ice cream'
    await page.fill('text=Question Text', 'questionText')
    await page.fill('text=Question help text', 'helpText')
    await page.fill('text=Administrative identifier', questionName)
    await page.fill(
      'text=Question note for administrative use only',
      'description',
    )

    // Add three options
    await page.click('#add-new-option')
    await page.fill(
      '#question-settings div.flex-row:nth-of-type(1) input',
      'chocolate',
    )
    await page.click('#add-new-option')
    await page.fill(
      '#question-settings div.flex-row:nth-of-type(2) input',
      'vanilla',
    )
    await page.click('#add-new-option')
    await page.fill(
      '#question-settings div.flex-row:nth-of-type(3) input',
      'strawberry',
    )

    // Assert there are three options present
    let questionSettingsDiv = await page.innerHTML('#question-settings')
    expect(questionSettingsDiv.match(/<input/g)).toHaveLength(3)

    // Remove first option - use :visible to not select the hidden template
    await page.click('button:has-text("Delete"):visible')

    // Assert there are only two options now
    questionSettingsDiv = await page.innerHTML('#question-settings')
    expect(questionSettingsDiv.match(/<input/g)).toHaveLength(2)

    // Verify question preview text has changed based on user input.
    expect(await page.innerText('.cf-applicant-question-text')).toContain(
      'questionText',
    )
    expect(await page.innerText('.cf-applicant-question-help-text')).toContain(
      'helpText',
    )

    // Submit the form, then edit that question again
    await page.click('text=Create')
    await adminQuestions.expectDraftQuestionExist(questionName)

    // Edit the question
    await adminQuestions.gotoQuestionEditPage(questionName)
    questionSettingsDiv = await page.innerHTML('#question-settings')
    expect(questionSettingsDiv.match(/<input/g)).toHaveLength(4)
  })
})
