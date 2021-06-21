

const setInput = () => {
  console.log("Bro dont worry i m inside set input");
  fetch('/student/getPreload',{method : 'GET'})
  .then((response) => {
    return response.json()
  })
  .then((data) =>{
    console.log(data);
    if(!data.error){
      document.getElementById('name').value = data.fullname;
      document.getElementById('email').value = data.email;
      document.getElementById('cgpa').value = data.cgpa;
      document.getElementById('resume').value = data.resume;
    }
    else{
      console.log("no data found");
    }
  })
}

const details = () => {
  var fullname = document.getElementById('name').value
  var email = document.getElementById('email').value
  var cgpa = document.getElementById('cgpa').value
  var resume = document.getElementById('resume').value

  console.log(`${fullname} ${email} ${cgpa} ${resume}`)

  fetch('/student/details', {
    method: 'POST',
    body: JSON.stringify({
      fullname: fullname,
      email: email,
      cgpa: cgpa,
      resume: resume
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
      if(data.error){
        alert(data.msg)
        location.reload();
      }
      else{
        alert(data.msg)
      }
      
    })
}
