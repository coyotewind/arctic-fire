//setting up some global variables

let todos, pendingTodos, completedTodos, expiredTodos, prefs, moveThis;

// create object from form field values
// format the date and pass it into the object
// retuns an object to be accessed by the create click handler

function createTodoFromForm() {
    const date = new Date($('#todo-due-date').val());
    const createTodo = {
        title: $('#todo-title').val(),
        dueDate: date.toLocaleDateString(),
        description: $('#todo-description').val(),
        isComplete: false,
    };
    return createTodo;
}

// loop through with for each todos as todo
// build the card html from an object's data
// use boolean to show or hide complete button
// attach data attribute so data can be accessed later

function createElementFromTodo(todo) {
    return $(` <div class="todo">
        <h3><span class="title">${todo.title}</span><span class="due-date">${todo.dueDate}</span></h3>
        <pre>${todo.description}</pre>
        <footer class="actions">    
            ${ todo.isComplete ? '' : '<button class="action complete">Complete</button>' }
            <button class="action delete">Delete</button>
        </footer>
    </div> `).data('todo', todo);
}

// store todos in local storage for later
// key is todos, local storage only accepts strings
// value is JSON stringified

function storeData() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('prefs', JSON.stringify(prefs));
    console.log('prefs set');
}

// retrieve todos from local storage to populate todos
// converts string back to an array or object from JSON parse
// values can later be accessed by calling the key
// extended to also set local storage for preferences

function retrieveData() {
    todos = JSON.parse(localStorage.getItem('todos')) || fetchDefaultTodos();
    prefs = JSON.parse(localStorage.getItem('prefs')) || fetchDefaultPrefs();
}

// create default todos for onboarding the user as an array of objects
// objects will have title, due date, description, and isComplete properties
// invoking retrieve data will load default todos if there is no local storage
// extended to also get local storage for prefs o set default

function fetchDefaultTodos() {
    return [
        { title: 'Create New Todo', dueDate: '06/30/2020', description: 'Click the create icon (+)  to the left to make a new todo.', isComplete: false },
        { title: 'Mark Todo Complete', dueDate: '06/30/2020', description: 'Use the complete button to move this to the completed column', isComplete: false },
        { title: 'Delete Todo', dueDate: '06/30/2020', description: 'Use the delete button to remove this todo at any time.', isComplete: false },
        { title: 'Clear Completed Todo', dueDate: '06/30/2020', description: 'Click the checkbox icon to the left to remove completed todos.', isComplete: false },
        { title: 'Remove Expired Todo', dueDate: '06/30/2020', description: 'Click the trash icon to the left to remove expired todos.', isComplete: false },
        { title: 'Kiss Your Wife', dueDate: '05/31/2020', description: 'Remember to do this a few times a day.', isComplete: true },
        { title: 'Call Someone Unexectedly', dueDate: '04/30/2020', description: 'Tell them how much they mean to you.', isComplete: false },
        { title: 'Pet Your Dog', dueDate: '04/30/2020', description: 'Afterall, he is one of your best friends and never judges you.', isComplete: true },
        { title: 'Learn Something New', dueDate: '04/30/2020', description: 'Keep in mind, information has no purpose unless you share it freely', isComplete: true },
        { title: 'Look In The Mirror', dueDate: '04/30/2020', description: 'Tell yourself you look beautiful, but see the beauty inside as well.', isComplete: false },
        { title: 'Smile At A Stranger', dueDate: '05/31/2020', description: 'It will brighten their day and it costs you nothing.', isComplete: true },
    ];
}



// goal: click on a todo title, then click on todo colummn (completed/pending) and move the card
// input: what I did was grab the data() from the item clicked, and toggle it true/false with the bang operator
// output: what I did was run the updateAll() function on when the todo clolumn was clicked

// I feel like I need a different input (not data), do I need to retrieve data from local storage?
// I would like to know how to access the value from a specific property, from an object, stored in an array
// I also want to know how to do this potentially without having to grab the entire array first

// @natalie: question is related to this...

$('main').on('click', '.title', function () {

    moveThis = $(this).closest('.todo').data();
    console.log(moveThis);

    // getThese = JSON.parse(localStorage.getItem('todos')); // gets whole array
    // getThis = getThese.filter(function(todo) { // gets only those that are complete
    //     return todo.isComplete // how to get the data from the object clicked?
    // });
    
});


$('h3.list-title:not(.expired)').on('click', function() { 
    moveThis.todo.isComplete = !moveThis.todo.isComplete;
    updateAll();
});


// separately fetch the default prefs from an object
function fetchDefaultPrefs() {
    return { darkMode: false };
}

// set the color mode in the front-end by toggling the class attribute
// UI will update by reading class from #app and applying unique CSS

function setColorMode() {
    $('#app').attr('class', prefs.darkMode ? 'dark' : 'light');
}

// question again what this does, why it is necessary
// loop through each prefs as pres and read the name attribute
// update the form checkbox input element as checked or null

function populateCustomControls() {
    // $('#dark-mode').attr('checked', userPreferences.darkMode);
    Object.keys(prefs).forEach(function (pref) {
        const inputElement = $(`.custom-controls [name=${pref}]`);
        inputElement.attr('checked', prefs[pref]);
    });
}

// added function update the inferface by setting the color mode
// additional user preferences could be invoked here in the future

function updateInterface() {
    setColorMode();
}

// invoked on input at the checkbox, custom controls is the hook
// read the result of the input that is clicked, checked or not
// connect to the name attribute, which matches above

$('.custom-controls').on('input', 'input', function () {
    const updatedPref = $(this);
    const prefType = updatedPref.attr('name');
    const isChecked = updatedPref.is(':checked');
    prefs[prefType] = isChecked;

    // userPreferences[prefType.attr('name')] = updatedPref.is(':checked');

    storeData();
    updateInterface();
    
});

// test if the due has date expired or not
// calculate the difference between now and the due date
// returns true if now is less than due date

function isCurrent(todo) {
    const todoDueDate = new Date(todo.dueDate);
    const now = new Date();
    return now < todoDueDate;
}

// divide todos into three buckets - pending, complete, expired
// set variables to a filter of todos as todo
// use conditional to split todos and return true

function splitTodos() {
    pendingTodos = todos.filter(function(todo) {
        // console.log('pending is true')
        return !todo.isComplete && isCurrent(todo);
    });
    completedTodos = todos.filter(function(todo) {
        // console.log('completed is true')
        return todo.isComplete;
    });
    expiredTodos = todos.filter(function(todo) {
        // console.log('expired is true')
        return !todo.isComplete && !isCurrent(todo);
    });
}

// render the todos to add them to UI but first empty the content
// loop through each filtered todos as todo from split todos
// make the todo cards by appending returned value from createElementFromTodo

function renderTodos() {
    $('main .content').empty(),
    pendingTodos.forEach(function (todo) {
        $('.pending-todos').append(createElementFromTodo(todo));
    });
    completedTodos.forEach(function (todo) {
        $('.completed-todos').append(createElementFromTodo(todo));
    });
    expiredTodos.forEach(function (todo) {
        $('.expired-todos').append(createElementFromTodo(todo));
    });
}

// build click handler to open and close the left drawer

$('.left-drawer').click(function (todo) {
    $(todo.target).hasClass('left-drawer')
        ? $('#app').toggleClass('drawer-open')
        : '';
});

// build click handler for add todo which pops the modal open

$('.add-todo').click(function () {
    $('.modal').addClass('open');
});

// click handler to create creating todo from the form data, start by prevent page reload
// create todo from object returned from createTodoFromForm and add to the beginning of the array
// reset the form and close the modal before storahe, split and render are invoked

$('.create-todo').click(function (todo) {
    todo.preventDefault();
    const todoForm = $('.todo-form');
    todos.unshift(createTodoFromForm(todoForm));
    $(todoForm).trigger('reset');
    $('.modal').removeClass('open');
    updateAll() 
});

// this is the click handler for the cancel button 
// on click remove class to close modal

$('.cancel-create-todo').click(function () {
    $('.modal').removeClass('open');
});

// this is the click handler to mark the card complete
// set variable that is the todo closest to the button that was clicked
// use data for that todo from the create element function set isComplete property to true

$('main').on('click', '.action.complete', function () {
    const markComplete = $(this).closest('.todo');
    markComplete.data('todo').isComplete = true;
    markComplete.slideUp(700, function () { updateAll() });
});

// this is the click handler to delete a todo card
// set variable that is the todo closest to the button that was clicked
// set variable that is the index of the card where the button was clicked
// filter the to do list by splice out at the index, only remove one item

$('main').on('click', '.action.delete', function () {
    const markDelete = $(this).closest('.todo');
    const getIndex = todos.indexOf(markDelete.data('todo'));
    todos.splice(getIndex, 1);
    markDelete.slideUp(700, function () { updateAll() });
});

$('.remove-completed').click(function() {
    todos = todos.filter(function(todo) {
        return !todo.isComplete;
    });
    updateAll();
});

$('.remove-expired').click(function () {
    todos = todos.filter(function(todo) {
        return isCurrent(todo);
    });
    updateAll();
});

// $('.remove-completed').click(function () {
//     todos = todos.filter(todo => !todo.isComplete);
//     updateAll();
// });

// $('.remove-expired').click(function () {
//     todos = todos.filter(todo => isCurrent(todo));
//     updateAll();  
// });

$('.menu-closed').click(function () {
    $('.custom-controls').toggleClass('open');
});

function updateAll() {
    storeData();
    splitTodos();
    renderTodos();
}

retrieveData();
splitTodos();
updateInterface();
populateCustomControls();
renderTodos();
