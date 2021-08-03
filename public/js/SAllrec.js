$(document).ready(() => {
    const display = $('#companyList')
  
    const getCompList = () => {
      fetch('/student/reclist', { method: 'GET' })
        .then(response => {
          return response.json()
        })
        .then(data => {
          if (data.error) {
            alert(data.msg)
            window.location.replace('/student/dashboard')
            return
          }
  
          buildComp(data)
        })
    }
  
    getCompList()

    //building ids
    const buildID = comp => {
      return {
        applyID: 'apply_' + comp._id,
        // deleteID: 'delete_' + comp._id,
        listItemID: 'listItem_' + comp._id,
        compID: 'comp_' + comp._id
      }
    }
  
    // build edit operation
  
    const applyComp = (comp, compID, applyID) => {
      let applyBtn = $(`#${applyID}`)
      applyBtn.click(() => {
        // alert(`You clicked a button ${comp.companyname}`)
        fetch("/student/apply", {
          method: 'PUT',
          body: JSON.stringify({ compID : comp._id }),
          headers: {
            'content-type': 'application/json; charset = utf-8'
          }
        }).then((response) => {
            return response.json();
          }).then((data) => {
            if (data.error) {
              if(data.noApplicant){
                window.location.replace('./academics')
              }
            }
            alert(data.msg)
          })
      })
    };

  
  
    // building the company list template

    const buildTemplate = (comp, ids, index) => {
      return `<tr id="${ids.listItemID}">
          <td>${index}</td>
          <td><a href="${comp.website}">${comp.companyname}</a></td>
          <td>${comp.package}</td>
          <td>${comp.cutoff}</td>
          <td><button class="btn btn-success" id="${ids.applyID}">Apply</button></td>    
      </tr>`
    }
   
    // building the company list
    const buildComp = data => {
      let index = 1;
      data.forEach(comp => {
        let ids = buildID(comp)
        display.append(buildTemplate(comp, ids, index))
        applyComp(comp, ids.compID, ids.applyID)
        index++;
        // deleteComp(comp, ids.listItemID, ids.deleteID);
      })
    }
  })
  