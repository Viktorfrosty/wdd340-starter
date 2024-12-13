const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea')
const selects = document.querySelectorAll("select")
let text = document.querySelector("textarea")
const pattern = /^[A-Z0-9][A-Za-z0-9\s\.\-\?]{9,}$/

selects.forEach(select => {
  select.classList.toggle("touched", true)
})

inputs.forEach(input => {
  if (input.value !== "") {
    input.classList.toggle("touched", true)
  } else {
    input.onclick = () => {
      input.classList.toggle("touched", true)
    }
  }
})

if (text) {

  text.addEventListener("input", function (event) {  
    if (!pattern.test(event.target.value)) { 
      event.target.setCustomValidity("Please follow the indications.")
    } else { 
      event.target.setCustomValidity("") 
    } 
  })
  
  document.addEventListener("DOMContentLoaded", function() { 
    if (!pattern.test(text.value)) { 
      text.setCustomValidity("Please follow the indications.") 
    } else { 
      text.setCustomValidity("") 
    }
  })
  
}