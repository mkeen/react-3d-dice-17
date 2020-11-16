import React from 'react'
import ReactDOM from 'react-dom'
import * as THREE from 'three'
import { Canvas } from 'react-three-fiber'
import { Tetrahedron, Box, Octahedron, Dodecahedron, Icosahedron } from '@react-three/drei'
import { Physics, usePlane, useBox, useConvexPolyhedron } from 'use-cannon'
import niceColors from 'nice-color-palettes'
import './styles.css'

const Plane = ({ color, ...props }) => {
  const [ref] = usePlane(() => ({ ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color={color} />
    </mesh>
  )
}

const D4 = (props) => {
  const radius = 2
  const tetrahedronGeometry = new THREE.TetrahedronGeometry(radius)
  const [ref, api] = useConvexPolyhedron(() => {
    return {
      args: tetrahedronGeometry,
      mass: 1,
      ...props
    }
  })

  return (
    <Tetrahedron args={radius} ref={ref} onClick={() => api.applyImpulse([0, 20, 0], [0, 0, 0])} castShadow receiveShadow>
      <meshNormalMaterial attach="material" />
    </Tetrahedron>
  )
}

const D6 = (props) => {
  const radius = 2.5
  const [ref, api] = useBox(() => ({ args: [radius, radius, radius], mass: 1, ...props }))

  return (
    <Box args={[radius, radius, radius]} ref={ref} onClick={() => api.applyImpulse([0, 10, 0], [0, 0, 0])} castShadow receiveShadow>
      <meshNormalMaterial attach="material" />
    </Box>
  )
}

const D8 = (props) => {
  const radius = 2
  const octahedronGeometry = new THREE.OctahedronGeometry(radius)
  const [ref, api] = useConvexPolyhedron(() => {
    return {
      args: octahedronGeometry,
      mass: 1,
      ...props
    }
  })

  return (
    <Octahedron args={radius} ref={ref} onClick={() => api.applyImpulse([0, 20, 0], [0, 0, 0])} castShadow receiveShadow>
      <meshNormalMaterial attach="material" />
    </Octahedron>
  )
}

// TODO Use actual pentagonal trapezohedron geometry
// Manually built octahedron is just an example of PolyhedronGeometry
const D10 = (props) => {
  const radius = 2
  const vertices = [
    // Octahedron vertices
    // Magnitude doesn't matter, because each vertex is projected onto a unit sphere
    [0, 0, 1],
    [0, 0, -1],
    [-1, -1, 0],
    [1, -1, 0],
    [1, 1, 0],
    [-1, 1, 0]
  ].flat()
  const faces = [
    // Octahedron faces
    [0, 2, 3],
    [0, 3, 4],
    [0, 4, 5],
    [0, 5, 2],
    [1, 3, 2],
    [1, 4, 3],
    [1, 5, 4],
    [1, 2, 5]
  ].flat()
  const args = [vertices, faces, radius, 0]
  const d10Geometry = new THREE.PolyhedronGeometry(...args)
  const [ref, api] = useConvexPolyhedron(() => {
    return {
      args: d10Geometry,
      mass: 1,
      ...props
    }
  })

  return (
    <mesh ref={ref} onClick={() => api.applyImpulse([0, 20, 0], [0, 0, 0])} castShadow receiveShadow>
      <polyhedronGeometry attach="geometry" args={args} />
      {/* <meshNormalMaterial attach="material" /> */}
      <meshPhongMaterial attach="material" color={'red'} />
    </mesh>
  )
}

const D12 = (props) => {
  const radius = 2
  const dodecahedronGeometry = new THREE.DodecahedronGeometry(radius)
  const [ref, api] = useConvexPolyhedron(() => {
    return {
      args: dodecahedronGeometry,
      mass: 1,
      ...props
    }
  })

  return (
    <Dodecahedron args={radius} ref={ref} onClick={() => api.applyImpulse([0, 20, 0], [0, 0, 0])} castShadow receiveShadow>
      <meshNormalMaterial attach="material" />
    </Dodecahedron>
  )
}

const D20 = (props) => {
  const radius = 2
  const icosahedronGeometry = new THREE.IcosahedronGeometry(radius)
  const [ref, api] = useConvexPolyhedron(() => {
    return {
      args: icosahedronGeometry,
      mass: 1,
      ...props
    }
  })

  return (
    <Icosahedron args={radius} ref={ref} onClick={() => api.applyImpulse([0, 10, 0], [0, 0, 0])} castShadow receiveShadow>
      <meshNormalMaterial attach="material" />
    </Icosahedron>
  )
}

ReactDOM.render(
  <Canvas concurrent shadowMap sRGB gl={{ alpha: false }} camera={{ position: [0, -12, 16] }}>
    <hemisphereLight intensity={0.35} />
    <spotLight position={[30, 0, 30]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-mapSize-width={256} shadow-mapSize-height={256} />
    <pointLight position={[-30, 0, -30]} intensity={0.5} />
    <Physics gravity={[0, 0, -30]}>
      <Plane color={niceColors[17][4]} />
      <Plane color={niceColors[17][1]} position={[-10, 0, 0]} rotation={[0, 1, 0]} />
      <Plane color={niceColors[17][2]} position={[10, 0, 0]} rotation={[0, -1, 0]} />
      <Plane color={niceColors[17][3]} position={[0, 10, 0]} rotation={[1, 0, 0]} />
      <Plane color={niceColors[17][0]} position={[0, -10, 0]} rotation={[-1, 0, 0]} />
      <D4 position={[-4, 0, 2]} rotation={[0, 1, 0]} />
      <D6 position={[0, 0, 2]} />
      <D8 position={[0, 4, 2]} rotation={[1, 1, 0]} />
      <D10 position={[-4, -4, 2]} />
      <D12 position={[0, -4, 2]} rotation={[1, 0, 0]} />
      <D20 position={[4, 0, 2]} rotation={[2, 0, 0]} />
    </Physics>
  </Canvas>,
  document.getElementById('root')
)
