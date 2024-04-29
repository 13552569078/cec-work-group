<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal, isOpenInIframe } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    isOpenInIframe() {
      return isOpenInIframe(this.to)
    },
    type() {
      if (this.isExternal && !this.isOpenInIframe) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      if (this.isOpenInIframe) {
        return {
          to: {
            path: '/other/iframe',
            query: {
              path: to
            }
          }
        }
      } else if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
