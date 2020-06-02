module.exports = {
    siteMetadata: {
      title: `nancychauhan`,
      name: `Nancy Chauhan`,
      siteUrl: `https://nancychauhan.in`,
      description: `This is my description that will be used in the meta tags and important for search results`,
  
      // important to set the main text that appears in the hero
      hero: {
        heading: `Hi, I'm Nancy. <br/> <br/> Let's build something together.`,
        maxWidth: 652,
      },
      social: [
        {
          name: `twitter`,
          url: `https://twitter.com/_nancychauhan`,
        },
        {
          name: `github`,
          url: `https://github.com/Nancy-Chauhan`,
        },
      ],
    },
    plugins: [
        {
          resolve: "@narative/gatsby-theme-novela",
          options: {
            contentPosts: "content/posts",
            contentAuthors: "content/authors",
            basePath: "/",
            mailchimp: false,
            authorsPage: true,
            sources: {
              local: true,
              // contentful: true,
            },
          },
        },
      ],
    };
