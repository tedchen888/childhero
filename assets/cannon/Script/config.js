

var Config = {    
    SCALE: 30,  //1��=30����
    DEGTORAD: (Math.PI / 180),  //������Ƕȵ�ת��
    RADTODEG: (180 / Math.PI),
    
    angle: 45,
    linearVelocity: 0,
    angularVelocity: -10,
    
    //setPlaneNum: function(num) {
    //    this.planeNum = num;
    //},
    force: 1500,
    force_x: 1000,  
    force_y: -1000,  
};
module.exports = Config;
