import * as assert from 'assert'
import { from } from 'rxjs'
import { bufferTime, first } from 'rxjs/operators'

import { observable } from '../src/Observable'

describe('Observable', () => {
  it('of', () => {
    const fa = observable.of(1)
    return new Promise((resolve, reject) => {
      fa.pipe(bufferTime(10), first()).subscribe(events => {
        try {
          assert.deepEqual(events, [1])
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    })
  })

  it('map', () => {
    const fa = from([1, 2, 3])
    const double = (n: number): number => n * 2
    const fb = observable.map(fa, double)
    return new Promise((resolve, reject) => {
      fb.pipe(bufferTime(10), first()).subscribe(events => {
        try {
          assert.deepEqual(events, [2, 4, 6])
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    })
  })

  it('ap', () => {
    const fa = from([1, 2, 3])
    const double = (n: number): number => n * 2
    const triple = (n: number): number => n * 3
    const fab = from([double, triple])
    const fb = observable.ap(fab, fa)
    return new Promise((resolve, reject) => {
      fb.pipe(bufferTime(10), first()).subscribe(events => {
        try {
          assert.deepEqual(events, [3, 6, 9])
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    })
  })

  it('chain', () => {
    const fa = from([1, 2, 3])
    const fb = observable.chain(fa, a => from([a, a + 1]))
    return new Promise((resolve, reject) => {
      fb.pipe(bufferTime(10), first()).subscribe(events => {
        try {
          assert.deepEqual(events, [1, 2, 2, 3, 3, 4])
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    })
  })
})
