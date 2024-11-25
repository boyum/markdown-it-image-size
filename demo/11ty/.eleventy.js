const markdownIt = require("markdown-it");
const { markdownItImageSize } = require("markdown-it-image-size");

module.exports = (eleventyConfig) => {
  eleventyConfig.setLibrary("md", markdownIt().use(markdownItImageSize));

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    pathPrefix: "/",
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
