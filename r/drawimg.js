var can = document.getElementById("can"),
  ctx = can.getContext("2d"),
  w = 200,
  h = 200,
  img = null,
  data = null;
  
var perPixelFunc = {
  r: null,
  g: null,
  b: null
};

can.width = w;
can.height = h;

var timer;

function execute() {
  img = ctx.getImageData(0, 0, w, h),
  data = img.data;
  F.gen();
  try {
    perPixel();
  } catch(e) {
    console.log(e);
  }
  setTimeout(disp, 300);
  can.style.opacity = 0;
}

function disp() {
  ctx.putImageData(img, 0, 0);
  can.style.opacity = 1;
  timer = setTimeout(execute, 1000);
}

function genExps() {
  setTimeout(genExps, 20000);
  F.genExps();
}

genExps();

function stop() {
  clearTimeout(timer);
}

function perPixel(ppf){
  var i, j, idx;
  for (i = 0; i < h; i++) {
    for (j = 0; j < w; j++) {
      idx = (i * w + j) * 4;
      data[idx] = F.eval(i, j, idx, data);
      data[idx + 1] = F.eval(i, j, idx + 1, data);
      data[idx + 2] = F.eval(i, j, idx + 2, data);
      data[idx + 3] = 255;
    }
  }
}

function mutate() {
  img = ctx.createImageData(w, h),
  data = img.data;
  
  F.mutate();
  try {
    perPixel();
  } catch(e) {
    console.log(e);
  }
  ctx.putImageData(img, 0, 0);
}

window.onload = function() {
  execute();
};




