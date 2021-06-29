  
  const notifications = () => {
    var messageto = document.getElementById('Ato').value
    var announcement = document.getElementById('Amsg').value
    
  
    console.log(` ${messageto} ${announcement} `)
  
    fetch('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify({
        messageto : messageto,
        announcement : announcement
        
      }),
      headers: {
        'Content-type' : 'application/json; charset = utf-8'
      }
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
        if(data.error){
          alert(data.message)
        }
        else{
           alert(data.message)
           location.reload();
        }
        
      })
  }
  