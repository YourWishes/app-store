import { AppStore } from './AppStore';
import * as Actions from './../actions/';
import * as Reducers from './../reducers/';
import * as States from './../states/';

type AppState = States.CounterState;
type AppActions = Actions.Actions;

//Store
class DummyAppStoreOwner<AppState,AppActions> {
  constructor() {}
  getReducer() { return Reducers.counterReducer; }
};

let dummyOwner = new DummyAppStoreOwner<AppState, AppActions>();

describe('AppStore', () => {
  it('should require a real AppStoreOwner', () => {
    expect(() => new AppStore(null)).toThrow();
    expect(() => new AppStore(dummyOwner)).not.toThrow();
  });

  it('should create a store', () => {
    let store = new AppStore(dummyOwner);
    expect(store.store).toBeDefined();
  });
});

describe('getState', () => {
  it('should get the state with the initial value of the store', () => {
    let store = new AppStore(dummyOwner);
    let state = store.getState();
    expect(state).toBeDefined();
    expect(state.counter).toBeDefined();
    expect(state.counter).toStrictEqual(0);
  });
});

/*** We are going to test the actual store now ***/
describe('dispatch', () => {
  it('should allow an action to be dispatched', () => {
    let store = new AppStore(dummyOwner);
    expect(store.getState().counter).toStrictEqual(0);

    expect(() => store.dispatch(Actions.add(3))).not.toThrow();
    expect(store.getState().counter).toStrictEqual(3);

    expect(() => store.dispatch(Actions.sub(2))).not.toThrow();
    expect(store.getState().counter).toStrictEqual(1);

    expect(() => store.dispatch(Actions.set(22))).not.toThrow();
    expect(store.getState().counter).toStrictEqual(22);

    expect(() => store.dispatch(Actions.doThing())).not.toThrow();
    expect(store.getState().counter).toStrictEqual(44);
  });

  it('should allow thunks to be dispatched', async () => {
    let store = new AppStore(dummyOwner);
    expect(store.getState().counter).toStrictEqual(0);
    expect(() => store.dispatch(Actions.add(3))).not.toThrow();
    expect(store.getState().counter).toStrictEqual(3);

    expect( () => store.dispatch(Actions.doThingLater()) ).not.toThrow();
    expect(store.getState().counter).toStrictEqual(6);

    expect( () => store.dispatch(Actions.doThingMuchLater()) ).not.toThrow();
    expect(store.getState().counter).toStrictEqual(6);

    await new Promise(resolve => setTimeout(resolve, 150));
    expect(store.getState().counter).toStrictEqual(12);
  });
});
