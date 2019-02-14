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

export class AppStore<S, A extends Action>  {
  owner:AppStoreOwner<S,A>;
  reducer:Reducer<S,A>;
  store:Store<S,A>;

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
  }

  getState() { return this.store.getState(); }

  dispatch(action:A|ThunkAction<any, S, any, A>) {
    this.store.dispatch(action as A);
  }
}
