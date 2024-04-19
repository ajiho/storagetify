import mitt from 'mitt'
import TagSet from './TagSet'

//参数默认值
const Default = {
  type: 'local', //默认驱动是 localStorage
  expire: 0, //单位是秒
  prefix: '', //key的前缀
  serialize: JSON.stringify, //序列化
  deserialize: JSON.parse, //反序列化
}

class Storagetify {
  #emitter
  #storage
  #config

  constructor(config) {
    this.#config = {
      ...Default,
      ...config,
    }

    this.#emitter = mitt()
    this.#storage = window[`${this.#config.type}Storage`]
  }

  on(event, callback) {
    this.#emitter.on(event, callback)
  }

  #getKey(key) {
    return this.#config.prefix + key
  }

  set(key, value, expire = null) {
    const cacheValue = {
      value,
      expire:
        expire || this.#config.expire !== 0
          ? Date.now() + (expire || this.#config.expire) * 1000
          : 0,
    }
    try {
      this.#storage.setItem(
        this.#getKey(key),
        this.#config.serialize(cacheValue),
      )
      //触发事件
      this.#emitter.emit('change')
      return true
    } catch (error) {
      return false
    }
  }

  has(key) {
    return this.#storage.getItem(this.#getKey(key)) !== null
  }

  get(key, defaultValue = null) {
    const cacheValue = this.#storage.getItem(this.#getKey(key))
    if (cacheValue) {
      const parsedValue = this.#config.deserialize(cacheValue)
      if (parsedValue.expire === 0 || parsedValue.expire >= Date.now()) {
        return parsedValue.value
      }
      this.delete(key)
    }
    return defaultValue
  }

  delete(key) {
    this.#storage.removeItem(this.#getKey(key))
    this.#emitter.emit('change')
  }

  clear() {
    this.#storage.clear()
    this.#emitter.emit('change')
  }

  remember(key, value, expire = null) {
    const cachedValue = this.get(key)
    if (cachedValue !== null) {
      return cachedValue
    }

    if (typeof value === 'function') {
      //允许第二个参数是一个函数
      const computedValue = value()
      this.set(key, computedValue, expire)
      return computedValue
    }
    this.set(key, value, expire)
    return value
  }

  inc(key, step = 1) {
    const cachedValue = this.get(key, 0)
    if (typeof cachedValue === 'number') {
      this.set(key, cachedValue + step)
    }
  }

  tag(tag) {
    return new TagSet(tag, this)
  }

  dec(key, step = 1) {
    this.inc(key, -step)
  }

  //获取并删除缓存
  pull(key) {
    let value = this.get(key)
    this.delete(key)
    return value
  }

  push(key, value) {
    const cachedValue = this.get(key, [])
    if (Array.isArray(cachedValue)) {
      cachedValue.push(value)
      this.set(key, cachedValue)
    }
  }

  store(type) {
    return new this.constructor({
      type,
      expire: this.#config.expire,
      prefix: this.#config.prefix,
      serialize: this.#config.serialize,
      deserialize: this.#config.deserialize,
    })
  }

  getTagItems(tag) {
    return this.get(tag, [])
  }
}

export default Storagetify
