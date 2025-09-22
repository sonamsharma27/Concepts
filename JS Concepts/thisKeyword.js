const obj1 = {
  name: "Sonam",
  printName: function () {
    console.log(this.name);
  },
};

const obj2 = {
  name: " Sonam",
  printName: () => {
    console.log(this.name);  //arrow functions dont bind context with this keyword
  },
};

obj1.printName(); //Sonam
obj2.printName(); //undefined
