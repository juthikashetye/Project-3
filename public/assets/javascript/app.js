var name = ""
var pass = "";

$(document).ready(function() {

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


function login(n,p){

	$.ajax({
    url: `/login/${n}/${p}`,
    method: 'GET'

  }).then(function(l){

    alert(l);
    if (l=="You are logged in.") {
    	window.location.href = "./testingStuff.html"
    }

  });

}


