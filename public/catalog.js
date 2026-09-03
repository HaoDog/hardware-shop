(function () {
  const parts = [
    { id: 'smart-board', name: '智能版高性能主控板', priceCents: 24000, unit: '块', summary: '板载彩屏、摄像头、麦克风和多种环境感知，课程智能核心。', why: '光线、室温、语音、视觉都在这块智能版主控上完成。', image: './course-shop/k10-board.jpg', maxQty: 4 },
    { id: 'io-extender', name: '开发专用扩展板', priceCents: 7500, unit: '块', summary: '引出接口，稳定接舵机、灯带、风扇和外接传感器。', why: '做执行件和多路传感时，开发专用扩展更稳。', image: './course-shop/k10-io-extender.jpg', maxQty: 4 },
    { id: 'usb-c-cable', name: '开发专用数据线', priceCents: 2000, unit: '根', summary: '给智能版主控供电并上传程序，必须能传数据。', why: '上课烧录和充电都靠它。', image: './course-shop/usb-c-cable.jpg', maxQty: 6 },
    { id: 'lipo-battery', name: '高性能锂电池', priceCents: 3600, unit: '块', summary: '插上主控电池口，作品可以离开电脑独立演示。', why: '展演和家庭服役需要脱机供电。', image: './course-shop/lipo-battery.jpg', maxQty: 4 },
    { id: 'servo', name: '高性能微型舵机', priceCents: 1600, unit: '个', summary: '让守护站做出指针、开合或轻轻推一下的动作。', why: '接在验证过的扩展板舵机口。', image: './course-shop/servo-sg90.jpg', maxQty: 8 },
    { id: 'rgb-strip', name: '智能幻彩灯带', priceCents: 2000, unit: '条', summary: '用颜色告诉大家：正常、关注还是要行动。', why: '教室环境信号塔和舒适小屋的可见回应。', image: './course-shop/rgb-strip.jpg', maxQty: 6 },
    { id: 'mini-fan', name: '智能散热风扇', priceCents: 1600, unit: '个', summary: '室温偏高时轻轻吹一下。', why: '低压驱动，经扩展板控制。', image: './course-shop/mini-fan.jpg', maxQty: 4 },
    { id: 'ultrasonic', name: '高性能超声波测距模块', priceCents: 1600, unit: '个', summary: '感知有没有人靠近，适合教室门口或休息角。', why: '默认优先物体和距离，不采集人脸。', image: './course-shop/ultrasonic.jpg', maxQty: 4 },
    { id: 'pir-sensor', name: '智能人体感应模块', priceCents: 1600, unit: '个', summary: '判断“有人经过”，给门卫或休息角一个简单输入。', why: '只判断有没有人，不做身份识别。', image: './course-shop/pir-sensor.jpg', maxQty: 4 },
    { id: 'soil-probe', name: '智能土壤湿度探针', priceCents: 1100, unit: '个', summary: '看看土壤是偏干还是刚好，提醒你去浇水。', why: '课程不做自动浇水。', image: './course-shop/soil-probe.jpg', maxQty: 4 },
    { id: 'temp-module', name: '高性能外接温度模块', priceCents: 2200, unit: '个', summary: '把探测点放到房间另一侧，和板载传感器对比。', why: '给想做双点判断的赛道。', image: './course-shop/extra-dht.jpg', maxQty: 4 },
    { id: 'water-level', name: '智能水位传感器', priceCents: 1400, unit: '个', summary: '判断容器里的水是少了、刚好还是快满了。', why: '只做水位提醒，不接自动加水。', image: './course-shop/water-level.jpg', maxQty: 4 },
    { id: 'rain-sensor', name: '智能雨滴传感器', priceCents: 1100, unit: '个', summary: '感知有没有水滴落到探测面，适合窗边或室外檐口。', why: '用来做天气提醒，不采集影像。', image: './course-shop/rain-sensor.jpg', maxQty: 4 },
    { id: 'pin3-cable', name: '开发专用信号线', priceCents: 600, unit: '根', summary: '三线接口，用来接扩展模块和传感器。', why: '外接传感器和执行器都靠它。', image: './course-shop/jumper-pack.jpg', maxQty: 8 },
    { id: 'print-shell', name: '定制3D打印外壳', priceCents: 4500, unit: '件', summary: '按已验证孔位打印的守护站外壳，不是上课必选项。', why: '纸板和积木也能完成展演。', image: './course-shop/print-shell.jpg', maxQty: 2 },
  ].map((item) => ({ ...item, shelf: 'part' }));

  const listPriceCents = parts.reduce((sum, item) => sum + item.priceCents, 0);
  const kit = {
    id: 'basic-kit',
    name: '基础款套餐',
    priceCents: listPriceCents,
    listPriceCents,
    unit: '套',
    shelf: 'kit',
    summary: '把清单上的元器件一次配齐。点开可看全部内容，套餐价就是全部散件合计。',
    why: '适合想一次带回家继续做的同学，省去按件挑选。',
    image: './course-shop/guardian-home-kit.jpg',
    maxQty: 3,
    contents: parts.map((item) => ({
      id: item.id,
      name: item.name,
      priceCents: item.priceCents,
      unit: item.unit,
    })),
  };

  window.HW_SHOP = {
    shelves: [
      { id: 'kit', label: '套装', recommend: true, hint: '只保留基础款套餐，点开可看全部内容' },
      { id: 'part', label: '散件', hint: '主控、传感器和执行件按件挑选' },
    ],
    products: [kit, ...parts],
    yuan(cents) {
      const value = Math.round(cents) / 100;
      return '¥' + value.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    },
    find(id) {
      return this.products.find((item) => item.id === id);
    },
  };
})();
