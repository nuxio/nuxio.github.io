---
layout: post
title:  "Promise的实现"
date:   2019-04-21 18:17:32 +0800
categories: JavaScript
---

## 下面是一个简要的 Promise 实现

```js
const isFunction = value => typeof value === 'function'

// Promise's status
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
  constructor(init) {
    if (!isFunction(init)) {
      throw new Error(`Promise resolver ${init} is not a function`)
    }

    this.status = PENDING

    this.value = undefined

    this._fulfilledQueue = []

    this._rejectedQueue = []

    try {
      init(this._resolve.bind(this), this._reject.bind(this))
    } catch (error) {
      this._reject(error)
    }
  }
  
  _resolve(value) {
    if (this.status !== PENDING) return

    const run = () => {
      const runFulfilled = value => {
        let cb
        while (cb = this._fulfilledQueue.shift()) {
          cb(value)
        }
      }

      const runRejected = error => {
        let cb
        while (cb = this._rejectedQueue.shift()) {
          cb(error)
        }
      }

      if (value instanceof MyPromise) {
        value.then(fulfilledValue => {
          this.status = FULFILLED
          this.value = fulfilledValue
          runFulfilled(fulfilledValue)
        }, rejectedValue => {
          this.status = REJECTED
          this.value = rejectedValue
          runRejected(rejectedValue)
        })
      } else {
        this.status = FULFILLED
        this.value = value
        runFulfilled(value)
      }
    }
    
    setTimeout(() => run(), 0)
  }

  _reject(error) {
    if (this.status !== PENDING) return

    const run = () => {
      this.status = REJECTED
      this.value = error
      let cb

      while (cb = this._rejectedQueue.shift()) {
        cb(error)
      }
    }

    setTimeout(() => run(), 0)
  }

  then(onFulfilled, onRejected) {
    const { value, status } = this
    
    // 返回一个新的 promise 
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      // 封装一个成功的执行函数
      let fulfilled = value => {
        try {
          if (!isFunction(onFulfilled)) {
            // 如果不为函数，则直接把值传递给下一个 then 的回调函数
            onFulfilledNext(value)
          } else {
            const result = onFulfilled(value)
            if (result instanceof MyPromise) {
              // 如果返回的是 promise 对象，必须等待其状态改变后才执行下一个回调
              result.then(onFulfilledNext, onRejectedNext)
            } else {
              // 否则将返回结果作为下一个 then 的回调函数的参数传递
              onFulfilledNext(result)
            }
          }
        } catch (error) {
          // 如果函数执行出错，新的 promise 对象的状态转为失败
          onRejectedNext(error)
        }
      }

      // 封装一个失败的执行函数，操作步骤同 fulfilled
      let rejected = error => {
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(error)
          } else {
            const result = onRejected(value)
            if (result instanceof MyPromise) {
              result.then(onFulfilledNext, onRejectedNext)
            } else {
              onRejectedNext(result)
            }
          }
        } catch (error) {
          onRejectedNext(error)
        }
      }

      switch(status) {
        // 当前 promise 状态为 PENDING 时，将 then 方法回调函数加入队列等待执行
        case PENDING:
          this._fulfilledQueue.push(onFulfilled)
          this._rejectedQueue.push(onRejected)
          break
        // 如果为 FULFILLED 则立即执行对应的回调函数
        case FULFILLED:
          fulfilled(value)
          break
        case REJECTED:
          rejected(value)
          break
      }
    })
  }

  // 相当于调用 then 方法，只传入 rejected 状态的函数
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  // 不管 promise 最后状态如何都会执行的操作
  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback(value)).then(() => value),
      reason => MyPromise.resolve(callback(reason)).then(() => { throw reason })
    )
  }

  // 静态 resolve 方法
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    } else {
      return new MyPromise(resolve => resolve(value))
    }
  }

  // 静态 reject 方法
  static reject(value) {
    return new MyPromise((resolve, reject) => reject(value))
  }

  // 静态 all 方法
  static all(list) {
    return new MyPromise((resolve, reject) => {
      // 返回值的集合
      let values = []
      let count = 0
      for(let [index, promise] of list.entries()) {
        // 不管三七二十一必须得有then方法
        this.resolve(promise).then(result => {
          values[index] = result
          count++

          if (count === list.length) {
            resolve(values)
          }
        }, error => {
          reject(error)
        })
      }
    })
  }

  // 静态 race 方法
  static race(list) {
    return new MyPromise((resolve, reject) => {
      for (let promise of list) {
        this.resolve(promise).then(result => {
          // 直接resolve
          resolve(result)
        }, error => {
          reject(error)
        })
      }
    })
  }
}
```