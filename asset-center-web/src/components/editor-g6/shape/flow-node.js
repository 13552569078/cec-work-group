import editorStyle from '../util/default-style';

const baseDefaultOptions = {
  icon: null,
  style: {
    ...editorStyle.nodeStyle,
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    shadowBlur: 4,
    shadowColor: 'rgba(180,191,239,0.3)',
    lineWidth: 1,
    radius: 2,
    strokeOpacity: 1,
    fill: '#FFFFFF',
    stroke: '#C8D1F8',
    cursor: 'default'
  },
  labelCfg: {
    position: 'center',
    offset: 0,
    style: {
      fill: '#ffffff',
      fontSize: 12,
      opacity: 0
    }
  },
  stateStyles: {
    selected: editorStyle.nodeSelectedStyle,
    hover: {
      cursor: editorStyle.cursor.hoverNode
    }
  }
};

const taskDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 12,
    height: 12,
    left: 2,
    top: 2
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#E7F7FE',
    stroke: '#1890FF',
    cursor: 'default'
  },
  stateStyles: {
    selected: {
      fill: '#95D6FB'
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode
    }
  }
};

const gatewayDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 20,
    height: 20,
    left: 2,
    top: 2
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#E8FEFA',
    stroke: '#13C2C2',
    cursor: 'default'
  },
  stateStyles: {
    selected: {
      fill: '#8CE8DE'
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode
    }
  }
};

const startDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 18,
    height: 18,
    left: 6,
    top: 6
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#FEF7E8',
    stroke: '#FA8C16',
    cursor: 'default'
  },
  stateStyles: {
    selected: {
      fill: '#FCD49A'
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode
    }
  }
};

const endDefaultOptions = {
  icon: null,
  style: {
    ...editorStyle.nodeStyle,
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    shadowBlur: 4,
    shadowColor: 'rgba(180,191,239,0.3)',
    lineWidth: 1,
    radius: 2,
    strokeOpacity: 1,
    fill: '#FFFFFF',
    stroke: '#F0DAC8',
    cursor: 'default'
  },
  labelCfg: {
    position: 'center',
    offset: 0,
    style: {
      fill: '#ffffff',
      fontSize: 12,
      opacity: 0
    }
  },
  stateStyles: {
    selected: editorStyle.nodeSelectedStyle,
    hover: {
      cursor: editorStyle.cursor.hoverNode
    }
  }
};

const catchDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 20,
    height: 20,
    left: -10,
    top: -8
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#FEF7E8',
    stroke: '#FA8C16',
    cursor: 'default'
  },
  stateStyles: {
    selected: {
      fill: '#FCD49A'
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode
    }
  }
};

const getLength = function (str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[^\x00-\xff]/g, 'aa').length;
}

const getLabelText = function (str) {
  const arr = str.split('');
  let len = 0;
  let data = ''
  for (let i = 0; i < arr.length; i++) {
    if (getLength(arr[i]) === 2) {
      len += 2
    } else {
      len++
    }
    if (len >= 14) {
      data = str.substr(0, i + 1) + '...'
      break;
    }
  }
  return data
}

export default function (G6) {
  // 通用组件 结束
  G6.registerNode('end-node', {
    shapeType: 'rect',
    options: {
      ...endDefaultOptions
    },
    afterDraw(cfg, group) {
      group.addShape('image', {
        attrs: {
          typeFlag: 'image',
          x: 60,
          y: -8,
          width: 16,
          height: 16,
          img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAgMAAAAOFJJnAAAADFBMVEX///8NDQ0CAgICAgKxrHwrAAAABHRSTlMDJ3OBAokAkgAAABlJREFUeAFjIBKwTYAyuB/AGQgpbGB4mAwAEK4JBxiP+x0AAAAASUVORK5CYII='
        }
      })

      if (cfg.label) {
        // 如果有文本
        group.addShape('text', {
          attrs: {
            textType: 'name',
            x: -62,
            y: 0,
            textAlign: 'left',
            textBaseline: 'middle',
            text: getLength(cfg.label) > 14 ? getLabelText(cfg.label) : cfg.label,
            fill: '#404040',
            fontSize: 14
          }
        });
      }

      group.addShape('rect', {
        attrs: {
          x: -76,
          y: -20,
          width: 4,
          height: 40,
          stroke: '#F0A468',
          radius: [2, 2],
          fill: '#F0A468'
        }
      })
    },
    update(cfg, node) {
      // 更新节点名称
      node.getContainer().getChildren().map(item => {
        if (item.attrs.textType === 'name') {
          item.attrs.text = getLength(cfg.label) > 14 ? getLabelText(cfg.label) : cfg.label
        }
      })
    },
    getShapeStyle(cfg) {
      cfg.size = [160, 48];
      const width = cfg.size[0];
      const height = cfg.size[1];
      const style = {
        x: 0 - width / 2,
        y: 0 - height / 2,
        width,
        height,
        ...this.options.style
      };
      return style;
    },
    getAnchorPoints() {
      return [
        [0, 0.5] // left
      ]
    }
  }, 'base-node');

  // 逻辑组件
  G6.registerNode('operation-node', {
    shapeType: 'rect',
    options: {
      ...baseDefaultOptions
    },
    afterDraw(cfg, group) {
      group.addShape('image', {
        attrs: {
          typeFlag: 'image',
          x: 60,
          y: -8,
          width: 16,
          height: 16,
          img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAgMAAAAOFJJnAAAADFBMVEX///8NDQ0CAgICAgKxrHwrAAAABHRSTlMDJ3OBAokAkgAAABlJREFUeAFjIBKwTYAyuB/AGQgpbGB4mAwAEK4JBxiP+x0AAAAASUVORK5CYII='
        }
      })

      if (cfg.label) {
        let _label = cfg.label;
        if (cfg.data && cfg.data.name) {
          _label = `${_label}-${cfg.data.name}`;
        }
        // 如果有文本
        group.addShape('text', {
          // attrs: style
          attrs: {
            textType: 'name',
            x: -62,
            y: 0,
            textAlign: 'left',
            textBaseline: 'middle',
            text: getLength(_label) > 14 ? getLabelText(_label) : _label,
            fill: '#404040',
            fontSize: 14
          }
        });
      }

      group.addShape('rect', {
        attrs: {
          x: -76,
          y: -20,
          width: 4,
          height: 40,
          stroke: '#788BDF',
          radius: [2, 2],
          fill: '#788BDF'
        }
      })
    },
    getShapeStyle(cfg) {
      cfg.size = [160, 48];
      const width = cfg.size[0];
      const height = cfg.size[1];
      const style = {
        x: 0 - width / 2,
        y: 0 - height / 2,
        width,
        height,
        ...this.options.style
      };
      return style;
    },
    getAnchorPoints() {
      return [
        [0, 0.5], // left
        [1, 0.5] // right
      ]
    }
  }, 'base-node');
  // 算法组件
  G6.registerNode('algo-node', {
    shapeType: 'rect',
    options: {
      ...baseDefaultOptions
    },
    afterDraw(cfg, group) {
      group.addShape('image', {
        attrs: {
          typeFlag: 'image',
          x: 60,
          y: -8,
          width: 16,
          height: 16,
          img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAgMAAAAOFJJnAAAADFBMVEX///8NDQ0CAgICAgKxrHwrAAAABHRSTlMDJ3OBAokAkgAAABlJREFUeAFjIBKwTYAyuB/AGQgpbGB4mAwAEK4JBxiP+x0AAAAASUVORK5CYII='
        }
      })

      if (cfg.label) {
        // 如果有文本
        const label = '算法-' + cfg.label;
        group.addShape('text', {
          // attrs: style
          attrs: {
            textType: 'name',
            x: -62,
            y: 0,
            textAlign: 'left',
            textBaseline: 'middle',
            text: getLength(label) > 14 ? getLabelText(label) : label,
            fill: '#404040',
            fontSize: 14
          }
        });
      }

      group.addShape('rect', {
        attrs: {
          x: -76,
          y: -20,
          width: 4,
          height: 40,
          stroke: '#788BDF',
          radius: [2, 2],
          fill: '#788BDF'
        }
      })
    },
    getShapeStyle(cfg) {
      cfg.size = [160, 48];
      const width = cfg.size[0];
      const height = cfg.size[1];
      const style = {
        x: 0 - width / 2,
        y: 0 - height / 2,
        width,
        height,
        ...this.options.style
      };
      return style;
    },
    getAnchorPoints() {
      return [
        [0, 0.5], // left
        [1, 0.5] // right
      ]
    }
  }, 'base-node');

  // 基础数据  基础模型 研判模型
  G6.registerNode('input-node', {
    shapeType: 'rect',
    options: {
      ...baseDefaultOptions
    },
    afterDraw(cfg, group) {
      group.addShape('image', {
        attrs: {
          typeFlag: 'image',
          x: 60,
          y: -8,
          width: 16,
          height: 16,
          img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAgMAAAAOFJJnAAAADFBMVEX///8NDQ0CAgICAgKxrHwrAAAABHRSTlMDJ3OBAokAkgAAABlJREFUeAFjIBKwTYAyuB/AGQgpbGB4mAwAEK4JBxiP+x0AAAAASUVORK5CYII='
        }
      })
      if (cfg.label) {
        // 如果有文本
        group.addShape('text', {
          // attrs: style
          attrs: {
            x: -62,
            y: 0,
            textAlign: 'left',
            textBaseline: 'middle',
            text: getLength(cfg.label) > 14 ? getLabelText(cfg.label) : cfg.label,
            fill: '#404040',
            fontSize: 14
          }
        });
      }
      group.addShape('rect', {
        attrs: {
          x: -76,
          y: -20,
          width: 4,
          height: 40,
          stroke: '#788BDF',
          radius: [2, 2],
          fill: '#788BDF'
        }
      })
    },
    getShapeStyle(cfg) {
      cfg.size = [160, 48];
      const width = cfg.size[0];
      const height = cfg.size[1];
      const style = {
        x: 0 - width / 2,
        y: 0 - height / 2,
        width,
        height,
        ...this.options.style
      };
      return style;
    },
    getAnchorPoints() {
      return [
        [1, 0.5] // right
      ]
    }
  }, 'base-node');

  G6.registerNode('task-node', {
    shapeType: 'rect',
    options: {
      ...taskDefaultOptions
    },
    getShapeStyle(cfg) {
      cfg.size = [80, 44];
      const width = cfg.size[0];
      const height = cfg.size[1];
      const style = {
        x: 0 - width / 2,
        y: 0 - height / 2,
        width,
        height,
        ...this.options.style
      };
      return style;
    }
  }, 'base-node');
  G6.registerNode('gateway-node', {
    shapeType: 'path',
    labelPosition: 'bottom',
    options: {
      ...gatewayDefaultOptions
    },
    getShapeStyle(cfg) {
      cfg.size = [40, 40];
      const width = cfg.size[0];
      const height = cfg.size[1];
      const gap = 4;
      const style = {
        path: [
          ['M', 0 - gap, 0 - height / 2 + gap],
          ['Q', 0, 0 - height / 2, gap, 0 - height / 2 + gap],
          ['L', width / 2 - gap, 0 - gap],
          ['Q', width / 2, 0, width / 2 - gap, gap],
          ['L', gap, height / 2 - gap],
          ['Q', 0, height / 2, 0 - gap, height / 2 - gap],
          ['L', -width / 2 + gap, gap],
          ['Q', -width / 2, 0, -width / 2 + gap, 0 - gap],
          ['Z']
        ],
        ...this.options.style
      };
      return style;
    }
  }, 'base-node');
  G6.registerNode('exclusive-gateway-node', {
    afterDraw(cfg, group) {
      group.icon = group.addShape('path', {
        attrs: {
          path: [
            ['M', -8, -8],
            ['L', 8, 8],
            ['Z'],
            ['M', 8, -8],
            ['L', -8, 8],
            ['Z']
          ],
          lineWidth: 2,
          stroke: this.options.style.stroke
        }
      });
      this.runAnimate(cfg, group);
    }
  }, 'gateway-node');
  G6.registerNode('parallel-gateway-node', {
    afterDraw(cfg, group) {
      group.icon = group.addShape('path', {
        attrs: {
          path: [
            ['M', 0, -10],
            ['L', 0, 10],
            ['Z'],
            ['M', -10, 0],
            ['L', 10, 0],
            ['Z']
          ],
          lineWidth: 2,
          stroke: this.options.style.stroke
        }
      });
      this.runAnimate(cfg, group);
    }
  }, 'gateway-node');
  G6.registerNode('inclusive-gateway-node', {
    afterDraw(cfg, group) {
      group.icon = group.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: 10,
          lineWidth: 2,
          stroke: this.options.style.stroke
        }
      });
      this.runAnimate(cfg, group);
    }
  }, 'gateway-node');
  G6.registerNode('start-node', {
    shapeType: 'circle',
    labelPosition: 'bottom',
    options: {
      ...startDefaultOptions
    },
    getShapeStyle(cfg) {
      cfg.size = [30, 30];
      const width = cfg.size[0];
      const style = {
        x: 0,
        y: 0,
        r: width / 2,
        ...this.options.style
      };
      // eslint-disable-next-line no-prototype-builtins
      if (cfg.hasOwnProperty('color')) {
        style.fill = cfg.color
      }
      return style;
    },
    afterDraw(cfg, group) {
      if (cfg.active) {
        const shape = group.get('children')[0];
        shape.animate({
          repeat: true,
          onFrame(ratio) {
            const diff = ratio <= 0.5 ? ratio * 10 : (1 - ratio) * 10;
            let radius = cfg.size;
            if (isNaN(radius)) radius = radius[0];
            return {
              r: radius / 2 + diff
            }
          }
        }, 3000, 'easeCubic');
      }
      group.icon = group.addShape('path', {
        attrs: {
          path: [
            ['M', -4, -6],
            ['L', 6, 0],
            ['L', -4, 6],
            ['Z'] // close
          ],
          fill: this.options.style.stroke,
          stroke: this.options.style.stroke
        }
      });
    },
    getAnchorPoints() {
      return [
        [0.5, 0], // top
        [1, 0.5], // right
        [0.5, 1] // bottom
      ]
    }
  }, 'base-node');
  // G6.registerNode('end-node', {
  //  shapeType: 'circle',
  //  labelPosition: 'bottom',
  //  options: {
  //    ...endDefaultOptions
  //  },
  //  getShapeStyle(cfg) {
  //    cfg.size = [30, 30];
  //    const width = cfg.size[0];
  //    const style = {
  //      x: 0,
  //      y: 0,
  //      r: width / 2,
  //      ...this.options.style,
  //    };
  //    if(cfg.hasOwnProperty('color')){
  //      style.fill = cfg.color
  //    }
  //    return style;
  //  },
  //  afterDraw(cfg, group) {
  //    if(cfg.active) {
  //
  //    }
  //    group.icon = group.addShape('path', {
  //      attrs: {
  //        path: [
  //          ['M', -4 , -4],
  //          ['L', 4, -4],
  //          ['L', 4, 4],
  //          ['L', -4, 4],
  //          ['Z'] // close
  //        ],
  //        fill: this.options.style.stroke,
  //        stroke: this.options.style.stroke,
  //      }
  //    });
  //  },
  //  getAnchorPoints() {
  //    return [
  //      [0.5, 0], // top
  //      [0.5, 1], // bottom
  //      [0, 0.5], // left
  //    ]
  //  }
  // }, 'base-node');
  G6.registerNode('catch-node', {
    shapeType: 'path',
    labelPosition: 'bottom',
    options: {
      ...catchDefaultOptions
    },
    getShapeStyle(cfg) {
      cfg.size = [50, 30];
      const width = cfg.size[0];
      const height = cfg.size[1];
      const style = {
        path: [
          ['M', 0, -height / 3],
          ['L', width / 2, -height / 3],
          ['L', 0, height / 3 * 2],
          ['L', -width / 2, -height / 3],
          ['Z'] // close
        ],
        ...this.options.style
      };
      return style;
    },
    getAnchorPoints() {
      return [
        [0.5, 0], // top
        [0.8, 0.38], // right
        [0.5, 1], // bottom
        [0.2, 0.38] // left
      ]
    }
  }, 'base-node');
  G6.registerNode('user-task-node', {
    options: G6.Util.deepMix({}, taskDefaultOptions, {
      icon: require('../assets/icons/flow/icon-user.svg'),
      style: {
        fill: '#E7F7FE',
        stroke: '#1890FF'
      },
      stateStyles: {
        selected: {
          fill: '#95D6FB'
        }
      }
    })
  }, 'task-node');
  G6.registerNode('script-task-node', {
    options: G6.Util.deepMix({}, taskDefaultOptions, {
      icon: require('../assets/icons/flow/icon-script.svg'),
      style: {
        fill: '#FFF7E6',
        stroke: '#FFA940'
      },
      stateStyles: {
        selected: {
          fill: '#FFE7BA'
        }
      }
    })
  }, 'task-node');
  G6.registerNode('java-task-node', {
    options: G6.Util.deepMix({}, taskDefaultOptions, {
      icon: require('../assets/icons/flow/icon-java.svg'),
      style: {
        fill: '#FFF1F0',
        stroke: '#FF4D4F'
      },
      stateStyles: {
        selected: {
          fill: '#FFCCC7'
        }
      }
    })
  }, 'task-node');
  G6.registerNode('mail-task-node', {
    options: G6.Util.deepMix({}, taskDefaultOptions, {
      icon: require('../assets/icons/flow/icon-mail.svg'),
      style: {
        fill: '#F6FFED',
        stroke: '#73D13D'
      },
      stateStyles: {
        selected: {
          fill: '#D9F7BE'
        }
      }
    })
  }, 'task-node');
  G6.registerNode('receive-task-node', {
    options: G6.Util.deepMix({}, taskDefaultOptions, {
      icon: require('../assets/icons/flow/icon-receive.svg'),
      style: {
        fill: '#FFF0F6',
        stroke: '#FF85C0'
      },
      stateStyles: {
        selected: {
          fill: '#FFD6E7'
        }
      }
    })
  }, 'task-node');
  G6.registerNode('timer-start-node', {
    options: G6.Util.deepMix({}, startDefaultOptions, { icon: require('../assets/icons/flow/icon-timer.svg') }),
    afterDraw(cfg, group) { this.runAnimate(cfg, group) }
  }, 'start-node');
  G6.registerNode('message-start-node', {
    options: G6.Util.deepMix({}, startDefaultOptions, { icon: require('../assets/icons/flow/icon-message.svg') }),
    afterDraw(cfg, group) { this.runAnimate(cfg, group) }
  }, 'start-node');
  G6.registerNode('signal-start-node', {
    options: G6.Util.deepMix({}, startDefaultOptions, { icon: require('../assets/icons/flow/icon-signal.svg') }),
    afterDraw(cfg, group) { this.runAnimate(cfg, group) }
  }, 'start-node');
  G6.registerNode('timer-catch-node', {
    options: G6.Util.deepMix({}, catchDefaultOptions, { icon: require('../assets/icons/flow/icon-timer.svg') })
  }, 'catch-node');
  G6.registerNode('signal-catch-node', {
    options: G6.Util.deepMix({}, catchDefaultOptions, { icon: require('../assets/icons/flow/icon-signal.svg') })
  }, 'catch-node');
  G6.registerNode('message-catch-node', {
    options: G6.Util.deepMix({}, catchDefaultOptions, { icon: require('../assets/icons/flow/icon-message.svg') })
  }, 'catch-node');
}
