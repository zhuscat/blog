---
title: 使用GitHub，GitCafe和Hexo创建一个独立博客
date: 2015-12-25T14:34:12.000Z
category: 教程
tags:
  - 教程
  - 创建博客
---
# 前言

这篇文章描述了如何使用GitHub，GitCafe和Hexo创建一个独立博客。虽然网上有许多这方面的教程了，但是在我建立这个独立博客的过程中，发生了许多不是我所看的一篇教程就所能解决的问题，因此，我决定以我创建这个博客的视角来写一篇教程。我创建这个博客所用的平台是Mac OS X，如果你使用的是其他操作系统，步骤也是大同小异。本文既适合作为同时使用GitHub，GitCafe和Hexo创建一个独立博客的教程，也适合作为单独使用GitHub和Hexo创建一个独立博客或单独使用GitCafe创建一个独立博客的教程。

本文参考了许多教程，我已经将大部分写到了参考资料栏目中，后续修改我会继续增加参考资料。如果文章有任何错误的地方，欢迎大家指出。

**注：**文章还没有最终完成，还有许多要润色修改的地方。

# 为什么将博客同时部署到GitHub和GitCafe上

原本我是仅仅将博客部署到GitHub上的，在我完成之后，我确发现有时候访问博客十分缓慢，于是我决定将博客同时部署到GitHub和GitCafe上，通过DNS分流，国内访问GitCafe，国外访问GitHub，从而提升博客的访问速度。

# 准备工作

下载并安装Node.js: https://nodejs.org

下载并安装Git: http://git-scm.com

# 如何打开Git？

此处内容来自[如何搭建一个独立博客——简明 Github Pages与 jekyll 教程](http://cnfeat.com/blog/2014/05/10/how-to-build-a-blog/)。

## Windows平台操作

- 1、开始菜单Git Bash

![StartMenu](https://i.loli.net/2018/11/17/5befc0e0df691.jpg)

- 2、鼠标右键打开Git Bash

![Menu2](https://i.loli.net/2018/11/17/5befc1de3da4e.jpg)

## Mac平台操作

安装Git后可直接在终端(terminal)操作。

# 注册GitHub和GitCafe

分别在[GitHub](https://github.com)和[GitCafe](https://gitcafe.com)上注册。

# 配置和使用GitHub与GitCafe

打开终端（Windows平台打开Git Bash)，下同，不再反复说明。

**提示：**执行命令都是在终端（Windows下为Git Bash)中进行的。

## 配置和使用GitHub

### 1.检查SSH Keys的设置

```
$ cd ~/.ssh
```

如果显示`No such file or directory`，到第三步，否则继续。

**提示：**`cd`命令为设置当前工作目录，如`cd /Users`为进入Users目录。

### 2.备份和删除原来的SSH Key设置

```
$ ls
config id_rsa id_rsa.pub known_hosts
$ mkdir key_backup
$ cp id_rsa* key_backup
$ rm id_rsa*
```
### 3.生成新的SSH Key

输入下面代码并回车，当询问你在哪里保存key的时候，回车就好。

```
$ ssh-keygen -t rsa -C "你的邮箱@youremail.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/your_user_directory/.ssh/id_rsa)
```

然后输入你的密码，输入密码的时候屏幕上不会显示，输完后按回车就行了

```
Enter passphrase (empty for no passphrase):<输入加密串>
Enter same passphrase again:<再次输入加密串>
```

当看到下面的界面就说明你已经成功设置了SSH Key

![SSHSetting](https://i.loli.net/2018/11/17/5befc1e2cd560.png)

### 4.添加SSH Key到GitHub

1. 用文本编辑工具打开id_rsa.pub文件，如果看不到这个文件，你需要设置显示隐藏文件，复制这个文件里的内容。
2. 登陆GitHub,点击右上角头像->Settings->SSH Keys->Add SSH Key
3. 把你刚才复制的内容复制到Key文本框中并添加一个Title，点击Add Key

### 5.测试

在terminal中输入

```
$ ssh -T git@github.com
```

如果出现如下内容

```
The authenticity of host 'github.com (207.97.227.239)' can't be established.
RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
Are you sure you want to continue connecting (yes/no)?
```

输入yes即可，然后就会看到

```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

### 6.设置用户信息

现在你已经可以通过 SSH 链接到 GitHub 了，还有一些个人信息需要完善的。
Git 会根据用户的名字和邮箱来记录提交。GitHub 也是用这些信息来做权限的处理，输入下面的代码进行个人信息的设置，把名称和邮箱替换成你自己的，名字必须是你的真名，而不是GitHub的昵称。

```
$ git config --global user.name "username"//用户名
$ git config --global user.email  "你的邮箱@youremail.com"//填写自己的邮箱
```

### 7.SSH Key配置成功

本机已成功连接到GitHub。

## 配置和使用GitCafe

这里假定你已经完成了以上步骤

### 1.进入存放SSH的目录

```
$ cd ~/.ssh
```

### 2.生成新的SSH公钥

执行以下命令

```
$ ssh-keygen -t rsa -C "你的邮箱@youremail.com" -f ~/.ssh/gitcafe
```

### 3.完成之后，在SSH的文件夹下，可以看到GitCafe私钥和公钥文件

```
gitcafe
gitcafe.pub
```

### 4.生成配置文件

执行以下命令

```
$ touch ~/.ssh/config
```

用文本编辑程序打开config文件，添加以下内容

```
Host gitcafe.com www.gitcafe.com
IdentityuFile ~/.ssh/gitcafe
```

### 5.添加SSH Key到GitCafe

登陆GitCafe，点击右上角头像->账户设置->SSH公钥管理->添加新的公钥，将gitcafe.pub中内容复制进去并添加一个名称。

### 6.测试

执行以下命令

```
$ ssh -T git@gitcafe.com -i ~/.ssh/gitcafe
```

这里的输出信息与操作步骤与GitHub相似，当最后看到如下内容就成功了

```
Hi username! You've successfully authenticated, but GitCafe does not provide shell access.
```

### 7.SSH Key配置成功
本机已成功连接到GitCafe

# 使用GitHub Pages和GitCafe Pages创建个人页面

## 使用GitHub Pages创建个人页面

可以按照[GitHub Pages](https://pages.github.com)上的指引进行操作，这里我将以terminal为示例，当然你也可以使用GitHub的客户端。

### 创建一个仓库(repository)

创建一个命名为username.github.io的仓库，username为你在GitHub上注册的用户名（一定要相同）

### 测试GitHub Pages

**注：**这里的内容不是必须做的，因为稍后会用Hexo创建博客，这里仅仅是用于测试你的GitHub Pages是否成功创建，因此可以略过这个步骤。另外，GitHub Pages有一定的延迟，在你对username.github.io这个仓库做出修改之后，过一段时间才会在username.github.io这个网站上出现你修改后的内容。

#### 1. 在terminal中输入:

```
$ git clone https://github.com/username/username.github.io
```

#### 2. 进入你创建的文件夹:

```
$ cd username.github.io
```

#### 3. 增加一个index.html:

```
$ echo "Hello World" > index.html
```

#### 4. Push:

```
$ git add --all
$ git commit -m "Initial commit"
$ git push -u origin master
```

#### 5. 访问username.github.io

访问username.github.io(将username改为你在GitHub上注册的用户名）你就可以看到Hello World字样了，这说明你成功创建了自己的页面，当然现在还没有博客的功能。

## 使用GitCafe Pages创建个人页面

### 创建项目

项目名称要与自己的用户名字相同，比如你的用户名是username，那么项目名称也要是username。

### 测试GitCafe Pages

这里与测试GitHub Pages大同小异，由于不是必要步骤，就不再反复阐述，详细步骤可以访问[Pages相关帮助](https://gitcafe.com/GitCafe/Help/wiki/Pages-相关帮助)。访问GitCafe Pages的网址是：username.gitcafe.io（将username改为你在GitCafe上注册的用户名）。

详情可访问[Pages 相关帮助](https://gitcafe.com/GitCafe/Help/wiki/Pages-相关帮助)。

# 使用Hexo生成博客

详细内容可以看[Hexo的官方文档](https://hexo.io/docs/)，这里也将描述步骤。

## 安装Hexo

执行以下命令

```
$ sudo npm install -g hexo-cli
```

等待一些一定的时间之后出现成功安装的提示后就行了。

如果出现错误，可能是由于网络原因，国内的网络环境大家懂的。我们可以用npm的国内镜像来解决。
执行以下命令

```
$ npm config set registry https://registry.npm.taobao.org
$ npm info underscore （如果上面配置正确这个命令会有字符串response）
```

成功后再输入以下内容即可

```
$ sudo npm install -g hexo-cli
```

安装完成后，进行初始化，在终端中输入

```
$ hexo init <folder>
$ cd <folder>
$ npm install
```

**注：**如果你不输入`<folder>`，则会在当前目录下创建，为了方便描述，我将用**博客文件夹**来描述你init的这个目录。

**提示：**在本文中，以`hexo`开头的命令需要在博客文件夹下执行。
至此，安装工作完成。

## 生成静态页面

在终端中进入博客文件夹（如果已经在博客文件夹下则不用）

```
$ cd <folder>
```
执行如下命令

```
$ hexo generate
```
如此，静态页面创建成功。

## 本地启动

执行如下命令(需要在博客文件夹下)

```
$ hexo server
```

然后在浏览器中输入[http://localhost:4000](http://localhost:4000)即可查看你所生成的页面

## 配置Hexo

用文本编辑工具打开你博客文件夹目录下的`_config.yml`

将deploy的内容改为如下内容并保存(username是你在GitHub和GitCafe注册的用户名)：

```
deploy:
- type: git
  repo: git@github.com:username/username.github.io.git,master
- type: git
  repo: git@gitcafe.com:username/username.git,gitcafe-pages
```

另外你可以看到`config.yml`下有许多属性，该文件也已经做了一定的注释，比如说`title`是你站点的名字，`author`是博主的名称等等，可以按照你的需要更改。

## 使用Hexo写博客

执行如下命令新建一篇文章，`title`是你保存文件的名称。

```
$ hexo new "title"
```

然后你就可以打开生成的文件进行编辑了，所生成的文件在你博客目录的source/_posts下，文章采用Markdown编写。

关于Markdown语法，可以参考[Markdown 语法说明(简体中文版)](http://wowubuntu.com/markdown/basic.html)。

## 将博客部署到GitHub和GitCafe

每次对文件夹进行了修改，都需要重新执行generate命令，在你博客文件夹下执行

```
$ hexo generate
```
成功生成页面后再执行

```
$ hexo deploy
```
成功后你就把博客部署到GitHub和GitCafe上了。

前面说到过，Pages有一定的延迟，一段时间后再访问 http://username.github.io 或者 http://username.gitcafe.io 你就能看到自己生成的页面了。

## 部署步骤

以后每次部署，可以按照以下步骤进行（都是在博客文件夹下执行）

```
$ hexo clean
$ hexo generate
$ hexo deploy
```

## 使用主题

博客创建成功了，自然少不了主题，我目前所使用的主题是NexT。

详细步骤可以浏览[NexT主题官方文档](http://theme-next.iissnan.com)，里面做了详细的解释，这里不再赘述。

至此，独立博客建立完成，但还不完美，因为现在必须在浏览器中输入你的Pages页面，当然，你的博客已经可以使用了，一下的内容将讲述如何将自己的域名与Pages页面进行绑定，比如访问我的博客输入[zhuscat.com](http://zhuscat.com)就行了。

更多内容请访问[Hexo的官方文档](https://hexo.io/docs/)查看。

# 注册域名

我是在[GoDaddy](https://www.godaddy.com)在购买的域名，主要原因是可以使用支付宝，进入网站后搜索你想要的域名，如果可以购买的话就按照指引进行购买就行了。

如果不明白如何购买，可以参考[《2013年10月新版godaddy域名注册图文教程》](http://www.admin5.com/article/20131014/527495.shtml)。

# 将独立域名与GitHub Pages和GitCafe Pages进行绑定

## GitHub Pages的设置

在你创建的博客文件夹下的source文件夹中创建一个命名为CNAME的文件(可以使用文本编辑器创建，如记事本），该文件没有扩展名，内容为你申请的域名地址（如zhuscat.com)。

## GitCafe Pages的设置

登陆GitCafe，进入你所创建的项目，点击项目设置->Pages服务->添加你所申请的域名(如zhuscat.com)。

## DNS设置

注册[DNSPod](https://www.dnspod.cn/)，添加域名，并按下图所示设置

**注：**如果没有国内国外选项，则将国内记录分别改为电信，联通，教育网这几个记录，国外则为默认。

![DNSPodSetting](https://i.loli.net/2018/11/17/5befc37a33b9d.png)

其中需要修改 zhuscat.github.io 为你自己的 username.github.io 。

## 修改GoDaddy中的DNS地址

这里的内容参考了[如何搭建一个独立博客——简明 Github Pages与 jekyll 教程](http://cnfeat.com/blog/2014/05/10/how-to-build-a-blog/)

更改 GoDaddy 的 Nameservers 为 DNSPod 的 Nameservers。

1、登陆GoDaddy，点击右上角用户名，点击管理域名(Manage My Domains)

![Manage My Domain](https://i.loli.net/2018/11/17/5befc406a91c0.png)

2、点击页面右方的第二个图标（图片中显示为黑色的）将视图改为列表显示

![Click Button](https://i.loli.net/2018/11/17/5befc45e29853.png)

3、点击域名

![Click Domain Name](https://i.loli.net/2018/11/17/5befc48703edc.png)

4、进入域名详情后，点击Nameservers一栏的Manage

![Domain Detail](https://i.loli.net/2018/11/17/5befc4a0e4be6.png)

4、将 GoDaddy 的 Nameservers 改为 f1g1ns1.dnspod.net 和 f1g1ns2.dnspod.net 并保存

![Nameserver Settings](https://i.loli.net/2018/11/17/5befc4c111a2c.png)

修改生效可能有一定的延迟，一段时间后，你就可以用自己的域名去访问啦！

# 图床

可以使用[七牛](http://www.qiniu.com/)。

至此，你就完成了所有步骤，赶紧你的独立博客之旅吧。

# 更新日志

2015-12-26 第一次更新：修改部分描述，增加了一些提示内容，修改了部分图片。

# 参考资料

1. [如何搭建一个独立博客——简明 Github Pages与 jekyll 教程](http://cnfeat.com/blog/2014/05/10/how-to-build-a-blog/)
2. [HEXO+Github,搭建属于自己的博客](http://www.jianshu.com/p/465830080ea9)
3. [将Hexo部署到GitCafe](http://www.sumrday.com/2014/09-18-Hello-Hexo.html)
4. [同时将博客部署在Github和Gitcafe上，并通过DNSPOD分流](http://ppting.me/2015/02/08/gitcafe/)
5. [使用Github Pages建独立博客](http://beiyuu.com/github-pages/)
