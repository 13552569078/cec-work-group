import { settingsConf } from '../settings'

const title = settingsConf.title || 'ioc vue template'

export default function getPageTitle(pageTitle) {
  if (pageTitle && settingsConf.showRouteTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
