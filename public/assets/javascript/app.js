var name = ""
var pass = "";

$(document).ready(function() {

	// event handler for signup button
  	$("#signupButton").on("click",function(e) {

		name = $("#username").val();
		pass = $("#password").val();

		if (name == "" || pass == "") {
    		alert("Please fill required (*) fields.");
  		}else {
  			signup(name,pass);
  		}
  	});

	// event handler for login button
	$("#loginButton").on("click",function(e) {

		name = $("#username").val();
		pass = $("#password").val();

		if (name == "" || pass == "") {
    		alert("Please fill required (*) fields.");
  		}else {
  			login(name,pass);
  		}
  	});
});

// returns login msg for user & redirects to main page
function login(n,p){

	$.ajax({
    url: `/login/${n}/${p}`,
    method: 'GET'

  	}).then(function(l){

    alert(l);

	    if (l == "You are logged in.") {
	    	window.location.href = "./testingStuff.html"
	    }
  	});
}

// returns signup msg for user
function signup(n,p){

	$.ajax({
    url: `/signup/${n}/${p}`,
    method: 'GET'

  	}).then(function(s){

    alert(s);

  	});
}
