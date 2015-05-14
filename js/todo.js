"use strict";

//Author: Aditya Rawat (aditya@eddywebws.com)
// A simple todo list which stores the task data in browser's localStorage, no login required just add task and do it !

var tasks=[];
var task, todoList;
//wait for dom to ready and execuite the main function
$(document).ready(function(){

    $("#todoForm").submit(addTask);
    $("#clearList").submit(clearList);
    todoList=document.getElementById("list");
    
    if (localStorage.getItem("tasks")) {
        tasks=JSON.parse(localStorage.getItem("tasks"));
        //filter and remove deleted tasks first
        tasks = tasks.filter(function( obj ) {
            return obj.deleted != true;
        });
        todoList.innerHTML=writeTaskList(tasks);
    }
    
    //set autofocus on input box
    document.getElementById("todo").focus();
    //pass all the task items to updateStatus plugin which has click handler to update task status
    $(".listItem").updateStatus();
    //pass all the delete buttons to jQuery plugin which has click handler to execute the delete process
    $(".deleteBtn").deleteTasks();
    console.log(tasks);
});

$.fn.updateStatus=function(list){
// A jQuery plugin is responsible for updating and saving the tasks on clicks
// @param list - list of elements to which click hander needs to be attached for updating the status of task

    var listElements = this;
    //traverse through each tasks dom element and update the status from the stored tasks object array
    listElements.each(function(i){
        var id= parseInt(this.attributes["id"].value);
        var accomplished= tasks[id].accomplished;
        console.log(accomplished);
        $(this).find(":checkbox").prop("checked", accomplished);//set the box of each task
        //add a strikethrough if task is accomplished
        if(accomplished){
            $(this).find(".taskText").css("text-decoration", "line-through");
        }
    });


    //a click handler that updates the status of each task upon click, it also updates the dom to refelect completed task
    return this.click(function(evt){
        var taskId= parseInt(this.attributes["id"].value);
        //set the clicked task as accomplished and save it to localStorage
        if(tasks[taskId].accomplished==false)
        {
            tasks[taskId].accomplished=true;
            //if task is accomplished then strike it out
            $(this).find(".taskText").css("text-decoration", "line-through");
            $(this).find(":checkbox").prop("checked", tasks[taskId].accomplished);
        }
        else{
                tasks[taskId].accomplished=false;
                $(this).find(".taskText").css("text-decoration", "");
                $(this).find(":checkbox").prop("checked", tasks[taskId].accomplished);
        }
        localStorage.setItem("tasks", JSON.stringify(tasks));    
    });

}; //end of updateStatus() plugin

$.fn.deleteTasks=function(list){
// dom element deletion -this jQuery function attaches a click handler to the passed elemenet which will delete the parent element on click
// @param list - list of all the items to which the click handler is to be attached.
    
    return this.click(function(evt){
        console.log(this);
        var id =parseInt($(this).parent().attr("id"));
        $(this).parent().remove() //delete the clicked dom element
    });
        setDelete(id); //set the removed element's record as deleted on next load, 
        //this because deleting the object array before a load mismathes the id of the elements remaminng in actual array 
        //from the ids attached to each element in the dom causing errors 

};//end of deleteTasks()

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
    this.deleted=false;
};

function addTask(){
//This takes the value in the task input box and adds to an task object an array. it will then store that array to localStorage for retrieval   
    task = document.getElementById("todo").value;
    //do basic validation first(for browsers which cannot interpret "required" attribute)
    if(task ==null || task.trim() ==""){
        alert("The task entered is blank, please enter a valid task.")
        return;
    }
    tasks.push(new todo(task));
    localStorage.setItem("tasks", JSON.stringify(tasks));
};
function setDelete(id){
//This function sets the delete property as true for the record of the given id
//@param id- id of the array object element(task) that needs to be set for deleted    
    tasks[id].deleted=true;
};
function writeTaskList(tasks){    
//This function writes the task to dom as as table
//@param - task object to populate the dom accordingly   
    var output, count=0;
    output = "<table>";
    if(tasks){
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

    }
    else{output ="<b>No tasks on your list.</b>";}

  return output
    
};
