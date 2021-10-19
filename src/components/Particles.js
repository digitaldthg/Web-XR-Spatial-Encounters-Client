
import {
    Color,
    FogExp2,
    Clock,
    MeshBasicMaterial,
    PlaneGeometry,
    Mesh,
    FrontSide,
    PointsMaterial,
    Points,
    BufferGeometry,
    BufferAttribute,
    Texture,
    FloatType,
    OneMinusSrcAlphaFactor, CustomBlending, OneFactor
} from "three";

class Particles {
    constructor(store, position) {
        this.store = store;
        this.xr = store.state.xr;
        this.position = position
        this.InitParticles();
    }

    InitParticles() {
        this.textureSize = 32.0;
        const pointGeometry = new BufferGeometry();
        var verts = [];
        this.timer = 0;
        this.particleNum = 1000;

        for (let i = 0; i < this.particleNum; i++) {
            const x = this.position.x + (Math.random() - .5) * 1.2;
            const y = this.position.y + (Math.random() - .5) * 1.2;
            const z = this.position.z + (Math.random() - .5) * 1.2;

            verts.push(x, y, z);
        }

        var vertices = new Float32Array(verts);
        pointGeometry.setAttribute("position", new BufferAttribute(vertices, 3));
        
        let colorHSL = new Color(this.store.state.nextTheme.triangle_color_bottom);
        const pointMaterial = new PointsMaterial({
            size: 0.05,
            color: colorHSL,
            vertexColors: false,
            map: this.GetParticleTexture(),
            // blending: THREE.AdditiveBlending,
            transparent: true,
            fog: true,
        });

        const velocities = [];
        for (let i = 0; i < this.particleNum; i++) {
            const x = ((Math.random() + 0.001) * 8 - 4) * 0.004;
            const y = ((Math.random() + 0.001) * 10) * -0.007;
            const z = ((Math.random() + 0.001) * 8 - 4) * 0.004;
            velocities.push(x, y, z);
        }

        this.particles = new Points(pointGeometry, pointMaterial);
        this.particles.renderOrder = 12;
        this.particles.geometry.velocities = velocities;
        this.particles.visible = true;
        this.particles.frustumCulled = false;
        this.xr.Scene.add(this.particles);

        this.store.state.xr.Events.addEventListener(
            "OnAnimationLoop",
            this.RenderLoop
        );
    }

    RenderLoop = (clock) => {
        this.timer += clock.elapsedTime;
        if (this.timer >= 25000) {
            this.xr.Scene.remove(this.particles);
            this.store.state.xr.Events.removeEventListener(
                "OnAnimationLoop",
                this.RenderLoop
            );
        }
        const pos = this.particles.geometry.attributes.position.array;
        const velArr = this.particles.geometry.velocities;

        for (var i = 0; i < pos.length; i += 3) {
            const velocity = {
                x: velArr[i],
                y: velArr[i + 1],
                z: velArr[i + 2],
            };

            // y
            pos[i + 1] += velocity.y;
            pos[i] += velocity.x;
            pos[i + 2] += velocity.z;
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    GetParticleTexture() {
        const canvas = document.createElement("canvas");
        canvas.setAttribute("data-name", "PARTICLE TEXTURE");
        let container = document.getElementById("canvases");
        container.appendChild(canvas);

        const ctx = canvas.getContext("2d");

        const diameter = this.textureSize;
        canvas.width = diameter;
        canvas.height = diameter;
        const canvasRadius = diameter / 2;


        ctx.beginPath();
        ctx.moveTo(diameter / 2, 0);
        ctx.lineTo(0, diameter);
        ctx.lineTo(diameter, diameter);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.closePath();

        /* gradation circle
      ------------------------ */
        //this.drawRadialGradation(ctx, canvasRadius, canvas.width, canvas.height);

        const texture = new Texture(canvas);
        //texture.minFilter = THREE.NearestFilter;
        texture.type = FloatType;
        texture.needsUpdate = true;
        return texture;
    }

    drawRadialGradation(ctx, canvasRadius, canvasW, canvasH) {
        ctx.save();
        const gradient = ctx.createRadialGradient(
            canvasRadius,
            canvasRadius,
            0,
            canvasRadius,
            canvasRadius,
            canvasRadius
        );
        gradient.addColorStop(0, "rgba(255,255,255,1.0)");
        gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasW, canvasH);
        ctx.restore();
    }
}

export default Particles;