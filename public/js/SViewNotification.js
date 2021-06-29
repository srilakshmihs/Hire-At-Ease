$(document).ready(() => {
    const display = $('#notifications')
  
    const getNotifications = () => {
      fetch('/student/notifications', { method: 'GET' })
        .then(response => {
          return response.json()
        })
        .then(data => {
          if (data.error) {
            alert(data.msg)
            window.location.replace('/student/dashboard')
            return
          }
  
          console.log(data)
          buildComp(data)
          console.log('Data is here in frontend')
        })
    }
  
    getNotifications()

    // building the company list template

    
    
  })
