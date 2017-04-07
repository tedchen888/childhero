let Box2d = require('box2dweb-commonjs');
let cfg = require('config');

cc.Class({
    extends: cc.Component,

    properties: {
        cannon_world: {
            default: null,
            serializable: false
        },
        cannon: { //创建一个物理世界的载体，与本身对应
            default: null,
            type: cc.Node
        },
        bodyDef: null,

        groupIndex: -1, //碰撞检测群组id
        angle: 0,
        angularVelocity: 0,
        force_x: 1000, //作用力
        force_y: -1000,
        
        isStart: false
    },

    // use this for initialization
    onLoad: function () {

    },
    setup: function() {
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);
    },
    stopAll: function() {
        this.node.stopAllActions();
    },
    setJumpAction: function () {
        // 跳跃上升
        var jumpUp = cc.moveBy(0.2, cc.p(0, 3)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(0.2, cc.p(0, -3)).easing(cc.easeCubicActionIn());
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },
    playJumpSound: function () {
        // 调用声音引擎播放声音
        //cc.audioEngine.playEffect(this.jumpAudio, false);
    },
    /*
    setup: function() {
        //cc.log('world: '+ this.cannon_world + ' a:'+this.angle.toString() 
        //    + ' lx:' + this.force_x.toString()
        //    + ' ly:' + this.force_y.toString()
        //    + ' av:' + this.angularVelocity.toString());
        
        let visibleSize = cc.director.getVisibleSize();
        this.visibleSize = visibleSize;
       
        let worldPoint = this.convertToWorld();
        
        this.bodyDef = new Box2d.b2BodyDef();  
		this.bodyDef.type = Box2d.b2Body.b2_dynamicBody;
		this.bodyDef.position.Set(worldPoint.x, worldPoint.y);  //设置物体的初始位置
		this.bodyDef.angle = 0;  //弧度
		this.bodyDef.linearVelocity = new Box2d.b2Vec2(0, 0);  //线速度
		this.bodyDef.angularVelocity = 0;  //角速度
        this.bodyDef.userData = "cannon";
        //this.bodyDef.filter.groupIndex = this.groupIndex;

		this.cannon = this.cannon_world.world.CreateBody(this.bodyDef);
			
	    var fixDef = new Box2d.b2FixtureDef();
		fixDef.shape = new Box2d.b2PolygonShape();  //SetAsArray
		fixDef.shape.SetAsBox(this.node.width/cfg.SCALE,this.node.height/cfg.SCALE);
        
		fixDef.density = 1.0; //密度
		fixDef.friction = 0.5;  //摩擦力
		fixDef.restitution = 0.8; //弹性
		
		this.cannon.CreateFixture(fixDef);
        
        //body.SetMassFromShapes();//根据形状计算质量        

        this.isStart = true;
    },
    
    convertToWorld: function(){
        let leftDownPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        return cc.v2(leftDownPos.x/cfg.SCALE,(this.visibleSize.height-leftDownPos.y)/cfg.SCALE);
    },
    
    convertToNode: function(worldPoint){
        let leftUpPos = cc.pMult(worldPoint,cfg.SCALE);
        let leftDownPosInWorldPixel = cc.v2(leftUpPos.x,(this.visibleSize.height-leftUpPos.y));
        let leftDownPos =  this.node.parent.convertToNodeSpaceAR(leftDownPosInWorldPixel);
        return leftDownPos;
    },
    
    update: function (dt) {
        if (this.isStart) {
            this.node.position = this.convertToNode(this.cannon.GetPosition());
            this.node.rotation = this.cannon.GetAngle()*cfg.RADTODEG%360-180;
        }
    },
    destoryMy: function() {
        this.cannon_world.world.DestroyBody(this.bodyDef);
    }
    */

});


