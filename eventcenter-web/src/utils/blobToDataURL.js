const blobToDataURL = file => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function(evt) {
      resolve(evt.target.result)
    }
  })
}
export default blobToDataURL
