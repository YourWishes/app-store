import { AppStore, StoreListener, AppStoreOwner } from './'
import * as Actions from './../actions/';
import * as Reducers from './../reducers/';
import * as States from './../states/';


//Dummy State/Action Types
type AppState = States.CounterState;
type AppActions = Actions.Actions;


//Dummy Store Owner
class DummyAppStoreOwner implements AppStoreOwner<AppState,AppActions> {
  dummyStore:AppStore<AppState,AppActions>;

  constructor() {}
  getReducer() { return Reducers.counterReducer; }
};

let dummyOwner = new DummyAppStoreOwner();


//Dummy Listener
class DummyAppStoreListener implements StoreListener<AppState> {
  mockOnStateChange:jest.Mock;

  onStateChange(newState:AppState, oldState:AppState, key:string, store:(typeof dummyOwner.dummyStore)) {
    this.mockOnStateChange(newState, oldState, key, store);
  }
};



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



describe('addStateChangeListener', () => {
  it('should require a real key', () => {
    let store = new AppStore(dummyOwner);
    let dummyListener = new DummyAppStoreListener();
    expect(() => store.addStateChangeListener(null, dummyListener)).toThrow();
    expect(() => store.addStateChangeListener('', dummyListener)).toThrow();
    expect(() => store.addStateChangeListener(null, null)).toThrow();
  });


  it('should require a real listener', () => {
    let store = new AppStore(dummyOwner);
    let dummyListener = new DummyAppStoreListener();
    expect(() => store.addStateChangeListener('counter', null)).toThrow();
  });


  it('should add a listener', () => {
    let store = new AppStore(dummyOwner);
    let listener = new DummyAppStoreListener();
    expect(store.stateChangeListeners).not.toHaveProperty('counter');
    expect(() => store.addStateChangeListener('counter', listener)).not.toThrow();
    expect(store.stateChangeListeners).toHaveProperty('counter');
    expect(store.stateChangeListeners.counter).toHaveLength(1);
  });


  it('should add multiple listeners of multiple different and same keys', () => {
    let store = new AppStore(dummyOwner);
    expect(store.stateChangeListeners).not.toHaveProperty('counter');
    expect(store.stateChangeListeners).not.toHaveProperty('other');
    expect(store.stateChangeListeners).not.toHaveProperty('apples');
    expect(store.stateChangeListeners).not.toHaveProperty('lorem');

    let listenerCounter1 = new DummyAppStoreListener();
    let listenerCounter2 = new DummyAppStoreListener();
    let listenerOther1 = new DummyAppStoreListener();
    let listenerOther2 = new DummyAppStoreListener();
    let listenerApples = new DummyAppStoreListener();
    let listenerAcross = new DummyAppStoreListener();

    [listenerCounter1,listenerCounter2].forEach(e => store.addStateChangeListener('counter', e));
    [listenerOther1,listenerOther2].forEach(e => store.addStateChangeListener('other', e));
    store.addStateChangeListener('apples', listenerApples);
    store.addStateChangeListener('counter', listenerAcross);
    store.addStateChangeListener('lorem', listenerAcross);

    expect(store.stateChangeListeners).toHaveProperty('counter');
    expect(store.stateChangeListeners).toHaveProperty('other');
    expect(store.stateChangeListeners).toHaveProperty('apples');
    expect(store.stateChangeListeners).toHaveProperty('lorem');

    //Counter
    expect(store.stateChangeListeners['counter']).toHaveLength(3);
    expect(store.stateChangeListeners['counter']).toContain(listenerCounter1);
    expect(store.stateChangeListeners['counter']).toContain(listenerCounter2);
    expect(store.stateChangeListeners['counter']).toContain(listenerAcross);

    //Other
    expect(store.stateChangeListeners['other']).toHaveLength(2);
    expect(store.stateChangeListeners['other']).toContain(listenerOther1);
    expect(store.stateChangeListeners['other']).toContain(listenerOther2);

    //Apples
    expect(store.stateChangeListeners['apples']).toHaveLength(1);
    expect(store.stateChangeListeners['apples']).toContain(listenerApples);

    //Across
    expect(store.stateChangeListeners['lorem']).toHaveLength(1);
    expect(store.stateChangeListeners['lorem']).toContain(listenerAcross);
  });


  it('should not add a listener twice', () => {
    let store = new AppStore(dummyOwner);
    let listener = new DummyAppStoreListener();
    store.addStateChangeListener('counter', listener);
    expect(store.stateChangeListeners['counter']).toHaveLength(1);
    expect(store.stateChangeListeners['counter']).toContain(listener);

    expect(() => store.addStateChangeListener('counter', listener)).not.toThrow();

    expect(store.stateChangeListeners['counter']).toHaveLength(1);
    expect(store.stateChangeListeners['counter']).toContain(listener);
  });
});



describe('onStateChange', () => {
  it('should detect a state change, and send the expected params to callbacks for the key', () => {
    let store = new AppStore(dummyOwner);
    let counterListener = new DummyAppStoreListener();
    let otherListener = new DummyAppStoreListener();

    let fnCounter = counterListener.mockOnStateChange = jest.fn();
    let fnOther = otherListener.mockOnStateChange = jest.fn();

    store.addStateChangeListener('counter', counterListener);
    store.addStateChangeListener('other', otherListener);

    expect(fnCounter).not.toHaveBeenCalled();
    store.dispatch(Actions.add(42));

    expect(fnCounter).toHaveBeenCalledWith(42, 0, 'counter', store);

    expect(fnOther).not.toHaveBeenCalled();
  });
});
