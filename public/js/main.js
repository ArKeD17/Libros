'use strict';
// Function run notificacion of MaterialSnackbar
function notification(message, color){
	let notification = document.querySelector('#notification');
	notification.className += ` mdl-color--${color}`;
	notification.MaterialSnackbar.showSnackbar({
		message: message,
		timeout: 10000
	});
}

window.addEventListener('load', function(){
	if(error.length > 0)
		setTimeout(function(){ notification(error, "red"); }, 1000);
	if(msg.length > 0)
		setTimeout(function(){ notification(msg, "blue"); }, 1000);
});

// Function input file
document.getElementById("uploadBtn").onchange = function () {
    document.getElementById("uploadFile").value = this.files[0].name;
};
