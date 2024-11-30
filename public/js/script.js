const inputs = document.querySelectorAll('input, textarea, select')

inputs.forEach(input => {
    input.onclick = () => {
        input.classList.add('touched')
    }
});

document.getElementById('inv_description').addEventListener('input', function (event) { 
    const pattern = /^[A-Z0-9][A-Za-z0-9\s]*$/; 
    if (!pattern.test(event.target.value)) { 
        event.target.setCustomValidity('Please follow the pattern: Start with a capital letter or number, followed by letters, numbers, or spaces.'); 
    } else { 
        event.target.setCustomValidity(''); 
    } 
});