const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea')
const selects = document.querySelectorAll('select')
const invDesc = document.getElementById('inv_description')
const pattern = /^[A-Z0-9][A-Za-z0-9\s\.\-\?]*$/;

selects.forEach(select => {
    select.classList.toggle('touched', true);
});

inputs.forEach(input => {
    if (input.value !== "") {
        input.classList.toggle('touched', true);
    } else {
        input.onclick = () => {
            input.classList.toggle('touched', true);
        }
    }
});

if (invDesc) {

    invDesc.addEventListener('input', function (event) {  
        if (!pattern.test(event.target.value)) { 
            event.target.setCustomValidity('Please follow the pattern: Start with a capital letter or number, followed by letters, numbers, or spaces.'); 
        } else { 
            event.target.setCustomValidity(''); 
        } 
    });
    
    document.addEventListener('DOMContentLoaded', function() { 
        if (!pattern.test(invDesc.value)) { 
            invDesc.setCustomValidity('Please follow the pattern: Start with a capital letter or number, followed by letters, numbers, or spaces.'); 
        } else { 
            invDesc.setCustomValidity(''); 
        }
    });
    
}