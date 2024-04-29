<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('c-icon')) {
        vnodes.push(<i class={[icon, 'sub-c-icon']} />)
      } else if (icon.includes('icon-c')) {
        vnodes.push(<i class={['iconfont', icon, 'sub-c-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon} class='sub-c-icon nothover' style='font-size:28px;' />)
        vnodes.push(<svg-icon icon-class={icon + '-hover'} class='sub-c-icon ishover' style='font-size:28px;' />)
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{title}</span>)
    }
    return vnodes
  }
}
</script>

<style lang="scss" scoped>
.sub-c-icon {
  color: currentColor;
  width: 16px !important;
  height: 16px !important;
  margin-right: 10px;
}
.c-menu .svg-icon {
  opacity: 1;
}
.router-link-active .svg-icon {
  opacity: 1;
}
.svg-icon.nothover {
  display: inline-block;
}
.svg-icon.ishover {
  display: none;
}
.router-link-active .svg-icon.ishover  {
  display: inline-block;
}
.router-link-active .svg-icon.nothover  {
  display: none;
}
</style>
