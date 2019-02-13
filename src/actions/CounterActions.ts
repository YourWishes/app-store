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

export const ADD = 'ADD';
export const SUB = 'SUB';
export const SET = 'SET';
export const DO_THING = 'DO_THING';

export type Add = { type: typeof ADD, amount:number };
export type Sub = { type: typeof SUB, amount:number };
export type Set = { type: typeof SET, value:number };
export type DoThing = { type: typeof DO_THING };

export type Actions = Add|Sub|Set|DoThing;

export const add = (amount:number):Add => ({ type: ADD, amount });
export const sub = (amount:number):Sub => ({ type: SUB, amount });
export const set = (value:number):Set => ({ type: SET, value });
export const doThing = ():DoThing => ({ type: DO_THING });
