  
  const companyDetails = () => {
    var companyName = document.getElementById('Cname').value
    var companyWebsite = document.getElementById('Cweb').value
    var companyPackage = document.getElementById('Cpak').value
    var companyCutoff = document.getElementById('Cutoff').value
  
  
    fetch('/admin/companies', {
      method: 'POST',
      body: JSON.stringify({
        companyname : companyName,
        website : companyWebsite,
        package : companyPackage,
        cutoff  : companyCutoff
      }),
      headers: {
        'Content-type' : 'application/json; charset = utf-8'
      }
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        if(data.error){
          alert(data.message)
        }
        else{
          alert(data.message)
          location.reload();
        }
        
      })
  }
  