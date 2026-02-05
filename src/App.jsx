import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Sparkles, Float, Text, Stars, Billboard } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import './index.css'

// --- DATA ---
const TECH_STACK = [
  { name: "LINUX", color: "#00f3ff", desc: "Core Foundation" },
  { name: "BASH", color: "#00f3ff", desc: "Automation Scripts" },
  { name: "JAVA", color: "#ff00aa", desc: "Backend Core" },
  { name: "GOLANG", color: "#00f3ff", desc: "System Tools" },
  { name: "PYTHON", color: "#0aff00", desc: "Orchestration" },
  { name: "AWS", color: "#ff8800", desc: "Cloud Infrastructure" }
];

const CERTS = {
  devops: [
    "DevOps Pre-Requisite", "DevOps Foundations", "Linux & Bash",
    "Java Backend Core", "Golang Automation", "Python Basics"
  ],
  aws: [
    "AWS Basics", "Cloud Practitioner", "Amazon EC2", "Amazon S3",
    "AWS IAM", "AWS Lambda", "Elastic Beanstalk"
  ],
  oracle: [
    "OCI AI Foundations", "Gen AI Professional", "OCI DevOps",
    "Cloud Computing", "12 Factor App"
  ]
};

// --- 3D COMPONENTS ---

const MovingStars = () => {
  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.02
      ref.current.rotation.x -= delta * 0.01
    }
  })
  return (
    <group ref={ref}>
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}


const TechOrb = ({ text, subtitle, position, color, delay }) => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshBasicMaterial color={color} />
        </mesh>

        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false} // Lock the rotation on the z axis (default=false)
        >
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.5}
            color="white"
            anchorY="bottom"
            outlineWidth={0.02}
            outlineColor={color}
          >
            {text}
          </Text>
          {/* Subtitle */}
          <Text
            position={[0, 0.15, 0]}
            fontSize={0.15}
            color={color}
            anchorY="top"
          >
            {subtitle}
          </Text>
        </Billboard>

        <Sparkles count={20} scale={2} size={2} color={color} speed={0.5} />
      </group>
    </Float>
  )
}

const TechGalaxy = () => {
  const scroll = useScroll()
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    // Precise placement in the Page 3 "Spacer"
    // Core Arsenal Text ends at 0.40
    // Certs start at 0.60
    // "Just below the Core"
    // Start at 33% (Overlaps slightly with end of Core text, but physically below)
    const r = scroll.range(0.33, 0.20)

    groupRef.current.visible = r > 0.01

    // Move from back (-25) to Closer (-15) then stay there
    groupRef.current.position.z = -25 + (r * 15)

    // Constant rotation
    groupRef.current.rotation.y += delta * 0.5
  })

  return (
    <group ref={groupRef} position={[0, -0.5, -30]}>
      {/* THE CORE: A pulsating central energy sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#00f3ff" wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color="#000205" />
      </mesh>
      <Sparkles count={50} scale={4} size={4} speed={0.4} opacity={0.5} color="#00f3ff" />

      {TECH_STACK.map((tech, i) => {
        const radius = 6 // Orbiting radius
        const angle = (i / TECH_STACK.length) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <TechOrb
            key={tech.name}
            text={tech.name}
            subtitle={tech.desc}
            position={[x, 0, z]}
            color={tech.color}
            delay={i * 0.1}
          />
        )
      })}
    </group>
  )
}

const CameraRig = () => {
  const { camera, mouse } = useThree()
  const scroll = useScroll()

  useFrame((state, delta) => {
    // Scroll Influence
    const s = scroll.offset

    // Position: Move steadily forward
    camera.position.z = 5 - (s * 15) // Start at 5, go deep
    camera.position.y = Math.sin(s * Math.PI) * 1 // Subtle wave

    // LookAt adjustment (keep looking forward-ish)
    camera.lookAt(0, 0, camera.position.z - 10)

    // Mouse Parallax (subtle)
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05
    camera.position.y += (mouse.y * 1 - camera.position.y) * 0.05
  })

  return null
}

// --- HTML CONTEXT ---

const Section = ({ children, style }) => (
  <section style={{
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 20px',
    boxSizing: 'border-box',
    ...style
  }}>
    {children}
  </section>
)

const Typist = ({ text, delay = 0, style }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration: 1 }}
    style={{
      fontSize: '1.2rem',
      margin: '10px 0',
      maxWidth: '800px', // Prevent it from stretching too far
      lineHeight: '1.6',
      ...style
    }}
  >
    {text}
  </motion.div>
)

const Interface = () => {
  return (
    <Scroll html style={{ width: '100%', height: '100%', zIndex: 10 }}>
      {/* SECTION 1: HERO */}
      <Section style={{ alignItems: 'flex-start', paddingLeft: '10vw' }}>
        <h1 style={{
          fontSize: 'clamp(3rem, 6vw, 8rem)',
          fontWeight: 900,
          color: 'white',
          lineHeight: 1
        }}>
          RANJITH <br />
          <span style={{ color: '#00f3ff' }}>KUMAR</span>
        </h1>

        <h2 style={{
          color: '#ff00aa',
          fontSize: 'clamp(1rem, 2vw, 2rem)',
          marginTop: '1rem',
          letterSpacing: '5px',
          background: 'rgba(0,0,0,0.5)',
          padding: '5px 15px'
        }}>
          DEVOPS & CLOUD ENGINEER
        </h2>

        <div style={{ marginTop: '3rem', fontFamily: 'Rajdhani', color: '#ccc' }}>
          <Typist
            text="> I’m a Linux-first DevOps & Cloud Engineer obsessed with automation and system reliability."
            delay={1.5}
            style={{ borderLeft: '3px solid #00f3ff', paddingLeft: '10px' }}
          />
          <Typist
            text="> Java is my backend core, while Golang and Python power my DevOps tooling."
            delay={2.5}
            style={{ borderLeft: '3px solid #ff00aa', paddingLeft: '10px' }}
          />
          <Typist
            text="> I build, automate, and scale cloud infrastructure on AWS—focused on systems that don’t break."
            delay={3.5}
            style={{ borderLeft: '3px solid #0aff00', paddingLeft: '10px', color: '#00f3ff' }}
          />
        </div>
      </Section>

      {/* SECTION 2: TECH STACK LABEL */}
      {/* Moved text to Top (flex-start) so the Ring (which is low) appears visually BELOW it */}
      <Section style={{ justifyContent: 'flex-start', paddingTop: '15vh', alignItems: 'center', textAlign: 'center' }}>
        <h2 style={{ fontSize: '4rem', color: '#00f3ff' }}>CORE ARSENAL</h2>
        <p style={{ fontFamily: 'Rajdhani', fontSize: '1.2rem', color: '#fff' }}>SYSTEM / BACKEND / CLOUD</p>
        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '10px' }}>(SCROLL TO EXPLORE)</p>
      </Section>

      {/* SECTION 2.5: SPACER FOR 3D RING */}
      <Section style={{ height: '100vh' }}>
        {/* Empty space for the 3D ring to be visible without text overlay */}
      </Section>

      {/* SECTION 3: CERTIFICATIONS */}
      {/* Moved LOWER (paddingTop: 25vh) and SPEEDED UP animations */}
      <Section style={{ height: 'auto', minHeight: '100vh', justifyContent: 'flex-start', paddingTop: '25vh' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '3rem', textShadow: '0 0 20px #ff00aa' }}>CERTIFICATIONS</h2>

        <div className="cert-grid">
          {/* Faster sequence: 0, 0.5, 1.0 */}
          <CertCard title="DEVOPS & CORE" items={CERTS.devops} color="#00f3ff" delay={0} />
          <CertCard title="AWS CLOUD" items={CERTS.aws} color="#ff8800" delay={0.5} />
          <CertCard title="ORACLE & AI" items={CERTS.oracle} color="#0aff00" delay={1.0} />
        </div>
      </Section>

      {/* FOOTER */}
      <Section style={{ height: '50vh', justifyContent: 'center' }}>
        <h3 style={{
          fontSize: '2rem',
          color: 'white',
          fontFamily: 'Orbitron',
          letterSpacing: '5px',
          textShadow: '0 0 10px #00f3ff'
        }}>
          END OF TRANSMISSION
        </h3>
      </Section>
    </Scroll>
  )
}

const CertCard = ({ title, items, color, delay = 0 }) => (
  <motion.div
    // "Deep Space" Arrival: Starts tiny and far back
    initial={{ opacity: 0, scale: 0, z: -1000 }}
    whileInView={{ opacity: 1, scale: 1, z: 0 }}
    viewport={{ once: false, margin: "-10%" }}
    /* DURATION REDUCED: 1.5 -> 0.8 (Faster fly-in) */
    transition={{ duration: 0.8, delay, type: "spring", bounce: 0.2 }}
    className="cert-card"
    style={{ borderColor: color, boxShadow: `0 0 10px ${color}22` }}
  >
    <h3 style={{ color, borderBottom: `1px solid ${color}55`, paddingBottom: '10px' }}>{title}</h3>
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1, // Faster stagger (0.2 -> 0.1)
            delayChildren: delay + 0.3 // Faster start after card arrives
          }
        }
      }}
    >
      {items.map((it, i) => (
        <motion.li
          key={i}
          variants={{
            hidden: { opacity: 0, scale: 0.5, x: -50 }, // Start small and left
            visible: {
              opacity: 1,
              scale: 1,
              x: 0,
              transition: { type: "spring", stiffness: 100 }
            }
          }}
        >
          <span style={{ color }}>//</span> {it}
        </motion.li>
      ))}
    </motion.ul>
  </motion.div>
)

const Cursor = () => {
  const cursorRef = useRef(null)
  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return <div ref={cursorRef} className="cursor" />
}

const LoadingScreen = () => (
  <div className="loader-container">
    <h1 style={{ marginBottom: '20px' }}>INITIALIZING</h1>
    <div style={{ width: '200px', height: '2px', background: '#333', position: 'relative', overflow: 'hidden' }}>
      <div className="scanline" style={{ width: '50%', background: '#00f3ff', animation: 'none', height: '100%' }}></div>
    </div>
  </div>
)

export default function App() {
  const [ready, setReady] = useState(false)
  useEffect(() => { setTimeout(() => setReady(true), 1500) }, [])

  return (
    <>
      <Cursor />
      {!ready && <LoadingScreen />}

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: false, toneMapping: THREE.ExponentToneMapping, toneMappingExposure: 1.5 }}
      >
        <color attach="background" args={['#000205']} />
        <fog attach="fog" args={['#000205', 5, 30]} />

        <Suspense fallback={null}>
          <ScrollControls pages={5} damping={0.1}>
            {/* 3D Scene */}
            <MovingStars />
            <TechGalaxy />
            <CameraRig />

            {/* 2D Overlay */}
            <Interface />
          </ScrollControls>

          <EffectComposer disableNormalPass multisampling={0}>
            <Bloom luminanceThreshold={0.4} mipmapBlur intensity={1.2} radius={0.6} />
            <Noise opacity={0.05} />
            <ChromaticAberration offset={[0.001, 0.001]} blendFunction={BlendFunction.NORMAL} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </>
  )
}
