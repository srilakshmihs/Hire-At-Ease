$(document).ready(() => {
    const display = $('#applyList')
  
    const getApplyList = () => {
      fetch('/admin/candidateslist', { method: 'GET' })
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
          buildApplyList(data)
        })
    }
  
    getApplyList()
  
    // building the company list template
    const buildTemplate = (comp, index) => {
      return `<tr>
            <td>${index}</td>
            <td>${comp.compName}</td>
            <td>${comp.status}</td>   
        </tr>`
    }
  
    // building the company list
    const buildApplyList = data => {
      console.log(data)
      let index = 1;
      data.forEach(comp => {
      //   let ids = buildID(comp)
        display.append(buildTemplate(comp, index))
        index++
      //   applyComp(comp, ids.compID, ids.applyID)
        // deleteComp(comp, ids.listItemID, ids.deleteID);
      })
    }
  })
  
  