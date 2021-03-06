let ident;
let messageid;
let socket = io();
//socket.emit('updateComments', {'text': text,'messageID':id,'user': user});
let postColor;

//Get message from server.
socket.on('welcome', function(data) {
  $.ajax({
    url: "/getPostID",
    type: "GET",
    data: {},
    success: function(data){
      messageid = data.ID;
      $.ajax({
        url: "/getData",
        type: "GET",
        data: {messageID:messageid},
        success: function(data2){
          postColor = data2.color
          display.src = "images/" + data2.propic;
          if(data2.yeetitle)
            $("#userInfo").html("User: " + data2.user + "<br>" + "Yeetitle: " + data2.yeetitle);
          else
            $("#userInfo").html("User: " + data2.user + "<br>" + "Yeetitle: User has not taken survey");
          let newComment =""
          if(data2.type == 'Text'){
            newComment =
            `<div class="userBlock" style="background-color:${postColor}">
            <h1>
            ${data2.message}`+ ":" + `
            </h1><p>
            ${data2.realMessage}
            </p>
            </div>
            <div  id="test" style="background-color:${postColor};  text-align: center;
            font-size:36px;
            font-weight: bold ;
            color: white;">Comments
              <br> <input type="text" class="textC" id="commentBox" maxlength="1000" value="" >
              <input class="button" type="button" id="addComment" value="Comment" onclick="commentit()">
            ${data2.comments}
            </div>
            `
          }
          else if (data2.type == 'Image'){
            newComment =
            `<div class="userBlock" style="background-color:${postColor}">
            <h1> ${data2.realMessage}`+ ":" + ` </h1>
            <img style="background-color:${postColor}" src="images/${data2.message}" width="60%">
            </div>
            <div  id="test" style="background-color:${postColor};  text-align: center;
            font-size:36px;
            font-weight: bold ;
            color: white;">Comments
              <br> <input type="text" class="textC" id="commentBox" maxlength="1000" value="" >
              <input class="button" type="button" id="addComment" value="Comment" onclick="commentit()">
            ${data2.comments}
            </div>
            `
          }
          else {
            newComment =
            `<div class="userBlock" style="background-color:${postColor}">
            <h1> ${data2.realMessage}`+ ":" + ` </h1>
            <video width="auto" height="auto" controls>
            <source src="videos/${data2.message}">
            </video>
            </div>
            <div  id="test" style="background-color:${postColor};  text-align: center;
            font-size:36px;
            font-weight: bold ;
            color: white;">Comments
              <br> <input type="text" class="textC" id="commentBox" maxlength="1000" value="" >
              <input class="button" type="button" id="addComment" value="Comment" onclick="commentit()">
            ${data2.comments}
            </div>
            `
          }
          $("#messages").append(newComment);
          $("#commentBox").keydown( function( event ) {
            if ( event.which === 13 ) {
              commentit();
              event.preventDefault();
              return false;
            }
          });
          } ,
        dataType: "json"
      });
    } ,
    dataType: "json"
  });
});

socket.on('updateComments', function(data) {
  if(messageid==data.messageID){
    $("#test").append(

      `
      <div class="commentStuff commentBlock" style="background-color:${data.color}">
      ${data.user}:
      ${data.text}
      </div>
      `
      )
  }
});

function commentit(id){
  if($("#commentBox").val() == "") {
    alert("comment is required")
    return false;
  } else {
  let text = $("#commentBox").val()+"<br>";
  if(text != "") {
    $.get("/checkAuthenticated",function(info){
      if(info.error) {
        alert(info.message);
        return false;
      } else {
          let user = info.user;
          let postColor;
          $.ajax({
            url: "/getData",
            type: "GET",
            data: {messageID:messageid},
            success: function(data){
              let oldComment = data.comments;
              postColor = data.color
              $.ajax({
                url: "/storeComment",
                type: "POST",
                data: {text:text,messageID:messageid,user:user,oldComment:oldComment,color:data.color},
                success: function(data2){

                } ,
                dataType: "json"
              });
              socket.emit("updateComments",{"text":text,"messageID":messageid,"user":user,"color":postColor})

            } ,
            dataType: "json"
          });

         $("#commentBox").val("");
        }
      });
    }
  }
}


$(document).ready(function(){
  $.get("/getInfo",function(data){
    if(data)
      $("#session").html("Welcome, " + data.name);

  });

});
