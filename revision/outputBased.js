setTimeout(() => console.log(1), 0) 
new Promise((resolve,reject) => setTimeout(() => resolve(2), 0) ).then(d => console.log(d)) 
new Promise((resolve,reject)=>console.log(5))
setTimeout(() => console.log(3), 0) 
console.log(4)


(async function () {
    console.log(1);
    setTimeout(() => console.log(2), 0)
    await Promise.resolve().then(() => console.log(3))
    setTimeout(() => console.log(4), 0)
    console.log(5)
   await Promise.resolve().then(() => console.log(6))
    Promise.reject().catch(() => console.log(7))
    console.log(8)
})()

1, 3, 5, 6, 8, 7, 2, 4


//to do
//immediate stopPropagation


const obj = {
    count: 0,
    inc: function() {
      setTimeout(function() {
        this.count++;
        console.log(this.count);
      }, 1000);
    }
  };
  obj.inc();
//   Output: NaN or undefined
  
//   this inside setTimeout refers to global. Fix using arrow function or bind(this).



const promiseA = new Promise((resolve, reject) => {
  resolve(777);
});
// At this point, "promiseA" is already settled.
promiseA.then((val) => console.log("asynchronous logging has val:", val));
console.log("immediate logging");

// produces output in this order:
// immediate logging
// asynchronous logging has val: 777

/*
An action can be assigned to an already settled promise. In this case, the action is added immediately to the back of the job queue and will be performed when all existing jobs are completed. Therefore, an action for an already "settled" promise will occur only after the current synchronous code completes and at least one loop-tick has passed. This guarantees that promise actions are asynchronous.
*/