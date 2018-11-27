var database = firebase.database();
var updateId = "";

function submitDataToFirebase(name, favMovie) {
    if (name && favMovie) {
        // Push the name and favMovie for someone to the movies collection
        database.ref("/movies").push({
            name: name,
            favMovie: favMovie
        });

        //clear out the values of name and favMovie 
        $("#name").val("");
        $("#fav-movie").val("");
    } else {
        alert("Please provide and name and movie");
    }
}

$("#submit-form").on("click", function (e) {
    // prevent the form from submitting on default
    e.preventDefault();
    var name = $("#name").val().trim();
    var favMovie = $("#fav-movie").val().trim();
    submitDataToFirebase(name, favMovie);
});

$("#submit-update-form").on("click", function (e) {

    // prevent the form from submitting on default
    e.preventDefault();

    // using postData object to store the name and the movie
    var postData = {
        name: $("#name-modal").val().trim(),
        favMovie: $("#fav-movie-modal").val().trim()
    };

    //hide our modal 
    $('#myModal').modal('hide');

    // Update the child by its id ex: /collectionName/id
    var updates = {};
    updates['/movies/' + updateId] = postData;

    return database.ref().update(updates);

});

//watcher for when children are added and adds all children up intially
database.ref("/movies").on("child_added", function (snap) {

    //store all the values in an object
    var snapData = {
        "id": snap.key,
        "name": snap.val().name,
        "favMovie": snap.val().favMovie
    };

    //put the data into a string before attaching it to the update button
    var snapDataString = JSON.stringify(snapData);

    //add the record to the table
    var tableData = "<tr class=" + snapData.id + "><td>" + snapData.id + "</td>";
    tableData += "<td class='snap-name'>" + snapData.name + "</td>";
    tableData += "<td class='snap-movie'>" + snapData.favMovie + "</td>";
    tableData += "<td><button class='btn btn-info edit snap-update-button' data-movie-object='" + snapDataString + "' data-target='#myModal' data-toggle='modal'>Update</button></td>";
    tableData += "<td><button class='btn btn-danger delete' data-movie-id=" + snapData.id + ">Delete</button></td></tr>";

    $("#all-results-table tbody").append(tableData);
});

//listen for when a child has changed 
database.ref("/movies").on("child_changed", function (snap) {
    //get the class of that child based of it's key
    var snapId = "." + snap.key;

    //store all the values in an object
    var snapData = {
        "id": snap.key,
        "name": snap.val().name,
        "favMovie": snap.val().favMovie
    };

    //put the data into a string before attaching it to the update button
    var snapDataString = JSON.stringify(snapData);

    // use the class name then target the .snap-name and .snap-movie of 
    // that class 
    $(snapId + " .snap-name").text(snapData.name);
    $(snapId + " .snap-movie").text(snapData.favMovie);
    $(snapId + " .snap-update-button").attr("data-movie-object", snapDataString);
});

// listen for when a child is removed
database.ref("/movies").on("child_removed", function (snap) {
    // get class based on the child's key and remove the element
    $('.' + snap.key).remove();
});

$(document).on("click", ".edit", function (e) {
    e.preventDefault();
    var snapObject = JSON.parse($(this).attr("data-movie-object"));
    $("#myModalLabel").text("Update " + snapObject.name);
    $("#name-modal").val(snapObject.name);
    $("#fav-movie-modal").val(snapObject.favMovie);
    updateId = snapObject.id;
});

$(document).on("click", ".delete", function (e) {
    e.preventDefault();
    var buttonId = $(this).attr("data-movie-id");
    database.ref("/movies/" + buttonId).remove();
});

$("#submit-search").on("click", function (e) {
    e.preventDefault();
    var reviewerName = $("#search-item").val().trim();
    $("#results-table tbody").empty();
    searchForMovieByTitle(reviewerName);
});

function searchForMovieByTitle(reviewer) {
    database.ref("/movies").orderByChild("name").equalTo(reviewer).on("child_added", function (snapshot) {
        var snapData = snapshot.val();
        var tableData = "<tr>";
        tableData += "<td class='snap-name'>" + snapData.name + "</td>";
        tableData += "<td class='snap-movie'>" + snapData.favMovie + "</td>";
        tableData += "</tr>";
        $("#results-table tbody").append(tableData);
    }, function (errorObject) {
        console.log(errorObject);
    });
}