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

        buildMessage(data.result.reverse())
      })
  }

  getNotifications()

  const buildMessage = msgs => {
    const motherDiv = $('#msgList')
    msgs.forEach(element => {
      display.append(buildTemplate(element))
    })
  }

  const buildTemplate = msg => {
    return `<div class="card m-2">
              <h5 class="card-header">Announcement</h5>
              <div class="card-body">
                <h5 class="card-title">${msg.message}</h5>
                <p class="card-text">Branch ${msg.msgto}</p>
                <p class="card-text">Date ${msg.date.slice(0,10)}</p>
                <a href="/student/companies" class="btn btn-primary">View more</a>
              </div>
            </div>`
    
  }
})
