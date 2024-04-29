const title = window.GLOBAL_CONFIG.pageTitle || 'admin template'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
