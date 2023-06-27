---
title: 使用虚拟机搭建 K8S 集群
date: 2023-04-09 10:09:00
category: 学以致用
tags:
- K8S
---

搭建环境：Macbook Pro（M1 Pro），因此该篇文章同时适用于基于 Apple Silicon 的 macOS

虚拟机使用了这个软件：[UTM | Virtual machines for Mac (getutm.app)](https://mac.getutm.app/)

安装 Ubuntu Server for ARM（22.04.2），我起了三个虚拟机

安装完成后，重启之后，一直黑屏有个光标在闪，去设置里面把 USB Drive 拖到最下面再启动就行了（[Ubuntu 20.04 fails to soft-reboot after install · Issue #3344 · utmapp/UTM (github.com)](https://github.com/utmapp/UTM/issues/3344)）

然后就可以在宿主机中用 SSH 访问安装好的虚拟机了：

```sh
ssh username@hostname
```

然后就开始配置了，如果网络不通的地方，可以使用镜像，或者你可以配置代理，比如：

- GitHub Raw 镜像：[Github RAW 加速服务 | GitMirror](https://gitmirror.com/raw.html)
- GitHub：[https://gitee.com/mirrors](https://gitee.com/mirrors)、[网达极客社区 (gitclone.com)](https://gitclone.com/)

因为这部分配置会随着时间发生变化，所以最好是在网上查一下

## 前置操作

所有虚拟机中都做了下面相同的配置

### Shell

把虚拟机的 Shell 改成 zsh + OMZ，原本的不好用：

```sh
sudo apt install zsh

chsh -s /bin/zsh

wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
```

注：如果这里用了 gitee 的 mirror，要先下载 `install.sh`，然后更改一下里面的内容：

```
REPO=${REPO:-mirrors/oh-my-zsh}
REMOTE=${REMOTE:-https://gitee.com/${REPO}.git}
```

安装好，还需要改一下 `.zshrc` 的配置，不然按删除键是空格：

```
export TERM="xterm"
```

### 关闭 swap

```shell
sudo swapoff -a

sudo rm -f /swap.img

sudo vim /etc/fstab
# 注释
# /swap.img
```

为什么关闭 swap？搜了一下网上是这样说的：

> Swap 是 Linux 系统用来临时存储内存过剩数据的空间。尽管 SWAP 可以增加系统的可用内存，但在运行 Kubernetes 时，建议禁用 swap。这是因为当内存不足时，Linux 会将一部分内存存储到磁盘交换文件中，从而导致性能下降并可能导致应用程序崩溃。
> 
> 此外，在执行大型容器操作时，内存压力可能很高。如果系统启用了 swap，那么可能会有一些容器被停止或无法正常工作。为避免这种情况，建议在 Kubernetes 节点上禁用 swap。

在 Kubernetes 的官方文档（[安装 kubeadm | Kubernetes](https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)）中也说到：

> 禁用交换分区。为了保证 kubelet 正常工作，你**必须**禁用交换分区。

## 安装 Docker

以下内容来自官网：

```sh
sudo apt-get update

sudo apt-get install \
  ca-certificates \
  curl \
  gnupg

sudo mkdir -m 0755 -p /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo service docker start
```

更改 `node /etc/containerd/config.toml` 配置，不然有问题，我改过的完整配置文件在这里[/etc/containerd/config.toml (github.com)](https://gist.github.com/zhuscat/9f10dee3ac36634997ba1a5418eb4767)：

```toml
disabled_plugins = []
[plugins]
  [plugins."io.containerd.grpc.v1.cri"]
    sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.6"
  [plugins."io.containerd.grpc.v1.cri".containerd]
    [plugins."io.containerd.grpc.v1.cri".containerd.runtimes]
      [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
        [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
          SystemdCgroup = true
```

主要的改动是：
1. 我默认这个文件里 `disabled_plugins = ["cri"]`，导致 `kubeadm init` 的时候报错 `container runtime is not running`
2. 把 `sandbox_image` 改成了国内的镜像，解决网络问题：`registry.aliyuncs.com/google_containers/pause:3.6`，不然 `kubeadm init` 的时候会超时
3. 把 `[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]` 的 `SystemdCgroup` 改成了 `true`，这是在这里说的：[容器运行时 | Kubernetes](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#containerd)

改好要重启一下：

```sh
sudo systemctl restart containerd
```

## 安装 kubeadm

我用了阿里云的镜像：

```shell
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | sudo apt-key add - 
sudo vim /etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
sudo systemctl enable kubelet && sudo systemctl start kubelet
```

## 初始化

「初始化」仅在 master 节点操作

```sh
sudo kubeadm init --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers --v=5
```

成功后按照提示执行一些命令即可：

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

另外还会输出一段加入集群的命令，这是其他虚拟机加入集群要使用的：

```
kubeadm join xxx
```

## 部署网络插件

「部署网络插件」仅在 master 节点操作

现在执行 `kubectl get nodes`，节点还是 `NotReady` 的状态，需要部署网络插件，我部署的是 Calico：

```shell
curl https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml -O
kubectl apply -f calico.yaml
```

然后节点状态就变成 Ready 了

## 配置 Worker 节点

同样参照「安装 Docker」和「安装 kubeadm」，然后执行前面说到的 `join` 命令就可以了

## kubectl 补全

`.zshrc` 中加这个：

```sh
source <(kubectl completion zsh)
```

## 测试

最后测试一下集群能不能正常部署 Pod，创建一个 `nignx-deployment.yaml` 文件：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.23.4
        ports:
        - containerPort: 80
```

执行：

```sh
kubectl apply -f nginx-deployment.yaml
```

然后执行 `kubectl get pods` 看看，如果状态都变成 Running 就可以了

## 参考

尽量参考官方文档即可，下面一些文章主要是含有一些镜像配置相关：

1. [重新安装k8s套件 - Lewin's Blog (lewinblog.com)](https://lewinblog.com/blog/page/2023/230319-install-k8s.md)
2. [【工具使用】Mac M1 UTM虚拟机安装 - 大梦想家 - 博客园 (cnblogs.com)](https://www.cnblogs.com/dreamfly2016/p/15990864.html)
3. [【K8S】UTM虚拟机安装K8S集群 - 大梦想家 - 博客园 (cnblogs.com)](https://www.cnblogs.com/dreamfly2016/p/16000693.html)
4. [如何在Ubuntu 20.04种配置静态IP地址 | linux资讯 (linux265.com)](https://linux265.com/news/6376.html)
5. [MAC UTM 虚拟机使用 - Blog by Jonathan Dai (xenojoshua.com)](https://xenojoshua.com/posts/2021/10/mac-utm)
6. [kubernetes安装（国内环境） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/46341911)
7. [国内环境Ubuntu-20.04安装Kubernetes-1.23.9 - ClownFish的博客 - 做难做的事](https://www.clownfish.site/post/2022-08-09-%E5%9B%BD%E5%86%85%E7%8E%AF%E5%A2%83ubuntu-20.04%E5%AE%89%E8%A3%85kubernetes-1.23.9/)
