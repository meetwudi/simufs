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

最后在simufs文件夹下面执行index.js，注意要运行在harmony和strict模式下

```
$ node --harmony --use-strict index.js
```

## 使用方法
simufs中，`>`符号开头的行代表输入，`-`符号开头的行代表输出。

#### 查看当前目录 pwd()
simufs采用了类似linux的多级目录结构。程序刚开始的时候，你会在根目录下。你可以使用`pwd`命令来查看当前所在的目录。

```
> pwd()
- /
```

上面的指令输出代表我们处在根目录（`/`）下。

#### 创建文件 create(filename)
`create(filename)`在当前文件夹下创建一个新文件。文件名只能由拉丁字母、数字和半角小数点`.`组成，不允许有空格、中文等其他特殊符号。文件名最短长度为2，最长长度为8。

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
  上次修改时间： xxxxx
  文件大小： 29B
  文件类型：普通文件
```

#### 创建目录 mkdir(dirname)
`mkdir(dirname)`创建一个新目录（在当前目录下）。

```
> mkdir("etc")
- 目录etc创建完毕
```

#### 删除目录 rmdir(dirname)
`rmdir(dirname)`删除当前目录下的一个目录，被删除的目录必须是空目录。

```
> rmdir("ect")
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
将字符串content写入文件`filename`。

```
> write("myfile.ext", "Hello, world!")
- 文件myfile.ext保存完毕
```

## 代码文档
请见[doc](doc)文件夹下的文档页面。

