var shader;
(function (shader) {
    var NegativePositiveShader = (function () {
        function NegativePositiveShader() {
            this.uniforms = {
                "tDiffuse": { type: "t", value: null }
            };
            this.vertexShader = [
                "varying vec2 vUv;",
                "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join("\n");
            this.fragmentShader = [
                "varying vec2 vUv;",
                "uniform sampler2D tDiffuse;",
                "void main() {",
                "vec4 color = texture2D( tDiffuse, vUv );",
                "gl_FragColor = vec4(1.0 - color.x, 1.0 - color.y, 1.0 - color.z, 1.0);",
                "}"
            ].join("\n");
        }
        return NegativePositiveShader;
    })();
    shader.NegativePositiveShader = NegativePositiveShader;
    ;
})(shader || (shader = {}));

var shader;
(function (shader) {
    var MosaicShader = (function () {
        function MosaicShader(width, height) {
            this.uniforms = {
                "tDiffuse": { type: "t", value: null },
                "vScreenSize": { type: "v2", value: new THREE.Vector2(0.0, 0.0) },
                "fMosaicScale": { type: "f", value: null }
            };
            this.vertexShader = [
                "varying vec2 vUv;",
                "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join("\n");
            this.fragmentShader = [
                "varying vec2 vUv;",
                "uniform sampler2D tDiffuse;",
                "uniform vec2 vScreenSize;",
                "uniform float fMosaicScale;",
                "void main() {",
                "vec2 vUv2 = vUv;",
                "vUv2.x = floor(vUv2.x  * vScreenSize.x / fMosaicScale) / (vScreenSize.x / fMosaicScale) + (fMosaicScale/2.0) / vScreenSize.x;",
                "vUv2.y = floor(vUv2.y  * vScreenSize.y / fMosaicScale) / (vScreenSize.y / fMosaicScale) + (fMosaicScale/2.0) / vScreenSize.y;",
                "vec4 color = texture2D(tDiffuse, vUv2);",
                "gl_FragColor = color;",
                "}"
            ].join("\n");
            this.setMosaicScale(10.0);
            this.setScreenSize(width, height);
        }
        MosaicShader.prototype.setScreenSize = function (width, height) {
            this.uniforms["vScreenSize"].value.x = width;
            this.uniforms["vScreenSize"].value.y = height;
        };
        MosaicShader.prototype.setMosaicScale = function (scale) {
            this.uniforms["fMosaicScale"].value = scale;
        };
        return MosaicShader;
    })();
    shader.MosaicShader = MosaicShader;
    ;
})(shader || (shader = {}));

var shader;
(function (shader) {
    var ShaderUtil = (function () {
        function ShaderUtil() {
        }
        Object.defineProperty(ShaderUtil, "RANDOM_DEFINE", {
            get: function () {
                return ["float rand(vec2 co) {", "float a = fract(dot(co, vec2(2.067390879775102, 12.451168662908249))) - 0.5;", "float s = a * (6.182785114200511 + a * a * (-38.026512460676566 + a * a * 53.392573080032137));", "float t = fract(s * 43758.5453);", "return t;", "}"].join("\n");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShaderUtil, "LUMINANCE", {
            get: function () {
                return {
                    R_LUMINANCE: 0.298912,
                    G_LUMINANCE: 0.586611,
                    B_LUMINANCE: 0.114478
                };
            },
            enumerable: true,
            configurable: true
        });
        ShaderUtil.mergeDefines = function (dest, src) {
            for (var keyName in src) {
                dest[keyName] = src[keyName];
            }
            return dest;
        };
        return ShaderUtil;
    })();
    shader.ShaderUtil = ShaderUtil;
})(shader || (shader = {}));

var shader;
(function (shader) {
    var RandomDitherShader = (function () {
        function RandomDitherShader() {
            this.uniforms = {
                "tDiffuse": { type: "t", value: null }
            };
            this.defines = shader.ShaderUtil.mergeDefines({}, shader.ShaderUtil.LUMINANCE);
            this.vertexShader = [
                "varying vec2 vUv;",
                "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join("\n");
            this.fragmentShader = [
                shader.ShaderUtil.RANDOM_DEFINE,
                "varying vec2 vUv;",
                "uniform sampler2D tDiffuse;",
                "void main() {",
                "vec4 color = texture2D(tDiffuse, vUv);",
                "float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;",
                "if (v > rand(vUv)) {",
                "color.x = 1.0;",
                "color.y = 1.0;",
                "color.z = 1.0;",
                "} else {",
                "color.x = 0.0;",
                "color.y = 0.0;",
                "color.z = 0.0;",
                "}",
                "gl_FragColor = color;",
                "}"
            ].join("\n");
        }
        return RandomDitherShader;
    })();
    shader.RandomDitherShader = RandomDitherShader;
    ;
})(shader || (shader = {}));

var shader;
(function (shader) {
    var ThresholdShader = (function () {
        function ThresholdShader() {
            this.uniforms = {
                "tDiffuse": { type: "t", value: null }
            };
            this.defines = shader.ShaderUtil.mergeDefines({}, shader.ShaderUtil.LUMINANCE);
            this.vertexShader = [
                "varying vec2 vUv;",
                "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join("\n");
            this.fragmentShader = [
                "varying vec2 vUv;",
                "uniform sampler2D tDiffuse;",
                "void main() {",
                "vec4 color = texture2D(tDiffuse, vUv);",
                "float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;",
                "if (v >= 0.53333) {",
                "v = 1.0;",
                "} else {",
                "v = 0.0;",
                "}",
                "gl_FragColor = vec4(vec3(v, v, v), 1.0);",
                "}"
            ].join("\n");
        }
        return ThresholdShader;
    })();
    shader.ThresholdShader = ThresholdShader;
    ;
})(shader || (shader = {}));

var shader;
(function (shader) {
    var BayerDitherShader = (function () {
        function BayerDitherShader(width, height) {
            this.defines = shader.ShaderUtil.mergeDefines({}, shader.ShaderUtil.LUMINANCE);
            this.uniforms = {
                "tDiffuse": { type: "t", value: null },
                "vScreenSize": { type: "v2", value: new THREE.Vector2(0.0, 0.0) },
            };
            this.vertexShader = [
                "varying vec2 vUv;",
                "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join("\n");
            this.fragmentShader = [
                "varying vec2 vUv;",
                "uniform sampler2D tDiffuse;",
                "uniform vec2 vScreenSize;",
                "void main() {",
                "vec4 color = texture2D(tDiffuse, vUv);",
                "float x = floor( vUv.x * vScreenSize.x  );",
                "float y = floor( vUv.y * vScreenSize.y );",
                "mat4 m = mat4(",
                "vec4( 0.0,  8.0,    2.0,    10.0),",
                "vec4( 12.0, 4.0,    14.0,   6.0),",
                "vec4( 3.0,  11.0,   1.0,    9.0),",
                "vec4( 15.0, 7.0,    13.0,   5.0)",
                ");",
                "float xi = mod( x,4.0) ;",
                "float yi = mod( y,4.0) ;",
                "float threshold = 0.0;",
                "if( xi == 0.0 )",
                "{  ",
                "if( yi == 0.0 ) {threshold = m[0][0]; }",
                "if( yi == 1.0 ) {threshold = m[0][1]; }",
                "if( yi == 2.0 ) {threshold = m[0][2]; }",
                "if( yi == 3.0 ) {threshold = m[0][3]; }",
                "}",
                "if( xi == 1.0) {",
                "if( yi == 0.0 ) {threshold = m[1][0]; }",
                "if( yi == 1.0 ) {threshold = m[1][1]; }",
                "if( yi == 2.0 ) {threshold = m[1][2]; }",
                "if( yi == 3.0 ) {threshold = m[1][3]; }",
                "}",
                "if( xi == 2.0) {",
                "if( yi == 0.0 ) {threshold = m[2][0]; }",
                "if( yi == 1.0 ) {threshold = m[2][1]; }",
                "if( yi == 2.0 ) {threshold = m[2][2]; }",
                "if( yi == 3.0 ) {threshold = m[2][3]; }",
                "}",
                "if( xi == 3.0) {",
                "if( yi == 0.0 ) {threshold = m[3][0]; }",
                "if( yi == 1.0 ) {threshold = m[3][1]; }",
                "if( yi == 2.0 ) {threshold = m[3][2]; }",
                "if( yi == 3.0 ) {threshold = m[3][3]; }",
                "}",
                "color = color * 16.0;",
                "float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;",
                "if (v <threshold ) {",
                "color.x = 0.0;",
                "color.y = 0.0;",
                "color.z = 0.0;",
                "} else {",
                "color.x = 1.0;",
                "color.y = 1.0;",
                "color.z = 1.0;",
                "}",
                "gl_FragColor = color;",
                "}"
            ].join("\n");
            this.setSize(width, height);
        }
        BayerDitherShader.prototype.setSize = function (width, height) {
            this.uniforms["vScreenSize"].value.x = width;
            this.uniforms["vScreenSize"].value.y = height;
        };
        return BayerDitherShader;
    })();
    shader.BayerDitherShader = BayerDitherShader;
    ;
})(shader || (shader = {}));

var shader;
(function (shader) {
    var SepiaToneShader = (function () {
        function SepiaToneShader() {
            this.uniforms = {
                "tDiffuse": { type: "t", value: null }
            };
            this.defines = shader.ShaderUtil.mergeDefines({}, shader.ShaderUtil.LUMINANCE);
            this.vertexShader = [
                "varying vec2 vUv;",
                "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join("\n");
            this.fragmentShader = [
                "varying vec2 vUv;",
                "uniform sampler2D tDiffuse;",
                "void main() {",
                "vec4 color = texture2D(tDiffuse, vUv);",
                "float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;",
                "color.x = v * 0.9;",
                "color.y = v * 0.7;",
                "color.z = v * 0.4;",
                "gl_FragColor = vec4(color);",
                "}"
            ].join("\n");
        }
        return SepiaToneShader;
    })();
    shader.SepiaToneShader = SepiaToneShader;
    ;
})(shader || (shader = {}));

var shader;
(function (shader) {
    var DiffusionShader = (function () {
        function DiffusionShader(width, height) {
            this.uniforms = {
                "tDiffuse": { type: "t", value: null },
                "vScreenSize": { type: "v2", value: new THREE.Vector2(0.0, 0.0) }
            };
            this.vertexShader = [
                "varying vec2 vUv;",
                "uniform vec2 vScreenSize;",
                "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join("\n");
            this.fragmentShader = [
                shader.ShaderUtil.RANDOM_DEFINE,
                "varying vec2 vUv;",
                "uniform sampler2D tDiffuse;",
                "uniform vec2 vScreenSize;",
                "void main() {",
                "float radius = 5.0;",
                "float x = (vUv.x * vScreenSize.x) + rand(vUv) * radius * 2.0 - radius;",
                "float y = (vUv.y * vScreenSize.y) + rand(vUv) * radius * 2.0 - radius;",
                "vec4 textureColor = texture2D(tDiffuse, vec2( x, y ) / vScreenSize );",
                "gl_FragColor = textureColor;",
                "}"
            ].join("\n");
            this.setSize(width, height);
        }
        DiffusionShader.prototype.setSize = function (width, height) {
            this.uniforms["vScreenSize"].value.x = width;
            this.uniforms["vScreenSize"].value.y = height;
        };
        return DiffusionShader;
    })();
    shader.DiffusionShader = DiffusionShader;
    ;
})(shader || (shader = {}));

var shader;
(function (shader) {
    var BokashiShader = (function () {
        function BokashiShader(width, height) {
            this.uniforms = {
                "tDiffuse": { type: "t", value: null },
                "vScreenSize": { type: "v2", value: new THREE.Vector2(0.0, 0.0) },
                "vCenter": { type: "v2", value: new THREE.Vector2(1000, 100) },
                "fBokashiScale": { type: "f", value: null }
            };
            this.vertexShader = [
                "varying vec2 vUv;",
                "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join("\n");
            this.fragmentShader = [
                "varying vec2 vUv;",
                "uniform sampler2D tDiffuse;",
                "uniform vec2 vScreenSize;",
                "uniform vec2 vCenter;",
                "uniform float fBokashiScale;",
                "void main() {",
                "if( length(vCenter-vUv*vScreenSize) >= fBokashiScale ) ",
                "{",
                "gl_FragColor = texture2D(tDiffuse,vUv);",
                "return;",
                "}",
                "vec4 color =  vec4(0.0,0.0,0.0,0.0);",
                "const float count = 9.0;",
                "float s = floor(count / 2.0 ) *  - 1.0;",
                "for(int i = 0; i < int( count ) ;i++)",
                "{",
                "float x = (floor(vUv.x  * vScreenSize.x) +s + float(i)) / vScreenSize.x ;",
                "for(int j=0;j<int( count ) ;j++)",
                "{",
                "float y = (floor(vUv.y  * vScreenSize.y) + s + float(j) ) / vScreenSize.y ;",
                "color += texture2D(tDiffuse, vec2( x, y ) );",
                "}",
                "}",
                "gl_FragColor = color / float(count * count);",
                "}"
            ].join("\n");
            this.setBokashiScale(150.0);
            this.setScreenSize(width, height);
        }
        BokashiShader.prototype.setMousePos = function (mouseX, mouseY) {
            this.uniforms["vCenter"].value.x = mouseX;
            this.uniforms["vCenter"].value.y = this.uniforms["vScreenSize"].value.y - mouseY;
        };
        BokashiShader.prototype.setScreenSize = function (width, height) {
            this.uniforms["vScreenSize"].value.x = width;
            this.uniforms["vScreenSize"].value.y = height;
        };
        BokashiShader.prototype.setBokashiScale = function (scale) {
            this.uniforms["fBokashiScale"].value = scale;
        };
        return BokashiShader;
    })();
    shader.BokashiShader = BokashiShader;
    ;
})(shader || (shader = {}));

var shader;
(function (shader) {
    var UzumakiShader = (function () {
        function UzumakiShader(width, height) {
            this.uniforms = {
                "tDiffuse": { type: "t", value: null },
                "vScreenSize": { type: "v2", value: new THREE.Vector2(300, 200) },
                "vCenter": { type: "v2", value: new THREE.Vector2(1000, 0) },
                "fRadius": { type: "f", value: 150.0 },
                "fUzuStrength": { type: "f", value: 2.5 }
            };
            this.vertexShader = [
                "varying vec2 vUv;",
                "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join("\n");
            this.fragmentShader = [
                "uniform sampler2D tDiffuse;",
                "varying vec2 vUv;",
                "uniform vec2 vScreenSize;",
                "uniform vec2 vCenter;",
                "uniform float fRadius;",
                "uniform float fUzuStrength;",
                "void main() {",
                "vec2 pos =  ( vUv * vScreenSize ) - vCenter;",
                "float len = length(pos);",
                "if( len >= fRadius ) ",
                "{",
                "gl_FragColor = texture2D(tDiffuse,vUv);",
                "return;",
                "}",
                "float uzu = min( max( 1.0 - ( len / fRadius),0.0),1.0)  * fUzuStrength; ",
                "float x = pos.x * cos(uzu) - pos.y * sin(uzu); ",
                "float y = pos.x * sin(uzu) + pos.y * cos(uzu);",
                "vec2 retPos = (vec2( x, y ) + vCenter )  / vScreenSize ;",
                "vec4 color = texture2D(tDiffuse, retPos );",
                "gl_FragColor = color;",
                "}"
            ].join("\n");
            this.setScreenSize(width, height);
        }
        UzumakiShader.prototype.setMousePos = function (mouseX, mouseY) {
            this.uniforms["vCenter"].value.x = mouseX;
            this.uniforms["vCenter"].value.y = this.uniforms["vScreenSize"].value.y - mouseY;
        };
        UzumakiShader.prototype.setScreenSize = function (width, height) {
            this.uniforms["vScreenSize"].value.x = width;
            this.uniforms["vScreenSize"].value.y = height;
        };
        UzumakiShader.prototype.setUzumakiScale = function (scale) {
            this.uniforms["fRadius"].value = scale;
        };
        return UzumakiShader;
    })();
    shader.UzumakiShader = UzumakiShader;
    ;
})(shader || (shader = {}));



var TestObjects = (function () {
    function TestObjects(scene, renderer) {
        this.groups = [];
        this.renderer = renderer;
        this.groups.push(this.getImagePlane());
        this.groups.push(this.getVideoImagePlane());
        for (var id in this.groups) {
            scene.add(this.groups[id]);
        }
        this.current = 0;
    }
    TestObjects.prototype.change = function () {
        if (this.current == 1) {
            this.video.pause();
        }
        this.groups[this.current].visible = false;
        this.current++;
        if (this.current >= this.groups.length) {
            this.current = 0;
        }
        if (this.current == 1) {
            this.video.play();
        }
        this.groups[this.current].visible = true;
    };
    TestObjects.prototype.getVideoImagePlane = function () {
        this.video = document.createElement('video');
        this.video.src = "texture/BigBuckBunny_320x180.mp4";
        this.video.load();
        this.video.play();
        this.video.loop = true;
        var videoImage = document.createElement('canvas');
        videoImage.width = 480;
        videoImage.height = 200;
        this.videoImageContext = videoImage.getContext('2d');
        this.videoImageContext.fillStyle = '#000000';
        this.videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);
        this.videoTexture = new THREE.Texture(videoImage);
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;
        var movieMaterial = new THREE.MeshBasicMaterial({ map: this.videoTexture, side: THREE.DoubleSide });
        var movieGeometry = new THREE.PlaneGeometry(2.0, 1.0, 1, 1);
        var movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
        movieScreen.position.x = -1.68;
        movieScreen.scale.x = movieScreen.scale.y = 5;
        var group = new THREE.Group();
        group.add(movieScreen);
        group.visible = false;
        return group;
    };
    TestObjects.prototype.getImagePlane = function () {
        var group = new THREE.Group();
        var texture = THREE.ImageUtils.loadTexture('texture/flower.jpg');
        texture.anisotropy = this.renderer.getMaxAnisotropy();
        var geometry = new THREE.PlaneGeometry(1.5, 1.0, 1, 1);
        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.scale.x = mesh.scale.y = 3.5;
        group.add(mesh);
        group.visible = true;
        return group;
    };
    TestObjects.prototype.onUpdate = function () {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.videoImageContext.drawImage(this.video, 0, 0);
            if (this.videoTexture) {
                this.videoTexture.needsUpdate = true;
            }
        }
    };
    return TestObjects;
})();

var Main = (function () {
    function Main() {
        this.effects = {};
        this.effectList = [];
    }
    Main.prototype.initialize = function () {
        this.checkSpMode();
        this.startScene();
        this.initMouse();
    };
    Main.prototype.changeScene = function () {
        this.objects.change();
    };
    Main.prototype.initMouse = function () {
        var _this = this;
        if ("ontouchstart" in window) {
            this.renderer.domElement.addEventListener("touchmove", function (event) {
                event.preventDefault();
                _this.mouseX = event.changedTouches[0].pageX;
                _this.mouseY = event.changedTouches[0].pageY;
            });
        }
        document.addEventListener("mousemove", function (event) {
            _this.mouseX = event.pageX;
            _this.mouseY = event.pageY;
        });
    };
    Main.prototype.isIphone = function () {
        return (navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0;
    };
    Main.prototype.checkSpMode = function () {
        if (this.isIphone() || navigator.userAgent.indexOf('Android') > 0) {
            this.spMode = true;
        }
        else {
            this.spMode = false;
        }
    };
    Main.prototype.initObjects = function () {
        this.objects = new TestObjects(this.scene, this.renderer);
    };
    Main.prototype.resetShader = function () {
        this.normalRenderMode = true;
        for (var i = 0; i < this.effectList.length; i++) {
            this.effectList[i].pass.enabled = false;
            this.effectList[i].pass.renderToScreen = false;
        }
    };
    Main.prototype.changeShader = function (id, value) {
        this.normalRenderMode = false;
        this.effects[id].pass.enabled = value;
        var renderToScreen = false;
        for (var i = this.effectList.length - 1; i >= 0; i--) {
            if (this.effectList[i].pass.enabled && !renderToScreen) {
                this.effectList[i].pass.renderToScreen = true;
                renderToScreen = true;
            }
            else {
                this.effectList[i].pass.renderToScreen = false;
            }
        }
        if (!renderToScreen) {
            this.normalRenderMode = true;
        }
    };
    Main.prototype.startScene = function () {
        var _this = this;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(77, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('canvas-wrapper').appendChild(this.renderer.domElement);
        if (!this.spMode) {
            this.controller = new RoundCameraController(this.camera, this.renderer.domElement);
            ;
        }
        this.initObjects();
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
        this.addShaders();
        this.normalRenderMode = true;
        this.camera.position.z = 3;
        var render = function () {
            requestAnimationFrame(render);
            if (_this.normalRenderMode) {
                _this.renderer.render(_this.scene, _this.camera);
            }
            else {
                _this.composer.render();
            }
            _this.uzumaki.setMousePos(_this.mouseX, _this.mouseY);
            _this.bokashi.setMousePos(_this.mouseX, _this.mouseY);
            if (!_this.spMode) {
                _this.controller.update();
            }
            _this.objects.onUpdate();
        };
        render();
    };
    Main.prototype.addShaders = function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.addEffect("nega", new shader.NegativePositiveShader);
        this.addEffect("sepia_tone", new shader.SepiaToneShader);
        this.addEffect("mosaic", new shader.MosaicShader(width, height));
        this.addEffect("diffusion", new shader.DiffusionShader(width, height));
        this.addEffect("bokashi", this.bokashi = new shader.BokashiShader(width, height));
        this.bokashi.uniforms = this.effects["bokashi"].pass.uniforms;
        this.addEffect("uzumaki", this.uzumaki = new shader.UzumakiShader(width, height));
        this.uzumaki.uniforms = this.effects["uzumaki"].pass.uniforms;
        this.addEffect("threshold", new shader.ThresholdShader);
        this.addEffect("random_dither", new shader.RandomDitherShader);
        this.addEffect("bayer_dither", new shader.BayerDitherShader(width, height));
        if (this.spMode) {
            this.bokashi.setBokashiScale(75);
            this.uzumaki.setUzumakiScale(75);
        }
    };
    Main.prototype.addEffect = function (name, shader) {
        var pass = new THREE.ShaderPass(shader);
        this.composer.addPass(pass);
        pass.renderToScreen = false;
        pass.enabled = false;
        this.effects[name] = { material: shader, pass: pass };
        this.effectList.push(this.effects[name]);
    };
    return Main;
})();
;

var RoundCameraController = (function () {
    function RoundCameraController(camera, stage) {
        this.RAD = Math.PI / 180;
        this.radiusMin = 3.0;
        this.radiusMax = 5.0;
        this.radiusOffset = 0.1;
        this.gestureRadiusFactor = 1;
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
    RoundCameraController.prototype.enable = function () {
        var _this = this;
        document.addEventListener("keydown", function (event) {
            _this._keyHandler(event);
        });
        document.addEventListener("mouseup", function (event) {
            _this._upHandler(event);
        });
        this._stage.addEventListener("mousedown", function (event) {
            _this._downHandler(event);
        });
        this._stage.addEventListener("mousemove", function (event) {
            _this._moveHandler(event);
        });
        this._stage.addEventListener("mousewheel", function (event) {
            _this._wheelHandler(event);
        });
        if ("ontouchstart" in window) {
            this._stage.addEventListener("touchstart", function (event) {
                _this._touchStartHandler(event);
            });
            this._stage.addEventListener("touchmove", function (event) {
                _this._touchMoveHandler(event);
            });
            document.addEventListener("touchend", function (event) {
                _this._touchEndHandler(event);
            });
        }
        if ("ongesturestart" in window) {
            this._stage.addEventListener("gesturestart", function (event) {
                _this._gestureStartHandler(event);
            });
            this._stage.addEventListener("gesturechange", function (event) {
                _this._gestureChangeHandler(event);
            });
            document.addEventListener("gestureend", function (event) {
                _this._gestureEndHandler(event);
            });
        }
    };
    RoundCameraController.prototype._keyHandler = function (e) {
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
    };
    RoundCameraController.prototype._upHandler = function (e) {
        this.isMouseDown = false;
    };
    RoundCameraController.prototype._downHandler = function (e) {
        this.isMouseDown = true;
        var rect = e.target.getBoundingClientRect();
        this._oldX = e.clientX - rect.left;
        this._oldY = e.clientY - rect.top;
    };
    RoundCameraController.prototype._wheelHandler = function (e) {
        if (e.wheelDelta > 0) {
            this.radius -= this.radiusOffset;
            this._adjustToRange();
        }
        else {
            this.radius += this.radiusOffset;
            this._adjustToRange();
        }
        this._upDateCamera();
    };
    RoundCameraController.prototype._moveHandler = function (e) {
        if (this.isMouseDown) {
            var rect = e.target.getBoundingClientRect();
            var stageX = e.clientX - rect.left;
            var stageY = e.clientY - rect.top;
            this.inputXY(stageX, stageY);
        }
    };
    RoundCameraController.prototype._touchStartHandler = function (e) {
        if (!this.isMouseDown) {
            var touches = e.changedTouches;
            var touch = touches[0];
            this.isMouseDown = true;
            this._identifier = touch.identifier;
            var target = touch.target;
            this._oldX = touch.pageX - target.offsetLeft;
            this._oldY = touch.pageY - target.offsetTop;
        }
    };
    RoundCameraController.prototype._touchMoveHandler = function (e) {
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
    };
    RoundCameraController.prototype._touchEndHandler = function (e) {
        this.isMouseDown = false;
    };
    RoundCameraController.prototype._gestureStartHandler = function (e) {
        this._isGestureChange = true;
        this.isMouseDown = true;
        this._oldRadius = this.radius;
    };
    RoundCameraController.prototype._adjustToRange = function () {
        if (this.radius < this.radiusMin) {
            this.radius = this.radiusMin;
        }
        if (this.radius > this.radiusMax) {
            this.radius = this.radiusMax;
        }
    };
    RoundCameraController.prototype._gestureChangeHandler = function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.radius = this._oldRadius + this.gestureRadiusFactor * this.radiusOffset * (1 - e.scale);
        this._adjustToRange();
        this._upDateCamera();
    };
    RoundCameraController.prototype._gestureEndHandler = function (e) {
        this._isGestureChange = false;
        this.isMouseDown = false;
        this._identifier = -1;
    };
    RoundCameraController.prototype.inputXY = function (newX, newY) {
        this._theta -= (newX - this._oldX) * 0.3;
        this._oldX = newX;
        this._phi -= (newY - this._oldY) * 0.3;
        this._oldY = newY;
        if (this._phi < 20) {
            this._phi = 20;
        }
        else if (this._phi > 160) {
            this._phi = 160;
        }
        this._upDateCamera();
    };
    RoundCameraController.prototype._upDateCamera = function () {
    };
    RoundCameraController.prototype.update = function () {
        this.targetTheta += (this._theta - this.targetTheta) * 0.1;
        this.targetPhi += (this._phi - this.targetPhi) * 0.1;
        var t = this.targetTheta * this.RAD;
        var p = this.targetPhi * this.RAD;
        var rsin = this.radius * Math.sin(p);
        this._camera.position.x = rsin * Math.sin(t) + this._target[0];
        this._camera.position.z = rsin * Math.cos(t) + this._target[2];
        this._camera.position.y = this.radius * Math.cos(p) + this._target[1];
        this._camera.lookAt(new THREE.Vector3(this._target[0], this._target[1], this._target[2]));
    };
    RoundCameraController.prototype.rotate = function (dTheta, dPhi) {
        this._theta += dTheta;
        this._phi += dPhi;
        this._upDateCamera();
    };
    return RoundCameraController;
})();
;
