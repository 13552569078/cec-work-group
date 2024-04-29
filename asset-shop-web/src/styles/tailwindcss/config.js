// eslint-disable-next-line no-undef
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#36A4FF',
        page: '#f1f5fb',
        'regal-blue': '#243c5a' },
      boxShadow: {
        'shop-car':
          '0px 4px 24px 0px rgba(41, 48, 64, 0.12),0px 16px 32px 0px rgba(41, 48, 64, 0.06);'
      }
    }
  },
  // 不覆盖之前样式
  corePlugins: { preflight: false }
}
