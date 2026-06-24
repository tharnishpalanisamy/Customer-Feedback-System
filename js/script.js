//theme

let theme = document.getElementById('theme') 
let dark = document.getElementById('dark') 
let light = document.getElementById('light') 
theme.addEventListener('click' , function(){
    dark.classList.toggle('d-none') 
    light.classList.toggle('d-none')
    document.body.classList.toggle('dark')
})


let theme2 = document.getElementById('theme2') 
let dark2 = document.getElementById('dark2') 
let light2 = document.getElementById('light2') 
theme2.addEventListener('click' , function(){
    dark2.classList.toggle('d-none') 
    light2.classList.toggle('d-none')
    document.body.classList.toggle('dark')
})


let login = document.getElementById('login') 

login.addEventListener('click' , function(){
    Swal.fire({
    title: "Success!",
    html: `
        <object
            data="assets/svg/success.svg"
            type="image/svg+xml"
            class = 'w-75'>
        </object>
        <p>Student added successfully</p>
    `,
    showConfirmButton: false,
    timer: 2000
});


})