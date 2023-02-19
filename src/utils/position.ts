export const getPosition = (a = "aaa", b = "zzz") => {
  let pos1 = a;
  let pos2 = b;
  if (pos1 >= pos2) return "error";

  while (pos1.length !== pos2.length) {
    if (pos1.length > pos2.length) pos2 += "a";
    else pos1 += "a";
  }
  let num1 = 0;
  let num2 = 0;
  for (let i = 0; i < pos1.length; i++) {
    num1 += (pos1.charCodeAt(i) - 97) * 26 ** (pos1.length - i - 1);
    num2 += (pos2.charCodeAt(i) - 97) * 26 ** (pos1.length - i - 1);
    // console.log(num1, num2)
  }

  const mid = (num1 + num2) / 2;
  let curr = Math.floor(mid);
  let nextcode;
  const codes = [];
  do {
    nextcode = curr % 26;
    curr = Math.floor(curr / 26);
    codes.push(nextcode);
  } while (curr > 0);
  let pos = codes
    .reverse()
    .map((d) => String.fromCharCode(d + 97))
    .join("")
    .padStart(pos1.length, "a");
  pos += Number.isSafeInteger(mid) ? "" : "n";

  return pos;
};
