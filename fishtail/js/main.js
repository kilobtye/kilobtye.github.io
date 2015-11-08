  var config = {
    col : 21,
    row : 13,
    mid : 10,
    cellWidth : 30,
    cellHeight : 30,
    titlePos : 3,
    view: "landscape", //landscape potrait
    punctuation: "corner" //inline corner none
  };

  var str = "source";
  var div = $('.' + str);

  var data = {
    title: "",
    chapter: "",
    txt: ""
  };

  function getData(div) {
    data.title = $(".title", div)[0].innerHTML;
    data.chapter = $(".chapter", div)[0].innerHTML;
    $(".p", div).each(function(idx, ele) {
      data.txt += ele.innerHTML;
    });

  }

  var content = $("<div class='content'></div>");
  var i = 0, j;

  var html = "<div class='column-big column" + i + "'></div>";
  var column = $(html);
  for (j = 0; j < config.row - 1; j+=2) {
    var html = "<div class='cell-big cell" + j + "'></div>";
    $(html).appendTo(column);
  }
  if (j === config.row - 1) {
    var html = "<div class='cell cell" + (j - 1) + "'></div>";
    $(html).appendTo(column);
  }
  $(column).appendTo(content);
  i+=2;

  for (i = 2; i < config.col; i++) {
    var html = "<div class='column column" + i + "'></div>";
    var column = $(html);
    for (j = 0; j < config.row; j++) {
      var html = "<div class='cell cell" + j + "'></div>";
      $(html).appendTo(column);
    }
    if (i === config.mid) {
      column.addClass("mid");
      var cell = ".cell" + (config.titlePos - 1);
      $(cell, column).addClass("fishtail-2");
    }
    column.appendTo(content);
  }
  $(".page").append(content);


  function fillCell(col, row, c) {
    if (col >= config.col || col < 0 || row >= config.row || row < 0) {
      return;
    }
    var selector = ".content .column" + col + " .cell" + row;
    var html = "<div class='char'>" + c + "</div>";
    $(selector).append($(html));
  }

  function fillCellPunc(col, row, punc) {
    if (col >= config.col || col < 0 || row >= config.row || row < 0) {
      return;
    }
    var selector = ".content .column" + col + " .cell" + row;
    var punc_class;
    if (punc === '。') {
      punc_class = "punc-circle-red";
    } else if (punc === '，') {
      punc_class = "punc-comma-red";
    }
    $(selector).addClass(punc_class);
  }

  function fillCellSmall(col, row, pos, c) {
    if (col >= config.col || col < 0 || row >= config.row || row < 0) {
      return;
    }
    var selector = ".content .column" + col + " .cell" + row;
    var cell = $(selector);
    if ($(".cell-small", cell).length === 0) {
      var html = "<div class='cell-small cell-small-top-right'></div>" +
        "<div class='cell-small cell-small-bottom-right'></div>" +
        "<div class='cell-small cell-small-top-left'></div>" +
        "<div class='cell-small cell-small-bottom-left'></div>";
      cell.append($(html));
    }
    var pos_class;
    switch (pos) {
      case "tr" :
        pos_class = ".cell-small-top-right";
        break;
      case "br":
        pos_class = ".cell-small-bottom-right";
        break;
      case "tl":
        pos_class = ".cell-small-top-left";
        break;
      case "bl":
        pos_class = ".cell-small-bottom-left";
        break;
      default:
        break;
    }
    var html = "<div class='char-small'>" + c + "</div>";
    $(pos_class, cell).append($(html));
  }

  function fillCellBig(col, row, c) {
    if (col >= config.col || col < 0 || row >= config.row || row < 0) {
      return;
    }

    var selector = ".content .column" + col + " .cell" + row;
    var html = "<div class='char-big'>" + c + "</div>";
    $(selector).append($(html));
  }

  function eraseCell(col, row) {
    if (col >= config.col || col < 0 || row >= config.row || row < 0) {
      return;
    }
    var selector = ".content .column" + col + " .cell" + row;
    $(selector).empty();
  }

  getData(div);
  var k = 0;
  for (i = 2; i < config.col; i++) {
    if (i === config.mid) {
      continue;
    }
    for (j = 0; j < config.row; j++) {
      fillCell(i, j, data.txt[k]);
      k++;
      if (data.txt[k] === "，" || data.txt[k] === "。") {
        fillCellPunc(i, j, data.txt[k]);
        k++;
      }
    }
  }

  k = 0;
  while (k < data.title.length) {
    fillCell(config.mid, k + config.titlePos, data.title[k]);
    k++;
  }

  k = 0;
  while (k < data.chapter.length) {
    fillCellBig(0, k * 2, data.chapter[k]);
    k++;
  }

  eraseCell(2, 10);
  fillCellSmall(2, 10, "tr", "春");
  fillCellSmall(2, 10, "br", "夏");
  fillCellSmall(2, 10, "tl", "秋");
  fillCellSmall(2, 10, "bl", "冬");











