"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface ShaderHeroProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export function AnimatedShaderHero({
  title,
  subtitle,
  className = "",
}: ShaderHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const fragmentShader = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      float t = u_time * 0.3;

      float r = sin(uv.x * 6.28318 + t) * 0.5 + 0.5;
      float g = sin(uv.y * 6.28318 + t * 1.3) * 0.5 + 0.5;
      float b = sin((uv.x + uv.y) * 6.28318 + t * 0.7) * 0.5 + 0.5;

      vec3 color1 = vec3(0.427, 0.157, 0.851);
      vec3 color2 = vec3(0.655, 0.545, 0.984);
      vec3 color3 = vec3(0.957, 0.447, 0.694);

      vec3 color = mix(color1, color2, r);
      color = mix(color, color3, g * 0.5);

      float alpha = 0.15 + 0.05 * sin(t + uv.x * 3.0);

      gl_FragColor = vec4(color * alpha, alpha);
    }
  `;

  const vertexShader = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const initGL = useCallback((canvas: HTMLCanvasElement) => {
    const gl = canvas.getContext("webgl");
    if (!gl) return null;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vertexShader, gl.VERTEX_SHADER);
    const fs = compileShader(fragmentShader, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    return { gl, program, positionBuffer };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = initGL(canvas);
    if (!ctx) return;

    const { gl, program, positionBuffer } = ctx;
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      timeRef.current += 0.016;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLocation, timeRef.current);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initGL]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] px-4 text-center">
        {title ? (
          <div className="mb-4">{title}</div>
        ) : (
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            DSA Practice
          </h1>
        )}
        {subtitle ? (
          <div>{subtitle}</div>
        ) : (
          <p className="text-lg md:text-xl text-muted-foreground max-w-md">
            Master algorithms, ace your interviews
          </p>
        )}
      </div>
    </div>
  );
}
