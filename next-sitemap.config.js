module.exports = {
    siteUrl: 'https://www.joblawn.com',
    generateRobotsTxt: true,
    exclude: ['/dashboard/*', '/verify-otp/*', '/forget-password/*'],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/dashboard/*', '/verify-otp/*', '/forget-password/*']
        }
      ]
    }
  }
  