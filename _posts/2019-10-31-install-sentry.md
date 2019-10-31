---
layout: post
title: "安装Sentry"
date: 2019-10-31 21:24:59 +0800
categories: JavaScript Sentry
---

## 安装环境

- Centos 7

## 步骤

### 1. 安装 docker

```bash
wget -qO- https://get.docker.com/ | sh
```

这里我就遇到了问题，安装报错：

```bash
File "/usr/bin/yum-config-manager", line 135
    except yum.Errors.RepoError, e:
                               ^
SyntaxError: invalid syntax
```

然后找到了一个解决办法，编辑`/usr/bin/yum-config-manager`文件，将第一行改为以下内容：

```bash
#!/usr/bin/python2 -tt
```

问题解决。

安装成功后执行`docker --version`查看版本。国内访问官方镜像速度慢，需要设置镜像：

```bash
curl -sSL https://get.daocloud.io/daotools/set_mirror.sh | sh -s http://4031ebb7.m.daocloud.io
```

### 2. 安装 pip

```bash
yum -y install epel-release
yum -y install python-pip
pip --version
```

### 3. 安装`docker-compose`（可以理解为一个 docker 的批量处理工具）

```bash
sudo pip install -U docker-compose
```

安装后使用`docker-compose --version`查看版本。

### 4. 搭建 sentry

首先拉取最新的代码：

```bash
git clone https://github.com/getsentry/onpremise.git
```

然后进入`onpremise`目录依次执行：

```bash
bashmkdir -p data/{sentry,postgres} # 创建对应的目录
docker-compose run --rm web config generate-secret-key # 生成 key
```

完成第二步后可以拿到一个 key：
![](https://www.notion.so/a43b999295894e02b90b68dabfd5ef90#e1f16d643e414b9bb24a8ce7a934780b)

然后：

```bash
vim docker-compose.yml
```

将 key 写进去：

![](https://www.notion.so/a43b999295894e02b90b68dabfd5ef90#8fa861688233461591339e5601c1d489)

创建`superuser`，输入 sentry 账号的邮箱和密码

```bash
docker-compose run --rm web upgrade
```

完成后起服务：

```bash
docker-compose up -d
```

这时候在浏览器输入`http://ip:9000`即可进入你的 sentry。

### 参考资料：

sentry 安装教程：[https://learnku.com/articles/4285/build-your-own-sentry-service](https://learnku.com/articles/4285/build-your-own-sentry-service)

docker 介绍：[http://dockone.io/article/6051](http://dockone.io/article/6051)

docker-compose 介绍：[https://www.jianshu.com/p/658911a8cff3](https://www.jianshu.com/p/658911a8cff3)
