<p align="center">
  <a href="https://www.prosesspilotene.no">
    <img alt="ProsessPilotene" src="https://res.cloudinary.com/prosesspilotene/image/upload/v1587373586/logo/prosesspilotene/ProsessPiloteneLogoHorisontal.svg" width="60" />
  </a>
</p>

<h1 align="center">
  Gatsbyjs source plugin for Dynamics Marketing
</h1>

A simple source plugin, using standard dynamcis marketing apis, to allow Gatsby based sites create a marketing calendar.

## 🚀 Quick start

To get started creating a new plugin, you can follow these steps:

1. Install the plugin to your existing Gatsby site `npm install`

```shell
npm install gatsby-source-dynamics-marketing
```

1. Include the plugin in a Gatsby site

Inside of the `gatsby-config.js` file of your site (in this case, `my-gatsby-site`), include the plugin in the `plugins` array:

```javascript
module.exports = {
  plugins: [
    // other gatsby plugins
    // ...
    {
      resolve: `gatsby-source-dynamics-marketing`,
      options: {
        apiKey: "API Key as defined by Dynamics Markerint",
        apiEndPoint: "API endpont something ike https://e0caasfsdfsdfadsf0edbc.svc.dynamics.com",
        Origin: "http://localhost:8000",
      },
    },
  ],
}
```

1. Verify the plugin was added correctly

The plugin added by the starter implements a single Gatsby API in the `gatsby-node` that logs a message to the console. When you run `gatsby develop` or `gatsby build` in the site that implements your plugin, you should see this message.

You can verify your plugin was added to your site correctly by running `gatsby develop` for the site.

You should now see a message logged to the console in the preinit phase of the Gatsby build process:

```shell
$ gatsby develop
success open and validate gatsby-configs - 0.033s
success load plugins - 0.074s
Loaded gatsby-source-dynamics-marketing
success onPreInit - 0.016s
...
```

## 🎓 Learning Microsoft Dynamics Marketing

If you're looking for more guidance on how to use Dynamics Marketing, contact our support staff at support@prosesspilotene.no


## 🎓 Learning Gatsby

If you're looking for more guidance on plugins, how they work, or what their role is in the Gatsby ecosystem, check out some of these resources:

- The [Creating Plugins](https://www.gatsbyjs.com/docs/creating-plugins/) section of the docs has information on authoring and maintaining plugins yourself.
- The conceptual guide on [Plugins, Themes, and Starters](https://www.gatsbyjs.com/docs/plugins-themes-and-starters/) compares and contrasts plugins with other pieces of the Gatsby ecosystem. It can also help you [decide what to choose between a plugin, starter, or theme](https://www.gatsbyjs.com/docs/plugins-themes-and-starters/#deciding-which-to-use).
- The [Gatsby plugin library](https://www.gatsbyjs.com/plugins/) has over 1750 official as well as community developed plugins that can get you up and running faster and borrow ideas from.
