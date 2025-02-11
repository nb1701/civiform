import {
  createTestContext,
  disableFeatureFlag,
  enableFeatureFlag,
  loginAsAdmin,
  loginAsProgramAdmin,
  loginAsTestUser,
  logout,
  selectApplicantLanguage,
  testUserDisplayName,
  validateScreenshot,
} from './support'

// This test is for the old version of the predicate UI.
// TODO(#4004): delete this file

describe('create and edit predicates', () => {
  const ctx = createTestContext()
  it('add a hide predicate', async () => {
    const {
      page,
      adminQuestions,
      adminPrograms,
      applicantQuestions,
      adminPredicates,
    } = ctx

    await loginAsAdmin(page)
    await disableFeatureFlag(page, 'predicates_multiple_questions_enabled')

    // Add a program with two screens
    await adminQuestions.addTextQuestion({questionName: 'hide-predicate-q'})
    await adminQuestions.addTextQuestion({
      questionName: 'hide-other-q',
      description: 'desc',
      questionText: 'conditional question',
    })

    const programName = 'Create hide predicate'
    await adminPrograms.addProgram(programName)
    await adminPrograms.editProgramBlock(programName, 'first screen', [
      'hide-predicate-q',
    ])
    await adminPrograms.addProgramBlock(programName, 'screen with predicate', [
      'hide-other-q',
    ])

    // Edit predicate for second block
    await adminPrograms.goToEditBlockVisibilityPredicatePage(
      programName,
      'Screen 2',
    )
    await adminPredicates.addLegacyPredicate(
      'hide-predicate-q',
      'hidden if',
      'text',
      'is equal to',
      'hide me',
    )
    await adminPredicates.expectVisibilityConditionEquals(
      'Screen 2 is hidden if "hide-predicate-q" text is equal to "hide me"',
    )
    await validateScreenshot(page, 'hide-predicate')

    // Publish the program
    await adminPrograms.publishProgram(programName)

    // Switch to the applicantQuestions.view and apply to the program
    await logout(page)
    await loginAsTestUser(page)
    await selectApplicantLanguage(page, 'English')
    await applicantQuestions.applyProgram(programName)

    // Initially fill out the first screen so that the next screen will be shown
    await applicantQuestions.answerTextQuestion('show me')
    await applicantQuestions.clickNext()

    // Fill out the second screen
    await applicantQuestions.answerTextQuestion(
      'will be hidden and not submitted',
    )
    await applicantQuestions.clickNext()

    // We should be on the review page, with an answer to Screen 2's question
    expect(await page.innerText('#application-summary')).toContain(
      'conditional question',
    )

    // Return to the first screen and answer it so that the second screen is hidden
    await page.click('text=Edit') // first screen edit
    await applicantQuestions.answerTextQuestion('hide me')
    await applicantQuestions.clickNext()

    // We should be on the review page
    expect(await page.innerText('#application-summary')).not.toContain(
      'conditional question',
    )
    await applicantQuestions.submitFromReviewPage()

    // Visit the program admin page and assert the hidden question does not show
    await logout(page)
    await loginAsProgramAdmin(page)
    await adminPrograms.viewApplications(programName)
    await adminPrograms.viewApplicationForApplicant(testUserDisplayName())

    const applicationText = await adminPrograms
      .applicationFrameLocator()
      .locator('#application-view')
      .innerText()
    expect(applicationText).not.toContain('Screen 2')
  })

  it('add a show predicate', async () => {
    const {
      page,
      adminQuestions,
      adminPrograms,
      applicantQuestions,
      adminPredicates,
    } = ctx

    await loginAsAdmin(page)
    await disableFeatureFlag(page, 'predicates_multiple_questions_enabled')

    // Add a program with two screens
    await adminQuestions.addTextQuestion({questionName: 'show-predicate-q'})
    await adminQuestions.addTextQuestion({
      questionName: 'show-other-q',
      description: 'desc',
      questionText: 'conditional question',
    })

    const programName = 'Create show predicate'
    await adminPrograms.addProgram(programName)
    await adminPrograms.editProgramBlock(programName, 'first screen', [
      'show-predicate-q',
    ])
    await adminPrograms.addProgramBlock(programName, 'screen with predicate', [
      'show-other-q',
    ])

    // Edit predicate for second screen
    await adminPrograms.goToEditBlockVisibilityPredicatePage(
      programName,
      'Screen 2',
    )
    await adminPredicates.addLegacyPredicate(
      'show-predicate-q',
      'shown if',
      'text',
      'is equal to',
      'show me',
    )
    await adminPredicates.expectVisibilityConditionEquals(
      'Screen 2 is shown if "show-predicate-q" text is equal to "show me"',
    )
    await validateScreenshot(page, 'show-predicate')

    // Publish the program
    await adminPrograms.publishProgram(programName)

    // Switch to the applicantQuestions.view and apply to the program
    await logout(page)
    await loginAsTestUser(page)
    await selectApplicantLanguage(page, 'English')
    await applicantQuestions.applyProgram(programName)

    // Initially fill out the first screen so that the next screen will be hidden
    await applicantQuestions.answerTextQuestion('hide next screen')
    await applicantQuestions.clickNext()

    // We should be on the review page, with no Screen 2 questions shown. We should
    // be able to submit the application
    expect(await page.innerText('#application-summary')).not.toContain(
      'conditional question',
    )
    expect((await page.innerText('.cf-submit-button')).toLowerCase()).toContain(
      'submit',
    )

    // Return to the first screen and answer it so that the second screen is shown
    await page.click('text=Edit') // first screen edit
    await applicantQuestions.answerTextQuestion('show me')
    await applicantQuestions.clickNext()

    // The second screen should now appear, and we must fill it out
    await applicantQuestions.answerTextQuestion('hello world!')
    await applicantQuestions.clickNext()

    // We should be on the review page
    expect(await page.innerText('#application-summary')).toContain(
      'conditional question',
    )
    await applicantQuestions.submitFromReviewPage()

    // Visit the program admin page and assert the conditional question is shown
    await logout(page)
    await loginAsProgramAdmin(page)
    await adminPrograms.viewApplications(programName)

    await adminPrograms.viewApplicationForApplicant(testUserDisplayName())
    expect(
      await adminPrograms
        .applicationFrameLocator()
        .locator('#application-view')
        .innerText(),
    ).toContain('Screen 2')
  })

  it('add an eligibility predicate', async () => {
    const {
      page,
      adminQuestions,
      adminPrograms,
      applicantQuestions,
      adminPredicates,
    } = ctx

    await loginAsAdmin(page)
    await disableFeatureFlag(page, 'predicates_multiple_questions_enabled')
    await enableFeatureFlag(page, 'program_eligibility_conditions_enabled')

    // Add a program with two screens
    await adminQuestions.addTextQuestion({
      questionName: 'eligibility-predicate-q',
    })
    await adminQuestions.addTextQuestion({
      questionName: 'eligibility-other-q',
      description: 'desc',
      questionText: 'eligibility question',
    })

    const programName = 'Create eligibility predicate'
    await adminPrograms.addProgram(programName)
    await adminPrograms.editProgramBlock(programName, 'first screen', [
      'eligibility-predicate-q',
    ])

    // Edit predicate for second screen
    await adminPrograms.goToEditBlockEligibilityPredicatePage(
      programName,
      'Screen 1',
    )
    await adminPredicates.addLegacyPredicate(
      'eligibility-predicate-q',
      /* action= */ null,
      'text',
      'is equal to',
      'eligible',
    )

    await adminPredicates.expectVisibilityConditionEquals(
      'Screen 1 is eligible if "eligibility-predicate-q" text is equal to "eligible"',
    )
    await validateScreenshot(page, 'eligibility-predicate')

    // Publish the program
    await adminPrograms.publishProgram(programName)

    // Switch to the applicantQuestions.view and apply to the program
    await logout(page)
    await loginAsTestUser(page)
    await selectApplicantLanguage(page, 'English')
    await enableFeatureFlag(page, 'program_eligibility_conditions_enabled')
    await applicantQuestions.applyProgram(programName)

    // Initially fill out the first screen so that it is ineligible
    await applicantQuestions.answerTextQuestion('ineligble')
    await applicantQuestions.clickNext()
    await applicantQuestions.expectIneligiblePage()
    await validateScreenshot(page, 'ineligible')

    // Return to the screen and fill it out to be eligible.
    await page.goBack()
    await applicantQuestions.answerTextQuestion('eligible')
    await applicantQuestions.clickNext()

    // We should be on the review page, and able to submit the application
    expect((await page.innerText('.cf-submit-button')).toLowerCase()).toContain(
      'submit',
    )
    await applicantQuestions.submitFromReviewPage()

    // Visit the program admin page and assert the question is shown
    await logout(page)
    await loginAsProgramAdmin(page)
    await adminPrograms.viewApplications(programName)

    await adminPrograms.viewApplicationForApplicant(testUserDisplayName())
    expect(
      await adminPrograms
        .applicationFrameLocator()
        .locator('#application-view')
        .innerText(),
    ).toContain('Screen 1')
  })

  describe('test predicates', () => {
    beforeEach(async () => {
      const {page, adminQuestions} = ctx

      await loginAsAdmin(page)
      await disableFeatureFlag(page, 'predicates_multiple_questions_enabled')

      // DATE, STRING, LONG, LIST_OF_STRINGS, LIST_OF_LONGS
      await adminQuestions.addNameQuestion({questionName: 'single-string'})
      await adminQuestions.addTextQuestion({questionName: 'list of strings'})
      await adminQuestions.addNumberQuestion({questionName: 'single-long'})
      await adminQuestions.addNumberQuestion({questionName: 'list of longs'})
      await adminQuestions.addCurrencyQuestion({
        questionName: 'predicate-currency',
      })
      await adminQuestions.addDateQuestion({questionName: 'predicate-date'})
      await adminQuestions.addCheckboxQuestion({
        questionName: 'both sides are lists',
        options: ['dog', 'rabbit', 'cat'],
      })
      await adminQuestions.addTextQuestion({
        questionName: 'depends on previous',
      })

      await logout(page)
    })

    it('every visibility right hand type evaluates correctly', async () => {
      const {page, adminPrograms, applicantQuestions, adminPredicates} = ctx

      await loginAsAdmin(page)
      await disableFeatureFlag(page, 'predicates_multiple_questions_enabled')

      const programName = 'Test all visibility predicate types'
      await adminPrograms.addProgram(programName)
      await adminPrograms.editProgramBlock(programName, 'string', [
        'single-string',
      ])
      await adminPrograms.addProgramBlock(programName, 'list of strings', [
        'list of strings',
      ])
      await adminPrograms.addProgramBlock(programName, 'long', ['single-long'])
      await adminPrograms.addProgramBlock(programName, 'list of longs', [
        'list of longs',
      ])
      await adminPrograms.addProgramBlock(programName, 'currency', [
        'predicate-currency',
      ])
      await adminPrograms.addProgramBlock(programName, 'date', [
        'predicate-date',
      ])
      await adminPrograms.addProgramBlock(programName, 'two lists', [
        'both sides are lists',
      ])
      await adminPrograms.addProgramBlock(programName, 'last', [
        'depends on previous',
      ])

      // Simple string predicate
      await adminPrograms.goToEditBlockVisibilityPredicatePage(
        programName,
        'Screen 2',
      )
      await adminPredicates.addLegacyPredicate(
        'single-string',
        'shown if',
        'first name',
        'is not equal to',
        'hidden',
      )

      // Single string one of a list of strings
      await adminPrograms.goToEditBlockVisibilityPredicatePage(
        programName,
        'Screen 3',
      )
      await adminPredicates.addLegacyPredicate(
        'list of strings',
        'shown if',
        'text',
        'is one of',
        'blue, green',
      )

      // Simple long predicate
      await adminPrograms.goToEditBlockVisibilityPredicatePage(
        programName,
        'Screen 4',
      )
      await adminPredicates.addLegacyPredicate(
        'single-long',
        'shown if',
        'number',
        'is equal to',
        '42',
      )

      // Single long one of a list of longs
      await adminPrograms.goToEditBlockVisibilityPredicatePage(
        programName,
        'Screen 5',
      )
      await adminPredicates.addLegacyPredicate(
        'list of longs',
        'shown if',
        'number',
        'is one of',
        '123, 456',
      )

      // Currency predicate
      await adminPrograms.goToEditBlockVisibilityPredicatePage(
        programName,
        'Screen 6',
      )
      await adminPredicates.addLegacyPredicate(
        'predicate-currency',
        'shown if',
        'currency',
        'is greater than',
        '100.01',
      )

      // Date predicate
      await adminPrograms.goToEditBlockVisibilityPredicatePage(
        programName,
        'Screen 7',
      )
      await adminPredicates.addLegacyPredicate(
        'predicate-date',
        'shown if',
        'date',
        'is earlier than',
        '2021-01-01',
      )

      // Lists of strings on both sides (multi-option question checkbox)
      await adminPrograms.goToEditBlockVisibilityPredicatePage(
        programName,
        'Screen 8',
      )
      await adminPredicates.addLegacyPredicate(
        'both sides are lists',
        'shown if',
        'selections',
        'contains any of',
        'dog,cat',
      )

      await adminPrograms.publishProgram(programName)

      // Switch to applicantQuestions.view - if they answer each question according to the predicate,
      // the next screen will be shown.
      await logout(page)
      await loginAsTestUser(page)
      await selectApplicantLanguage(page, 'English')
      await applicantQuestions.applyProgram(programName)

      // For each condition:
      // - submit an invalid option
      // - verify the other screens aren't show and the review page is shown
      // - go back
      // - enter an allowed value

      // "hidden" first name is not allowed.
      await applicantQuestions.answerNameQuestion('hidden', 'next', 'screen')
      await applicantQuestions.clickNext()
      await applicantQuestions.expectReviewPage()
      await page.goBack()
      await applicantQuestions.answerNameQuestion('show', 'next', 'screen')
      await applicantQuestions.clickNext()

      // "blue" or "green" are allowed.
      await applicantQuestions.answerTextQuestion('red')
      await applicantQuestions.clickNext()
      await applicantQuestions.expectReviewPage()
      await page.goBack()
      await applicantQuestions.answerTextQuestion('blue')
      await applicantQuestions.clickNext()

      // 42 is allowed.
      await applicantQuestions.answerNumberQuestion('1')
      await applicantQuestions.clickNext()
      await applicantQuestions.expectReviewPage()
      await page.goBack()
      await applicantQuestions.answerNumberQuestion('42')
      await applicantQuestions.clickNext()

      // 123 or 456 are allowed.
      await applicantQuestions.answerNumberQuestion('11111')
      await applicantQuestions.clickNext()
      await applicantQuestions.expectReviewPage()
      await page.goBack()
      await applicantQuestions.answerNumberQuestion('123')
      await applicantQuestions.clickNext()

      // Greater than 100.01 is allowed
      await applicantQuestions.answerCurrencyQuestion('100.01')
      await applicantQuestions.clickNext()
      await applicantQuestions.expectReviewPage()
      await page.goBack()
      await applicantQuestions.answerCurrencyQuestion('100.02')
      await applicantQuestions.clickNext()

      // Earlier than 2021-01-01 is allowed
      // TODO(#3859): 2021-01-01 evaluates as earlier, but it shouldn't.
      await applicantQuestions.answerDateQuestion('2021-01-02')
      await applicantQuestions.clickNext()
      await applicantQuestions.expectReviewPage()
      await page.goBack()
      await applicantQuestions.answerDateQuestion('2020-12-31')
      await applicantQuestions.clickNext()

      // "dog" or "cat" are allowed.
      await applicantQuestions.answerCheckboxQuestion(['rabbit'])
      await applicantQuestions.clickNext()
      await applicantQuestions.expectReviewPage()
      await page.goBack()
      await applicantQuestions.answerCheckboxQuestion(['cat'])
      await applicantQuestions.clickNext()

      await applicantQuestions.answerTextQuestion('last one!')
      await applicantQuestions.clickNext()

      // We should now be on the summary page
      await applicantQuestions.submitFromReviewPage()
    })

    it('every eligibility right hand type evaluates correctly', async () => {
      const {page, adminPrograms, applicantQuestions, adminPredicates} = ctx

      await loginAsAdmin(page)
      await disableFeatureFlag(page, 'predicates_multiple_questions_enabled')
      await enableFeatureFlag(page, 'program_eligibility_conditions_enabled')

      const programName = 'Test all eligibility predicate types'
      await adminPrograms.addProgram(programName)
      await adminPrograms.editProgramBlock(programName, 'string', [
        'single-string',
      ])
      await adminPrograms.addProgramBlock(programName, 'list of strings', [
        'list of strings',
      ])
      await adminPrograms.addProgramBlock(programName, 'long', ['single-long'])
      await adminPrograms.addProgramBlock(programName, 'list of longs', [
        'list of longs',
      ])
      await adminPrograms.addProgramBlock(programName, 'currency', [
        'predicate-currency',
      ])
      await adminPrograms.addProgramBlock(programName, 'date', [
        'predicate-date',
      ])
      await adminPrograms.addProgramBlock(programName, 'two lists', [
        'both sides are lists',
      ])

      // Simple string predicate
      await adminPrograms.goToEditBlockEligibilityPredicatePage(
        programName,
        'Screen 1',
      )
      await adminPredicates.addLegacyPredicate(
        'single-string',
        /* action= */ null,
        'first name',
        'is not equal to',
        'hidden',
      )

      // Single string one of a list of strings
      await adminPrograms.goToEditBlockEligibilityPredicatePage(
        programName,
        'Screen 2',
      )
      await adminPredicates.addLegacyPredicate(
        'list of strings',
        /* action= */ null,
        'text',
        'is one of',
        'blue, green',
      )

      // Simple long predicate
      await adminPrograms.goToEditBlockEligibilityPredicatePage(
        programName,
        'Screen 3',
      )
      await adminPredicates.addLegacyPredicate(
        'single-long',
        /* action= */ null,
        'number',
        'is equal to',
        '42',
      )

      // Single long one of a list of longs
      await adminPrograms.goToEditBlockEligibilityPredicatePage(
        programName,
        'Screen 4',
      )
      await adminPredicates.addLegacyPredicate(
        'list of longs',
        /* action= */ null,
        'number',
        'is one of',
        '123, 456',
      )

      // Currency predicate
      await adminPrograms.goToEditBlockEligibilityPredicatePage(
        programName,
        'Screen 5',
      )
      await adminPredicates.addLegacyPredicate(
        'predicate-currency',
        /* action= */ null,
        'currency',
        'is greater than',
        '100.01',
      )

      // Date predicate
      await adminPrograms.goToEditBlockEligibilityPredicatePage(
        programName,
        'Screen 6',
      )
      await adminPredicates.addLegacyPredicate(
        'predicate-date',
        /* action= */ null,
        'date',
        'is earlier than',
        '2021-01-01',
      )

      // Lists of strings on both sides (multi-option question checkbox)
      await adminPrograms.goToEditBlockEligibilityPredicatePage(
        programName,
        'Screen 7',
      )
      await adminPredicates.addLegacyPredicate(
        'both sides are lists',
        /* action= */ null,
        'selections',
        'contains any of',
        'dog,cat',
      )

      await adminPrograms.publishProgram(programName)

      // Switch to applicantQuestions.view - if they answer each question according to the predicate,
      // the next screen will be shown.
      await logout(page)
      await loginAsTestUser(page)
      await selectApplicantLanguage(page, 'English')
      await enableFeatureFlag(page, 'program_eligibility_conditions_enabled')
      await applicantQuestions.applyProgram(programName)

      // For each condition:
      // - submit an invalid option
      // - verify the ineligible page is shown
      // - go back
      // - enter an allowed value

      // "hidden" first name is not allowed.
      await applicantQuestions.answerNameQuestion('hidden', 'next', 'screen')
      await applicantQuestions.clickNext()
      await applicantQuestions.expectIneligiblePage()
      await page.goBack()
      await applicantQuestions.answerNameQuestion('show', 'next', 'screen')
      await applicantQuestions.clickNext()

      // "blue" or "green" are allowed.
      await applicantQuestions.answerTextQuestion('red')
      await applicantQuestions.clickNext()
      await applicantQuestions.expectIneligiblePage()
      await page.goBack()
      await applicantQuestions.answerTextQuestion('blue')
      await applicantQuestions.clickNext()

      // 42 is allowed.
      await applicantQuestions.answerNumberQuestion('1')
      await applicantQuestions.clickNext()
      await applicantQuestions.expectIneligiblePage()
      await page.goBack()
      await applicantQuestions.answerNumberQuestion('42')
      await applicantQuestions.clickNext()

      // 123 or 456 are allowed.
      await applicantQuestions.answerNumberQuestion('11111')
      await applicantQuestions.clickNext()
      await applicantQuestions.expectIneligiblePage()
      await page.goBack()
      await applicantQuestions.answerNumberQuestion('123')
      await applicantQuestions.clickNext()

      // Greater than 100.01 is allowed
      await applicantQuestions.answerCurrencyQuestion('100.01')
      await applicantQuestions.clickNext()
      await applicantQuestions.expectIneligiblePage()
      await page.goBack()
      await applicantQuestions.answerCurrencyQuestion('100.02')
      await applicantQuestions.clickNext()

      // Earlier than 2021-01-01 is allowed
      // TODO(#3859): 2021-01-01 evaluates as earlier, but it shouldn't.
      await applicantQuestions.answerDateQuestion('2021-01-02')
      await applicantQuestions.clickNext()
      await applicantQuestions.expectIneligiblePage()
      await page.goBack()
      await applicantQuestions.answerDateQuestion('2020-12-31')
      await applicantQuestions.clickNext()

      // "dog" or "cat" are allowed.
      await applicantQuestions.answerCheckboxQuestion(['rabbit'])
      await applicantQuestions.clickNext()
      await applicantQuestions.expectIneligiblePage()
      await page.goBack()
      await applicantQuestions.answerCheckboxQuestion(['cat'])
      await applicantQuestions.clickNext()

      // We should now be on the summary page
      await applicantQuestions.submitFromReviewPage()
    })
  })
})
