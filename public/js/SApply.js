
  
  const apply = () => {
    var name = document.getElementById('Sname').value
    var email = document.getElementById('Semail').value
    var phno = document.getElementById('Snum').value
    var resume = document.getElementById('Sresume').value
  
  
    fetch('/student/', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        email: email,
        phno: phno,
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
        if(data.error){
          alert(data.msg)
          location.reload();
        }
        else{
          alert(data.msg)
        }
        
      })
  }
  