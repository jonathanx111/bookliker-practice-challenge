// Global Query Selectors and Variable Declarations
const bookListPanelDiv = document.querySelector('#list-panel')
const bookListUl = document.querySelector('#list')
const bookShowPanel = document.querySelector('#show-panel')
let likeBtnText;
let currentUserLikes = [];

// Initial Fetch Function for lists of Books
function fetchAllBooks() {
    fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(bookObjects => {
            bookObjects.forEach(renderBookName)
        })
}

// Render Each Individual Book Objects' name to Dom Using Delegation
const renderBookName = (bookObj) => {
    bookListUl.innerHTML += `
    <li class = "book-li" data-id = ${bookObj.id}>${bookObj.title}</li>
    `
}

// Event listener for books: Click On Book to see book Info.
const bookInfoEvent = (event) => {
    if (event.target.matches('li')) {
        let id = event.target.dataset.id
        fetchBookInfoByIdGet(id)
    }
}

function fetchBookInfoByIdGet(id) {
    fetch(`http://localhost:3000/books/${id}`)
        .then(response => response.json())
        .then(bookObj => {
            renderIndiviualBookInfo(bookObj)
        })
}

const renderIndiviualBookInfo = (bookObj) => {
    if (bookObj.users.length > 0)
        if (bookObj.users[bookObj.users.length - 1].username ==="pouros") {
            likeBtnText = "Unlike"
        } else {
            likeBtnText = "Like"
        }    
    else {
            likeBtnText = "Like"
        }
    if (bookObj.subtitle) {
            bookShowPanel.innerHTML = `
                <img src = ${bookObj['img_url']}>
                <h2>${bookObj.title}</h2>
                <h4>${bookObj.subtitle}</h4>
                <h6>${bookObj.author}</h6>
                <p>${bookObj.description}</p>
                <ul id = "show-ul"></ul>
                <button class = 'book-li' data-id = ${bookObj.id}>${likeBtnText}</button>
            `
    } else {
        bookShowPanel.innerHTML = `
                <img src = ${bookObj['img_url']}>
                <h2>${bookObj.title}</h2>
                <h6>${bookObj.author}</h6>
                <p>${bookObj.description}</p>
                <ul id = "show-ul"></ul>
                <button class = 'book-li' data-id = ${bookObj.id}>${likeBtnText}</button>
            `
    }
    bookObj.users.forEach(user => {
        const showUl = document.querySelector("#show-ul")
        const showLi = document.createElement('li')

        showLi.textContent = user.username
        showUl.append(showLi)
    })

    currentUserLikes = bookObj.users
}

bookListUl.addEventListener('click', bookInfoEvent)

// Like Button Event Listener
const showPanelEvent = (event) => {
    console.log(event.target)
    if (event.target.matches('button') & event.target.textContent === "Like") {
        let id = event.target.dataset.id
        console.log(currentUserLikes)
        likeBtnText = "Unlike"
        fetchBookInfoByIdPatch(id)
    } else if (event.target.matches('button') & event.target.textContent === "Unlike"){
        let id = event.target.dataset.id
        console.log(currentUserLikes)
        likeBtnText = "Like"
        fetchBookInfoByIdPatchRemove(id)
    }
}

// let newUsersObj = {
//     users: currentUserLikes
// }

// const userLikePatchObj = {
//     method: "PATCH",
//     headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json"
//     },
//     body: JSON.stringify({
//         users: currentUserLikes
//     })
// }
function fetchBookInfoByIdPatch(id) {
    currentUserLikes.push({ id: 1, username: "pouros" })
    fetch(`http://localhost:3000/books/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            users: currentUserLikes
        })
    })
        .then(response => response.json())
        .then(bookObj => {
            fetchBookInfoByIdGet(id)
        })
} 

function fetchBookInfoByIdPatchRemove(id) {
    currentUserLikes.pop()
    fetch(`http://localhost:3000/books/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            users: currentUserLikes
        })
    })
        .then(response => response.json())
        .then(bookObj => {
            fetchBookInfoByIdGet(id)
        })
} 



bookShowPanel.addEventListener('click', showPanelEvent)

// Initial FetchAllBooks function call
fetchAllBooks()

// document.addEventListener("DOMContentLoaded", function () {
// });
