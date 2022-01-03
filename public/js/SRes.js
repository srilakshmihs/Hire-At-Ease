$(document).ready(() => {
  
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
      fetch('/student/getResList', {
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
  