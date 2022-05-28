let TC=document.querySelector(".ticket-container");
let modalVisible=false
let selectedPriority;

let add=document.querySelector(".add");
let remove=document.querySelector(".delete")
remove.addEventListener("click",removeTicket);
add.addEventListener("click",showModal);

//fetch only those tiicket who match the priority
let allfilters=document.querySelectorAll(".filter");
for(let i=0;i<allfilters.length;i++){
  allfilters[i].addEventListener("click",filterHandler);
}


//fetch ticket and display when reload the webpage
function loadTicket(color){
let allTicket=localStorage.getItem("allTask");
if(allTicket!=null)
{
  allTicket=JSON.parse(allTicket);

  if(color)//if color undefined this condition not run
  {
  allTicket=allTicket.filter(function(data){
    return data.priority==color;
  })   
  }

  for(let i=0;i<allTicket.length;i++){
    let ticket=document.createElement("div");
    ticket.classList.add("ticket");

    ticket.innerHTML= `
                        <div class="ticket-color ticket-color-${allTicket[i].priority}">
                        </div>
                        <div class="ticket-id">#${allTicket[i].ticketid}</div>
                        <div class="task">${allTicket[i].task}</div>
                      `
    ticket.addEventListener("click",selectTicket)
    TC.appendChild(ticket);
  }
}
}

loadTicket();
//end of fetch ticket


function showModal(e){
  if(modalVisible==false){
    let modal=document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML=`
                    <div class="task-to-be-added" contenteditable="true" data-type="false">enter your text</div>
                    <div class="modal-priority-list">
                      <div class="modal-pink-filter modal-filter active"></div>
                      <div class="modal-blue-filter modal-filter"></div>
                      <div class="modal-green-filter modal-filter"></div>
                      <div class="modal-yellow-filter modal-filter"></div>
                    </div>
                  ` 
TC.appendChild(modal);
let tasktobeadded=document.querySelector(".task-to-be-added");//now when we click enter your task remove
tasktobeadded.addEventListener("click",function(e){
      if(e.currentTarget.getAttribute("data-type")=="false"){
        e.currentTarget.innerText="";
        e.currentTarget.setAttribute("data-type","true");
      }
    });
  
  selectedPriority="pink";//by default selected priority
  tasktobeadded.addEventListener("keypress",addTicket.bind(this,tasktobeadded));
  let modalFilters=document.querySelectorAll(".modal-filter");
  for(let i=0;i<modalFilters.length;i++){
    modalFilters[i].addEventListener("click",selectPriority.bind(this,tasktobeadded));
  }
modalVisible=true
}
}

function selectPriority(tasktobeadded,e){//function to change priority
  let activeFilter=document.querySelector(".modal-filter.active");
  activeFilter.classList.remove("active");
  e.currentTarget.classList.add("active");
  selectedPriority=e.currentTarget.classList[0].split("-")[1];
  
  tasktobeadded.click();//so that enter your text remove after selection
  tasktobeadded.focus();//after selection the priority we want the focus on tasktobeadded so that we press enter and ticket add on container if we only use click we cant enter any string
  console.log(selectedPriority)
}

function addTicket(tasktobeadded,e){
  if(e.key=='Enter'&&e.shiftKey==false&&tasktobeadded.innerText.trim()!=""){
    let task=e.currentTarget.innerText;
    let ticket=document.createElement("div");
    ticket.classList.add("ticket");
    let id=uid();
    // ticket.innerHTML= `
    //                     <div class="ticket-color ticket-color-${selectedPriority}">
    //                     </div>
    //                     <div class="ticket-id">#${id}</div>
    //                     <div class="task">${task}</div>
    //                   `
    // ticket.addEventListener("click",selectTicket)
    // TC.appendChild(ticket);

    //Add tickket into local storage as well
    let allTask=localStorage.getItem("allTask");
    if(allTask==null){
     allTask=[{"ticketid":id,"task":task,"priority":selectedPriority}] 
     localStorage.setItem("allTask",JSON.stringify(allTask));
    }
    else{
      let data=JSON.parse(allTask);//we get data in form of string
      data.push({"ticketid":id,"task":task,"priority":selectedPriority});
      localStorage.setItem("allTask",JSON.stringify(data));
    }
   
    //here in addticket we first store ticket in local storage then we add on ticket container because if we add directly then ticket add with current selected filter
    let activeFilter=document.querySelector(".filter.active"); 
    TC.innerHTML=""//to remove duplicate ticket
    if(activeFilter){
      let color=activeFilter.children[0].classList[0].split("-")[0];
      loadTicket(color);  
    }
    else{
      loadTicket();
    }
    //local storage addition complete
    //document.querySelector(".modal").remove();//now after entering the ticket we need to remove modal
    modalVisible=false;
  }
  else if(e.key=='Enter'&&e.shiftKey==false&&tasktobeadded.innerText.trim()==""){
    e.preventDefault();
  }
}

function selectTicket(e){//eventlistener to select ticket
  if(e.currentTarget.classList.contains("active")){
    e.currentTarget.classList.remove("active");
  }
  else{
    e.currentTarget.classList.add("active");
  }
}

function removeTicket(e){
  console.log("Remmofe")
  let selectedTicket=document.querySelectorAll(".ticket.active");
  let allTasks=JSON.parse(localStorage.getItem("allTask"));
  for(let i=0;i<selectedTicket.length;i++){
    selectedTicket[i].remove();
    //delete data from local storage
    let ticketId=selectedTicket[i].querySelector(".ticket-id").innerText;//we fetch ticket-id element from selected ticket
    allTasks=allTasks.filter(function(data){
      return "#"+data.ticketid!=ticketId;
    })
  }
  localStorage.setItem("allTask",JSON.stringify(allTasks));
  //local storage deletion end here
}


//this funtion will show only that ticket on which we click if we dont click on any fiter then it display all the ticket
function showonlythiscolorticket(e){
 TC.innerHTML="";//first blank the ticket-container
 let color=e.currentTarget.children[0].classList[0].split("-")[0];

 let allTicket=localStorage.getItem("allTask");
if(allTicket!=null)
{
  allTicket=JSON.parse(allTicket);
  for(let i=0;i<allTicket.length;i++){
    if(allTicket[i].priority==color){//if color mactch with ticket priority then it display other it not
    let ticket=document.createElement("div");
    ticket.classList.add("ticket");

    ticket.innerHTML= `
                        <div class="ticket-color ticket-color-${allTicket[i].priority}">
                        </div>
                        <div class="ticket-id">#${allTicket[i].ticketid}</div>
                        <div class="task">${allTicket[i].task}</div>
                      `
    ticket.addEventListener("click",selectTicket)
    TC.appendChild(ticket);
    }
  }

}  }

function filterHandler(e){
  TC.innerHTML=""; 
  if(e.currentTarget.classList.contains("active")){
    e.currentTarget.classList.remove("active");
    loadTicket();
  }
  else{
    let activeFilter=document.querySelector(".filter.active");
    if(activeFilter!=null){
      activeFilter.classList.remove("active");
    }
    e.currentTarget.classList.add("active")
    let color=e.currentTarget.children[0].classList[0].split("-")[0];
    loadTicket(color)
  }
}