class Validators {
  async emailValidator(promptContext) {
    // This condition is our validation rule. You can also change the value at this point.
    return promptContext.recognized.succeeded && /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(promptContext.recognized.value)
  }

  async direccionValidator(promptContext) {
    // This condition is our validation rule. You can also change the value at this point.
    return promptContext.recognized.succeeded && true
  }
}

module.exports.Validators = Validators;