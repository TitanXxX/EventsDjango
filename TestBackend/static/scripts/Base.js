
var SiteMessageList = [];
const colors = ["var(--bad-message-color)", "var(--neutral-message-color)", "var(--good-message-color)"];
var ID = null;



function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

function create_message(good, ...text){
	var message = document.createElement("div");
	message.setAttribute("class","SiteMessage");
	message.innerHTML = "";
	for (item in text){
		message.innerHTML += text[item]
	}
	message.style = "background-color: color-mix(in srgb, " + colors[good + 1] + " var(--opacity), transparent);";
	SiteMessages.appendChild(message);
	SiteMessageList.push(message);
	console.log(...text);
	setTimeout(del_messages, 5000, message);
}

function del_messages(message){
	SiteMessageList.splice(SiteMessageList.indexOf(message), 1);
	message.remove();
}

function LOGIN(DATA) {
	var data = {};
	login_el.style.display="none";
	logout_el.style.display="none";
	username_el.style.display="none";
	if(DATA !== undefined) {
		data = DATA;
	} else if(!getCookie("Token")){
		login_el.style.display="block";
		return 1;
	}
	$.ajax({
		url: LOGIN_URL,
		type: "POST",
		beforeSend: function(request){
			request.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
			if($.isEmptyObject(data)) request.setRequestHeader("Authorization", getCookie("Token"));
		},
		mode: "same-origin",
		data: data,
		dataType: "json",
		success: function(response) {
				login_el.style.display = "none";
				logout_el.style.display = "none";
				username_el.style.display = "none";
				if(response.error === null) {
					ID = response.result.user.id;
					username_el.innerHTML = response.result.user.name;
					username_el.style.display = "block";
					username_el.href = DETAILS_WEB_URL.slice(0, DETAILS_WEB_URL.length - 2) + ID;
					document.cookie = "Token=" + encodeURIComponent("Token " + response.result.token) + "; path=/; secure; max-age=31536000";
					logout_el.style.display = "block";
					create_message(1, "Успешная авторизация");
					if(!$.isEmptyObject(data)) {
						window.location.href = MAIN_WEB_URL;
					}
				} else {
					create_message(-1, "Ошибка:", response.error);
					login_el.style.display = "block";
				}
		},
		error: function(response) {
			create_message(-1, "Ошибка при входе:", response);
			login_el.style.display="block";
			logout_el.style.display="none";
			username_el.style.display="none";
		}
	});
}

function LOGOUT() {
	login_el.style.display="none";
	logout_el.style.display="none";
	username_el.style.display="none";
	if(!getCookie("Token")){
		login_el.style.display="block";
		return 1;
	}
	$.ajax({
		url: LOGIN_URL,
		type: "DELETE",
		beforeSend: function(request){
			request.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
			request.setRequestHeader("Authorization", getCookie("Token"));
		},
		mode: "same-origin",
		data: {},
		dataType: "json",
		success: function(response) {
				login_el.style.display="none";
				logout_el.style.display="none";
				username_el.style.display="none";
				if(response.error === null) {
					document.cookie = "Token=Token; path=/; secure; max-age=0";
					login_el.style.display="block";
					create_message(1, "Успешный выход");
					window.location.href = LOGIN_WEB_URL;
				} else {
					create_message(-1, "Ошибка:", response.error);
					logout_el.style.display="block";
				}
		},
		error: function(response) {
			create_message(-1, "Ошибка при выходе:", response);
			login_el.style.display="none";
			logout_el.style.display="block";
			username_el.style.display="none";
		}
	});
}
