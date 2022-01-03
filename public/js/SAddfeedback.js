$(document).ready(() => {
    const feedbackBtn = $('#feedSubmit')
    let compArray = [
                        'CISCO', 
                        'WESTERNDIGITAL', 
                        'TCS', 
                        'DELL',
                        'MERCEDES',
                        'BELL',
                        'INFOSYS',
                    ];
    feedbackBtn.submit(() => {
        var role = $('#roleFeedName')
        var companyFeedBack = $('#companyFeedName')
        var feedBackText = $('#feedback-text')
        // alert("Hurry" + role.val() + " " +companyFeedBack.val()+" "+ feedBackText.val());
        fetch('/student/addFeedback', {
            method: 'POST',
            body: JSON.stringify({
            role: role.val(),
            companyFeedBack : companyFeedBack.val(),
            feedBackText : feedBackText.val()
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
  
    const buildNavBar = (compArray) => {
        const navMotherDiv = $('#compList')
        compArray.forEach(element =>{
            navMotherDiv.append(buildNavTemplate(element))
            getParticular(element);
        })
    }

    const getParticular = (comp) =>{
        let compBtn = $(`#${comp}`)
        compBtn.click(() =>{
            feedbackLoader(comp);
        })
    }

    const buildNavTemplate = (comp) => {
        return `<label class="btn btn-secondary" id="${comp}">
                  <input type="radio" id="${comp}">${comp}
                </label>`
    }    

    const buildFeedback = (msgs) =>{
        // alert(msgs);
        const motherDiv = $('#feedbacks')
        motherDiv.empty();
        if(msgs.length == 0){
            motherDiv.append(`<div class="d-flex justify-content-center"><h4>No feedbacks found at this moment</h4></div>`)
        }
        msgs.forEach(element => { 
            // alert(element.companyFeedBack) 
            motherDiv.append(buildTemplate(element))
        });
    }
  
    const buildTemplate = (feed) => {
      return  `<div class="card m-2">
                <h5 class="card-header">${feed.role}</h5>
                <div class="card-body">
                  <p class="card-text"> ${feed.feedBackText}</p>
                </div>
              </div>` /*Change the payh*/
    }
  
    const feedbackLoader = (comp) => {
        
        // alert("Trying to get feedbacks");
      fetch('/student/getfeedback/'+comp, {
        method: 'GET',
        // params : { 'id' : comp}
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
            // alert("got something");
            // alert(data.result);
            buildFeedback(data.result)
          //   alert(data.msg)
        })
    }

    buildNavBar(compArray);
    // feedbackLoader();
  })
  