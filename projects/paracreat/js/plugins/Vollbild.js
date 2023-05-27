FSInitStart = SceneManager.initialize;
SceneManager.initialize = function(){
FSInitStart.call(this);
Graphics._requestFullScreen();
};