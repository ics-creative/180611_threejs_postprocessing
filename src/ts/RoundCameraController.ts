/// <reference path="../../typings/threejs/three.d.ts" />

/**
* Cameraクラスインスタンスをマウス、タッチ入力で制御するクラスです。
* ※threeJS用に調整
* @auther Kentaro Kawakatsu
* @author Nozomi Nohara
*/
class RoundCameraController{

    private RAD:number = Math.PI / 180;

    private radiusMin:number;
    private radiusMax:number;
    private radiusOffset:number;
    private gestureRadiusFactor:number;
    //camera
    private radius:number;
    private _theta:number;
    private _oldX:number;
    private _phi:number;
    private _oldY:number;
    private targetTheta:number;
    private targetPhi:number;
    private _camera:THREE.Camera;
    private _stage:any;
    private _target:Float32Array;
    private _identifier:number;
    private isMouseDown:boolean;
    private _isGestureChange:boolean;
    private _oldRadius:number;

    constructor(camera:THREE.Camera, stage:any) {
        //parameter
        this.radiusMin = 3.0;
        this.radiusMax = 5.0;
        this.radiusOffset = 0.1;
        this.gestureRadiusFactor = 1;
        //camera
        this.radius = 2;
        this._theta = 0;
        this._oldX = 0;
        this._phi = 90;
        this._oldY = 0;
        this.targetTheta = 0;
        this.targetPhi = 90;
        this._camera = camera;
        this._stage = stage;
        this._target = new Float32Array([0, 0, 0]);
        this.enable();
        this._upDateCamera();
    }

    enable() {
        document.addEventListener("keydown", (event) => {
            this._keyHandler(event);
        });
        document.addEventListener("mouseup", (event) => {
            this._upHandler(event);
        });
        this._stage.addEventListener("mousedown", (event) => {
            this._downHandler(event);
        });
        this._stage.addEventListener("mousemove", (event) => {
            this._moveHandler(event);
        });
        this._stage.addEventListener("mousewheel", (event) => {
            this._wheelHandler(event);
        });

        //touch
        if ("ontouchstart" in window) {
            this._stage.addEventListener("touchstart", (event) => {
                this._touchStartHandler(event);
            });
            this._stage.addEventListener("touchmove", (event) => {
                this._touchMoveHandler(event);
            });
            document.addEventListener("touchend", (event) => {
                this._touchEndHandler(event);
            });
        }
        if ("ongesturestart" in window) {
            this._stage.addEventListener("gesturestart", (event) => {
                this._gestureStartHandler(event);
            });
            this._stage.addEventListener("gesturechange", (event) => {
                this._gestureChangeHandler(event);
            });
            document.addEventListener("gestureend", (event) => {
                this._gestureEndHandler(event);
            });
        }
    }

    //
    _keyHandler(e:any) {
        switch (e.keyCode) {
            case 38:
                this.radius -= this.radiusOffset;
                this._adjustToRange();
        
                this._upDateCamera();
                break;
            case 40:
                this.radius += this.radiusOffset;
                this._adjustToRange();
        
                this._upDateCamera();
                break;
            default:
                break;
        }
    }

    _upHandler(e:any) {
        this.isMouseDown = false;
    }

    _downHandler(e:any) {
        this.isMouseDown = true;
        var rect = e.target.getBoundingClientRect();
        this._oldX = e.clientX - rect.left;
        this._oldY = e.clientY - rect.top;
    }

    _wheelHandler(e:any) {
        if (e.wheelDelta > 0) {
            this.radius -= this.radiusOffset;
            this._adjustToRange();
        } else {
            this.radius += this.radiusOffset;
            this._adjustToRange();
        
        }
        this._upDateCamera();
    }

    _moveHandler(e:any) {
        if (this.isMouseDown) {
            var rect = e.target.getBoundingClientRect();
            var stageX = e.clientX - rect.left;
            var stageY = e.clientY - rect.top;

            this.inputXY(stageX, stageY);
        }
    }

    _touchStartHandler(e:any) {
       // e.preventDefault();
        if (!this.isMouseDown) {
            var touches = e.changedTouches;
            var touch = touches[0];
            this.isMouseDown = true;
            this._identifier = touch.identifier;
            var target = touch.target;
            this._oldX = touch.pageX - target.offsetLeft;
            this._oldY = touch.pageY - target.offsetTop;
        }
    }

    _touchMoveHandler(e:any) {
       // e.preventDefault();
        if (this._isGestureChange) {
            return;
        }
        var touches = e.changedTouches;
        var touchLength = touches.length;
        for (var i = 0; i < touchLength; i++) {
            var touch = touches[i];
            if (touch.identifier == this._identifier) {
                var target = touch.target;
                var stageX = touch.pageX - target.offsetLeft;
                var stageY = touch.pageY - target.offsetTop;
                this.inputXY(stageX, stageY);
                break;
            }
        }
    }

    _touchEndHandler(e:any) {
        //e.preventDefault();
        this.isMouseDown = false;
    }

    _gestureStartHandler(e:any) {
        this._isGestureChange = true;
        this.isMouseDown = true;
        this._oldRadius = this.radius;
    }
    _adjustToRange() {
        if (this.radius < this.radiusMin) {
            this.radius = this.radiusMin;
        }
        if (this.radius > this.radiusMax) {
            this.radius = this.radiusMax;
        }
    }

    _gestureChangeHandler(e:any) {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.radius = this._oldRadius + this.gestureRadiusFactor * this.radiusOffset * (1 - e.scale);
        this._adjustToRange();

        this._upDateCamera();
    }

    _gestureEndHandler(e:any) {
        this._isGestureChange = false;
        this.isMouseDown = false;
        this._identifier = -1;
    }

    inputXY(newX, newY) {
        this._theta -= (newX - this._oldX) * 0.3;
        this._oldX = newX;
        this._phi -= (newY - this._oldY) * 0.3;
        this._oldY = newY;

        //
        if (this._phi < 20) {
            this._phi = 20;
        } else if (this._phi > 160) {
            this._phi = 160;
        }
        this._upDateCamera();
    }

    _upDateCamera() {
    }

    update() {
        this.targetTheta += (this._theta - this.targetTheta) * 0.1;
        this.targetPhi += (this._phi - this.targetPhi) * 0.1;
        var t = this.targetTheta * this.RAD;
        var p = this.targetPhi * this.RAD;

        var rsin = this.radius * Math.sin(p);

        //  ThreeJS用に改変
        this._camera.position.x = rsin * Math.sin(t) + this._target[0];
        this._camera.position.z = rsin * Math.cos(t) + this._target[2];
        this._camera.position.y = this.radius * Math.cos(p) + this._target[1];

        this._camera.lookAt(new THREE.Vector3(this._target[0], this._target[1], this._target[2]));
    }

    rotate(dTheta, dPhi) {
        this._theta += dTheta;
        this._phi += dPhi;
        this._upDateCamera();
    }
};
