let Box2d = require('box2dweb-commonjs');
let cfg = require('config');

cc.Class({
    extends: cc.Component,

    properties: {
        cannon_world: {
            default: null,
            serializable: false
        },
        bullet: { //创建一个物理世界的载体，与本身对应
            default: null,
            type: cc.Node
        },
        bodyDef: null,
        
        groupIndex: -1, //碰撞检测群组id
        angle: 45,
        angularVelocity: -10,
        force_x: 1000, //作用力
        force_y: -1000,
        
        isStart: false
    },

    // use this for initialization
    onLoad: function () {
    },
    
    onFire: function() {
        //cc.log('world: '+ this.cannon_world + ' a:'+this.angle.toString() 
        //    + ' lx:' + this.force_x.toString()
        //    + ' ly:' + this.force_y.toString()
        //    + ' av:' + this.angularVelocity.toString());
        
        let visibleSize = cc.director.getVisibleSize();
        this.visibleSize = visibleSize;
                
        let worldPoint = this.convertToWorld();
        
        this.bodyDef = new Box2d.b2BodyDef();  
		this.bodyDef.type = Box2d.b2Body.b2_dynamicBody;
		this.bodyDef.position.Set(worldPoint.x,worldPoint.y);  //设置物体的初始位置
		this.bodyDef.angle = this.angle * cfg.DEGTORAD;  //角度
		this.bodyDef.linearVelocity = new Box2d.b2Vec2(0, 0);  //线速度
		this.bodyDef.angularVelocity = this.angularVelocity;  //角速度
		this.bodyDef.userData = "bullet";
        ////设置碰撞群组 整数的时候总是检测碰撞！当为负数的时侯总是不检测同一群组，需要注意的是不同的索引依然会发生碰撞检测比如-1组合-2组依然会！
        //this.bodyDef.filter.groupIndex = this.groupIndex;
        
		//创建一个炮弹
		var bullet = this.cannon_world.world.CreateBody(this.bodyDef);
		this.bullet = bullet;
			
	    var fixDef = new Box2d.b2FixtureDef();
		//fixDef.shape = new Box2d.b2PolygonShape();  //SetAsArray
		//fixDef.shape.SetAsBox(this.node.width/2/cfg.SCALE,this.node.height/2/cfg.SCALE);
        fixDef.shape = new Box2d.b2CircleShape();
		fixDef.shape.SetRadius(this.node.width/2/cfg.SCALE);

		fixDef.density = 1.0; //密度
		fixDef.friction = 0.5;  //摩擦力
		fixDef.restitution = 0.8; //弹性
		
		bullet.CreateFixture(fixDef);
        
        var force = new Box2d.b2Vec2(this.force_x, this.force_y);
        var force_point = bullet.GetWorldCenter();//new Box2d.b2Vec2(0, 0);  //GetWorldPoint(Box2d.b2Vec2(1,1))不同的边会导致旋转
		bullet.ApplyForce(force, force_point); //施加外力 ，循序渐进 //速度，叠加——ApplyImpulse// 一触即发——SetLinearVelocity
        
        //body.SetMassFromShapes();//根据形状计算质量
        
		this.node.on('mousedown',function(){
		    this.bullet.ApplyImpulse(new Box2d.b2Vec2(5,0),this.bullet.GetWorldCenter());
		},this);

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
            this.node.position = this.convertToNode(this.bullet.GetPosition());
            this.node.rotation = this.bullet.GetAngle()*cfg.RADTODEG%360-180;
        }
    },
    
    destoryMy: function() {
        this.cannon_world.world.DestroyBody(this.bodyDef);
    }
});


