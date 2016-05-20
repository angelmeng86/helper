// 初始化 param1：应用 id、param2：应用 key
AV.initialize('vBV3UIdIQAXqLOIDT2WYgVnB-gzGzoHsz', 'hGKL7DRGL3YkjahwGLY8ecf2');

// 创建AV.Object子类.
var Overtime = AV.Object.extend('Overtime');
var Workstat = AV.Object.extend('Workstat');
var Diary = AV.Object.extend('Diary');
var DiaryFile = AV.Object.extend('DiaryFile');
