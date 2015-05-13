"use strict";

var tasks=[];
var task, todoList;
//wait for dom to ready and execuite the main function
$(document).ready(function (){

//    document.getElementById("todoForm").onsubmit=addTask;
    $("#todoForm").submit(addTask);
    $("#clearList").submit(clearList);
    todoList=document.getElementById("list");
    
    if (localStorage.getItem("tasks")) {
        tasks=JSON.parse(localStorage.getItem("tasks"));
        todoList.innerHTML=writeTaskList(tasks);
        //checkTasks(tasks);
    }
    
    //pass all the task items to updateStatus plugin which has click handler to update task status
    $(".listItem").updateStatus();
    $(".deleteBtn").deleteTasks();

    console.log(tasks);
});

$.fn.deleteTasks=function(list){
// dom element deletion -this jQuery function attaches a click handeler to all the elements passed which will delete the parent element on click
// @param list - list of all the items to which the click handler is to be attached.
    
    return this.click(function(evt){
        console.log(this);
        var id =parseInt($(this).parent().attr("id"));
        $(this).parent().remove() //delete the clicked element
        deleteTask(id); //delete the task from the memory
    });
s
};//end of deleteTasks()

$.fn.updateStatus=function(list){
    
    var listElements = this;
   // console.log(listElements);
    listElements.each(function(i){
        var id= parseInt(this.attributes["id"].value);
        var accomplished= tasks[id].accomplished;
        console.log(accomplished);
        $(this).find(":checkbox").prop("checked", accomplished);//set the box of each task
        //add a strikethrough if task is accomplished
        if(accomplished){
            $(this).find(".taskText").css("text-decoration", "line-through");

        }
        //$(this).find(".taskText").prop("checked", accomplished)
        //console.log(foo);
    });

   // $(':checkbox').prop("checked", this.attributes["accomplished"].value);

    return this.click(function(evt){
       // console.log(this);
        //tasks[this.]
        var taskId= parseInt(this.attributes["id"].value);
      //  console.log(tasks[taskId]);
        //set the clicked task as accomplished and save it to localStorage
        if(tasks[taskId].accomplished==false)
        {
            tasks[taskId].accomplished=true;
            //if task is accomplished then strike it out
            $(this).find(".taskText").css("text-decoration", "line-through");
        }
        else{
            tasks[taskId].accomplished=false;
            $(this).find(".taskText").css("text-decoration", "");;
        }
        localStorage.setItem("tasks", JSON.stringify(tasks));    
    });

}; //end of updstStatus() plugin

function clearList(){
//This method clears the tasks from local storage and sets the local array to blank
    tasks=[];
    window.localStorage.clear();
};
function todo(todo) {
// todo is custom data structure that denotes each task, the task property stores the task's string value,
// accomplished property stores the status of task as boolean.
// @param todo - is a task as test teststing
    this.task=todo;
    this.accomplished=false;
};

function addTask(){
    task = document.getElementById("todo").value;
    if(task ==null || task.trim() ==""){
        alert("The task entered is blank, please enter a valid task.")
        return;
    }
    tasks.push(new todo(task));
    localStorage.setItem("tasks", JSON.stringify(tasks));
};
function deleteTask(id){
    tasks.splice(id, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));

};
function writeTaskList(tasks){    
    
    var output, count=0;
    output = "<table>";
    for(var task in tasks){
        output += '<tr id="'+count+'" class="listItem" >';
        output +='<td> <input type="checkbox" chkbox /> </td>'; //add id attribute with value of array index for id
        output += '<td class="taskText">'+tasks[task].task+'</td>';
        output += '<td class="deleteBtn"><img src="img/recycle.png" width="22" height="22"></td>';
        //output += '<td>'+count+'</td>'
        output += '</tr>';
        count++;      
    }
    output += "</table>";
    return output
};
// function checkTasks(tasks){
// //this method checks the status of each task(accomplished property)and marks checkbox against tasks accordingly
//     for(var task in tasks){
//         document.getElementById(task).checked = tasks[task].accomplished;
//     }

// };