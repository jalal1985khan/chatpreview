'use client' // If using Next.js, ensure to add this for client-side rendering
import React, { useCallback, useState } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
} from '@xyflow/react' // Ensure you have the correct imports for your ReactFlow setup
import '@xyflow/react/dist/style.css'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  TextBox,
  TextInput,
  ButtonComponent,
  ImageInput,
} from '@/components/DraggableComponents' // Adjust the import path as needed
import ChartModule from '@/components/ChatModule/page' // Ensure this path is correct

const ItemTypes = {
  COMPONENT: 'component',
}

// Define the TextUpdaterNode component
const TextUpdaterNode = ({ data }) => {
  return (
    <div className="bg-yellow-100 relative rounded-sm border border-gray-600 p-1">
      <Handle type="target" position="top" style={{ background: '#555' }} />
      <Handle type="source" position="bottom" style={{ background: '#555' }} />

      {data.components.length === 0 && (
        <p className="text-black border border-gray-500 rounded-md">
          Drag & Drop Here
        </p>
      )}

      {data.components.map((Component, index) => (
        <div key={index} style={{ marginTop: '5px' }}>
          <Component />
        </div>
      ))}
    </div>
  )
}

const DraggableComponent = ({ component: Component }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COMPONENT,
    item: { component: Component },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="bg-green-300 p-2 m-1"
    >
      <Component />
    </div>
  )
}

const NodeComponent = ({ data, onDelete, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.COMPONENT,
    drop: (item) => onDrop(item.component),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  return (
    <div ref={drop}>
      <TextUpdaterNode data={data} />
      <button
        onClick={onDelete}
        className="bg-red-500 rounded-sm text-[5px] absolute -top-4 left-0 p-1"
      >
        X
      </button>
    </div>
  )
}

function Flow() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  )

  const addNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      label: 'hello',
      data: { components: [] },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    )
  }

  const handleDrop = (component, nodeId) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            components: [...node.data.components, component],
          },
        }
      }
      return node
    })

    setNodes(updatedNodes)
  }

  const nodeTypes = {
    default: (props) => (
      <NodeComponent
        {...props}
        onDelete={() => deleteNode(props.id)}
        onDrop={(component) => handleDrop(component, props.id)}
      />
    ),
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ height: '100vh', display: 'flex' }}>
        <div className="bg-pink-800 p-4 gap-2">
          <h3>Draggable Components</h3>
          <DraggableComponent component={TextBox} />
          <DraggableComponent component={TextInput} />
          <DraggableComponent component={ButtonComponent} />
          <DraggableComponent component={ImageInput} />
        </div>
        <div style={{ flexGrow: 1, position: 'relative' }}>
          <button
            onClick={addNode}
            style={{
              position: 'absolute',
              zIndex: 10,
              padding: '10px',
              margin: '10px',
            }}
            className="bg-blue-400 text-white rounded-md"
          >
            Add Node
          </button>
          <ReactFlow
            nodes={nodes.map((node) => ({ ...node, type: 'default' }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <ChartModule nodes={nodes} />{' '}
        {/* Pass nodes to ChartModule for preview */}
      </div>
    </DndProvider>
  )
}

export default Flow
