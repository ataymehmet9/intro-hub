type AuthLinks = {
  login: string
  signUp: string
  forgotPassword: string
  resetPassword: string
}

export type AppConfig = {
  apiPrefix: string
  authenticatedEntryPath: string
  unAuthenticatedEntryPath: string
  authPaths: AuthLinks
  locale: string
  accessTokenPersistStrategy: 'localStorage' | 'sessionStorage' | 'cookies'
  enableMock: boolean
  activeNavTranslation: boolean
}

const appConfig: AppConfig = {
  apiPrefix: '/api',
  authenticatedEntryPath: '/dashboard',
  unAuthenticatedEntryPath: '/',
  authPaths: {
    login: '/login',
    signUp: '/signup',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password'
  },
  locale: 'en',
  accessTokenPersistStrategy: 'cookies',
  enableMock: false,
  activeNavTranslation: false,
}

export default appConfig
