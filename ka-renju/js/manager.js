function Manager(){
  this.act = new Actuator();
  this.store = new LocalStore();

  this.param = {
    isShowNum: true
  };

  this.renju = 0; // 0: gomoku mode; 1: renju mode;

  this.player1 = {name: "player1", color: ""};
  this.player2 = {name: "player2", color: ""};
  this.stoneCount = 0;
  this.status = 0; // 0: empty; 1: playing; 2: player1 won; 3: player2 won;

  this.boardData = []; // 0: empty; 1: black; 2: white;
  this.stoneArray = [];

  this.turn = this.player1;

  this.setup();
}

Manager.prototype.setup = function(){
  this.act.listen();
  this.act.on("putStone", this.putStone2.bind(this));
  this.act.on("restart", this.restart.bind(this));
  this.act.on("start", this.start.bind(this));
  this.act.on("withdraw", this.withdraw2.bind(this));
  this.act.on("close", this.act.hideMessage.bind(this.act));
  this.act.on("showNum", this.showNum.bind(this));
  this.act.on("capture", this.capture.bind(this));
  this.act.on("exportRecord", this.exportRecord.bind(this));
  this.act.on("switchRule", this.switchRule.bind(this));

  if(this.store.hasGameState()){
    this.recover();
  }else{
    this.restart();
  }
};

Manager.prototype.setPlayers = function(){

  if(this.player1.color === "white"){
    this.player1.color = "black";
    this.player2.color = "white";
    this.turn = this.player1;
  }else{
    this.player1.color = "white";
    this.player2.color = "black";
    this.turn = this.player2;
  }
  this.act.setPlayers(this.player1, this.player2);
  this.act.setPlayerTurn(this.turn.pos);
};

Manager.prototype.recover = function(){
  var previousState = this.store.getGameState();
  this.param = previousState.param;
  this.renju = previousState.renju;
  this.player1 = previousState.player1;
  this.player2 = previousState.player2;
  this.stoneCount = previousState.stoneCount;
  this.status = previousState.status;
  this.boardData = previousState.boardData;
  this.stoneArray = previousState.stoneArray;
  if(previousState.turn.pos === "player1"){
    this.turn = this.player1;
  }else{
    this.turn = this.player2;
  }

  this.act.actuate();
  this.act.hideMessage();
  this.act.title(this.renju);

  this.act.setPlayers(this.player1, this.player2);
  this.act.setPlayerTurn(this.turn.pos);

  var pos, color = "black";
  for(i = 1; i <= this.stoneCount; i++){
    pos = this.stoneArray[i - 1];
    this.act.putStone(pos.x, pos.y, color, i, this.param.isShowNum);
    if(color === "black"){
      color = "white";
    }else{
      color = "black";
    }
  }

  if(this.status === 2){
    this.act.showMessage("won", this.player1);
  }
  if(this.status === 3){
    this.act.showMessage("won", this.player2);
  }
  this.act.hideMessage();
};

Manager.prototype.restart = function(){
  this.start();
};

Manager.prototype.start = function(){
  this.store.clearGameState();
  this.setPlayers();

  this.act.actuate();
  this.act.hideMessage();

  this.stoneCount = 0;
  this.status = 0;

  this.boardData = [];
  this.stoneArray = [];

  var i, j;
  for(i = 0; i < 15; i++){
    this.boardData[i] = [];
    for(j = 0; j < 15; j++){
      this.boardData[i][j] = 0;
    }
  }
  this.save();
};

Manager.prototype.putStone2 = function(pos){
  if(this.status >= 2){
    return;
  }
  if(this.boardData[pos.x][pos.y] !== 0){
    return;
  }
  this.putStone(pos);
  if(this.isWon()){
    if(this.turn === this.player1){
      this.status = 2;
    }else{
      this.status = 3;
    }
    this.act.showMessage("won", this.turn);
    this.save();
    return;
  }
  if(this.isLose()){
    if(this.turn === this.player1){
      this.status = 3;
    }else{
      this.status = 2;
    }
    this.act.showMessage("lose", this.turn);
    this.save();
    return;
  }
  this.switchPlayer();
  this.save();
};

Manager.prototype.putStone = function(pos){
  if(this.turn.color === "black"){
    this.boardData[pos.x][pos.y] = 1;
  }else{
    this.boardData[pos.x][pos.y] = 2;
  }
  this.stoneArray.push(pos);
  this.stoneCount++;
  this.act.putStone(pos.x, pos.y, this.turn.color, this.stoneCount, this.param.isShowNum);
  this.status = 1;
};

Manager.prototype.withdraw2 = function(){
  this.withdraw();
  this.save();
};

Manager.prototype.withdraw = function(){
  if(this.stoneCount === 0){
    return;
  }

  if(this.status < 2){
    this.switchPlayer();
  }

  var pos = this.stoneArray.pop();
  this.boardData[pos.x][pos.y] = 0;
  this.act.removeStone(pos.x, pos.y, this.turn.color);
  this.stoneCount--;

  if(this.stoneCount != 0){
    this.status = 1;
  } else {
    this.status = 0;
  }
};

Manager.prototype.switchPlayer = function(){
  if(this.turn === this.player1){
    this.turn = this.player2;
  }else{
    this.turn = this.player1;
  }
  this.act.switchPlayerTurn();
};

Manager.prototype.getboardData = function(x, y){
  if(x > 14 || x < 0 || y > 14 || y < 0){
    return -1;
  }
  return this.boardData[x][y];
};

Manager.prototype.isWon = function(){
  var c = 1, pos = this.stoneArray[this.stoneArray.length - 1];
  if(this.turn.color === "white"){
    c = 2;
  }
  var count, i, x = pos.x, y = pos.y;
  for(count = 1, i = 1; i <= 5; i++){
    if(this.getboardData(x + i, y) === c){
      count++;
    }else{
      break;
    }
  }
  for(i = 1; i <= 5; i++){
    if(this.getboardData(x - i, y) === c){
      count++;
    }else{
      break;
    }
  }
  if(count === 5 || (count > 5 && !(this.renju && c === 1))){
    return true;
  }

  for(count = 1, i = 1; i <= 5; i++){
    if(this.getboardData(x, y + i) === c){
      count++;
    }else{
      break;
    }
  }
  for(i = 1; i <= 5; i++){
    if(this.getboardData(x, y - i) === c){
      count++;
    }else{
      break;
    }
  }
  if(count === 5 || (count > 5 && !(this.renju && c === 1))){
    return true;
  }

  for(count = 1, i = 1; i <= 5; i++){
    if(this.getboardData(x + i, y + i) === c){
      count++;
    }else{
      break;
    }
  }
  for(i = 1; i <= 5; i++){
    if(this.getboardData(x - i, y - i) === c){
      count++;
    }else{
      break;
    }
  }
  if(count === 5 || (count > 5 && !(this.renju && c === 1))){
    return true;
  }

  for(count = 1, i = 1; i <= 5; i++){
    if(this.getboardData(x + i, y - i) === c){
      count++;
    }else{
      break;
    }
  }
  for(i = 1; i <= 5; i++){
    if(this.getboardData(x - i, y + i) === c){
      count++;
    }else{
      break;
    }
  }
  if(count === 5 || (count > 5 && !(this.renju && c === 1))){
    return true;
  }

  return false;
};

Manager.prototype.showNum = function(){
  this.param.isShowNum = !this.param.isShowNum;
  if(this.param.isShowNum){
    this.act.showNum();
  }else{
    this.act.hideNum();
  }
  this.save();
};

Manager.prototype.serialize = function(){
  return{
    param: this.param,
    renju: this.renju,
    player1: this.player1,
    player2: this.player2,
    stoneCount: this.stoneCount,
    status: this.status,
    boardData: this.boardData,
    stoneArray: this.stoneArray,
    turn: this.turn
  };
};

Manager.prototype.save = function(){
  this.store.setGameState(this.serialize());
};

Manager.prototype.exportRecord = function(){
  if(this.status === 0) {
    return;
  }
  var record = "";
  var positions = ["A", "B", "C", "D", "E", "F", "G",
    "H", "I", "J", "K", "L", "M", "N", "O"];
  var i = 0, pos;
  for(i = 0; i < this.stoneArray.length; i++){
    pos = this.stoneArray[i];
    record = record + positions[pos.y] + (15 - pos.x) + " ";
  }
  this.act.showRecord(record);
};

Manager.prototype.capture = function(){
  this.act.captureImage(this.stoneArray);
};

Manager.prototype.switchRule = function(){
  if(this.renju === 0){
    this.renju = 1;
  }else{
    this.renju = 0;
  }
  this.act.title(this.renju);
  this.restart();
};

Manager.prototype.findType = function(array){
  var countB, i, j;

  // >5 in one row/col, forbidden
  countB = 1;
  for(i = 6; i <= 10; i++){
    if(array[i] === 1){
      countB++;
    }else{
      break;
    }
  }
  for(i = 4; i >= 0; i--){
    if(array[i] === 1){
      countB++;
    }else{
      break;
    }
  }
  if(countB > 5){
    return 3;
  }

  // 4 4 in one row/col, forbidden
  // o_oOo_o; oo_oO_oo; oo_Oo_oo; ooo_O_ooo;
  if(array[2] === 1 && array[3] === 0 && array[4] === 1 &&
    array[6] === 1 && array[7] === 0 && array[8] === 1){
    return 3;
  }
  if(array[1] === 1 && array[2] === 1 && array[3] === 0 && array[4] === 1
    && array[6] === 0 && array[7] === 1 && array[8] === 1){
    return 3;
  }
  if(array[2] === 1 && array[3] === 1 && array[4] === 0 &&
    array[6] === 1 && array[7] === 0 && array[8] === 1 && array[9] === 1){
    return 3;
  }
  if(array[1] === 1 && array[2] === 1 && array[3] === 1 && array[4] === 0 &&
    array[6] === 0 && array[7] === 1 && array[8] === 1 && array[9] === 1){
    return 3;
  }

  // 4
  countB = 1;
  for(i = 6; i <= 10; i++){
    if(array[i] === 1){
      countB++;
    }else{
      break;
    }
  }
  for(j = 4; j >= 0; j--){
    if(array[j] === 1){
      countB++;
    }else{
      break;
    }
  }
  if(countB === 4 && (array[i] === 0 || array[j] === 0)){
    return 2;
  }
  if(countB === 3 && array[i] === 0 && array[i + 1] === 1){
    return 2;
  }
  if(countB === 3 && array[j] === 0 && array[j - 1] === 1){
    return 2;
  }

  // open 3
  // judgement here is WRONG!!!
  // have not consider complex cases of "fake" three
  // need to improve...
  if(array[4] === 1 && array[6] === 1 && array[3] === 0 && array[7] === 0
    && (array[2] === 0 || array[8] === 0)){
    return 1;
  }
  if(array[6] === 1 && array[7] === 1 && array[8] === 0 && array[4] === 0
    && (array[3] === 0 || array[9] === 0)){
    return 1;
  }
  if(array[4] === 1 && array[3] === 1 && array[2] === 0 && array[6] === 0
    && (array[1] === 0 || array[7] === 0)){
    return 1;
  }
  if(array[4] === 0 && array[6] === 0 && array[7] === 1 && array[8] === 1
    && array[9] === 0){
    return 1;
  }
  if(array[6] === 0 && array[4] === 0 && array[3] === 1 && array[2] === 1
    && array[1] === 0){
    return 1;
  }

  return 0;
};

Manager.prototype.isLose = function(){
  if(this.renju === 0 || this.turn.color === "white"){
   return false;
  }
  var pos = this.stoneArray[this.stoneArray.length - 1];

  var array, i, x = pos.x, y = pos.y, type;
  var count = [0, 0, 0, 0];
  for(array = [], i = -5; i <= 5; i++){
    array.push(this.getboardData(x + i, y));
  }
  type = this.findType(array); // 0: ; 1:3; 2:4; 3:>5 or 44;
  count[type]++;

  for(array = [], i = -5; i <= 5; i++){
    array.push(this.getboardData(x, y + i));
  }
  type = this.findType(array);
  count[type]++;

  for(array = [], i = -5; i <= 5; i++){
    array.push(this.getboardData(x + i, y + i));
  }
  type = this.findType(array);
  count[type]++;

  for(array = [], i = -5; i <= 5; i++){
    array.push(this.getboardData(x + i, y - i));
  }
  type = this.findType(array);
  count[type]++;

  if(count[1] > 1 || count[2] > 1 || count[3] > 0){
    return true;
  }
  return false;
};

var app = new Manager();













