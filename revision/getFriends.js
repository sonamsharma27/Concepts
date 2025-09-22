const mapping = {
  a: ["b", "c"],
  b: ["d", "g"],
  d: ["p", "q"],
  l: ["x", "y"],
};

// a-> b,c,d,g,p,q
// b-> d,g,p,q

function helper(person, mapping, friends) {
  friends.push(person);
  if (!mapping[person]) return;
  for (f of mapping[person]) {
    helper(f, mapping, friends);
  }
}

function getFriends(person, mapping) {
  if (!mapping[person]) return;
  let friends = [];
  for (f of mapping[person]) {
    helper(f, mapping, friends);
  }
  return friends;
}

console.log(getFriends("x", mapping));


function camelToSnake(str) {
  let res="";
  for(let i=0; i<str.length; i++){
      let c=str[i];
      if(c>='A' && c<='Z'){
          if(i!==0){
               res+='_';
          }
          c=c.toLowerCase();
          res+=c;
      }
      else {
          res+=c;
      }
  }
  console.log(res);
}

camelToSnake('PaymentMethodData')


function snakeToCamel(str) {
  let res="";
  for(let i=0; i<str.length; i++){
      if(str[i]=='_'){
          res+=str[i+1].toUpperCase();
          i++;
      } else {
          res+=str[i];
      }
  }
  console.log(res);
}

snakeToCamel('payment_method_data')



const obj = {
 obj1: {
  a: 'a1',
  b: 'b1'
 },
 obj2: {
  b: 'b2',
  c: 'c1'
 }
 //... can be any number of objects
}


function getAllKeys(obj){ //unique keys
    let keys=[];
    for(const [key,val] of Object.entries(obj)){
        for(const k in val){
            if(!keys.includes(k)){
                keys.push(k);
            }
        }
    }
    return keys;
}

function construct2DArray(obj){
    const keys = getAllKeys(obj);
    let res = [];
    res.push(keys);
    
    for(const [_,curObj] of Object.entries(obj)){
        let curVal = [];
        keys.forEach((key,index)=>{
            curval[index] = curObj[key] ?? '';
        })
        res.push(curVal);
    }
    return res;
}

//Tasks in series and parallel

var a = {};

(function b(a) {
 a.a = 10;
 a = null;
})(a);

console.log(a);

/**
 * Function parameters shadow outer variables.
 * Objects are passed by value of the reference.
 */