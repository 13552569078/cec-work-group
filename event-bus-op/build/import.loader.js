const regex = /import\.meta\.(env|globEager\(([^}]*?)\))/g;

/**
 * Webpack loader to rewrite `import.meta` in modules with url data to the source code file location.
 */
module.exports = function (source) {
  let found = false;
  const rewrittenSource = source.replace(regex, () => {
    found = true;
    return `({ })`;
  });

  if (found) {
    return `${rewrittenSource}`;
  } else {
    return source;
  }
};
