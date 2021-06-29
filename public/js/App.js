const HTTP_OK = 200

const ENDPOINTS = {
  all: '/api/all'
}

class App {
  constructor () {
    this.users = []
    this.$element = getElement('.js-users')
    this.getUsers()
  }

  getUsers () {
    const headers = { 'Content-Type': 'application/json' }
    const method = 'GET'
    const options = { method, headers }

    fetch(ENDPOINTS.all, options).then(this.onGetUsers.bind(this))
  }

  onGetUsers (response) { 
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
      this.$element.appendChild(user.render())
      this.users.push(user)
    })
  }
}
