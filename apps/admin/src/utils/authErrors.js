// Firebase Auth Error Handler
export const getAuthErrorMessage = (error) => {
  switch (error) {
    case 'auth/invalid-phone-number':
      return 'Invalid phone number format. Please include country code.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/invalid-verification-code':
      return 'Invalid verification code. Please check and try again.';
    case 'auth/code-expired':
      return 'Verification code has expired. Please request a new one.';
    case 'auth/missing-phone-number':
      return 'Phone number is required.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded. Please try again later.';
    case 'auth/app-not-authorized':
      return 'App not authorized for SMS. Please contact support.';
    case 'auth/recaptcha-not-enabled':
      return 'reCAPTCHA verification failed. Please try again.';
    default:
      return error || 'An unexpected error occurred. Please try again.';
  }
};