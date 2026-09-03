# 智能硬件商店 · 轻量机独立站

不走探索家 PR。和班级管理面板同一台腾讯云轻量，独立端口，互不影响。

## 正式地址（以后都更新到这里）

- **https://explorer.nxcode.net/hw-shop/**
- 扫码、发给家长和学生，只用这个 HTTPS 链接
- 本机备用：`http://127.0.0.1:4101`（nginx 反代到这里，安全组 4101 可不开给公网）

## 以后每次改完怎么上线

代码先推到 `HaoDog/hardware-shop`。这台上海机常常连不上 GitHub，用 jsDelivr 覆盖 `/opt/hardware-shop` 后重启即可。页面立刻出现在正式地址，不用再改 nginx。

```bash
cd /opt/hardware-shop
# 把 HASH 换成这次提交，例如 c28b778
HASH=c28b778
curl -fsSL "https://cdn.jsdelivr.net/gh/HaoDog/hardware-shop@${HASH}/public/catalog.js" -o public/catalog.js
curl -fsSL "https://cdn.jsdelivr.net/gh/HaoDog/hardware-shop@${HASH}/public/index.html" -o public/index.html
curl -fsSL "https://cdn.jsdelivr.net/gh/HaoDog/hardware-shop@${HASH}/public/shop.css" -o public/shop.css
curl -fsSL "https://cdn.jsdelivr.net/gh/HaoDog/hardware-shop@${HASH}/public/shop.js" -o public/shop.js
curl -fsSL "https://cdn.jsdelivr.net/gh/HaoDog/hardware-shop@${HASH}/server.mjs" -o server.mjs
pm2 restart hardware-shop
```

验收：`https://explorer.nxcode.net/hw-shop/?v=新数字`

## 首次部署（已完成，一般不用再跑）

```bash
sudo mkdir -p /opt/hardware-shop
sudo chown ubuntu:ubuntu /opt/hardware-shop
pm2 start /opt/hardware-shop/server.mjs --name hardware-shop
pm2 save
```

`explorer.conf` 里已有 `/hw-shop/` → `127.0.0.1:4101`。
