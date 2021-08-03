const toggleForm = () => {
    const container = document.querySelector(".container");
    container.classList.toggle("active");
};

const signUp = () =>{
  // preventDefault();
  var pass = document.getElementById("pass").value;
  var cpass = document.getElementById("cpass").value;
  if(cpass != pass){
    return alert("Password dint match")
  }
  var authId =document.getElementById("authId").value;
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  

  fetch("/admin/signup", {
      method: "POST",
      body: JSON.stringify({ 
        username : name, 
        email : email, 
        password : pass,
        authId :  authId


      }),
      headers: {
          "Content-type": "application/json; charset = utf-8",
      },
  })
  .then((response) => {
      return response.json();
  })
  .then((data) => {
      alert(data.msg)
      window.location.replace("/admin/dashboard");
  });
}

const login = () =>{
  var pass = document.getElementById("Apass").value;
  var email = document.getElementById("Aemail").value;

  fetch("/admin/login", {
      method: "POST",
      body: JSON.stringify({ 
        email : email, 
        password : pass
      }),
      headers: {
          "Content-type": "application/json; charset = utf-8",
      },
  })
  .then((response) => {
      return response.json();
  })
  .then((data) => {
      if(data.error) {
        alert("Enter correct password");
        location.reload();
      }
      else{
        window.location.replace("/admin/dashboard");
      }
  });
}