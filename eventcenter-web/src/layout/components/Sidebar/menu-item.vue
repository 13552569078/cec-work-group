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
    },
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon} class='sub-c-icon nothover' style='font-size:28px;' />)
      vnodes.push(<svg-icon icon-class={`${icon}-hover`} class='sub-c-icon ishover' style='font-size:28px;' />)
    } else {
      vnodes.push(<span style='width: 28px;display:inline-block'></span>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{title}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-c-icon {
  color: currentColor;
  width: 16px !important;
  height: 16px !important;
  margin-right: 10px;
}
.c-menu .svg-icon {
  opacity: 1;
}
.c-menu-item:hover .svg-icon.ishover {
  display: inline-block;
}
.c-menu-item:hover .svg-icon.nothover {
  display: none;
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
