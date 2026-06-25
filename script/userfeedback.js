import { USERSAPI , FEEDBACKAPI } from './api.js';  


//theme
//if user previously has dark theme

if(localStorage.getItem('theme') == 'dark') {
    changeTheme()
}

//change theme 
function changeTheme() {
    document.body.classList.toggle('dark')

    dark.classList.toggle('d-none')
    light.classList.toggle('d-none')

    dark2.classList.toggle('d-none')
    light2.classList.toggle('d-none')

    localStorage.setItem(
        'theme',
        document.body.classList.contains('dark') ? 'dark' : 'light'
    )
}


theme.addEventListener('click', changeTheme)
theme2.addEventListener('click', changeTheme)


//user
let user = JSON.parse(localStorage.getItem('user'))

//creating feedback 

function createFeedback(feedbacks){
    let table = document.querySelector('.table') 
    let body = table.querySelector('tbody') 
    body.innerHTML = "" 

    feedbacks.forEach((feedback,index) =>{
        let createdDate = new Date(feedback.createdOn) 
        let n =  Number(feedback.rating)
        
        let stars = '' 
        for(let i = 1 ; i<= n ; i++){
            stars += '⭐'
        }
        console.log(stars);
        
        
        body.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${feedback.title}</td>
            <td>${stars}</td>
            <td>${feedback.department}</td>
            <td>${feedback.feedback}</td>
            <td class = '${feedback.status} text'>${feedback.status}</td>
            <td>${createdDate.getDate()}-${createdDate.getMonth()}-${createdDate.getFullYear()}</td>
            <td class = 'text-center'>${feedback.respondedOn?feedback.respondedOn:'-'}</td> 
            <td class = 'text-center'>${feedback.remarks}</td>
            <td class='text-center' >
            <i class="bi bi-pencil-square fs-5  ${feedback.status == 'Pending' ? 'active editFeedbackIcon' : 'blocked'}" 
            ${feedback.status=='Pending' ? ` data-bs-toggle="modal" data-bs-target="#editFeedbackModal" 
                data-id = ${feedback.id}  ` : ''}
            ></i>
            </td>
            
        </tr>
        `
    })
}


//displaying feedbacks 

async function displayFeedback(){
    let feedbackData = await fetch(FEEDBACKAPI) 
    let feedbacks = await feedbackData.json() 
    let userFeedbacks = feedbacks.filter(feedback => feedback.userId = user.id)
    userFeedbacks.sort((a,b)=>{
        return new Date(b.createdOn) - new Date(a.createdOn) 
    })
    createFeedback(userFeedbacks)
}

displayFeedback()


//filtering 


let departmentFilter = document.getElementById('departmentFilter') 
let statusFilter = document.getElementById('statusFilter')
let searchTitle = document.getElementById('searchTitle') 


async function filterFeedback(){
    let dept = departmentFilter.value;
    let status = statusFilter.value;
    let value = searchTitle.value.toLowerCase();

    let response = await fetch(`${FEEDBACKAPI}?userId=${user.id}`);
    let feedbacks = await response.json();

    if (dept !== 'All') {
        feedbacks = feedbacks.filter(feedback => feedback.department === dept);
    }

    if (status !== 'All') {
        feedbacks = feedbacks.filter(feedback => feedback.status === status);
    }

    if (value !== '') {
        feedbacks = feedbacks.filter(feedback => feedback.title.toLowerCase().includes(value));
    }
    feedbacks.sort((a,b) =>{
        return new Date(b.createdOn) - new Date(a.createdOn)
    })
    createFeedback(feedbacks);

}

//dept
departmentFilter.addEventListener('change' , async function(){
    await filterFeedback()
    searchTitle.value = ''
})
//status
statusFilter.addEventListener('change' , async function(){
    await filterFeedback()
    searchTitle.value = ''
})

//search 

searchTitle.addEventListener('input' ,async function(){
    await filterFeedback()

    
})


//edit icon in action 
let currentId = ''


//elements of edit modal 
let editTitle = document.getElementById('editTitle') 
let editDepartment = document.getElementById('editDepartment') 
let editFeedback = document.getElementById('editFeedback')
let editRating = document.getElementById('editRating') 


document.addEventListener('click' , async  function(event){
    if(event.target.classList.contains('editFeedbackIcon')){
        currentId = event.target.dataset.id         
        
        let feedbackData = await fetch(`${FEEDBACKAPI}?id=${currentId}`) 
        let feedback = await feedbackData.json() 

        let data = feedback[0] 

        editTitle.value = data.title 
        editDepartment.value = data.department 
        editRating.value = data.rating  
        editFeedback.value = data.feedback
    }
})


//Feedback Validation
function validateFeedback(title , feedback , rating , department){
    if(!title || !feedback || !rating || !department ) {
        alert('Fields cannot be empty') 
        return false 
    }
    return true 
}

//saving edited feedback 
let saveBtn = document.getElementById('saveBtn') 
saveBtn.addEventListener('click' , async function(){
    let isValid = validateFeedback(editTitle.value , editFeedback.value , editRating.value , editDepartment.value) 

    if(isValid) {
        let editedFeedback = {
            title:editTitle.value , 
            department:editDepartment.value , 
            rating:editRating.value , 
            feedback:editFeedback.value , 
            updatedOn:new Date().toISOString()
        }

        await fetch(`${FEEDBACKAPI}/${currentId}` , {
            method:"PATCH" , 
            headers : {
                'Content-type' : 'application/json'
            } , 
            body:JSON.stringify(editedFeedback)
        })
    }
    await filterFeedback()



    //closing the modal 
    let modalElement = document.getElementById('editFeedbackModal') 
    let modal = bootstrap.Modal.getInstance(modalElement) 
    modal.hide()
    
})
