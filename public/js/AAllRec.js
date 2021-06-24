$(document).ready(() => {
  const display = $('#companyList')

  const getCompList = () => {
    fetch('/admin/reclist', { method: 'GET' })
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.error) {
          alert(data.msg)
          window.location.replace('/admin/dashboard')
          return
        }

        console.log(data)
        buildComp(data)
        console.log('Data is here in frontend')
      })
  }

  getCompList()
  //building ids
  const buildID = comp => {
    return {
      editID: 'edit_' + comp._id,
      deleteID: 'delete_' + comp._id,
      listItemID: 'listItem_' + comp._id,
      compID: 'comp_' + comp._id
    }
  }

  // build edit operation

  const editcomp = (comp, compID, editID) => {
    let editBtn = $(`#${editID}`)
    let value = compUserInput.val()
    editBtn.click(() => {
      console.log(value)
      fetch(`/${comp._id}`, {
        method: 'PUT',
        body: JSON.stringify({ comp: compUserInput.val() }),
        headers: {
          'content-type': 'application/json; charset = utf-8'
        }
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          if (data.ok == 1) {
            console.log(data)
            let compIndex = $(`#${compID}`)
            compIndex.html(data.value.comp)
            resetcompsInput()
          }
        })
    })
  }

  // build delete operation

  const deletecomp = (comp, listItemID, deleteID) => {
    let delteBtn = $(`#${deleteID}`)
    delteBtn.click(() => {
      fetch('/del', {
        method: 'delete',
        body: JSON.stringify({ id: comp._id }),
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          if (data.ok == 1) {
            $(`#${listItemID}`).remove()
          }
        })
    })
  }

  // building the company list template
  const buildTemplate = (comp, ids) => {
    return `<tr id="${ids.listItemID}">
        <td>1</td>
        <td>${comp.companyname}</td>
        <td>${comp.package}</td>
        <td>${comp.cutoff}</td>
        <td><button type="button" class="btn btn-success" id="${ids.editID}">View Applicants</button></td>   
        <td><button type="button" class="btn btn-primary" id="${ids.editID}">Edit</button></td>    
        <td><button type="button" class="btn btn-danger" id="${ids.deleteID}">Delete</button></td>
    </tr>`
  }
  // building the company list
  const buildComp = data => {
    console.log(data)
    // display = document.getElementById("companyList1");
    data.forEach(comp => {
      let ids = buildID(comp)
      display.append(buildTemplate(comp, ids))
      // editComp(comp, ids.compID, ids.editID);
      // deleteComp(comp, ids.listItemID, ids.deleteID);
    })
  }
})
