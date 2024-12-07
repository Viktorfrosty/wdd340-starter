const formInv = document.querySelector("#updateForm")
const formInfo = document.querySelector("#updateInfo")
const formPsw = document.querySelector("#updatePassword")

if (formInv) {
    formInv.addEventListener("change", function () { 
        let updateBtn = document.querySelector('input[value="Update Vehicle"]')
        updateBtn.removeAttribute("disabled")
    })
}

if (formInfo) {
    formInfo.addEventListener("change", function () { 
        let updateBtn = document.querySelector('input[value="Update Information"]')
        updateBtn.removeAttribute("disabled")
    })
}

if (formPsw) {
    formPsw.addEventListener("change", function () { 
        let updateBtn = document.querySelector('input[value="Update Password"]')
        updateBtn.removeAttribute("disabled")
    });
}