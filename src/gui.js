
export let options = ['4:3','3:4','16:9','1:1','2:3','3:2','21:9'];
let formatOptionList = document.getElementById('format-select').options;
let formatOption = [
    {
        text: '4:3',
        value: '4:3'
      },
      {
        text: '3:4',
        value: '3:4'
      },
      {
        text: '16:9',
        value: '16:9'
      },
      {
        text: '1:1',
        value: '1:1',
        selected: 'true',
      },
      {
        text: '2:3',
        value: '2:3'
      },
      {
        text: '3:2',
        value: '3:2'
      },
      {
        text: '21:9',
        value: '21:9'
      },  
];
formatOption.forEach(option=>
    formatOptionList.add(
        new Option(option.text,option.value,option.selected)
    )
);
export  let modelOptions = {
    'Модель 1': '123.glb',
    'Модель 2': 'building.glb',
    'Модель 3': 'build2.glb',
    'Модель 4': 'atlanta.glb',
    'Модель 5': 'empire_state_building.glb'
};
//empire_state_building
let modelOptionList = document.getElementById('model-select').options;
export let modelOptionsTest = [
  {
    text: 'Модель 1',
    value: '123.glb'
  },
  {
    text: 'Модель 2',
    value: 'building.glb',
    selected: true
  },
  {
    text: 'Модель 3',
    value: 'build2.glb'
  },
  {
    text: 'Модель 4',
    value: 'atlanta.glb'
  },
  {
    text: 'Модель 4',
    value: 'empire_state_building.glb'
  }
];

modelOptionsTest.forEach(option =>
    modelOptionList.add(
    new Option(option.text, option.value, option.selected)
  )
);