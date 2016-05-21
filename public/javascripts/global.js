
// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

});

$('#btnAddTask').on('click', addTask);
  // Delete task link click
    $('#userList table tbody').on('click', 'td a.linkdeletetask', deletetask);


// Functions =============================================================

// Fill table with data
function populateTable() {
  // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.taskname + '</td>';
            tableContent += '<td>' + this.location + '</td>';
            tableContent += '<td><a href="#" class="linkdeletetask" rel="' + this._id + '">done with?<a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};
//Add Task


function addTask(event){
	event.preventDefault();
	    
    // Super basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addTask input').each(function(index, val) {
       	   	 if($(this).val() === '') { errorCount++; }
    		 });
	 // Check and make sure errorCount's still at zero
   	 if(errorCount === 0) {

        	// If it is, compile all user info into one object
        	var newTask = {
            	'taskname': $('#addTask fieldset input#inputTaskName').val(),
            	'location': $('#addTask fieldset input#inputLocation').val()
		}
		


        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newTask,
            url: '/users/addtask',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addTask fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};






// Delete task
function deletetask(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this task?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deletetask/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
