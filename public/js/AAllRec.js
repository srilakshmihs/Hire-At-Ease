$(document).ready(() => {
  const display = $('#companyList')
  const show = $('#candidateList')
  const compNameForm = $('#compNameField')
  const websiteForm = $('#websiteField')
  const packageForm = $('#packageField')
  const updateBtn = $('#updateCompany')
  const statusUpdateBtn = $('#statusUpdater')
  let selectedCompany;
  let selectedStudents = [];

  
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
      viewID: 'view_' + comp._id,
      editID: 'edit_' + comp._id,
      listItemID: 'listItem_' + comp._id,
      compID: 'comp_' + comp._id
    }
  }

  // build edit operation

  const editComp = (comp, compID, editID) => {
    let editBtn = $(`#${editID}`)
    editBtn.click(() => {
      console.log(`You clicked ${comp._id}`)

      // window.location.replace(`/admin/saveCompID/1`)
      // window.location.replace(`/admin/saveCompID/${comp._id}`)
      fetch(`/admin/getPreload`, {
        method: 'POST',
        body: JSON.stringify({ compID: comp._id }),
        headers: {
          'content-type': 'application/json; charset = utf-8'
        }
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          console.log(data.companyname)
          if (!data.error) {
            compNameForm.val(`${data.companyname}`)
            websiteForm.val(`${data.website}`)
            packageForm.val(`${data.package}`)
          }
        })

      updateBtn.click(() => {
        // alert("You clicked")

        console.log(compNameForm.val())
        fetch('/admin/editCompany', {
          method: 'PUT',
          body: JSON.stringify({
            compID: comp._id,
            compName: compNameForm.val(),
            package: packageForm.val(),
            website: websiteForm.val()
          }),
          headers: {
            'content-type': 'application/json; charset = utf-8'
          }
        })
          .then(response => {
            console.log(response.json())
            return response.json()
          })
          .then(data => {
            console.log(data)
            alert(data.msg)
          })
      })
    })
  }

  // building the company list template
  const buildTemplate = (comp, ids, index) => {
    return `<tr id="${ids.listItemID}">
        <td>${index}</td>
        <td><a href="${comp.website}">${comp.companyname}</a></td>
        <td>${comp.package}</td>
        <td>${comp.cutoff}</td>
        <td><button type="button" class="btn btn-success" id="${ids.viewID}" data-toggle="modal" data-target="#viewApplicantsModal">View Applicants</button></td>   
        <td><button type="button" class="btn btn-primary" id="${ids.editID}"  data-toggle="modal" data-target="#editCompModal">Edit</button></td> 
    </tr>`
  }
  // building the company list
  const buildComp = data => {
    console.log(data)
    let index = 1
    // display = document.getElementById("companyList1");
    data.forEach(comp => {
      let ids = buildID(comp)
      display.append(buildTemplate(comp, ids, index))
      editComp(comp, ids.compID, ids.editID)
      viewCandidates(comp, ids.viewID);
      index++
    })
  }

  const viewCandidates = (comp, viewID) => {
    let viewBtn = $(`#${viewID}`)
    viewBtn.click(() => {
      selectedStudents = []
      selectedCompany = comp._id;
      fetch(`/admin/candidateslist/${comp._id}`, { 
        method: 'GET'
      })
      .then((response)=>{
        return response.json()
      })
      .then((data) =>{
        console.log(data);
        if(!data.error){
          buildCandidateList(data.result)
          data.result.forEach(element => {
            selectedStudents.push(element.candidateID)
          });
        }
      })
    })
  }

  statusUpdateBtn.click(()=>{
    let statusListToBeSent = []
    // console.log(selectedStudents);
    selectedStudents.forEach(element => {
      let toBeAsStatus = $(`#${selectedCompany}_${element}`).prop("checked")
      let statusItemToBeAdded = {
        studentId : element,
        status : toBeAsStatus
      }
      statusListToBeSent.push(statusItemToBeAdded)
    });
    console.log("Here you go daa");
    console.log(statusListToBeSent);

    fetch('/admin/editStatus',{
      method : 'PUT',
      body : JSON.stringify({
        result : statusListToBeSent,
        compID : selectedCompany
      }),
      headers : {
        'content-type': 'application/json; charset = utf-8'
      }
    })
    .then(response=>{
      return response.json()
    })
    .then(data => {
      alert(data.msg)
    })
  })

  const buildCandidateList = (data) => {
    show.empty()
    console.log(data)
    let index = 1
    data.forEach((candidate) => {
      //let statusID = candidate.candidateID
      show.append(buildList(candidate, index))
      let checkID = `${selectedCompany}_${candidate.candidateID}`;
      $(`#${checkID}`).prop("checked", candidate.candidateStatus)
      index++
    })
  }

  const buildList = (candidate, index) => {
    let checkID = `${selectedCompany}_${candidate.candidateID}`;
    return `<tr>
      <td>${index}</td>
      <td>${candidate.candidateName}</td>
      <td><a href="${candidate.candidateResume}" target="_blank">Click me</a></td>
      <td><input type="checkbox" id="${checkID}"></td>
    </tr>`
  }
})