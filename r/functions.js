var F = {};

F.code = [{}, {}, {}];

F.gen = function() {
  var i;
  for (i = 0; i < 3; i++) {
    F.code[i].g = F.genCodeG();
    F.code[i].c = F.genCodeC(F.code[i].g);
    console.log(F.code[i].c);
  }
};

F.r = function(arr){
  return arr[Math.floor(Math.random() * arr.length)];
};

F.rr = function(arr){
  return Math.floor(Math.random() * arr.length);
};

F.vars = ['v1', 'v2', 'v3'];
F.exps = ['v1', 'v2', 'v3', 'i', 'j', 'F.a()',
  'data[idx]', 'data[idx]', 'data[idx]', 'data[idx]', 'data[idx]',
//F.exps = ['i', 'j', 'F.a()',
  'i*i', 'i*j', 'j*j', '2*i', '2*j', '4*i', '4*j', 'i^j', 'i|j', 'i&j', 
  '0', '1', '2', '4', '8', '16', '32', '64', '128', '256'];

F.q = Math.sqrt;
F.a = function(){return Math.floor(Math.random() * 256);};
F.s = Math.sin;
F.c = Math.cos;
F.t = Math.tan;
F.l = Math.log2;
F.m = Math.min;
F.x = Math.max;

F.operations = [
  {fmt:'@1', argc:1},
  {fmt:'(@1+@2)', argc:2},
  {fmt:'(@1-@2)', argc:2},
  {fmt:'@1*@2', argc:2},
  {fmt:'@1/@2', argc:2},
  {fmt:'(@1%@2)', argc:2},
  {fmt:'(@1|@2)', argc:2},
  {fmt:'(@1&@2)', argc:2},
  {fmt:'(@1^@2)', argc:2},
//  {fmt:'(-@1)', argc:1},
  {fmt:'F.q(@1)', argc:1},
  {fmt:'F.s(@1)*255', argc:1},
  {fmt:'F.c(@1)*255', argc:1},
  {fmt:'F.t(@1)', argc:1},
  {fmt:'F.l(@1)', argc:1},
  {fmt:'F.m(@1,@2)', argc:2},
  {fmt:'F.x(@1,@2)', argc:2},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4},
  {fmt:'(@1>@2?@3:@4)', argc:4}
];

F.testExp = function(exp) {
  var i = 255, j = 255, v1 = 255, v2 = 255, v3 = 255, data = [128], idx = 0,
    num = 0, w = 0, b = 0, g = 0, c = 0, count = 0;
  if (exp.contains('i')){
    var i = 0;
    num++;
  }
  if (exp.contains('j')) {
    var j = 0;
    num++;
  }
  if (exp.contains('v1')) {
    var v1 = 0;
    num++;
  }
  if (exp.contains('v2')) {
    var v1 = 0;
    num++;
  }
  if (exp.contains('v3')) {
    var v1 = 0;
    num++;
  }
  
  if (num === 0) {
    return false;
  }
  
  if (num > 3) {
    return true;
  }
  
  for(; i <= 255; i++) {
    for (; j <= 255; j++) {
      for(; v1 <= 255; v1+=3) {
        for(; v2 <= 255; v2+=3) {
          for(; v3 <= 255; v3+=3) {
            c = eval(exp);
            count++;
            if (c > 250) {
              w++;
            } else if (c > 10) {
              g++;
            } else {
              b++;
            }
          }
        }
      }
    }
  }
  
  if (g > count * 0.5) {
    return true;
  } else if (w < count * 0.5 && b < count * 0.5) {
    return true;
  } else {
    return false;
  } 
};

F.inExps = function (exp) {
  var i;
  for (i = 0; i < F.exps.length; i++) {
    if (F.exps[i] == exp) {
      return true;
    }
  }
  return false;
}; 

F.genExps = function() {
  var i, opr, exp;
  for (i = 0; i < 2000; i++) {
    opr = F.r(F.operations);
    exp = opr.fmt.replace('@1', F.r(F.exps));
    if (opr.argc >= 2) {
      exp = exp.replace('@2', F.r(F.exps));
      if (opr.argc >= 3) {
        exp = exp.replace('@3', F.r(F.exps));
        if (opr.argc >= 4) {
        exp = exp.replace('@4', F.r(F.exps));
        }
      }
    }
    if (exp.length < 10 && !F.inExps(exp)) {
      F.exps.push(exp);
    }
  }
  
  for (i = 26; i < F.exps.length; i++) {
    if (!F.testExp(F.exps[i])) {
      F.exps.splice(i, 1);
      i--;
    }
  }
  for (i = 0; i < 2000; i++) {
    opr = F.r(F.operations);
    exp = opr.fmt.replace('@1', F.r(F.exps));
    if (opr.argc >= 2) {
      exp = exp.replace('@2', F.r(F.exps));
      if (opr.argc >= 3) {
        exp = exp.replace('@3', F.r(F.exps));
        if (opr.argc >= 4) {
        exp = exp.replace('@4', F.r(F.exps));
        }
      }
    }
    if (exp.length < 30 && !F.inExps(exp) && F.testExp(exp)) {
      F.exps.push(exp);
    }
  }
};

F.genCodeG = function() {
  var i, n = Math.random() * 10, code = [], exp = '';
  for (i = 0; i < F.vars.length; i++) {
    code.push([i, F.rr(F.exps)]);
  }
  //n = 0;
  //code.push([0, F.rr(F.exps)]);
  while (n > 0) {
    n--;
    exp = '';
    while (!exp.contains('v')) {
      i = F.rr(F.exps);
      exp = F.exps[i];
    }
    code.push([F.rr(F.vars), i]);
  }
  return code;
};

F.genCodeC = function(g) {
  var i, j, code = [], exp = '';
  for (i = 0; i < 3; i++) {
    code.push(F.vars[i] + '=0;');
  }
  for (j = 0; j < g.length; j++) {
    code.push(F.vars[g[j][0]] + '=' + F.exps[g[j][1]] + ';');
  }
  return code.join('');
};

F.eval = function(i, j, idx, data) {
  return eval(F.code[idx % 4].c);
  //return eval(F.code[0].c);
};














