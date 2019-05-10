var name = ""
var pass = "";
var globalUserId;
var globalName;

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
    method: 'POST'

  	}).then(function(l){

	    if (l.msg == "You are logged in.") {
	    	alert(l.msg);
	    	globalUserId = l.user_id;
	    	console.log(globalUserId);
	    	window.location.href = "./main.html"
	    }else {
	    	alert(l);
	    }
  	});
  	
}

// returns signup msg for user
function signup(n,p){

	$.ajax({
    url: `/signup/${n}/${p}`,
    method: 'POST'

  	}).then(function(s){

    alert(s);

  	});
}

function getNotebooks(id){

	$.ajax({
    url: `/get-all-notebooks/${id}`,
    method: 'GET',
    async: false

  	}).done(function(nb){

  		console.log(nb);

  		for (var i = 0; i < nb.length; i++) {

  			var optGroup = $("<optgroup>").attr("label", nb[i].notebook_name);
  			$("#notebookNotes").append(optGroup);


  			$("#notebookNotes").trigger('contentChanged');

  		}


  	});
}
function getSessionInfo() {

  $.ajax({
    url: "/get-session",
    method: 'GET',
    async: false
  }).done(function(c) {
      //console.log(c)
      globalUserId = c.user_id
      globalName = c.username
      

      // switch (flag) {
      //   case 1: 
      //     if (globalUserId == null) {
      //       window.location.href="./index.html"
      //     } else {
      //         //$("#currUser").empty().append(globalName);
      //         $(".usernameDropdown").text(globalName)
      //         var x = getCurrUserRank(globalUserId)
      //         $(".rankDropdown").text(x.user_rank)
      //         var y = currUserTeamRank(globalUserId)
      //         $(".teamRankDropdown").text(y.Team_Rank)
      //         $(".teamDropdown").text(teamName)
      //         if (callback != undefined)
      //           callback()
      //       }
      //   break;
      //   case 2:
      //     if (globalUserId == null) {
      //       //window.location.href="index.html"
      //     } else {
      //         //$("#currUser").empty().append(globalName);
      //         window.location.href="./assets/html/main.html"
      //         if (callback != undefined)
      //           callback()
      //       }
      //   break;
      // }

  });

}
