
module.exports = {
    passwordResetJwtSecret : process.env.JWT_PASSWORD_RESET_SECRET || 'PASSWORDRESETSECRET',
    registrationSecrect :process.env.JWT_REGISTRATION_SECRET || 'REGISTRATIONSECRET'
}