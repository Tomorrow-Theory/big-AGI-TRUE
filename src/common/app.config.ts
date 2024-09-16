/**
 * Application Identity (Brand)
 *
 * Also note that the 'Brand' is used in the following places:
 *  - README.md               all over
 *  - package.json            app-slug and version
 *  - [public/manifest.json]  name, short_name, description, theme_color, background_color
 */
export const Brand = {
  Title: {
    Base: 'Aurora',
    Common: (process.env.NODE_ENV === 'development' ? '[DEV] ' : '') + 'Aurora',
  },
  Meta: {
    Description: 'Launch Aurora by Tomorrow Theory to unlock the full potential of AI, with precise control over your data and models. Voice interface, AI personas, advanced features, and fun UX.',
    SiteName: 'Aurora | Tomorrow Theory',
    ThemeColor: '#7D41FF',
    TwitterSite: '@tomorrowtheory',
  },
  URIs: {
    Home: 'https://tomorrowtheory.com',
    // App: 'https://get.big-agi.com',
    CardImage: 'https://tomorrowtheory.com/wp-content/uploads/fondnoir_anneauviolet_notagline-1-e1692885486505-2048x570.png',
    OpenRepo: '',
    OpenProject: 'https://github.com/users/enricoros/projects/4',
    SupportInvite: 'https://discord.gg/MkH4qj2Jp9',
    // Twitter: 'https://www.twitter.com/enricoros',
    PrivacyPolicy: 'https://tomorrowtheory.com/en/terms-of-service-contact/',
  },
  Docs: {
    Public: (docPage: string) => `https://big-agi.com/docs/${docPage}`,
  }
} as const;