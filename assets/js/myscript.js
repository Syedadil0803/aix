	window.onscroll = function() {myFunction()};

// Get the header
var header = document.getElementById("myHeader");
var logow = document.getElementById("mylogoW");
var logob = document.getElementById("mylogoB");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("header-sticky");
    logow.classList.add("d-none");
    logob.classList.add("d-block");
  } else {
    header.classList.remove("header-sticky");
    logow.classList.remove("d-none");
    logob.classList.remove("d-block");
  }
}
	
var coll = document.getElementsByClassName("menu-trigger");
var i;
var nav = document.getElementById("myNav");

for (i = 0; i < coll.length; i++) {

  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
	nav.classList.toggle("d-block");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
	  
    }
  });
}
