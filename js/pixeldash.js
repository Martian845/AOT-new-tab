// Clock and Date updater
function startTime() {
    var time = new Date();
    var date = new Date();

    // Set the clock
    var timeOptions = {
    	hour: 'numeric',
    	minute:'numeric',
    	hour12: true 
    }
    time = time.toLocaleString('en-US', timeOptions);
    document.getElementById('clock').innerHTML = time.toLowerCase();

    // Set the date
    var dateOptions = {
		year: "numeric",
		month: "long",
		day: "numeric"
	}
	date = date.toLocaleDateString("en-US", dateOptions);
	document.getElementById("date").textContent = date;

    var t = setTimeout(startTime, 500);
}
startTime();

// Greet and Name
var greet = document.querySelector('#greet span');
var nameButton = document.querySelector('#greet button');
var nameInput = document.querySelector('#nameInput input');

// Set the user's name on screen
if(getCookie("name") != "") {
	setCookie("name", getCookie("name"), 1000000);
	greet.textContent = "Hello, ";
	nameButton.textContent = getCookie("name");
}

nameButton.addEventListener("click", function(event) {
	// Show the name input
	if(nameInput.style.visibility === "visible") {
		nameInput.style.visibility = "hidden";
		nameInput.style.opacity = "0";
	} else {
		nameInput.style.visibility = "visible";
		nameInput.style.opacity = "1";
		nameInput.value = "";
	}
	event.stopPropagation();
});

nameInput.addEventListener("click", function(event) {
	event.stopPropagation();
})

nameInput.addEventListener("keypress", function(event) {
	event.stopPropagation();
	// The user pressed Enter
	if(event.which == 13) {
		if(this.value.replace(/\s/g, '') != "") {
			// Set the user's name
			setCookie("name", this.value, 1000000);

			// Display the user's name
			greet.textContent = "Hello, ";
			nameButton.textContent = getCookie("name");

			// Hide the input
			this.style.visibility = "hidden";
			this.style.opacity = "0";
			this.value = "";
		}
	}
});

nameInput.addEventListener("blur", function() {
	if(this.value.replace(/\s/g, '') != "") {
		// Set the user's name
		setCookie("name", this.value, 1);

		// Display the user's name
		greet.textContent = "Hello, ";
		nameButton.textContent = getCookie("name");
	}

	this.style.visibility = "hidden";
	this.style.opacity = "0";
});

document.body.addEventListener("click", function() {
	if(nameInput.style.visibility === "visible") {
		nameInput.style.visibility = "hidden";
		nameInput.style.opacity = "0";

		if(nameInput.value != "") {
		// Set the user's name
			setCookie("name", this.value, 1);

			// Display the user's name
			greet.textContent = "Hello, ";
			nameButton.textContent = getCookie("name");
		}
	}
});

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Searchbox
var gButton = document.querySelector('#search > button:first-of-type');
var searchForm  = document.querySelector('#search > form');
var search  = document.querySelector('#search > form > input[name="q"]');

gButton.addEventListener('click', function(event) {
	event.stopPropagation();

	// Toggle the Search visibility
	search.classList.toggle('visible');

	// Get rid of focus so :hover can work
	this.blur();
})

search.addEventListener("keydown", function(event) {
	event.stopPropagation();
});

// Background Image
var backgrounds;
var backgroundIndex = 0;

var getBackground = new XMLHttpRequest();
getBackground.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
		// Read the backgrounds file
		backgrounds = JSON.parse(this.responseText).data;

		// Get a backgrounds
		backgroundIndex = Math.floor(Math.random() * backgrounds.length)
		switchBackground(backgroundIndex);
	}
}

// Authors
var authors;

var getAuthor = new XMLHttpRequest();
getAuthor.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
		// Read the authors file
		authors = JSON.parse(this.responseText);

		// Get all of the backgrounds database
		getBackground.open("GET", "data/backgrounds.json", true);
		getBackground.send();
	}
}
getAuthor.open("GET", "data/authors.json", true);
getAuthor.send();

// Change background
document.addEventListener("keydown", function(event) {
	if(nameInput !== document.activeElement && todoInput !== document.activeElement) {
		// Left arrow key
		if(event.which === 37) {
			// Cycle the backgrounds backwards
			if(backgroundIndex === 0) {
				backgroundIndex = backgrounds.length - 1;
			} else {
				backgroundIndex--;
			}
			switchBackground(backgroundIndex);
		} else if(event.which === 39) {
			// Cycle the backgrounds forwards
			if(backgroundIndex === backgrounds.length - 1) {
				backgroundIndex = 0;
			} else {
				backgroundIndex++;
			}
			switchBackground(backgroundIndex);
		}
	}
});

function switchBackground(index) {
	// Set the new background
	var body = document.querySelector("body");
	body.style.background = 'url("' + backgrounds[index].file +'") center center / cover no-repeat fixed';

	// Fetch the dom elements that will be adjusted
	var artAuthor = document.querySelector(".author");
	var artTitle = document.querySelector(".title");

	// Set the art's author, title and preffered link
	artAuthor.textContent = backgrounds[index].author;
	artAuthor.href = authors[backgrounds[index].author].link;
	artTitle.textContent = backgrounds[index].title;
}

// Quotes
var getQuote = new XMLHttpRequest();
getQuote.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
		// Get a quote
		var quotes = JSON.parse(this.responseText).data;
		var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

		// Set the quote
		var quote = document.querySelector("#text");
		var author = document.querySelector("#author");
		quote.textContent = '"' + randomQuote.quote + '"';
		author.textContent = randomQuote.author;
	}
}
getQuote.open("GET", "data/quotes.json", true);
getQuote.send();

// Todo List
var toggle      = document.querySelector('#open');
var modal       = document.querySelector('#modal');
var closeTodo   = document.querySelector('#modal .hide');
var toggleInput = document.querySelector('#modal .new');
var todoInput   = document.querySelector('#modal input');
var todos       = document.querySelector('#modal ul');
var todoSpans   = document.querySelectorAll('#modal ul li > span');
var todoData;

// Fetch previous todos
if(getCookie("todos") == "") {
	var init = "{ \"todos\": [] }";
	setCookie("todos", init, 7);
} else {
	// Extend the expiration date
	setCookie("todos", getCookie("todos"), 7);

	// Load the todos from the cookie
	todoData = JSON.parse(getCookie("todos")).todos;

	// Create the new todos
	for(var i = 0; i < todoData.length; i++) {
		// todoSpans[i].addEventListener("click", deleteTodo);
		// todoSpans[i].parentElement.addEventListener("click", toggleTodo);
		var currentTodo = todoData[i];
		addTodo(currentTodo.id, currentTodo.completed, currentTodo.content);
	}
}

// Toggle visibility on the TODO window
toggle.addEventListener("click", function() {
	modal.classList.toggle('visible');
});

closeTodo.addEventListener("click", function() {
	modal.classList.remove('visible');
});

// Toggle text input for new Todos
toggleInput.addEventListener("click", function() {
	if(todoInput.style.height == "35px") {
		todoInput.style.height = "0";
	} else {
		todoInput.style.height = "35px";
		todoInput.focus();
	}
});

// Existing "todos" event listeners


// Toggle "todo" status
function toggleTodo() {
	// Look for the todo in the cookie
	var todoID = this.dataset.id;

	var findTodo = function(todo) {
		if(todo.id == todoID) {
			return todo;
		} else {
			console.log("Error: Todo couldn't be found");
			return false;
		}
	}
	var todo = todoData.find(findTodo);

	if(todo != false) {
		// Mark it as done/pending in the cookie
		todo.completed = !todo.completed;

		// Mark it as done/pending in the UI
		this.classList.toggle("done");

		// Convert the data to a string
		var updatedData = '{ "todos": ' + JSON.stringify(todoData) + ' }';

		// Save the cookie
		setCookie("todos", updatedData, 7);
	}
}

// Add new "todo"
todoInput.addEventListener("keypress", function(event) {
	event.stopPropagation();
	if(event.which == 13 && this.value != "") {
		// Get a new id
		var lastIndex = 0;
		var newID = 1;
		if(todoData.length > 0) {
			lastIndex = todoData.length - 1;
			var newID = todoData[lastIndex].id + 1;
		}

		// Add the "todo" to the current data
		todoData.push({
			"id": newID,
			"completed": false,
			"content": this.value
		});

		// Convert the data to a string
		var updatedData = '{ "todos": ' + JSON.stringify(todoData) + ' }';

		// Save the cookie
		setCookie("todos", updatedData, 7);

		// Add the new "todo" to the UI
		addTodo(newID, false, this.value);

		// Reset the input
		this.value = "";
	}
});

function addTodo(id, completed, content) {
	// Create the element
	var newLi = document.createElement("li");
	if(completed) {
		newLi.classList.add("done");
	}
	newLi.dataset.id = id;
	newLi.innerHTML = "<span>x</span>" + content;

	// Add event listeners
	newLi.addEventListener("click", toggleTodo);
	newLi.querySelector("span").addEventListener("click", deleteTodo);

	// Append to the list
	todos.appendChild(newLi);
}

// Remove "todo"
function deleteTodo(event) {
	event.stopPropagation();

	// Look for the todo in the cookie
	var todoID = this.parentElement.dataset.id;

	var findTodo = function(todo) {
		if(todo.id == todoID) {
			return todo;
		} else {
			return false;
		}
	}
	var todo = todoData.find(findTodo);	

	if(todo != false) {
		// Delete the element from the data
		todoData.splice(todoData.indexOf(todo), 1);

		// Convert the data to a string
		var updatedData = '{ "todos": ' + JSON.stringify(todoData) + ' }';

		// Save the cookie
		setCookie("todos", updatedData, 7);

		// Delete the element in the UI
		var parent = this.parentElement;
		parent.style.height = "0";
		parent.style.opacity = "0";
		setTimeout(function() {
			parent.remove();
		}, 200);
	}
}
