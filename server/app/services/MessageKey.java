package services;

/** Contains keys into the {@code messages} files used for translation. */
public enum MessageKey {
  ADDRESS_LABEL_CITY("label.city"),
  ADDRESS_LABEL_LINE_2("label.addressLine2"),
  ADDRESS_LABEL_STATE("label.state"),
  ADDRESS_LABEL_STATE_SELECT("label.selectState"),
  ADDRESS_LABEL_STREET("label.street"),
  ADDRESS_LABEL_ZIPCODE("label.zipcode"),
  ADDRESS_PLACEHOLDER_CITY("placeholder.city"),
  ADDRESS_PLACEHOLDER_LINE_2("placeholder.line2"),
  ADDRESS_PLACEHOLDER_STATE("placeholder.state"),
  ADDRESS_PLACEHOLDER_STREET("placeholder.street"),
  ADDRESS_PLACEHOLDER_ZIPCODE("placeholder.zipcode"),
  ADDRESS_VALIDATION_CITY_REQUIRED("validation.cityRequired"),
  ADDRESS_VALIDATION_INVALID_ZIPCODE("validation.invalidZipcode"),
  ADDRESS_VALIDATION_NO_PO_BOX("validation.noPoBox"),
  ADDRESS_VALIDATION_STATE_REQUIRED("validation.stateRequired"),
  ADDRESS_VALIDATION_STREET_REQUIRED("validation.streetRequired"),
  ARIA_LABEL_EDIT("ariaLabel.edit"),
  ARIA_LABEL_ANSWER("ariaLabel.answer"),
  BUTTON_APPLY("button.apply"),
  BUTTON_APPLY_SR("button.applySr"),
  BUTTON_CHOOSE_FILE("button.chooseFile"),
  BUTTON_CONTINUE("button.continue"),
  BUTTON_CONTINUE_SR("button.continueSr"),
  BUTTON_CREATE_ACCOUNT("button.createAccount"),
  BUTTON_EDIT("button.edit"),
  BUTTON_EDIT_SR("button.editSr"),
  BUTTON_LOGIN("button.login"),
  BUTTON_LOGIN_GUEST("button.guestLogin"),
  BUTTON_LOGOUT("button.logout"),
  BUTTON_NEXT_SCREEN("button.nextScreen"),
  BUTTON_PREVIOUS_SCREEN("button.previousScreen"),
  BUTTON_REVIEW("button.review"),
  BUTTON_DELETE_FILE("button.deleteFile"),
  BUTTON_KEEP_FILE("button.keepFile"),
  BUTTON_SKIP_FILEUPLOAD("button.skipFileUpload"),
  BUTTON_SUBMIT("button.submit"),
  BUTTON_UNTRANSLATED_SUBMIT("button.untranslatedSubmit"),
  CURRENCY_VALIDATION_MISFORMATTED("validation.currencyMisformatted"),
  CONTENT_ADMIN_LOGIN_PROMPT("content.adminLoginPrompt"),
  CONTENT_CIVIFORM_DESCRIPTION_1("content.description1"),
  CONTENT_CIVIFORM_DESCRIPTION_2("content.description2"),
  CONTENT_CONFIRMED("content.confirmed"),
  CONTENT_GET_BENEFITS("content.benefits"),
  CONTENT_LOGIN_PROMPT("content.loginPrompt"),
  CONTENT_LOGIN_DISABLED_PROMPT("content.loginDisabledPrompt"),
  CONTENT_LOGIN_PROMPT_ALTERNATIVE("content.alternativeLoginPrompt"),
  CONTENT_OR("content.or"),
  CONTENT_NOT_ELIGIBLE("content.notEligible"),
  CONTENT_PLEASE_CREATE_ACCOUNT("content.pleaseCreateAccount"),
  CONTENT_PREVIOUSLY_ANSWERED_ON("content.previouslyAnsweredOn"),
  CONTENT_SELECT_LANGUAGE("label.selectLanguage"),
  ERROR_ANNOUNCEMENT_SR("validation.errorAnnouncementSr"),
  ERROR_NOT_FOUND_TITLE("error.notFoundTitle"),
  ERROR_NOT_FOUND_DESCRIPTION("error.notFoundDescription"),
  ERROR_NOT_FOUND_DESCRIPTION_LINK("error.notFoundDescriptionLink"),
  DATE_VALIDATION_MISFORMATTED("validation.dateMisformatted"),
  DROPDOWN_PLACEHOLDER("placeholder.noDropdownSelection"),
  ENUMERATOR_BUTTON_ADD_ENTITY("button.addEntity"),
  ENUMERATOR_BUTTON_REMOVE_ENTITY("button.removeEntity"),
  ENUMERATOR_DIALOG_CONFIRM_DELETE("dialog.confirmDelete"),
  ENUMERATOR_PLACEHOLDER_ENTITY_NAME("placeholder.entityName"),
  ENUMERATOR_VALIDATION_DUPLICATE_ENTITY_NAME("validation.duplicateEntityName"),
  ENUMERATOR_VALIDATION_ENTITY_REQUIRED("validation.entityNameRequired"),
  EXTERNAL_LINK("link.externalLink"),
  EXTERNAL_LINK_OPENS_IN_NEW_TAB("link.externalLinkOpensInNewTab"),
  FILEUPLOAD_VALIDATION_FILE_REQUIRED("validation.fileRequired"),
  FOOTER_SUPPORT_LINK_DESCRIPTION("footer.supportLinkDescription"),
  GUEST("guest"),
  ID_VALIDATION_NUMBER_REQUIRED("validation.numberRequired"),
  ID_VALIDATION_TOO_LONG("validation.idTooLong"),
  ID_VALIDATION_TOO_SHORT("validation.idTooShort"),
  INPUT_FILE_ALREADY_UPLOADED("input.fileAlreadyUploaded"),
  INVALID_INPUT("validation.invalidInput"),
  LANGUAGE_LABEL_SR("label.languageSr"),
  LINK_ADMIN_LOGIN("link.adminLogin"),
  LINK_ALL_DONE("link.allDone"),
  LINK_APPLY_TO_ANOTHER_PROGRAM("link.applyToAnotherProgram"),
  LINK_CREATE_ACCOUNT_OR_SIGN_IN("link.createAccountOrSignIn"),
  LINK_EDIT("link.edit"),
  LINK_ANSWER("link.answer"),
  LINK_PROGRAM_DETAILS("link.programDetails"),
  LINK_PROGRAM_DETAILS_SR("link.programDetailsSr"),
  MOBILE_FILE_UPLOAD_HELP("content.mobileFileUploadHelp"),
  MULTI_OPTION_VALIDATION("adminValidation.multiOptionEmpty"),
  MULTI_SELECT_VALIDATION_TOO_FEW("validation.tooFewSelections"),
  MULTI_SELECT_VALIDATION_TOO_MANY("validation.tooManySelections"),
  NAME_LABEL_FIRST("label.firstName"),
  NAME_LABEL_LAST("label.lastName"),
  NAME_LABEL_MIDDLE("label.middleName"),
  NAME_PLACEHOLDER_FIRST("placeholder.firstName"),
  NAME_PLACEHOLDER_LAST("placeholder.lastName"),
  NAME_PLACEHOLDER_MIDDLE("placeholder.middleName"),
  NAME_VALIDATION_FIRST_REQUIRED("validation.firstNameRequired"),
  NAME_VALIDATION_LAST_REQUIRED("validation.lastNameRequired"),
  NUMBER_VALIDATION_TOO_BIG("validation.numberTooBig"),
  NUMBER_VALIDATION_TOO_SMALL("validation.numberTooSmall"),
  NUMBER_VALIDATION_NON_INTEGER("validation.numberNonInteger"),
  REQUIRED_FIELDS_ANNOTATION("content.requiredFieldsAnnotation"),
  SUBMITTED_DATE("content.submittedDate"),
  TEXT_VALIDATION_TOO_LONG("validation.textTooLong"),
  TEXT_VALIDATION_TOO_SHORT("validation.textTooShort"),
  TITLE_APPLICATION_CONFIRMATION("title.applicationConfirmation"),
  TITLE_CREATE_AN_ACCOUNT("title.createAnAccount"),
  TITLE_PROGRAMS("title.programs"),
  TITLE_PROGRAMS_ACTIVE_UPDATED("title.activeProgramsUpdated"),
  TITLE_PROGRAMS_IN_PROGRESS_UPDATED("title.inProgressProgramsUpdated"),
  TITLE_PROGRAM_SUMMARY("title.programSummary"),
  TITLE_PROGRAMS_SUBMITTED("title.submittedPrograms"),
  TOAST_APPLICATION_SAVED("toast.applicationSaved"),
  TOAST_APPLICATION_OUT_OF_DATE("toast.applicationOutOfDate"),
  TOAST_LOCALE_NOT_SUPPORTED("toast.localeNotSupported"),
  TOAST_PROGRAM_COMPLETED("toast.programCompleted"),
  USER_NAME("header.userName"),
  VALIDATION_REQUIRED("validation.isRequired");

  private final String keyName;

  MessageKey(String keyName) {
    this.keyName = keyName;
  }

  public String getKeyName() {
    return this.keyName;
  }
}
