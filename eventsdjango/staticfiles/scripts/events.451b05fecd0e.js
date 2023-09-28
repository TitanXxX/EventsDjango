var selected = null;
var events = [];
const event_window = document.getElementById("event_window");
event_window.style.display = "none";
const title_all = document.getElementById("title_all");
const group_all = document.getElementById("group_all");
const title_my = document.getElementById("title_my");
const group_my = document.getElementById("group_my");
const add_event_btn = document.getElementById("add_event_btn");
/*window*/
const title = document.getElementById("title");
const date = document.getElementById("date");
const content = document.getElementById("content");
const members = document.getElementById("members");
const title_members = document.getElementById("title_members");

const btn_add_event = document.getElementById("add_event");
const btn_del_event = document.getElementById("del_event");
const btn_add_member = document.getElementById("add_member");
const btn_del_member = document.getElementById("del_member");

function GET_USER_INFO(id, place){
	data = {"id": id};
	$.ajax({
		url: DETAILS_URL,
		type: "POST",
		beforeSend: function(request){
			request.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
			request.setRequestHeader("Authorization", getCookie("Token"));
		},
		mode: "same-origin",
		data: data,
		dataType: "json",
		success: function(response) {
				if(response.error === null) {
					place.innerHTML = response.result.lastname + " " + response.result.name;
					place.href = DETAILS_WEB_URL.slice(0, DETAILS_WEB_URL.length - 2) + response.result.id;
				} else {
					create_message(-1, "Ошибка при проверке участника:", response.error);
				}
		},
		error: function(response) {
			create_message(-1, "Ошибка при проверке участника:", response);
		}
	});
}

function UPDATE_EVENTS() {
	var data = {};
	$.ajax({
		url: EVENTS_LIST_URL,
		type: "GET",
		beforeSend: function(request){
			request.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
			request.setRequestHeader("Authorization", getCookie("Token"));
		},
		mode: "same-origin",
		data: data,
		dataType: "json",
		success: function(response) {
				if(response.error === null) {
					events = response.result;
					REFRESH_EVENTS();
				} else {
					create_message(-1, "Ошибка при получении событий:", response.error);
				}
		},
		error: function(response) {
			create_message(-1, "Ошибка при получении событий:", response);
		}
	});
}

function ADD_EVENT() {
	title.value = "Название";
	content.value = "Описание";
	VIEW_EVENT(-1);
}

function VIEW_EVENT(click_id) {
	var event, member, me_in;
	console.log(click_id);
	event_window.style.display = "none";
	if(click_id !== undefined) {
		selected = click_id;
		for (i in events) {
			events[i].place.classList.remove("active");
			if(events[i].id == selected) events[i].place.classList.add("active");
		}
		if(selected == -1) add_event_btn.classList.add("active");
		else add_event_btn.classList.remove("active");
	}
	if(selected === null){
		event_window.style.display = "none";
	} else if(selected == -1){
		title.readOnly = false;
		content.readOnly = false;
		date.innerHTML = "";
		
		event_window.style.display = "block";
		title_members.style.display = "none";
		members.innerHTML = "";
		btn_add_event.style.display = "block";
		btn_del_event.style.display = "none";
		btn_add_member.style.display = "none";
		btn_del_member.style.display = "none";
	} else {
		for (i in events){
			if(events[i].id == selected) event = events[i];
		}
		title.value = event.title;
		content.value = event.text;
		date.innerHTML = new Date(Date.parse(event.add_date)).toLocaleString();
		me_in = false;
		members.innerHTML = "";
		if(!$.isEmptyObject(event.members)){
			title_members.style.display = "block";
			for (i in event.members){
				if(event.members[i] == ID) me_in = true;
				member = document.createElement("a");
				member.setAttribute("class","member");
				GET_USER_INFO(event.members[i], member);
				members.appendChild(member);
			}
		} else title_members.style.display = "none";

		btn_add_event.style.display = "none";
		btn_add_member.style.display = me_in?"none":"block";
		btn_del_member.style.display = me_in?"block":"none";
		title.readOnly = true;
		content.readOnly = true;
		if(event.owner == ID){
			/*title.readOnly = false;
			content.readOnly = false;*/
			btn_del_event.style.display = "block";
		} else {
			btn_del_event.style.display = "none";
		}
		event_window.style.display = "block";
	}
}



function REFRESH_EVENTS(){
	group_all.innerHTML = "";
	group_my.innerHTML = "";
	var flag_all = false;
	var flag_my = false;
	for (i in events){
		events[i].place = document.createElement("div");
		events[i].place.setAttribute("class","event");
		events[i].place.innerHTML = events[i].title;
		events[i].place.data = events[i].id;
		events[i].place.addEventListener("click", function(){
			VIEW_EVENT(this.data);
		});
		if(events[i].owner == ID){
			flag_my = true;
			group_my.appendChild(events[i].place);
		} else {
			flag_all = true;
			group_all.appendChild(events[i].place);
		}
	}
	title_all.style.display = flag_all?"block":"none";
	title_my.style.display = flag_my?"block":"none";
	group_all.style.display = flag_all?"block":"none";
	group_my.style.display = flag_my?"block":"none";
	VIEW_EVENT();
}
function CREATE_EVENT(e) {
	data = {"title": title.value, "text": content.value};
	$.ajax({
		url: EVENTS_LIST_URL,
		type: "POST",
		beforeSend: function(request){
			request.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
			request.setRequestHeader("Authorization", getCookie("Token"));
		},
		mode: "same-origin",
		data: data,
		dataType: "json",
		success: function(response) {
				if(response.error === null) {
					create_message(1, "Событие успешно создано");
					UPDATE_EVENTS();
				} else {
					create_message(-1, "Ошибка при создании события:", response.error);
				}
		},
		error: function(response) {
			create_message(-1, "Ошибка при создании события:", response);
		}
	});
}
function DELETE_EVENT(e) {
	data = {"id": selected};
	$.ajax({
		url: EVENTS_LIST_URL,
		type: "DELETE",
		beforeSend: function(request){
			request.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
			request.setRequestHeader("Authorization", getCookie("Token"));
		},
		mode: "same-origin",
		data: data,
		dataType: "json",
		success: function(response) {
				if(response.error === null) {
					create_message(1, "Событие успешно удалено");
					UPDATE_EVENTS();
				} else {
					create_message(-1, "Ошибка при удалении события:", response.error);
				}
		},
		error: function(response) {
			create_message(-1, "Ошибка при удалении события:", response);
		}
	});
}
function ADD_MEMBER(e) {
	data = {"id": selected};
	$.ajax({
		url: EVENTS_MEMBERS_URL,
		type: "POST",
		beforeSend: function(request){
			request.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
			request.setRequestHeader("Authorization", getCookie("Token"));
		},
		mode: "same-origin",
		data: data,
		dataType: "json",
		success: function(response) {
				if(response.error === null) {
					create_message(1, "Вы успешно присоединились к событию");
					UPDATE_EVENTS();
				} else {
					create_message(-1, "Ошибка при присоединении к событию:", response.error);
				}
		},
		error: function(response) {
			create_message(-1, "Ошибка при присоединении к событию:", response);
		}
	});
}
function DELETE_MEMBER(e) {
	data = {"id": selected};
	$.ajax({
		url: EVENTS_MEMBERS_URL,
		type: "DELETE",
		beforeSend: function(request){
			request.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
			request.setRequestHeader("Authorization", getCookie("Token"));
		},
		mode: "same-origin",
		data: data,
		dataType: "json",
		success: function(response) {
				if(response.error === null) {
					create_message(1, "Вы успешно вышли из события");
					UPDATE_EVENTS();
				} else {
					create_message(-1, "Ошибка при выходе из события:", response.error);
				}
		},
		error: function(response) {
			create_message(-1, "Ошибка при выходе из события:", response);
		}
	});
}
btn_add_event.addEventListener("click", CREATE_EVENT);
btn_del_event.addEventListener("click", DELETE_EVENT);
btn_add_member.addEventListener("click", ADD_MEMBER);
btn_del_member.addEventListener("click", DELETE_MEMBER);

function UPDATER(){
	UPDATE_EVENTS();
}

UPDATER();
let updater = setInterval(UPDATER, 30000);

content.setAttribute("style", "height: " + content.scrollHeight + "px; overflow-y: hidden;");
content.addEventListener("input", TEXTAREA, false);

function TEXTAREA(){
	this.style.height = "auto";
	this.style.height = (this.scrollHeight) + "px";
}





