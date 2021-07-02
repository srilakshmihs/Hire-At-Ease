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
        buildMessage(data.result.reverse())
        console.log('Data is here in frontend')
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
                <a href="/student/companies" class="btn btn-primary">Apply</a>
              </div>
            </div>`
    
              /*`<div class="m-3">
                <div class="row p-2" style="background-color: cadetblue;">
                    <div class="col-2">To</div>
                    <div class="col-1">:</div>
                    <div class="col-9">${msg.msgto}</div>
                </div>
                <div class="row p-2" style="background-color: cadetblue;">
                    <div class="col-2">Message</div>
                    <div class="col-1">:</div>
                    <div class="col-9">${msg.message}</div>
                </div>
                <div class="row p-2" style="background-color: cadetblue;">
                    <div class="col-2">Date</div>
                    <div class="col-1">:</div>
                    <div class="col-9">${msg.date.slice(0, 10)}</div>
                </div>
            </div>`*/
  }
})
