const display = document.querySelector('.display');

// 数字の入力
function inputNumber(num) {
  const value = display.value;
  if (value === "0では除算できません") {
    if (num === '0' || num === '00') {
      display.value = '0';
      return;
    }
    display.value = num;
    return;
  }

  if (display.value === "0" && num !== "00") {
    display.value = num;
    return;
  }

  if (num == '00') {
    const expr = display.value;
    const lastNumber = expr.split(/[+\-×÷]/).pop();
    if (lastNumber === '' || display.value === '0') {
      return;
    } else {
      display.value += '00';
      return; 
    }
  }

  display.value += num;
};

// 小数点の入力
function inputDot() {
  const value = display.value;
  if (value === "0では除算できません") {
    display.value = '0';
    return;
  }

  const expr = display.value;
  const lastNumber = expr.split(/[+\-×÷]/).pop();
  if (expr === "") return;
  if (lastNumber === "" || lastNumber.includes(".")) return;

  display.value += ".";
};

// 演算子の入力
function inputOperator(op) {
  const value = display.value;

  if (value === "0では除算できません") {
    display.value = "0";
    return;
  }

  const last = display.value.slice(-1);
  if (display.value === "0") {
    if (op === '-') {
      display.value = op;
    }
    return;
  }

  let opForDisplay = op;
  if (op === "*") opForDisplay = "×";
  if (op === "/") opForDisplay = "÷";

  if ("+-*/×÷".includes(last) && op === "-") {
    display.value += "-";
    return;
  }

  if ("+-*/×÷".includes(last)) {
    display.value = display.value.slice(0, -1) + opForDisplay;
  } else {
    display.value += opForDisplay;
  }
};

// -(マイナス)の処理 (符号か演算子を判定)
function mergeUnaryMinus(tokens) {
  const result = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const prev = result[result.length - 1];
    const next = tokens[i + 1];
    if (
      t === "-" &&
      next !== undefined && 
      !isNaN(Number(next)) &&
      (i === 0 || ["+", "-", "*", "/"].includes(prev))
    ) {
      result.push("-" + next);
      i++;
    } else {
      result.push(t);
    }
  }

  return result;
};

// 演算子*/を優先して計算する処理
function applyMulDiv(tokens) {
  const result = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t === "*" || t === "/"){
    const prev = Number(result.pop());
    const next = Number(tokens[i + 1]);
    
    let calc;
    if (t === "*" ) {
        calc = prev * next;
      } else {
        if (next === 0) {
          display.value = "0では除算できません";
          return null;
        }
        calc = prev / next;
      };

  result.push(String(calc));
    i += 2;
    } else {
      result.push(t);
      i++;
    };

  }
  return result;
};

// =(イコール)押下時の処理
function equal () {
  const exprDisplay = display.value;
  const exprForCalc = exprDisplay.replace(/×/g, "*").replace(/÷/g, "/");
  let tokens = exprForCalc.match(/(\d+(?:\.\d+)?|[+\-*/])/g);

  if (!tokens) return; 
  if (exprDisplay === "0では除算できません") {
    display.value = "0";
    return;
  }
  if (!exprDisplay) return;

  // 末尾が演算子なら、計算せずに何もしない
  const lastChar = exprDisplay.slice(-1); // 末尾1文字だけ取り出す
  if ("+-*/×÷".includes(lastChar)) {
    return;
  }

  tokens = mergeUnaryMinus(tokens);
  tokens = applyMulDiv(tokens);
  // mergeUnaryMinusとapplyMulDiv関数実行後のtokens配列の空列を防止
  if (!tokens) return;

  let result = Number(tokens[0]);

  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const num = Number(tokens[i+1]);
    if (op === '+') {
      result = result + num;  
    } else if (op === '-') {
      result = result - num;
    }
  }

  display.value = result;
};

// Cボタン
function reset() {
  display.value = '0';
};
