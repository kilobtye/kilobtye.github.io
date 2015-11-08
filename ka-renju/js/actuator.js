function Actuator(){
  this.events = {};

  this.boardContainer = document.querySelector(".renju-board-container");
  this.board = document.querySelector(".renju-board");
  this.leftIndex = document.querySelector(".renju-board-left-index");
  this.bottomIndex = document.querySelector(".renju-board-bottom-index");
  this.msgDiv = document.querySelector(".renju-message");
  this.msgBox = document.querySelector(".renju-message .msg-box");
  this.player1 = document.querySelector(".player.p1");
  this.player2 = document.querySelector(".player.p2");

  var i, position = null;
  for(i = 0; i < 15; i++){
    position = document.createElement("div");
    position.className = "renju-left-index";
    position.innerHTML = (15 - i).toString();
    this.leftIndex.appendChild(position);
  }

  this.l = ["A", "B", "C", "D", "E", "F", "G", "H",
    "I", "J", "K", "L", "M", "N", "O"];

  for(i = 0; i < 15; i++){
    position = document.createElement("div");
    position.className = "renju-bottom-index";
    position.innerHTML = this.l[i];
    this.bottomIndex.appendChild(position);
  }
}

Actuator.prototype.actuate = function(){
  var position = null, column = null, stone = null, i, j;
  this.board.innerHTML = "";

  for(i = 0; i < 15; i++){
    column = document.createElement("div");
    column.className = "renju-column";
    for(j = 0; j < 15; j++){
      position = document.createElement("div");
      position.className = "renju-position";
      stone = document.createElement("div");
      stone.className = "renju-stone";
      stone.dataset.x = i.toString();
      stone.dataset.y = j.toString();
      position.appendChild(stone);
      column.appendChild(position);
    }
    this.board.appendChild(column);
  }
};

Actuator.prototype.putStone = function(x, y, color, num, isShowNum){
  var attr = "[data-x='" + x + "'][data-y='" + y + "']";
  var stone = this.board.querySelector(".renju-stone" + attr);
  var last = this.board.querySelector(".renju-stone.last");
  stone.dataset.num = num.toString();
  if(isShowNum){
    stone.innerHTML = num.toString();
  }
  stone.classList.add(color);
  stone.classList.add("last");
  if(last){
    last.classList.remove("last");
  }
};

Actuator.prototype.removeStone = function(x, y, color){
  var attr = "[data-x='" + x + "'][data-y='" + y + "']";
  var stone = this.board.querySelector(".renju-stone" + attr);
  var num = stone.dataset.num;
  stone.dataset.num = "";
  stone.innerHTML = "";
  stone.classList.remove(color);
  stone.classList.remove("last");

  if(num){
    num--;
    attr = "[data-num='" + num + "']";
    var last = this.board.querySelector(".renju-stone" + attr);
    if(last){
      last.classList.add("last");
    }
  }
};

Actuator.prototype.showMessage = function(msg, player){
  var message = player.name + " " + msg;
  var msgH = document.createElement("h3");
  msgH.innerHTML = message;
  msgH.style.display = "inline-block";

  var msgRestart = document.createElement("a");
  msgRestart.innerHTML = "Restart";
  msgRestart.style.display = "inline-block";
  msgRestart.href = "#";
  msgRestart.className = "restart";
  var self = this;
  msgRestart.addEventListener("click", function(event){
    self.emit("restart");
    event.preventDefault();
  }, false);

  this.msgBox.appendChild(msgH);
  this.msgBox.appendChild(document.createElement("br"));
  this.msgBox.appendChild(msgRestart);

  this.msgDiv.style.display = "table";
};

Actuator.prototype.hideMessage = function(){
  this.msgBox.innerHTML = "<a class='close' href='#'>X</a>";
  this.msgDiv.style.display = "none";

  var close = document.querySelector("a.close");
  var self = this;
  close.addEventListener("click", function(event){
    self.emit("close");
    event.preventDefault();
  }, false);

}

Actuator.prototype.showNum = function(){
  var stones = this.board.querySelectorAll(".renju-stone.black, .renju-stone.white");
  Array.prototype.forEach.call(stones, function(item){
    item.innerHTML = item.dataset.num;
  });
  var shownum = document.querySelector("a.show-num");
  shownum.innerHTML = "Hide Number";
}

Actuator.prototype.hideNum = function(){
  var stones = this.board.querySelectorAll(".renju-stone.black, .renju-stone.white");
  Array.prototype.forEach.call(stones, function(item){
    item.innerHTML = "";
  });
  var shownum = document.querySelector("a.show-num");
  shownum.innerHTML = "Show Number";
}

Actuator.prototype.setPlayers = function(p1, p2){
  this.player1.querySelector(".icon").className = "icon " + p1.color;
  this.player2.querySelector(".icon").className = "icon " + p2.color;
  this.player1.querySelector(".player-name").innerHTML = p1.name;
  this.player2.querySelector(".player-name").innerHTML = p2.name;
};

Actuator.prototype.setPlayerTurn = function(name){
  if(name === "player1"){
    this.player1.classList.add("thinking");
    this.player2.classList.remove("thinking");
  }else{
    this.player2.classList.add("thinking");
    this.player1.classList.remove("thinking");
  }
};

Actuator.prototype.switchPlayerTurn = function(){
  if(this.player1.classList.contains("thinking")){
    this.setPlayerTurn("player2");
  }else{
    this.setPlayerTurn("player1");
  }
}

Actuator.prototype.showRecord = function(record){
  var msgP = document.createElement("p");
  var message = record;
  msgP.innerHTML = message;
  msgP.style.display = "inline-block"; 

  var self = this;
  var save2 = document.createElement("a");
  save2.innerHTML = "Capture Board Image";
  save2.href = "javascript:void(0)";
  var capture = function(event){
    self.emit("capture");
    save2.removeEventListener("click", capture, false);
    event.preventDefault();
  };
  save2.addEventListener("click", capture, false);

  this.msgBox.appendChild(msgP);
  this.msgBox.appendChild(document.createElement("br"));
  this.msgBox.appendChild(save2);

  this.msgDiv.style.display = "table";
};

Actuator.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

Actuator.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

Actuator.prototype.listen = function(){
  var self = this;
  this.board.addEventListener("click", function(event){
    var stone = event.target;
    if(!stone.classList.contains("renju-stone")){
      return;
    }
    var x = parseInt(event.target.dataset.x);
    var y = parseInt(event.target.dataset.y);
    self.emit("putStone", {x: x, y: y});
  }, false);

  var start = document.querySelector("a.start");
  start.addEventListener("click", function(event){
    self.emit("start");
    event.preventDefault();
  }, false);

  var withdraw = document.querySelector("a.withdraw");
  withdraw.addEventListener("click", function(event){
    self.emit("withdraw");
    event.preventDefault();
  }, false);

  var switchRule = document.querySelector("a.switch-rule");
  switchRule.addEventListener("click", function(event){
    self.emit("switchRule");
    event.preventDefault();
  }, false);

  var shownum = document.querySelector("a.show-num");
  shownum.addEventListener("click", function(event){
    self.emit("showNum");
    event.preventDefault();
  }, false);

  var exportRecord = document.querySelector("a.export");
  exportRecord.addEventListener("click", function(event){
    self.emit("exportRecord");
    event.preventDefault();
  }, false);
};

Actuator.prototype.captureImage = function(array){
  var canvas = document.createElement("canvas");
  canvas.width = "500";
  canvas.height = "500";

  var ctx = canvas.getContext("2d");

  ctx.font = "10pt Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.lineWidth = 2;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeRect(50, 30, 420, 420);

  ctx.lineWidth = 1;
  ctx.beginPath();
  var i, j, k;
  for(i = 2; i < 15; i++){
  ctx.moveTo(50, 30 * i + 0.5);
  ctx.lineTo(470, 30 * i + 0.5);
  ctx.moveTo(20 + 30 * i + 0.5, 30);
  ctx.lineTo(20 + 30 * i + 0.5, 450);
  }
  ctx.stroke();

  ctx.fillStyle = "black";
  for(i = 1; i <= 15; i++){
  ctx.fillText(i.toString(), 25, 480 - 30 * i);
  ctx.fillText(this.l[i - 1], 20 + 30 * i, 475);
  }

  ctx.fillRect(138, 118, 5, 5);
  ctx.fillRect(378, 118, 5, 5);
  ctx.fillRect(138, 358, 5, 5);
  ctx.fillRect(388, 358, 5, 5);
  ctx.fillRect(258, 238, 5, 5);

  ctx.font = "14pt Arial";
  ctx.lineWidth = 2;

  var count = array.length, color = "black";
  for(k = 0; k < count; k++){
    i = array[k].x;
    j = array[k].y;
    if(color === "black"){
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(50 + 30 * j, 30 + 30 * i, 13, 0, Math.PI*2, true);
      ctx.stroke();
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.fillText(k + 1, 50 + 30 * j, 31 + 30 * i);

      color = "white";
    }else{
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(50 + 30 * j, 30 + 30 * i, 13, 0, Math.PI*2, true);
      ctx.stroke();
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.fillText(k + 1, 50 + 30 * j, 31 + 30 * i);

      color = "black";
    }
  }
  var string = canvas.toDataURL();

  var msgImg = new Image();
  msgImg.src = string;
  msgImg.alt = "chess board capture";
  msgImg.title = "You can right click to save this image";

  this.msgBox.appendChild(msgImg);

  this.msgDiv.style.display = "table";
};

Actuator.prototype.title = function(renju){
  var h2 = document.querySelector(".renju-header h2");
  var caption = ["gomoku rule (five in a row)", "renju rule (have disallowed moves)"];
  h2.innerHTML = caption[renju];
};