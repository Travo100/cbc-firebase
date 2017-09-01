var database = firebase.database();

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

// 
database.ref("/movies").on("child_added", function(snap){
    var snapName = snap.val().name;
    var snapFavMovie = snap.val().favMovie;
    var snapId = snap.key;
    var tableData = "<tr><td>"+snapId+"</td>";
    
    tableData += "<td>"+snapName+"</td>";
    tableData += "<td>"+snapFavMovie+"</td>";
    tableData += "<td><button class='btn btn-default edit' data-movie-id="+snapId+">Edit</button></td>";
    tableData += "<td><button class='btn btn-danger delete' data-movie-id="+snapId+">Delete</button></td></tr>";
    
    $(".table").append(tableData);
});

$(document).on("click", ".edit", function(e){
    e.preventDefault()
    var buttonId = $(this).attr("data-movie-id");

});

$(document).on("click", ".delete", function(e){
    e.preventDefault()
    var buttonId = $(this).attr("data-movie-id");
    $(this).closest('tr').remove();
    database.ref("/movies/"+buttonId).remove();
});