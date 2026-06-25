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