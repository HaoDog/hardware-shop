window.HW_SHOP = {
  shelves: [
    { id: 'kit', label: '套装', recommend: true, hint: '整机带回包和增强执行包放在一起' },
    { id: 'part', label: '散件', hint: '主控、传感器和执行件按件挑选' },
  ],
  products: [
    { id: 'home-kit', name: '守护站整机带回包', priceCents: 22800, unit: '套', shelf: 'kit', summary: 'K10 + 数据线 + 电池 + 扩展板，回家还能继续改自己的守护站。', why: '课堂能做完；这一套是把作品带回家继续用的标准设备包。', image: './course-shop/guardian-home-kit.jpg', maxQty: 3 },
    { id: 'enhance-pack', name: '守护站增强执行包', priceCents: 8900, unit: '套', shelf: 'kit', summary: '扩展板 + 舵机 + 灯带 + 风扇 + 线材，比单买少一点。', why: '第6课以后要接执行件时，这一套能一次配齐。', image: './course-shop/enhance-pack.jpg', maxQty: 3 },
    { id: 'k10-board', name: '行空板 K10 主控板', sku: 'DFR0992', priceCents: 15800, unit: '块', shelf: 'part', summary: '板载彩屏、摄像头、麦克风、喇叭、光线、温湿度和 RGB，课程智能核心。', why: '前5课的光线、室温、语音、视觉都在这块板上完成。', image: './course-shop/k10-board.jpg', maxQty: 4 },
    { id: 'usb-c-cable', name: 'Type-C 数据线', priceCents: 1500, unit: '根', shelf: 'part', summary: '给 K10 供电并上传程序，必须能传数据。', why: '上课烧录和充电都靠它。', image: './course-shop/usb-c-cable.jpg', maxQty: 6 },
    { id: 'lipo-battery', name: '3.7V 锂电池（PH2.0）', priceCents: 2800, unit: '块', shelf: 'part', summary: '插上 K10 电池口，作品可以离开电脑独立演示。', why: '展演和家庭服役需要脱机供电。', image: './course-shop/lipo-battery.jpg', maxQty: 4 },
    { id: 'io-extender', name: 'K10 IO 扩展板', sku: 'DFR1231', priceCents: 3900, unit: '块', shelf: 'part', summary: '引出接口，稳定接舵机、灯带、风扇和外接传感器。', why: '舵机必须走扩展板的 5V 口。', image: './course-shop/k10-io-extender.jpg', maxQty: 4 },
    { id: 'servo-sg90', name: '180° 微型舵机', priceCents: 1200, unit: '个', shelf: 'part', summary: '让守护站做出指针、开合或轻轻推一下的动作。', why: '必须接在验证过的扩展板舵机口。', image: './course-shop/servo-sg90.jpg', maxQty: 8 },
    { id: 'rgb-strip', name: 'WS2812 短灯带', priceCents: 1800, unit: '条', shelf: 'part', summary: '用颜色告诉大家：正常、关注还是要行动。', why: '教室环境信号塔和舒适小屋的可见回应。', image: './course-shop/rgb-strip.jpg', maxQty: 6 },
    { id: 'mini-fan', name: '5V 低压小风扇', priceCents: 1500, unit: '个', shelf: 'part', summary: '室温偏高时轻轻吹一下。', why: '必须低压、经扩展板驱动。', image: './course-shop/mini-fan.jpg', maxQty: 4 },
    { id: 'jumper-pack', name: 'Gravity 硅胶线套装', priceCents: 1200, unit: '包', shelf: 'part', summary: '10 根 4Pin 硅胶线，用来接扩展模块。', why: '外接传感器和执行器都靠它。', image: './course-shop/jumper-pack.jpg', maxQty: 8 },
    { id: 'ultrasonic', name: '超声波测距模块', priceCents: 2200, unit: '个', shelf: 'part', summary: '感知有没有人靠近，适合教室门口或休息角。', why: '默认优先物体和距离，不采集人脸。', image: './course-shop/ultrasonic.jpg', maxQty: 4 },
    { id: 'pir-sensor', name: '人体红外模块', priceCents: 1600, unit: '个', shelf: 'part', summary: '判断“有人经过”，给门卫或休息角一个简单输入。', why: '只判断有没有人，不做身份识别。', image: './course-shop/pir-sensor.jpg', maxQty: 4 },
    { id: 'soil-probe', name: '土壤湿度探针', priceCents: 1400, unit: '个', shelf: 'part', summary: '看看土壤是偏干还是刚好，提醒你去浇水。', why: '课程不做自动浇水。', image: './course-shop/soil-probe.jpg', maxQty: 4 },
    { id: 'extra-dht', name: '外接温湿度模块', priceCents: 1200, unit: '个', shelf: 'part', summary: '把探测点放到房间另一侧，和板载传感器对比。', why: '给想做双点判断的 B 赛道。', image: './course-shop/extra-dht.jpg', maxQty: 4 },
    { id: 'print-shell', name: '3D 打印外壳（通用规格）', priceCents: 4500, unit: '件', shelf: 'part', summary: '按已验证孔位打印的守护站外壳，不是上课必选项。', why: '纸板和积木也能完成展演。', image: './course-shop/print-shell.jpg', maxQty: 2 },
  ],
};

window.HW_SHOP.yuan = function yuan(cents) {
  const value = cents / 100;
  return Number.isInteger(value) ? '¥' + value : '¥' + value.toFixed(2);
};

window.HW_SHOP.find = function find(id) {
  return window.HW_SHOP.products.find((item) => item.id === id);
};
