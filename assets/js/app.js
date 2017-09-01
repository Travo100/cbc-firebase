var database = firebase.database();

$("#submit-form").on("click", function(e){

    // prevent the form from submitting on default
    e.preventDefault();

    // get the name and favMovie values from the input fields
    var name = $("#name").val().trim();
    var favMovie = $("#fav-movie").val().trim();

    // Push the name and favMovie for someone to the database
    database.ref().push({
        name: name,
        favMovie: favMovie
    });

    //clear out the values of name and favMovie 
    $("#name").val("");
    $("#fav-movie").val("");

    alert("Item added!");
});