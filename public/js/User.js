class User {
  constructor (data) {
    console.log(data)
    this.username = data.username
    this.created_at = data.created_at
    this.profileImage = data.profileImage
    this.updated_at = data.updated_at
  }

  show () {
    this.$element.classList.remove('is-hidden')
  }

  hide () {
    this.$element.classList.add('is-hidden')
  }

  createAvatar () {
    let $img = new Image()

    $img.classList.add('Avatar')

    $img.onload = () => {
      $img.classList.add('is-visible')
    }

    $img.src = this.profileImage

    return $img
  }

  render () {
    this.$element = document.createElement('div')
    this.$element.classList.add('User')
    this.$element.appendChild(this.createAvatar())

    return this.$element
  }
}
