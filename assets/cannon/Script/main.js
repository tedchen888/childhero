let Box2d = require('box2dweb-commonjs')
let cfg = require('config');

cc.Class({
    extends: cc.Component,

    properties: {
        cannonWorld: {
            default: null,
            type: require('cannon_world')
        },
        cannon_1: {
            default: null,
            type: cc.Sprite
        },
        cannon_2: {
            default: null,
            type: cc.Sprite
        },
        
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        ground: {
            default: null,
            type: cc.Node
        },
        angle: {
            default: null,
            type: cc.EditBox
        },
        force_linearVelocity: {
            default: null,
            type: cc.EditBox
        },
        angularVelocity: {
            default: null,
            type: cc.EditBox
        },
        
        curPlayer: 'player1', //player1, player2
        gameState: 'begin',   //begin, fire, end
        
        score1: 0,
        score2: 0,
        
        display_score1: {
            default: null,
            type: cc.Label
        },
        display_score2: {
            default: null,
            type: cc.Label
        },
        fireAudio: {
            default: null,
            url: cc.AudioClip
        },
        explodeAudio: {
            default: null,
            url: cc.AudioClip
        },
        winOneAudio: {
            default: null,
            url: cc.AudioClip
        },
    },

    // use this for initialization
    onLoad: function () {
        this.cannon_1.node.on(cc.Node.EventType.TOUCH_END, this.fire1, this);
        this.cannon_2.node.on(cc.Node.EventType.TOUCH_END, this.fire2, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.changeCannonAngle, this);
        
        this.curPlayer = 'player2';
        this.nextGame();
        
        //在物理世界中创建地面
        this.createBox2dWorld();
        //this.createGround();
    },
    
    createBox2dWorld: function() {
        this.cannonWorld.createWorld();
        //var contactListener = new Box2d.b2ContactListener();
        //contactListener.BeginContact = this.beginContact;
        //contactListener.EndContact   = this.endContact;
        //contactListener.PreSolve     = this.preSolve;
        //contactListener.PostSolve    = this.postSolve;
        //this.cannonWorld.SetContactListener(contactListener);
    },
    beginContact: function(contact){
      if(contact.GetFixtureA().GetBody().GetUserData() == "bullet" || contact.GetFixtureB().GetBody().GetUserData() == "cannon"){
            var ball = contact.GetFixtureB().GetShape();
            ball.SetRadius(ball.GetRadius()*1.2);
        }
    },
    
    nextGame: function() {
        this.cannon_1.node.setPosition(-441, -266);
        this.cannon_1.node.rotation = 0;
        
        this.cannon_2.node.setPosition(429, -266);
        this.cannon_2.node.rotation = 0;
        
        this.gameState = 'begin';
        
        if (this.curPlayer == 'player1') {
            this.curPlayer = 'player2';
            this.cannon_1.getComponent('cannon').stopAll();
            this.cannon_2.getComponent('cannon').setup();
        } else {
            this.curPlayer = 'player1';
            this.cannon_2.getComponent('cannon').stopAll();
            this.cannon_1.getComponent('cannon').setup();
        }
    },
    
    createGround: function() {
        this.ground.getComponent('ground').cannon_world = this.cannonWorld;
        this.ground.getComponent('ground').setup();
    },
    
    createBullet: function(x, y, roation, forceDirect) {
        //获取配置
        cfg.angle = parseInt(this.angle.string);
        cfg.force = parseInt(this.force_linearVelocity.string);
        cfg.angularVelocity = parseInt(this.angularVelocity.string);
        //对发射力加随机值
        cfg.force += parseInt(cc.random0To1() * 500);
        
        var bullet = cc.instantiate(this.bulletPrefab);
        this.bullet = bullet;
        this.node.addChild(bullet);
        
        bullet.setPosition(x, y);
        bullet.getComponent('bullet_js').cannon_world = this.cannonWorld;
        bullet.getComponent('bullet_js').angle = cfg.angle;
        bullet.getComponent('bullet_js').angularVelocity = cfg.angularVelocity;
        bullet.getComponent('bullet_js').groupIndex = -1; //碰撞群组

         //-55~30 up->right
        //roation=0, force_x=1000, force_y=0;
        //roation=-60, force_x=0, force_y=-1000;
        if (roation === 0) {
            cfg.force_x = cfg.force;
            cfg.force_y = 0; 
        } else if (roation < 0) {
            var tmp = -(cfg.force * roation / 90);
            cfg.force_x = cfg.force - tmp;
            cfg.force_y = -tmp; 
        }

        cc.log('roation:'+roation + ' forcex:' + cfg.force_x + ' forcey:' + cfg.force_y);
        bullet.getComponent('bullet_js').force_x = cfg.force_x * forceDirect;
        bullet.getComponent('bullet_js').force_y = cfg.force_y;
        bullet.getComponent('bullet_js').onFire();
    },
    
    fire1: function (event) {
        if (this.gameState != 'begin' || this.curPlayer != 'player1') {
            return;
        }
        
        //计算位置
        var c = Math.abs(this.cannon_1.node.width);
        var roation = this.cannon_1.node.rotation;
        var roation_d = Math.abs(roation * cfg.DEGTORAD);
        
        var a = c * Math.sin(roation_d);
        var y = this.cannon_1.node.y + a;
        var x = this.cannon_1.node.x + Math.sqrt(c * c - Math.abs(a * a)); //a^2 + b^2 = c^2
        
        cc.log('width:' + c + ' x:' + parseInt(x) + ' y:' + parseInt(y) 
         + ' cx:'+ this.cannon_1.node.x + ' cy:' + this.cannon_1.node.y + ' a:' + parseInt(a)
         + ' roation:' + roation_d)
        this.createBullet(x, y, roation, 1);
        
        cc.audioEngine.playEffect(this.fireAudio, false); 
        
        this.gameState = 'fire';
    },
    
    fire2: function (event) {
        if (this.gameState != 'begin' || this.curPlayer != 'player2') {
            return;
        }
        
        //计算位置
        var c = Math.abs(this.cannon_2.node.width);
        var roation = this.cannon_2.node.rotation;
        var roation_d = Math.abs(roation * cfg.DEGTORAD);
        
        var a = c * Math.sin(roation_d);
        var y = this.cannon_2.node.y + a;
        var x = this.cannon_2.node.x - Math.sqrt(c * c - Math.abs(a * a)); //a^2 + b^2 = c^2
        
        cc.log('width:' + c + ' x:' + parseInt(x) + ' y:' + parseInt(y) 
         + ' cx:'+ this.cannon_2.node.x + ' cy:' + this.cannon_2.node.y + ' a:' + parseInt(a)
         + ' roation:' + roation_d)
        this.createBullet(x, y, roation, -1);
        
        cc.audioEngine.playEffect(this.fireAudio, false); 

        this.gameState = 'fire';
    },
    
    changeCannonAngle: function(event) {
        if (this.curPlayer == 'player1') {
            let startX = parseInt(event.getStartLocation().x);
            let startY = parseInt(event.getStartLocation().y);
            let preX = parseInt(event.getPreviousLocation().x);
            let preY = parseInt(event.getPreviousLocation().y);
            let thisX = parseInt(event.getLocation().x);
            let thisY = parseInt(event.getLocation().y);
            let disX = parseInt(event.getDelta().x);
            let disY = parseInt(event.getDelta().y);
            //cc.log('move start:' + startX + ','+ startY
            //    + ' pre location:' + preX+','+preY
            //    +' this location:' + thisX+','+thisY
            //    +' distance:' + disX +','+ disY);
            if (disX < 0) {
                this.cannon_1.node.rotation -= 3;
            } else if (disY < 0) {
                this.cannon_1.node.rotation += 3;
            }
            
            if (this.cannon_1.node.rotation < -60) {
                this.cannon_1.node.rotation = -60;
            } else if (this.cannon_1.node.rotation > 0) {
                this.cannon_1.node.rotation = 0;
            }
        } 
        else {
            let disX = parseInt(event.getDelta().x);
            let disY = parseInt(event.getDelta().y);
            cc.log('disX:' + disX + ' disy:' + disY)
            if (disX > 0) {
                this.cannon_2.node.rotation += 3;
            } else if (disX < 0) {
                this.cannon_2.node.rotation -= 3;
            }
            
            if (this.cannon_2.node.rotation > 60) {
                this.cannon_2.node.rotation = 60;
            } else if (this.cannon_2.node.rotation < 0) {
                this.cannon_2.node.rotation = 0;
            }
        }

    },
    
    update: function (dt) {
        if (this.gameState == 'fire') {
            this.checkConfict();
        }
    },
    //碰撞检测
    checkConfict: function() {
        //var manager = cc.director.getCollisionManager();
        //manager.enabled = true;
        //manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;
        var radius = 50;
        
        var bullet = this.node.getChildByName("bullet");
        if (null === bullet) {
            return;
        }
        
        if (this.curPlayer == 'player1') {
            let dist = cc.pDistance(bullet.position, this.cannon_2.node.getPosition());
            if (dist < radius) {
                cc.log('bomb! dist:' + dist);
                this.score1 += 1;
                this.display_score1.string = this.score1.toString();
                
                bullet.getComponent('bullet_js').destoryMy();
                bullet.destroy();
                //play action
                cc.audioEngine.playEffect(this.explodeAudio, false); 
                this.beBombAction(this.cannon_2.node);
            }
            //lose trun to player2
            else if (Math.abs(bullet.x) > this.node.width/2 || Math.abs(bullet.y) > this.node.height/2) { 
                cc.log('lose! turn to player2');
                
                bullet.getComponent('bullet_js').destoryMy();
                bullet.destroy();
                
                this.nextGame();
            }
            
        } else if (this.curPlayer == 'player2') {
            let dist = cc.pDistance(bullet.position, this.cannon_1.node.getPosition());
            if (dist < radius) {
                cc.log('bomb! dist:' + dist);
                this.score2 += 1;
                this.display_score2.string = this.score2.toString();
                
                bullet.getComponent('bullet_js').destoryMy();
                bullet.destroy();
                //play action
                cc.audioEngine.playEffect(this.explodeAudio, false); 
                this.beBombAction(this.cannon_1.node);
            }
            //lose trun to player2
            else if (Math.abs(bullet.x) > this.node.width/2 || Math.abs(bullet.y) > this.node.height/2) { 
                cc.log('lose! turn to player1');
                
                bullet.getComponent('bullet_js').destoryMy();
                bullet.destroy();
                
                this.nextGame();
            }
        }
    },
    endExplode: function() {
        this.nextGame();
    },
    beBombAction: function(mNode) {
        let tmpAction = [];
        var x = mNode.x;
        var y = mNode.y;
        cc.log('action x:' + x + ' y:' + y);
        tmpAction.push(cc.moveBy(0.1, 10, 10));
        tmpAction.push(cc.rotateBy(0.2, -180));
        tmpAction.push(cc.moveBy(0.1, -10, -10));
        var callback = cc.callFunc(this.endExplode, this, mNode);
        tmpAction.push(callback);
        var aAction = cc.sequence(tmpAction);
        mNode.runAction(aAction);
    }
    
    
});
