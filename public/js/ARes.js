$(document).ready(() => {
    const resBtn = $('#resourcesSaver')
  
    resBtn.submit(() => {
      var topic = $('#Atop')
      var content = $('#Acon')
  
  
      fetch('/admin/resource', {
        method: 'POST',
        body: JSON.stringify({
          topic: topic.val(),
          content: content.val()
        }),
        headers: {
          'Content-type': 'application/json; charset = utf-8'
        }
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          if (data.error) {
            alert(data.message)
          } else {
            alert(data.message)
            location.reload()
          }
        })
    })
  
    const buildResources = (res) =>{
        const motherDiv = $('#resList')
        res.forEach(element => {  
            motherDiv.append(buildTemplate(element))
        });
    }
  
    const buildTemplate = (ress) => {
      return  `<div class="card m-2">
                <h5 class="card-header">Resources</h5>
                <div class="card-body">
                  <h5 class="card-title">${ress.topic}</h5>
                  <p class="card-text"> ${ress.content}</p>
                  
                 
                </div>
              </div>` /*Change the path*/
              
     
    }
  
    const resourceLoader = () => {
      fetch('/admin/getResList', {
        method: 'GET'
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          buildResources(data.result.reverse())
          //   alert(data.msg)
        })
    }
  
    resourceLoader()
  })
  