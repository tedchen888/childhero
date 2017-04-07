let Box2d = require('box2dweb-commonjs');
let cfg = require('config');

cc.Class({
    extends: cc.Component,

    properties: {
        world:{
            default: null,
            visible: false,
        }
    },

    // use this for initialization
    onLoad: function () {
        
        //this.world = new Box2d.b2World(
        //        //new Box2d.b2Vec2(0, 1.0), 
        //        new Box2d.b2Vec2(0, 9.8),
        //        true
        //    );
        //    
        //var worldAABB = new Box2d.b2AABB();
        //worldAABB.minVertex.Set(-1000, -1000);  //左上角
        //worldAABB.maxVertex.Set(1000, 1000);    //右下角
        //
        ////2. 定义重力 - 2D向量 - b2Vec2 类 （x,y）
        //var gravity = new Box2d.b2Vec2(0, 300);
        //
        ////3. 忽略休眠的物体
        //var doSleep = true;
        //
        ////4. 创建世界 - b2World
        //this.world = new Box2d.b2World(worldAABB, gravity, doSleep);
    },
    
    createWorld: function() {
        this.world = new Box2d.b2World(
                //new Box2d.b2Vec2(0, 1.0), 
                new Box2d.b2Vec2(0, 9.8),
                true
            );
    },
    
    // called every frame
    update: function (dt) {
        this.world.Step(dt, 10, 10);
        this.world.ClearForces();
    },
});
