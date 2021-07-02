$(document).ready(() => {
  const msgBtn = $('#messageSaver')

  msgBtn.submit(() => {
    var messageto = $('#Ato')
    var announcement = $('#Amsg')


    fetch('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify({
        messageto: messageto.val(),
        announcement: announcement.val()
      }),
      headers: {
        'Content-type': 'application/json; charset = utf-8'
      }
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
        if (data.error) {
          alert(data.message)
        } else {
          alert(data.message)
          location.reload()
        }
      })
  })

  const buildMessage = (msgs) =>{
      const motherDiv = $('#msgList')
      msgs.forEach(element => {  
          motherDiv.append(buildTemplate(element))
      });
  }

  const buildTemplate = (msg) => {
    return  `<div class="card m-2">
              <h5 class="card-header">Announcement</h5>
              <div class="card-body">
                <h5 class="card-title">${msg.message}</h5>
                <p class="card-text">Branch ${msg.msgto}</p>
                <p class="card-text">Date ${msg.date.slice(0,10)}</p>
                <a href="/student/companies" class="btn btn-primary">Apply</a>
              </div>
            </div>` /*Change the payh*/
            
    /*<div class="m-3">
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
</div>*/
  }

  const messageLoader = () => {
    fetch('/admin/getMsgList', {
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data.result)
        buildMessage(data.result.reverse())
        //   alert(data.msg)
      })
  }

  messageLoader()
})
