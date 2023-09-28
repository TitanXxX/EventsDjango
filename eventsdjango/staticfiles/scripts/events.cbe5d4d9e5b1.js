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
		events[i].place.addEventListener("click", function(){
			const index = events[i].id;
			VIEW_EVENT(index);
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


/*
console.log('Start');
var Update_Loading_Value=0;
const myAudio=document.createElement("audio");

//----
var track_name=localStorage.getItem("track_name");
if((track_name==null) || (track_name===undefined)) track_name="TrackName";

var track_author=localStorage.getItem("track_author");
if((track_author==null) || (track_author===undefined)) track_author="TrackAuthor";

if((track_name!="TrackName") && (track_author!="TrackAuthor")) document.title=track_name+" - "+track_author;


var track_id=localStorage.getItem("track_id");
if(track_id==null) track_id=0;

var repeat_flag=parseInt(localStorage.getItem("repeat_flag"));
if((repeat_flag==null) || isNaN(repeat_flag)) repeat_flag=0;
var shuffle_flag=parseInt(localStorage.getItem("shuffle_flag"));
if(shuffle_flag==null){
	shuffle_flag=false;
} else{
	shuffle_flag=(shuffle_flag==1);
}
var volume=parseInt(localStorage.getItem("volume"));
if((volume==null) || isNaN(volume)) volume=50;
var track_loaded=false;
var trackname=document.getElementById("trackname");
trackname.innerHTML=track_name;
var trackauthor=document.getElementById("trackauthor");
trackauthor.innerHTML=track_author;

var tracktime=document.getElementById("tracktime");

var Starting=false;
var search_value="";

var MyMusic_element=document.getElementById("MyMusic");
var AllMusic_element=document.getElementById("AllMusic");
var MyMusic_switch=localStorage.getItem("MyMusic_switch");
if(MyMusic_switch==null){
	MyMusic_switch=true;
} else MyMusic_switch=MyMusic_switch=="true";
MyMusic_element.checked=MyMusic_switch;
AllMusic_element.checked=!MyMusic_switch;
//----

var play=document.getElementById("play");
var pause=document.getElementById("pause");
var shuffle_element=document.getElementById("shuffle_flag");
var repeat_element=document.getElementById("repeat_flag");
var for_repeat_element=document.getElementById("for_repeat");
var add_to_music=document.getElementById("add_to_music");
var MusicList_box=document.getElementById("MusicList_box");


var slider=document.getElementById("slider_range");

var track_list=[];

function playpause(argument){
	if(Starting) return true;
	Starting=true;
	const divs=MusicList_box.getElementsByTagName('div');
	for (const div of divs) {
		if(parseInt(div.getAttribute("data"))==track_id) {
			div.classList.add("Active_Track_box");
		} else{
			div.classList.remove("Active_Track_box");
		}
	}
	if(myAudio.paused) {
		if(track_loaded){
			if(myAudio.play()) {
				pause.style.display="block";
				play.style.display="none";
			} else{
				pause.style.display="none";
				play.style.display="block";
			}
		} else{
			myAudio.load();
			myAudio.src="";
			Loading_Timer=setInterval(Update_Loading_Timer,20);
			load_track(track_id).then(response => {
				myAudio.src="data:audio/mpeg;base64,"+response.source;
				clearInterval(Loading_Timer);
				if(argument){
					track_loaded=true;
					Starting=false;
					return true;
				}
				if(myAudio.play()) {
					pause.style.display="block";
					play.style.display="none";
					track_loaded=true;
				} else{
					pause.style.display="none";
					play.style.display="block";
					track_loaded=false;
				}
				Starting=false;
			}).catch(response => {
				clearInterval(Loading_Timer);
				pause.style.display="none";
				play.style.display="block";
				Starting=false;
			});
		}
	} else {
		myAudio.pause();
		pause.style.display="none";
		play.style.display="block";
	}
	Starting=false;
}
function getRandomInt(max) {
	return Math.floor(Math.random()*(max+1));
}
function skip(side){
	localStorage.setItem("track_name",track_name);
	localStorage.setItem("track_author",track_author);
	localStorage.setItem("track_id",track_id);
	if(track_list.length==0) return true;
	var real=-1;
	for(const index in track_list){
		if(track_list[index].track_id==track_id){
			real=parseInt(index);
			break;
		}
	}
	var output=0;
	if(shuffle_flag){
		if(track_list.length>=2){
			output=getRandomInt(track_list.length-2);
			if(output==real) output+=1;
		}
	} else{
		if(side==0){
			if((real==0) || (real==-1)){
				output=track_list.length-1;
			} else{
				output=real-1;
			}
		} else{
			if((real==(track_list.length-1)) || (real==-1)){
				output=0;
			} else{
				output=real+1;
			}
		}
	}
	const timed=track_list[output.toString()];
	if(timed===undefined) return true;
	if(!myAudio.paused) myAudio.pause();
	track_name=timed.name;
	track_author=timed.author;
	track_id=timed.track_id;
	document.title=track_name+" - "+track_author;
	trackname.innerHTML=track_name;
	trackauthor.innerHTML=track_author;
	localStorage.setItem("track_name",track_name);
	localStorage.setItem("track_author",track_author);
	localStorage.setItem("track_id",track_id);
	track_loaded=false;
	playpause();
}
function ended(argument){
	console.log('Ended with func');
	switch(repeat_flag) {
		case 0://Nothing to do
			pause.style.display="none";
			play.style.display="block";
			break;
		case 1://Play to the end of the list
			skip(1);
			break;
		case 2://Replay this one
			myAudio.play();
			break;
		default:
			break;
	}
}
function load_track(id){
	return $.ajax({
		url: LOAD_MUSIC_URL,
		type: "POST",
		beforeSend: function(request) {
			request.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
		},
		mode: "same-origin",
		data: {"ID": id},
		dataType: "json",
		error: function(response) {console.log("Error on download music",response);}
	});
}
function shuffle(argument){
	if(argument instanceof PointerEvent) {
		shuffle_flag=!shuffle_flag;
	} else {
		shuffle_flag=argument;
	}
	localStorage.setItem("shuffle_flag",shuffle_flag?"1":"0");
	if(shuffle_flag){
		shuffle_element.style.color="var(--second-color)";
	} else{
		shuffle_element.style.color="var(--third-color)";
	}
}
function repeat(argument){
	if(argument instanceof PointerEvent) {
		if(repeat_flag!=2) repeat_flag++;
		else repeat_flag=0;
	} else {
		repeat_flag=argument;
	}
	localStorage.setItem("repeat_flag",repeat_flag.toString());
	switch(repeat_flag) {
		case 0:
			repeat_element.style.color="var(--third-color)";
			for_repeat_element.style.color="transparent";
			break;
		case 1:
			repeat_element.style.color="var(--second-color)";
			for_repeat_element.style.color="transparent";
			break;
		case 2:
			repeat_element.style.color="var(--second-color)";
			for_repeat_element.style.color="currentColor";
			break;
		default:
			break;
	}
}
function addtomusic(argument){
	var id=parseInt(argument.getAttribute("data"));
	if(isNaN(id)) id=track_id;
	$.ajax({
		url: ADD_TO_MUSICLIST_URL,
		type: "POST",
		beforeSend: function(request) {
			request.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
		},
		mode: "same-origin",
		data: {
			"track_id":id,
			"flag_add":(!argument.classList.contains("Active_AddTrack_btn"))?"true":"false"},
		dataType: "json",
		success: function(response){
			if(response.success=="true") {
				argument.classList.toggle("Active_AddTrack_btn");
				if(argument==add_to_music) {
					const divs=MusicList_box.getElementsByTagName("div");
					for (const div of divs) {
						var track=parseInt(div.getAttribute("data"));
						if(track===undefined) continue;
						if(track==id) {
							div.getElementsByClassName("add-icon")[0].classList.toggle("Active_AddTrack_btn");
						}
					}
				} else {
					if(id==track_id) {
						add_to_music.classList.toggle("Active_AddTrack_btn");
					}
				}
			}
		},
		error: function(response) {console.log("Error on add/del to/from tracklist", response);}
	});
}
function changeVolume(arg){
	volume=arg;
	myAudio.volume=volume/100;
	localStorage.setItem("volume",volume.toString());
}
function UpdateRange(argument){
	if(myAudio.duration!==undefined) {
		set_point(myAudio.currentTime/myAudio.duration);
		var seconds=Math.floor(myAudio.currentTime);
		var allseconds=Math.floor(myAudio.duration);
		tracktime.innerHTML=Math.floor(seconds/60)+":"+(((seconds%60)<10)?"0":"")+(seconds%60).toString()+"/"+Math.floor(allseconds/60)+":"+(((allseconds%60)<10)?"0":"")+(allseconds%60).toString();
	}
}
function StartTrack(argument,event,target){
	if(!target.includes(event.target)){
		return false
	}
	var music_id=parseInt(argument.getAttribute("data"));
	var timed=undefined;
	for (const index in track_list) {
		if(track_list[index].track_id==music_id){
			timed=track_list[index];
			break;
		}
	}
	if(timed===undefined) return true;
	if(!myAudio.paused) myAudio.pause();
	track_name=timed.name;
	track_author=timed.author;
	track_id=timed.track_id;
	document.title=track_name+" - "+track_author;
	trackname.innerHTML=track_name;
	trackauthor.innerHTML=track_author;
	localStorage.setItem("track_name",track_name);
	localStorage.setItem("track_author",track_author);
	localStorage.setItem("track_id",track_id);
	track_loaded=false;
	playpause();
}

function load_tracklist(){
	MyMusic_switch=MyMusic_element.checked;
	localStorage.setItem("MyMusic_switch",MyMusic_switch);
	return $.ajax({
		url: LOAD_MUSICLIST_URL,
		type: "POST",
		beforeSend: function(request) {
			request.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
		},
		mode: "same-origin",
		data: {
			"q":search_value,
			"mymusic":MyMusic_switch?"true":"false"},
		dataType: "json",
		success: function(response){
			MusicList_box.innerHTML="";
			track_list=[];
			for (const index in response) {
				data=response[index];
				data["inmymusic"]=data["inmymusic"]=="1";
				/*<img src="assets/test.jpg" alt="Icon" class="icon">
				if(data["id"]==track_id) {
					if(data["inmymusic"]) {
						add_to_music.classList.add("Active_AddTrack_btn");
					} else {
						add_to_music.classList.remove("Active_AddTrack_btn");
					}
				}
				MusicList_box.appendChild(get_track_html(title=data["name"],author=data["author"],image=data["image"],id=data["id"],time=data["time"],inmymusic=data["inmymusic"]));
				track_list.push({
					name:data["name"],
					author:data["author"],
					image:data["image"],
					track_id:data["id"],
					time:data["time"],
					MyMusic:data["inmymusic"]});
			}
		},
		error: function(response) {console.log("Error on load tracklist",response);}
	});
}
function search(value){
	search_value=value;
	load_tracklist();
}
function get_track_html(title,author,image,id,time,inmymusic) {
	var title_element = document.createElement("div");
	title_element.setAttribute("class","title");
	title_element.innerHTML=title;
	var author_element = document.createElement("div");
	author_element.setAttribute("class","author");
	author_element.innerHTML=author;
	var image_element = document.createElement("div");
	image_element.setAttribute("class","image");

	var actions_element = document.createElement("div");
	actions_element.setAttribute("class","actions");

	var add_element = document.createElementNS("http://www.w3.org/2000/svg","svg");
	
	add_element.setAttribute("class","add-icon");
	add_element.setAttribute("width","46");
	add_element.setAttribute("height","46");
	add_element.setAttribute("data",id);
	add_element.setAttribute("viewBox","0 0 46 46");
	add_element.setAttribute("fill","none");
	add_element.innerHTML='<line x1="23" y1="36" x2="23" y2="10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>\
				<line x1="10" y1="23" x2="36" y2="23" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>\
				<rect x="1" y="1" width="44" height="44" rx="21" stroke="currentColor" stroke-width="2"/>';
	if(inmymusic) {
		add_element.classList.add("Active_AddTrack_btn");
	} else {
		add_element.classList.remove("Active_AddTrack_btn");
	}

	add_element.onclick=function(event) {
		addtomusic(add_element);
	}
	var load_element = document.createElementNS("http://www.w3.org/2000/svg","svg");
	load_element.setAttribute("class","add-icon");
	load_element.setAttribute("width","46");
	load_element.setAttribute("height","46");
	load_element.setAttribute("data",id);
	load_element.setAttribute("viewBox","0 0 46 46");
	load_element.setAttribute("fill","none");
	load_element.innerHTML='<path d="M24.5 11C24.5 10.1716 23.8284 9.5 23 9.5C22.1716 9.5 21.5 10.1716 21.5 11H24.5ZM21.9393 36.0607C22.5251 36.6464 23.4749 36.6464 24.0607 36.0607L33.6066 26.5147C34.1924 25.9289 34.1924 24.9792 33.6066 24.3934C33.0208 23.8076 32.0711 23.8076 31.4853 24.3934L23 32.8787L14.5147 24.3934C13.9289 23.8076 12.9792 23.8076 12.3934 24.3934C11.8076 24.9792 11.8076 25.9289 12.3934 26.5147L21.9393 36.0607ZM21.5 11V35H24.5V11H21.5Z" fill="currentColor"/>\
				<rect x="1" y="1" width="44" height="44" rx="21" stroke="currentColor" stroke-width="2"/>';
	
	var time_element=document.createElement("div");
	time_element.setAttribute("class","time");
	time_element.innerHTML=time;

	actions_element.appendChild(add_element);
	actions_element.appendChild(load_element);
	actions_element.appendChild(time_element);
			

	var track_element = document.createElement("div");
	track_element.setAttribute("class","track");
	track_element.setAttribute("data",id);

	track_element.appendChild(title_element);
	track_element.appendChild(author_element);
	track_element.appendChild(image_element);
	
	track_element.appendChild(actions_element);

	if(id==track_id) {
		track_element.classList.add("Active_Track_box");
	} else{
		track_element.classList.remove("Active_Track_box");
	}

	track_element.onclick=function(event) {
		StartTrack(track_element,event,[this,title_element,author_element,image_element]);
	}

	return track_element;
}
/*
----------------------
----------------------
----------------------

function polarToCartesian(centerX,centerY,radius,angleInDegrees) {
	var angleInRadians=(angleInDegrees-90)*Math.PI/180.0;
	return {
		x:centerX+(radius*Math.cos(angleInRadians)),
		y:centerY+(radius*Math.sin(angleInRadians))
	};
}

function describeArc(x,y,radius,startAngle,endAngle){
	var start=polarToCartesian(x,y,radius,endAngle);
	var end=polarToCartesian(x,y,radius,startAngle);
	var largeArcFlag=endAngle-startAngle<=180?"0":"1";
	pos.x=start.x;
	pos.y=start.y;
	if(isNaN(start.x)) return false;
	var d=[
		"M",start.x,start.y,
		"A",radius,radius,0,largeArcFlag,0,end.x,end.y
	].join(" ");
	return d;
}
arc=document.getElementById("arc");
full_arc=document.getElementById("full_arc");
arc_pos=document.getElementById("arc_pos");
var pos={x:0,y:0};
function set_point(percent,color){
	if(color===undefined) color="#000000";
	var angle=percent*360;
	var d=describeArc(50,50,48,0,angle);
	if(d==false) return false;
	if(angle>=360) {
		full_arc.setAttribute("stroke",color);
		arc.setAttribute("stroke","none");
	} else {
		arc.setAttribute("stroke",color);
		full_arc.setAttribute("stroke","none");
		arc.setAttribute("d",d);
	}
	arc_pos.setAttribute("cx",pos.x);
	arc_pos.setAttribute("cy",pos.y);
}

function addMouseDownListener(arg) {
	$(arg).on("mousedown",onMouseDownHandler);
}
function removeMouseDownListener(arg) {
	$(arg).off("mousedown",onMouseDownHandler);
}

myAudio.addEventListener("ended",ended);
var updateTimer=setInterval(UpdateRange,100);

load_tracklist();
playpause(true);

console.log('End');
*/




