const HTTP_OK = 200

const ENDPOINTS = {
  all: '/api/all'
}

class App {
  constructor () {
    this.users = []
  }

  getUsers () {
    const headers = { 'Content-Type': 'application/json' }
    const method = 'GET'
    const options = { method, headers }

    fetch(ENDPOINTS.all, options).then(this.onGetUsers.bind(this))
  }

  onGetUsers (response) { 
    let $users = getElement('.js-users')

    response.json().then((data) => {
      if (response && response.status === HTTP_OK) {
        data.forEach((userData) => {
          let user = new User(userData)
          $users.appendChild(user.render())
          this.users.push(user)
        })
      } else {
        console.error(data)
      }
    }).catch((e) => { 
      console.error(e)
    })
  }
}
