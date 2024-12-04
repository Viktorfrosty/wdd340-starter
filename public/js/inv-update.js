const form = document.querySelector("#updateForm"); 
form.addEventListener("change", function () { 
    let updateBtn = document.querySelector("input[type='submit']"); 
    updateBtn.removeAttribute("disabled"); });