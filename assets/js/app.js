var database = firebase.database();
var updateId = "";
$("#submit-form").on("click", function(e){

    // prevent the form from submitting on default
    e.preventDefault();

    // get the name and favMovie values from the input fields
    var name = $("#name").val().trim();
    var favMovie = $("#fav-movie").val().trim();

    // Push the name and favMovie for someone to the movies collection
    database.ref("/movies").push({
        name: name,
        favMovie: favMovie
    });

    //clear out the values of name and favMovie 
    $("#name").val("");
    $("#fav-movie").val("");

    alert("Item added!");
});

$("#submit-edit-form").on("click", function(e){
    
        // prevent the form from submitting on default
        e.preventDefault();
    
        // get the name and favMovie values from the input fields
        var name = $("#name-modal").val().trim();
        var favMovie = $("#fav-movie-modal").val().trim();

        var postData = {
            name: name,
            favMovie: favMovie
        };

        console.log(postData);

        var newPostKey = database.ref().child('movies').push().key;

        $('#myModal').modal('hide');
        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/movies/' + updateId] = postData;

        return database.ref().update(updates);

    });

// 
database.ref("/movies").on("child_added", function(snap){
    var snapName = snap.val().name;
    var snapFavMovie = snap.val().favMovie;
    var snapId = snap.key;

    var snapData = {
        "id": snapId,
        "name": snapName,
        "favMovie": snapFavMovie
    };

    var snapDataString = JSON.stringify(snapData);
    
    var tableData = "<tr class="+snapId+"><td>"+snapId+"</td>";
    tableData += "<td class='snap-name'>"+snapName+"</td>";
    tableData += "<td class='snap-movie'>"+snapFavMovie+"</td>";
    tableData += "<td><button class='btn btn-default edit' data-movie-object="+snapDataString+" data-target='#myModal' data-toggle='modal'>Edit</button></td>";
    tableData += "<td><button class='btn btn-danger delete' data-movie-id="+snapId+">Delete</button></td></tr>";
    
    $(".table").append(tableData);
});

database.ref("/movies").on("child_changed", function(snap){
    var snapId = "." + snap.key;
    $(snapId + " .snap-name").text(snap.val().name);
    $(snapId + " .snap-movie").text(snap.val().favMovie);
});

$(document).on("click", ".edit", function(e){
    e.preventDefault()
    var snapObject = JSON.parse($(this).attr("data-movie-object"));
    $("#myModalLabel").text("Edit " + snapObject.name);
    $("#name-modal").val(snapObject.name);
    $("#fav-movie-modal").val(snapObject.favMovie);
    updateId = snapObject.id;
});

$(document).on("click", ".delete", function(e){
    e.preventDefault()
    var buttonId = $(this).attr("data-movie-id");
    $(this).closest('tr').remove();
    database.ref("/movies/"+buttonId).remove();
});