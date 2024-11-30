const inputs = document.querySelectorAll('input')

inputs.forEach(input => {
    input.onclick = () => {
        input.classList.add('touched')
    }
});