let Box2d = require('box2dweb-commonjs');
let cfg = require('config');

cc.Class({
    extends: cc.Component,

    properties: {
        cannon_world: {
            default: null,
            serializable: false
        },
        ground: { //创建一个物理世界的载体，与本身对应
            default: null,
            type: cc.Node
        },
        
        angle: 0,
        angularVelocity: 0,
        force_x: 1000, //作用力
        force_y: -1000,
        
    },

    // use this for initialization
    onLoad: function () {
    
    },
    
    setup: function() {
        /*
            //1.首先要创建一个物体定义
            var bodydef = new Box2d.b2BodyDef();
            // 物体类型定义，基本上常用的有两种定义：b2_staticBody 静态物体; .b2_dynimacBod动态物体
            bodydef.type = Box2d.b2Body.b2_staticBody;
            //定义物体位置。也可以这样 bodydef.position.x=10; bodydef.position.y=10;
            bodydef.position.Set(worldPoint.x, worldPoint.y);
            //定义用户自己的数据
            //bodydef.userData=*;
            
            //2 其次要定义一个材质定义
            var fixDef = new Box2d.b2FixtureDef();
            fixDef.density = 0; // desity 密度，如果密度为0或者null，该物体则为一个静止对象
            fixDef.friction = 0.5; //摩擦力（0~1）
            fixDef.restitution = 0.2;// 弹性（0~1）
            
            //3 为材质定义添加一个形状
            
            //b2PolygonShape多边形；b2CircleSharp圆形设置该材质形状的大小；
            //b2PolygonShape对应着SetAsBox(halfWidth,halfHeight)方法设置半长半宽，值//得注意的是Box2d中的单位//是米，一米是30像素，
            //如果自定义多边形可以使用一个SetAsArray(vertexArray,vertexCount)，其中vertexArray为顶点矢量（b2Vec2）数组，vertexCount为顶点数，最多8个。
            //b2CircleSharp对应的设置属性为SetRadius(radius);
            
            fixDef.shape = new Box2d.b2PolygonShape();
            fixDef.shape.SetAsBox(this.ground.width / 2 / cfg.SCALE, this.ground.height / 2 / cfg.SCALE);
        */
        let visibleSize = cc.director.getVisibleSize();
        this.visibleSize = visibleSize;
        
        let worldPoint = this.convertToWorld();
        
        var bodyDef = new Box2d.b2BodyDef();  
		bodyDef.type = Box2d.b2Body.b2_staticBody;
		bodyDef.position.Set(worldPoint.x, worldPoint.y);  //设置物体的初始位置
		
		this.ground = this.cannon_world.world.CreateBody(bodyDef);
			
	    var fixDef = new Box2d.b2FixtureDef();
		fixDef.shape = new Box2d.b2PolygonShape();  //SetAsArray
		fixDef.shape.SetAsBox(this.node.width/cfg.SCALE,this.node.height/cfg.SCALE);
        
		fixDef.density = 1.0; //密度
		fixDef.friction = 0.5;  //摩擦力
		fixDef.restitution = 0.8; //弹性
		
		this.ground.CreateFixture(fixDef);
        
        //body.SetMassFromShapes();//根据形状计算质量        
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
            this.node.position = this.convertToNode(this.ground.GetPosition());
            this.node.rotation = this.ground.GetAngle()*cfg.RADTODEG%360-180;
        }
    },
});


