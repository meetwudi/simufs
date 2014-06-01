## File System Simulation

- Author: John Wu
- School: Tongji University
- Tutor: DongQing Wang

## 安装方法
首先，将这个代码仓库clone到本地。接着，你需要安装[Node.js](http://nodejs.org/)，安装后，用npm包管理器安装`n`：

```
$ npm install n -g
```

然后运行下面的命令切换到最新的非稳定版的Node.js

```
$ n latest
```

第一次执行时需要先安装文件系统，运行`install.js`即可，注意要运行在harmony和strict模式下。

```
$ node --harmony --use-strict install.js
```

最后在simufs文件夹下面执行`index.js`

```
$ node --harmony --use-strict index.js
```

## 使用方法
simufs中，`>`符号开头的行代表输入，`-`符号开头的行代表输出。

#### 查看当前目录 pwd()
simufs采用了类似linux的多级目录结构。程序刚开始的时候，你会在根目录下。你可以使用`pwd`命令来查看当前所在的目录。

```
> pwd()
- /etc/usr/local
```

上面的指令输出代表我们处在根目录（`/`）下。

#### 创建文件 create(filename)
`create(filename)`在当前文件夹下创建一个新文件。文件名只能由拉丁字母、数字和半角小数点`.`组成，不允许有空格、中文等其他特殊符号。文件名最短长度为2，最长长度为8。空间不足将报错（至少需要一个空闲块）。

```
> create("myfile.ext")
- 创建文件myfile.ext成功
```

#### 删除文件 unlink(filename)
`unlink(filename)`删除当前文件夹下的一个文件。当文件不存在时，会予以报错。

```
> unlink("myfile.ext")
- 删除文件myfile.ext成功
> unlink("test.ext")
- 文件test.ext不存在
```

#### 查看文件信息  info(filename)
`info(filename)`查看当前文件夹下文件名为`filename`的文件的FCB部分信息。这些信息包括

- 创建时间
- 上次修改时间
- 文件大小
- 文件类型（文件夹或普通文件）

```
> info("myfile.ext")
- 创建时间：xxxxx
  文件大小： 29B
  文件类型：普通文件
```

#### 创建目录 mkdir(dirname)
`mkdir(dirname)`创建一个新目录（在当前目录下）。目录的命名约束和文件一致。空间不足将报错（至少要有一个空闲块）

```
> mkdir("etc")
- 目录etc创建完毕
```

#### TODO: 删除目录 rmdir(dirname)
`rmdir(dirname)`删除当前目录下的一个目录，被删除的目录必须是空目录。

```
> rmdir("etc")
- 目录etc删除完毕
```

#### 列出目录下所有文件名 ls()
`ls`命令可以列出目录下所有文件名。对于普通文件，直接显示其文件名。对于普通文件，直接显示其文件名。对于目录文件，在其目录名后面加一个`/`。

```
> ls()
- myfile.ext
  myfile2.ext
  mydir/
  myfile3.ext
```


#### 读文件内容  read(filename)
`read(filename)`读取当前文件夹下文件名为`filename`的文件的内容。文件内容只能为字符串。

```
> read("myfile.ext")
- Hello, world!
```

#### 写文件内容 write(filename, content)
将字符串content写入文件`filename`。空间不足将报错。

```
> write("myfile.ext", "Hello, world!")
- 文件myfile.ext保存完毕
```

#### 进入目录 cd(dirname)
进入当前目录的下一级目录。

```
> mkdir("G")
> cd("G")
> pwd()
- /G/
```

#### 回到上一级目录 goback()
返回上一级目录。

```
> mkdir("G")
> cd("G")
> pwd()
- /G/
> goback();
> pwd();
- /
```

#### 退出 exit()
必须使用exit退出系统，否则数据将无法保存。

## 实现说明

#### 实现方案和参数

- 目录结构：哈希表
- 空闲空间管理：位图法
- 空间分配方法：连续分配
- 块大小：512B
- 块个数：8000（编号0~7999）
- 磁盘空间：3.9M
- 系统保留块（存放文件系统必要信息）：0~255

其中一些重要信息的存放块：

- 空闲区位图占块：0 ~ 3
- 根目录的FCB初始占块：4
- 根目录的目录文件初始占块：256

#### FCB结构

```
{
  t: 'd',  // 文件类型，目录为d，普通文件为f
  id: 'mydir',  // 文件名/ID。这里不对文件名进行哈希算法，直接以文件名做Key。因此也可用作ID
  blk: 589, // 如果是目录，则该处为目录文件所在块。如果是文件，则该处为文件内容所在块。
  tblk: 18, // 当前FCB所在的块
  len: 1, // 目录/文件内容所占块个数
  crd: '2014-04-14' // 文件创建时间
}
```

#### 目录文件结构

```
{
  cpath: '/usr/local',  // 完整的路径名
  fb: parentFcb,  // 父目录的FCB，根节点的父目录FCB为null
  d: [...] // 目录项的FCB
}
```


## 代码文档
请见[doc](doc)文件夹下的文档页面。

