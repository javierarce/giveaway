const HTTP_OK = 200

const ENDPOINTS = {
  all: '/api/all'
}

class App {
  constructor () {
    this.users = []
    this.spinner = new Spinner()
    this.$element = getElement('.js-app')
    this.$content = getElement('.js-content')
    this.$cover = getElement('.js-cover')
    this.render()
  }

  setLoaded () {
    this.$element.classList.add('is-loaded')
  }

  getUsers () {
    const headers = { 'Content-Type': 'application/json' }
    const method = 'GET'
    const options = { method, headers }

    this.spinner.show()
    fetch(ENDPOINTS.all, options).then(this.onGetUsers.bind(this))
  }

  onGetUsers (response) { 
    this.spinner.hide()

    response.json().then((data) => {
      if (response && response.status != HTTP_OK) {
        console.error(data)
        return
      }
      this.addUsers(data)
    }).catch((e) => { 
      console.error(e)
    })
  }

  addUsers (data) {
    data.forEach((userData) => {
      let user = new User(userData)
      this.$users.appendChild(user.render())
      this.users.push(user)
    })

    this.setLoaded()
  }

  addThanks () {
    this.$thanks = createElement({ className: 'Thanks', html: 'Thanks! If you are selected<br />I\'ll contact you through Twitter.' })
    this.$cover.appendChild(this.$thanks)
  }

  addLogin () {
    if (window.isLoggedIn) {
      this.addThanks()
      return
    }

    this.$login = createElement({ className: 'Login' })
    this.$loginButton = createElement({ className: 'Login__link', type: 'a', text: 'Login with Twitter', href:"/login" })
    this.$login.appendChild(this.$loginButton)
    this.$cover.appendChild(this.$login)
  }

  render () {
    this.$users = createElement({ className: 'Users' })
    this.$content.appendChild(this.spinner.$element)
    this.$content.appendChild(this.$users)

    this.addLogin()
    this.getUsers()
  }
}
