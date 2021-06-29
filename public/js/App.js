const HTTP_OK = 200

const ENDPOINTS = {
  all: '/api/all'
}

class App {
  constructor () {
    this.users = []
    this.spinner = new Spinner()
    this.$element = getElement('.js-app')
    this.render()
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
  }

  render () {
    this.$users = createElement({ className: 'Users' })
    this.$element.appendChild(this.spinner.$element)
    this.$element.appendChild(this.$users)
    this.getUsers()
  }
}
