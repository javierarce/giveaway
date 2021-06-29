class User {
  constructor (data) {
    this.username = data.username
    this.created_at = data.created_at
    this.profileImage = data.profileImage
    this.updated_at = data.updated_at

    this.delay = Math.random() * 1500
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

    $img.style.transitionDelay = `${this.delay}ms`

    $img.onload = () => {
      $img.classList.add('is-visible')

      setTimeout(() => {
        $img.style.transitionDelay = '0ms'
      }, 100)
    }

    $img.src = this.profileImage

    return $img
  }

  render () {
    this.$element = document.createElement('a')
    this.$element.href = `https://twitter.com/${this.username}`
    this.$element.target = '_blank'
    this.$element.classList.add('User')
    this.$element.appendChild(this.createAvatar())

    return this.$element
  }
}
