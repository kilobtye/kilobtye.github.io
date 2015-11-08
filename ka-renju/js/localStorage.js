function LocalStore(){
  this.storage = window.localStorage;
}

LocalStore.prototype.getGameState = function(){
  if(!this.storage){
    return null;
  }
  var stateJSON = this.storage.getItem("gameState");
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStore.prototype.setGameState = function(gameState){
  if(!this.storage){
    return;
  }
  this.storage.setItem("gameState", JSON.stringify(gameState));
  this.storage.setItem("hasGameState", "true");
};

LocalStore.prototype.hasGameState = function(){
  if(!this.storage){
    return false;
  }
  var state = this.storage.getItem("hasGameState");
  if(state === "true"){
    return true;
  }else{
    return false;
  }
};

LocalStore.prototype.clearGameState = function(){
  if(!this.storage){
    return;
  }
  this.storage.clear();
}