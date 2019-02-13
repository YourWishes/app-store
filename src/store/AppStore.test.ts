import { AppStore } from './AppStore';
import { Action, Reducer } from 'redux';


//Actions
const ADD_THING = 'ADD_THING';
const DO_THING = 'DO_THING';

type AddThing = {type: typeof ADD_THING, number:number };
type DoThing = {type: typeof DO_THING };
type Actions = AddThing|DoThing;

const addThing = (number:number):AddThing => ({ type: ADD_THING, number });
const doThing = () => ({type: DO_THING });

//State
type DummyState = {
  counter:number
}

//Reducer
const DefaultState:DummyState = { counter: 0 };

const DummyReducer:Reducer<DummyState,Actions> = (state:DummyState=DefaultState, action:Actions) => {
  switch(action.type) {
    case ADD_THING:
      return {...state, counter: state.counter+1 };

    case DO_THING:
      return {...state, counter: 0 };

    default:
      return state;
  }
}


//Store
class DummyAppStoreOwner<DummyState,Actions> {
  constructor() {}
  getReducer() { return DummyReducer; }
};

let dummyOwner = new DummyAppStoreOwner<DummyState, Actions>();

describe('AppStore', () => {
  it('should require a real AppStoreOwner', () => {
    expect(() => new AppStore(null)).toThrow();
    expect(() => new AppStore(dummyOwner)).not.toThrow();
  });
});

//TODO: I need tests for the actual reducer, store and actions themselves...
