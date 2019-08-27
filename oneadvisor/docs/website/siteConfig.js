/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
    title: "One Advisor Docs", // Title for your website.
    tagline: "",
    url: "https://docs.oneadvisor.net", // Your website URL
    baseUrl: "/", // Base URL for your project */

    // Used for publishing and more
    projectName: "oneadvisor-docs-site",
    organizationName: "One Advisor",

    // For no header links in the top nav bar -> headerLinks: [],
    headerLinks: [{ doc: "doc1", label: "Docs" }],

    /* path to images for header/footer */
    headerIcon: "img/favicon.png",
    footerIcon: "img/favicon.png",
    favicon: "img/favicon.png",

    /* Colors for website */
    colors: {
        primaryColor: "#00152A",
        secondaryColor: "#48a9a6",
    },

    // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
    copyright: `Copyright © ${new Date().getFullYear()} One Advisor`,

    highlight: {
        // Highlight.js theme to use for syntax highlighting in code blocks.
        theme: "default",
    },

    // On page navigation for the current documentation page.
    onPageNav: "separate",
    // No .html extensions for paths.
    cleanUrl: true,

    fonts: {
        myFont: ["Nunito", "sans-serif"],
    },

    stylesheets: ["https://fonts.googleapis.com/css?family=Nunito:300,400,700&display=swap"],

    // For sites with a sizable amount of content, set collapsible to true.
    // Expand/collapse the links and subcategories under categories.
    // docsSideNavCollapsible: true,

    // Show documentation's last contributor's name.
    // enableUpdateBy: true,

    // Show documentation's last update time.
    // enableUpdateTime: true,

    // You may provide arbitrary config keys to be used as needed by your
    // template. For example, if you need your repo's URL...
    //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
