import { USERSAPI , FEEDBACKAPI } from './api.js'; 


//getting the user
let user = JSON.parse(localStorage.getItem('user')) || '' 
if(!user){
    window.location.href = './login.html'
}


//fetching the statistics for dashboard 

async function displayStatistics(){
    let data = await fetch(`${FEEDBACKAPI}`)
    let feedbacks = await data.json() 

    let length = feedbacks.length 
    let pending = 0 
    let responded = 0 
    let totalRating = 0 

    feedbacks.forEach(feedback =>{
        totalRating += Number(feedback.rating) 
        feedback.status == 'Pending' ? pending ++ : responded ++ 
    })

    //puting the values
    document.getElementById('totalFeedback').innerText =length 
    document.getElementById('pendingCount').innerText = pending 
    document.getElementById('respondedCount').innerText = responded 
    document.getElementById('averageRating').innerText = Math.round(totalRating / length).toFixed(1) 

}

displayStatistics()


//admin dashboard table 
//Creating feedback
function createFeedback(feedbacks){
    let table = document.querySelector('.table') 
    let body = table.querySelector('tbody') 
    body.innerHTML = "" 
    if (feedbacks.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="10" class="text-center py-5 text-secondary">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    No feedback found.
                </td>
            </tr>
        `;
        return;
    }
    
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
            <td>${feedback.title}</td>
            <td>${feedback.username}</td>
            <td>${feedback.department}</td>
            <td>${stars}</td>
            <td class = '${feedback.status} text'>${feedback.status}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-primary viewBtn" data-id = ${feedback.id}  data-bs-toggle="modal" data-bs-target="#viewFeedbackModal" >
                    <i class="bi bi-eye me-1"></i> View
                </button>
            </td>
        </tr>
        `
    })
}

async function displayLatestFeedback(){
    let feedbackData = await fetch(`${FEEDBACKAPI}`) 
    let data = await feedbackData.json() 
    data.sort((a,b) => new Date(b.createdOn) - new Date(a.createdOn)) 
    data = data.splice(0,5) 
    createFeedback(data)
}
displayLatestFeedback()



//modal elements
let modalName = document.querySelector('.modalName') 
let modalRating = document.querySelector('.modalRating') 
let modalDate = document.querySelector('.modalDate') 
let modalFeedback = document.querySelector('.modalFeedback')
let title = document.querySelector('.title')

let currentFeedback ; 

document.addEventListener('click' , async function(event){
    if(event.target.classList.contains('viewBtn')) {
        currentFeedback = event.target.dataset.id ; 
        console.log(currentFeedback);
        
        let feedbackData = await fetch(`${FEEDBACKAPI}/${currentFeedback}`) 
        let data = await feedbackData.json() 
        console.log(data);
        
        modalName.innerText = data.username 
        let stars = '' 
        let n = Number(data.rating) 
        for(let i = 1 ; i <= n ; i++) {
            stars += '★'
        }
        let diff = 5 - n 
        let remainingStars = ""
        for (let i = 1 ; i <= diff ; i++) {
            remainingStars += '★'
        }

        modalRating.innerHTML = `<p>${stars}<span class = "text-secondary" >${remainingStars}</span></p>`

        let date = new Date(data.createdOn) 
        modalDate.innerText = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}` 

        modalFeedback.innerText = data.feedback
        title.innerText = data.title
    }
})



//rating distribution 

async function calculateDistribution(){
    let feedbackData = await fetch(FEEDBACKAPI) 
    let feedbacks = await feedbackData.json() 
    let five = 0 
    let four = 0 
    let three  = 0
    let two = 0 
    let one = 0 
    let n = feedbacks.length

    feedbacks.forEach(feedback => {
        if(feedback.rating == 5) {
            five ++
        }
        else if(feedback.rating == 4) {
            four ++
        }
        else if(feedback.rating == 3) {
            three ++
        }
        else if(feedback.rating == 2 ) {
            two ++
        }
        else if(feedback.rating == 1 ) {
            one ++
        }
    })

    //count  
    document.querySelector('.fiveCount').innerText = `(${five})` 
    document.querySelector('.fourCount').innerText = `(${four})` 
    document.querySelector('.threeCount').innerText = `(${three})` 
    document.querySelector('.twoCount').innerText = `(${two})` 
    document.querySelector('.oneCount').innerText = `(${one})` 

    const max = Math.max(five, four, three, two, one);

    five = (five/max) * 100 
    four = (four/max)  * 100 
    three = (three / max )  * 100 
    two = (two /max)  * 100 
    one = (one /max)  * 100 
    
    document.querySelector('.fiveStar').style.width = `${five}%`
    document.querySelector('.fourStar').style.width = `${four}%`
    document.querySelector('.threeStar').style.width = `${three}%`
    document.querySelector('.twoStar').style.width = `${two}%`
    document.querySelector('.oneStar').style.width = `${one}%`


    //count 
    
}

calculateDistribution()


//dynamic filtering 

//view 

let pendingView = document.getElementById('pendingView') 
pendingView.addEventListener('click' , function(){
    localStorage.setItem('status' , 'Pending') 
    window.location.href = './adminfeedback.html'
})


let respondedView = document.getElementById('respondedView') 
respondedView.addEventListener('click' , function(){
    localStorage.setItem('status' , 'Responded') 
    window.location.href = './adminfeedback.html'
})

let averageRatingView = document.getElementById('averageRatingView') 
averageRatingView.addEventListener('click' , function(){
    let rating = document.getElementById('averageRating')
    localStorage.setItem('rating' , rating.textContent)
    window.location.href = './adminfeedback.html'
})