export default function promtStructure(promt) {
  return `I want to render a dynamic form by array of objects . 

the components are ---

for input field item {

    component:"input",

    type:"email",

    placeholder:"enter email",

    label:"email",

    required:true // or false

}

for textarea field item {

    component:"textarea",

    placeholder:"enter description",

    label:"write description",

    required:true // or false

}

for select field item {

    component:"select", // or radio

    placeholder:"select stream",

    label:"stram",

    options:["CSE","ECE","EE","ME","CE"],

    required:true // or false

}

for datepicker field item {

    component:"datepicker",

    placeholder:"enter email",

    label:"pick your date",

    required:true // or false

}

strictly using this structure give me a array of objects to build a form for ${promt} for rendering dynamic form. only give me the array of object in javascript without the variable decleration nothing else.`;
}
