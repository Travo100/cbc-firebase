var database = firebase.database();
var updateId = "";
$("#submit-form").on("click", function(e){

    // prevent the form from submitting on default
    e.preventDefault();

    // Push the name and favMovie for someone to the movies collection
    database.ref("/movies").push({
        name: $("#name").val().trim(),
        favMovie: $("#fav-movie").val().trim()
    });

    //clear out the values of name and favMovie 
    $("#name").val("");
    $("#fav-movie").val("");

});

$("#submit-edit-form").on("click", function(e){

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
database.ref("/movies").on("child_added", function(snap){

    //store all the values in an object
    var snapData = {
        "id": snap.key,
        "name": snap.val().name,
        "favMovie": snap.val().favMovie
    };

    //put the data into a strong before attaching it to the edit button
    var snapDataString = JSON.stringify(snapData);
    
    //add the record to the table
    var tableData = "<tr class="+snapData.id+"><td>"+snapData.id+"</td>";
    tableData += "<td class='snap-name'>"+snapData.name+"</td>";
    tableData += "<td class='snap-movie'>"+snapData.favMovie+"</td>";
    tableData += "<td><button class='btn btn-default edit snap-edit-button' data-movie-object='"+snapDataString+"' data-target='#myModal' data-toggle='modal'>Edit</button></td>";
    tableData += "<td><button class='btn btn-danger delete' data-movie-id="+snapData.id+">Delete</button></td></tr>";
    
    $(".table").append(tableData);
});

//listen for when a child has changed 
database.ref("/movies").on("child_changed", function(snap){
    //get the class of that child based of it's key
    var snapId = "." + snap.key;

    //store all the values in an object
    var snapData = {
        "id": snap.key,
        "name": snap.val().name,
        "favMovie": snap.val().favMovie
    };

    //put the data into a strong before attaching it to the edit button
    var snapDataString = JSON.stringify(snapData);
    
    // use the class name then target the .snap-name and .snap-movie of 
    // that class 
    $(snapId + " .snap-name").text(snapData.name);
    $(snapId + " .snap-movie").text(snapData.favMovie);
    $(snapId + " .snap-edit-button").attr("data-movie-object", snapDataString);
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