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
            <td>${feedback.feedback}</td>
            <td class = '${feedback.status} text'>${feedback.status}</td>
            <td>${createdDate.getDate()}-${createdDate.getMonth()}-${createdDate.getFullYear()}</td>
            <td class = 'text-center'>${feedback.respondedOn?feedback.respondedOn:'-'}</td> 
            <td >View</td>
        </tr>
        `
    })
}


//displaying feedbacks 

async function displayFeedback(){
    let feedbackData = await fetch(FEEDBACKAPI) 
    let feedbacks = await feedbackData.json() 

    createFeedback(feedbacks)
}

displayFeedback()