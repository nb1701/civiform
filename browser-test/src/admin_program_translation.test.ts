import {
  createTestContext,
  enableFeatureFlag,
  loginAsAdmin,
  loginAsGuest,
  logout,
  selectApplicantLanguage,
  validateScreenshot,
} from './support'

describe('Admin can manage translations', () => {
  const ctx = createTestContext()

  it('creates a program without statuses and adds translation', async () => {
    const {page, adminPrograms, adminTranslations} = ctx

    await loginAsAdmin(page)

    const programName = 'Program to be translated no statuses'
    await adminPrograms.addProgram(programName)

    // Go to manage translations page.
    await adminPrograms.gotoDraftProgramManageTranslationsPage(programName)

    // Add translations for Spanish and publish
    await adminTranslations.selectLanguage('Spanish')
    await validateScreenshot(page, 'program-translation')
    await adminTranslations.expectProgramTranslation({
      expectProgramName: '',
      expectProgramDescription: '',
    })
    await adminTranslations.expectNoProgramStatusTranslations()
    const publicName = 'Spanish name'
    const publicDescription = 'Spanish description'
    await adminTranslations.editProgramTranslations({
      name: publicName,
      description: publicDescription,
      statuses: [],
    })
    await adminPrograms.gotoDraftProgramManageTranslationsPage(programName)
    await adminTranslations.selectLanguage('Spanish')
    await adminTranslations.expectProgramTranslation({
      expectProgramName: publicName,
      expectProgramDescription: publicDescription,
    })
    await adminTranslations.expectNoProgramStatusTranslations()
    await adminPrograms.publishProgram(programName)

    // View the applicant program page in Spanish and check that the translations are present
    await logout(page)
    await loginAsGuest(page)
    await selectApplicantLanguage(page, 'Español')
    const cardText = await page.innerText(
      '.cf-application-card:has-text("' + publicName + '")',
    )
    expect(cardText).toContain('Spanish name')
    expect(cardText).toContain('Spanish description')
  })

  it('creates a program with statuses and adds translations for program statuses', async () => {
    const {page, adminPrograms, adminProgramStatuses, adminTranslations} = ctx

    await loginAsAdmin(page)
    await enableFeatureFlag(page, 'application_status_tracking_enabled')

    const programName = 'Program to be translated with statuses'
    await adminPrograms.addProgram(programName)

    // Add two statuses, one with a configured email and another without
    const statusWithEmailName = 'status-with-email'
    const statusWithNoEmailName = 'status-with-no-email'
    await adminPrograms.gotoDraftProgramManageStatusesPage(programName)
    await adminProgramStatuses.createStatus(statusWithEmailName, {
      emailBody: 'An email',
    })
    await adminProgramStatuses.expectProgramManageStatusesPage(programName)
    await adminProgramStatuses.createStatus(statusWithNoEmailName)
    await adminProgramStatuses.expectProgramManageStatusesPage(programName)

    // Add only program translations for Spanish. Empty status translations should be accepted.
    await adminPrograms.gotoDraftProgramManageTranslationsPage(programName)
    await adminTranslations.selectLanguage('Spanish')
    await adminTranslations.expectProgramTranslation({
      expectProgramName: '',
      expectProgramDescription: '',
    })
    await adminTranslations.expectProgramStatusTranslationWithEmail({
      configuredStatusText: statusWithEmailName,
      expectStatusText: '',
      expectStatusEmail: '',
    })
    await adminTranslations.expectProgramStatusTranslationWithNoEmail({
      configuredStatusText: statusWithNoEmailName,
      expectStatusText: '',
    })
    const publicName = 'Spanish name'
    const publicDescription = 'Spanish description'
    await adminTranslations.editProgramTranslations({
      name: publicName,
      description: publicDescription,
      statuses: [],
    })
    await adminPrograms.gotoDraftProgramManageTranslationsPage(programName)
    await adminTranslations.selectLanguage('Spanish')
    await adminTranslations.expectProgramTranslation({
      expectProgramName: publicName,
      expectProgramDescription: publicDescription,
    })
    await adminTranslations.expectProgramStatusTranslationWithEmail({
      configuredStatusText: statusWithEmailName,
      expectStatusText: '',
      expectStatusEmail: '',
    })
    await adminTranslations.expectProgramStatusTranslationWithNoEmail({
      configuredStatusText: statusWithNoEmailName,
      expectStatusText: '',
    })

    // Now add a partial translation for one status and a full translation for the other.
    await adminPrograms.gotoDraftProgramManageTranslationsPage(programName)
    await adminTranslations.selectLanguage('Spanish')
    await adminTranslations.editProgramTranslations({
      name: publicName,
      description: publicDescription,
      statuses: [
        {
          configuredStatusText: statusWithEmailName,
          statusText: '',
          statusEmail: `${statusWithEmailName}-email-spanish`,
        },
        {
          configuredStatusText: statusWithNoEmailName,
          statusText: `${statusWithNoEmailName}-spanish`,
        },
      ],
    })
    await adminPrograms.gotoDraftProgramManageTranslationsPage(programName)
    await adminTranslations.selectLanguage('Spanish')
    await adminTranslations.expectProgramTranslation({
      expectProgramName: publicName,
      expectProgramDescription: publicDescription,
    })
    await adminTranslations.expectProgramStatusTranslationWithEmail({
      configuredStatusText: statusWithEmailName,
      expectStatusText: '',
      expectStatusEmail: `${statusWithEmailName}-email-spanish`,
    })
    await adminTranslations.expectProgramStatusTranslationWithNoEmail({
      configuredStatusText: statusWithNoEmailName,
      expectStatusText: `${statusWithNoEmailName}-spanish`,
    })
  })

  it('creates a question and adds translations', async () => {
    const {
      page,
      adminPrograms,
      adminQuestions,
      adminTranslations,
      applicantQuestions,
    } = ctx

    await loginAsAdmin(page)

    // Add a new question to be translated
    const questionName = 'name-translated'
    await adminQuestions.addNameQuestion({questionName})

    // Go to the question translation page and add a translation for Spanish
    await adminQuestions.goToQuestionTranslationPage(questionName)
    await adminTranslations.selectLanguage('Spanish')
    await validateScreenshot(page, 'question-translation')
    await adminTranslations.editQuestionTranslations(
      'Spanish question text',
      'Spanish help text',
    )

    // Add the question to a program and publish
    const programName = 'Spanish question program'
    await adminPrograms.addProgram(
      programName,
      'program description',
      'http://seattle.gov',
    )
    await adminPrograms.editProgramBlock(programName, 'block', [questionName])
    await adminPrograms.publishProgram(programName)
    await logout(page)

    // Log in as an applicant and view the translated question
    await loginAsGuest(page)
    await selectApplicantLanguage(page, 'Español')
    await applicantQuestions.validateHeader('es-US')

    // Expect program details link to contain 'Detalles del programa' with link to 'http://seattle.gov'
    expect(
      await page.innerText('.cf-application-card a[href="http://seattle.gov"]'),
    ).toContain('Sitio externo')

    await applicantQuestions.applyProgram(programName)

    expect(await page.innerText('.cf-applicant-question-text')).toContain(
      'Spanish question text',
    )
    expect(await page.innerText('.cf-applicant-question-help-text')).toContain(
      'Spanish help text',
    )
  })

  it('create a multi-option question and add translations for options', async () => {
    const {
      page,
      adminPrograms,
      adminQuestions,
      adminTranslations,
      applicantQuestions,
    } = ctx

    await loginAsAdmin(page)

    // Add a new question to be translated
    const questionName = 'multi-option-translated'
    await adminQuestions.addRadioButtonQuestion({
      questionName,
      options: ['one', 'two', 'three'],
    })

    // Go to the question translation page and add a translation for Spanish
    await adminQuestions.goToQuestionTranslationPage(questionName)
    await adminTranslations.selectLanguage('Spanish')
    await validateScreenshot(page, 'multi-option-question-translation')
    await adminTranslations.editQuestionTranslations('hola', 'mundo', [
      'uno',
      'dos',
      'tres',
    ])

    // Add the question to a program and publish
    const programName = 'Spanish question multi option program'
    await adminPrograms.addProgram(programName)
    await adminPrograms.editProgramBlock(programName, 'block', [questionName])
    await adminPrograms.publishProgram(programName)
    await logout(page)

    // Log in as an applicant and view the translated question
    await loginAsGuest(page)
    await selectApplicantLanguage(page, 'Español')
    await applicantQuestions.applyProgram(programName)

    expect(await page.innerText('main form')).toContain('uno')
    expect(await page.innerText('main form')).toContain('dos')
    expect(await page.innerText('main form')).toContain('tres')
  })

  it('create an enumerator question and add translations for entity type', async () => {
    const {
      page,
      adminPrograms,
      adminQuestions,
      adminTranslations,
      applicantQuestions,
    } = ctx

    await loginAsAdmin(page)

    // Add a new question to be translated
    const questionName = 'enumerator-translated'
    await adminQuestions.addEnumeratorQuestion({questionName})

    // Go to the question translation page and add a translation for Spanish
    await adminQuestions.goToQuestionTranslationPage(questionName)
    await adminTranslations.selectLanguage('Spanish')
    await adminTranslations.editQuestionTranslations('test', 'enumerator', [
      'family member',
    ])

    // Add the question to a program and publish
    const programName = 'Spanish question enumerator program'
    await adminPrograms.addProgram(programName)
    await adminPrograms.editProgramBlock(programName, 'block', [questionName])
    await adminPrograms.publishProgram(programName)
    await logout(page)

    // Log in as an applicant and view the translated question
    await loginAsGuest(page)
    await selectApplicantLanguage(page, 'Español')
    await applicantQuestions.applyProgram(programName)

    expect(await page.innerText('main form')).toContain('family member')
  })

  it('updating a question does not clobber translations', async () => {
    const {page, adminQuestions, adminTranslations} = ctx

    await loginAsAdmin(page)

    // Add a new question.
    const questionName = 'translate-no-clobber'
    await adminQuestions.addNumberQuestion({questionName})

    // Add a translation for a non-English language.
    await adminQuestions.goToQuestionTranslationPage(questionName)
    await adminTranslations.selectLanguage('Spanish')
    await adminTranslations.editQuestionTranslations(
      'something different',
      'help text different',
    )

    // Edit the question again and update the question.
    await adminQuestions.updateQuestion(questionName)

    // View the question translations and check that the Spanish translations are still there.
    await adminQuestions.goToQuestionTranslationPage(questionName)
    await adminTranslations.selectLanguage('Spanish')
    expect(await page.inputValue('text=Question text')).toContain(
      'something different',
    )
  })

  it('deleting help text in question edit view deletes all help text translations', async () => {
    const {page, adminQuestions, adminTranslations} = ctx

    await loginAsAdmin(page)

    // Add a new question with help text
    const questionName = 'translate-help-text-deletion'
    await adminQuestions.addNumberQuestion({questionName})

    // Add a translation for a non-English language.
    await adminQuestions.goToQuestionTranslationPage(questionName)
    await adminTranslations.selectLanguage('Spanish')
    await adminTranslations.editQuestionTranslations(
      'something different',
      'help text different',
    )

    // Edit the question and delete the help text.
    await adminQuestions.changeQuestionHelpText(questionName, '')

    // Edit the question and add help text back
    await adminQuestions.changeQuestionHelpText(questionName, 'a new help text')

    // View the question translations and check that the Spanish translations for question help text are gone.
    await adminQuestions.goToQuestionTranslationPage(questionName)
    await adminTranslations.selectLanguage('Spanish')
    expect(await page.inputValue('text=Question text')).toContain(
      'something different',
    )
    expect(await page.inputValue('text=Question help text')).toEqual('')
  })

  it('Applicant sees toast message warning translation is not complete', async () => {
    const {page, adminQuestions, adminPrograms, applicantQuestions} = ctx

    // Add a new program with one non-translated question
    await loginAsAdmin(page)

    const programName = 'Toast program'
    await adminPrograms.addProgram(programName)

    await adminQuestions.addNameQuestion({questionName: 'name-english'})
    await adminPrograms.editProgramBlock(programName, 'not translated', [
      'name-english',
    ])

    await adminPrograms.publishProgram(programName)
    await logout(page)

    // Set applicant preferred language to Spanish
    // DO NOT LOG IN AS TEST USER. We want a fresh guest so we can guarantee
    // the language has not yet been set.
    await loginAsGuest(page)
    await selectApplicantLanguage(page, 'Español')
    await applicantQuestions.applyProgram(programName)

    // Check that a toast appears warning the program is not fully translated
    const toastMessages = await page.innerText('#toast-container')
    expect(toastMessages).toContain(
      'Lo sentimos, este programa no está traducido por completo al inglés.',
    )

    await validateScreenshot(page, 'applicant-toast-error')
  })
})
