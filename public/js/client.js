const onLoad = () => {
  if (window.isLoggedIn) {
    console.log('logged in')
  } else {
    console.log('not logged in')
  }

  const app = new App()
  app.getUsers()
}


window.onload = onLoad
