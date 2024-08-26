
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
    'Модель 3': 'test1.glb',
    'Модель 4': 'stadium.glb',
    'Модель 5': 'home.glb',
};
//empire_state_building
let modelOptionList = document.getElementById('model-select').options;
export let modelOptionsTest = [
  {
    text: 'Жилой дом 1',
    value: 'second_build.glb'
  },
  {
    text: 'Школа',
    value: 'building.glb',
    selected: true
  },
  {
    text: 'Жилой дом 2',
    value: 'first_build.glb'
  },
  {
    text: 'Стадион',
    value: 'stadium.glb'
  },
  {
    text: 'Жилой дом 3',
    value: 'third_build.glb'
  },
  {
    text: 'Автовокзал',
    value: 'railway_station.glb'
  },
];

modelOptionsTest.forEach(option =>
    modelOptionList.add(
    new Option(option.text, option.value, option.selected)
  )
);