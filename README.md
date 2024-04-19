# storagetify 

一个简单轻量级的对LocalStorage和SessionStorage的AP简单包装js插件(支持过期时间设置等)

**特性:**

- 零依赖
- 体积极小[storagetify.min.js](https://unpkg.com/storagetify@latest/dist/storagetify.min.js) 2.82kb(gzipped: 1.16kb)



## 使用

通过npm安装

```bash
$ npm install storagetify -D
```


```js
import Storagetify from 'storagetify';

//实例化，以及默认参数
const storage = new Storagetify({
  type: 'local', //默认驱动是 localStorage
  expire: 0,//单位是秒
  prefix: '',//key的前缀
  serialize: JSON.stringify,//序列化
  deserialize: JSON.parse,//反序列化
})

storage.set('key', 'value', 3600)
```

或者使用cdn

```html
<script src="https://unpkg.com/storagetify@latest/dist/storagetify.min.js"></script>
<!-- 或者 -->
<!-- <script src="https://cdn.jsdelivr.net/npm/storagetify@latest/dist/storagetify.min.js"></script> -->
<script type="text/javascript">
  const storage = new Storagetify({})
  storage.set('key', 'value', 3600)
</script>
```


## API

### 设置缓存


```js
//数组
storage.set('name', [1, 2, 4])
//数值
storage.set('name', 1)
//对象
storage.set('name', {name:'value1',name2:'value2'})
// 缓存在3600秒之后过期
storage.set('name', 'hello php!',3600)
```


## 缓存自增

针对数值类型的缓存数据，可以使用自增操作，例如:

```js
storage.set('name', 1)
//name自增（步进值为1）
storage.inc('name')
//name自增（步进值为3）
storage.inc('name',3)
```
> 只能对数字类型数据进行自增和自减操作

## 缓存自减

```js

//name自减（步进值为1）
storage.dec('name')
//name自减（步进值为3）
storage.dec('name',3)
```

## 获取缓存

```js
storage.get('name')
```
如果`name`值不存在，则默认返回 `null`
支持指定默认值，例如

```js
storage.get('name','')
```
表示如果`name`值不存在，则返回空字符串


## 追加缓存数据

如果缓存数据是一个数组，可以通过`push`方法追加一个数据
```js
storage.set('name', [1,2,3]);
storage.push('name', 4);
storage.get('name'); // [1,2,3,4]
```

## 删除缓存
```js
storage.delete('name')
```

## 获取并删除缓存

```js
storage.pull('name')
```

如果`name`值不存在，则返回`null`

## 清空缓存

```js
storage.clear()
```

> 该方法谨慎使用，它会一口气清除所有的缓存

## 不存在则写入缓存数据后返回

```js
storage.remember('start_time', Date.now())
```

如果`start_time`缓存数据不存在，则会设置缓存数据为当前时间。

第二个参数可以使用函数

```js
storage.remember('start_time',function(){
    return time()+1;
})
```

remember方法的第三个参数可以设置缓存的有效期


## 缓存标签

支持给缓存数据打标签，例如：

```js
 storage.tag('tag').set('name1', 'value1')


// 清除tag标签的缓存数据
 storage.tag('tag').clear()
```
缓存标签不会改变缓存的读取操作，所以获取方式依然是：

```js
storage.get('name1')
```

并支持同时指定多个缓存标签操作

```js
storage.tag(['tag1', 'tag2']).set('name1', 'value1')

// 清除多个标签的缓存数据
storage.tag(['tag1', 'tag2']).clear()
```

可以追加某个缓存标识到标签
```js
storage.tag('tag').append('name3')
```

获取标签的缓存标识列表

```js
storage.getTagItems('tag')
```

## 切换缓存类型
```js
// 默认使用localStorage缓存(初始化时指定的type类型)
storage.set('name','value',3600);
storage.get('name');

//切换到sessionStorage
storage.store('session').set('name','value',3600);
storage.store('session').get('name')
```

## 变更日志

每个版本的详细更改记录在[CHANGELOG.md](https://github.com/ajiho/storagetify/blob/main/CHANGELOG.md)中.


## 贡献

在提出拉取请求之前,请务必阅读[贡献指南](https://github.com/ajiho/storagetify/blob/main/.github/CONTRIBUTING.md)


## License

[MIT](https://github.com/ajiho/storagetify/blob/master/LICENSE)

Copyright (c) 2024-present, ajiho









  


