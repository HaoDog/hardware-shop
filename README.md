# 智能硬件商店 · 轻量机独立站

不走探索家 PR。和班级管理面板同一台腾讯云轻量，独立端口，互不影响。

## 线上地址

- 本机访问：`http://122.51.86.69:4101`
- 需要先在轻量控制台安全组放行 **TCP 4101**

## 在 OrcaTerm 里部署（复制整段）

```bash
sudo mkdir -p /opt/hardware-shop
sudo chown ubuntu:ubuntu /opt/hardware-shop
cd /opt
rm -rf /tmp/hardware-shop-src
git clone --depth 1 https://github.com/HaoDog/hardware-shop.git /tmp/hardware-shop-src
rsync -a --delete /tmp/hardware-shop-src/ /opt/hardware-shop/
cd /opt/hardware-shop
pm2 delete hardware-shop >/dev/null 2>&1 || true
pm2 start server.mjs --name hardware-shop
pm2 save
pm2 status hardware-shop
```

浏览器打开：`http://122.51.86.69:4101`
