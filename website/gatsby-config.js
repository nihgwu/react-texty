module.exports = {
  pathPrefix: '/react-texty',
  siteMetadata: {
    title: 'Website for react-texty',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-39825336-3',
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-offline',
  ],
}
