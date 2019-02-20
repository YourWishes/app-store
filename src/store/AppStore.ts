// Copyright (c) 2019 Dominic Masters
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { createStore, applyMiddleware, Store, Reducer, Action } from 'redux';
import thunk, { ThunkMiddleware, ThunkAction } from 'redux-thunk';
import { AppStoreOwner } from './AppStoreOwner';
import { createLogger } from 'redux-logger';
import { StoreListener, StateChangeListenerMap } from './';

export class AppStore<S, A extends Action>  {
  owner:AppStoreOwner<S,A>;
  reducer:Reducer<S,A>;
  store:Store<S,A>;

  currentState:S;
  stateChangeListeners:StateChangeListenerMap<S>={};

  constructor(owner:AppStoreOwner<S,A>) {
    if(!owner) throw new Error("Owner must be a real AppStoreOwner");
    this.owner = owner;

    //Get the reducer from the dummyOwner
    this.reducer = owner.getReducer();

    //Get the middlewares (if any)
    let middlewares = [];
    if(owner.getMiddlewares) middlewares = owner.getMiddlewares();

    //Create the store
    this.store = createStore(this.reducer, applyMiddleware(
      thunk as ThunkMiddleware<S,A>,
      createLogger({ }),
      ...middlewares
    ));

    //Store the "current" state
    this.currentState = this.getState();

    //Internal subscription
    this.store.subscribe(() => this.onStateChange());
  }

  getState() { return this.store.getState(); }
  getStateChangeListenerList() { return this.stateChangeListeners; }
  getStateChangeListeners(key:string) { return this.stateChangeListeners[key] || []; }

  addStateChangeListener(key:string, listener:StoreListener<S>) {
    if(!key || !key.length) throw new Error("Key must be valid!");
    if(!listener) throw new Error("Listener must be valid!");
    let existing = this.stateChangeListeners[key] || [];
    if(existing.indexOf(listener) !== -1) return;

    this.stateChangeListeners[key] = [ ...existing, listener ];
  }

  dispatch(action:A|ThunkAction<any, S, any, A>) { this.store.dispatch(action as A); }

  onStateChange() {
    let newState = this.getState();

    //Determine changes
    let stateKeys = [...new Set([
      ...Object.keys(this.currentState),
      ...Object.keys(newState)
    ])];

    let changedKeys = stateKeys.filter(key => {
      return newState[key] !== this.currentState[key];
    });

    changedKeys.forEach(key => this.getStateChangeListeners(key).forEach(listener => {
      listener.onStateChange(newState, this.currentState, key, this);
    }));

    this.currentState = newState;
  }
}
