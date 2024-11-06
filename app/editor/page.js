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
  WelcomeMessage,
  TextBox,
  TextInput,
  ButtonComponent,
  ImageInput,
  SelectComponent,
  TextArea,
} from '@/components/DraggableComponents' // Adjust the import path as needed
import ChartModule from '@/components/ChatModule/page' // Ensure this path is correct

const ItemTypes = {
  COMPONENT: 'component',
}

// Define the DraggableComponentWithHandles component
const DraggableComponentWithHandles = ({ Component, index, color }) => {
  return (
    <div style={{ position: 'relative', marginTop: '5px' }}>
      <Handle
        type="target"
        position="top"
        id={`target-${index}`}
        style={{ background: color }}
      />
      <Component />
      <Handle
        type="source"
        position="bottom"
        id={`source-${index}`}
        style={{ background: color }}
      />
    </div>
  )
}

// Define the TextUpdaterNode component
const TextUpdaterNode = ({ data }) => {
  const nodeStyle = {
    backgroundColor: data.isStartNode ? '#4CAF50' : '#FFC107', // Green for start node, orange for others
    borderColor: data.isStartNode ? 'green' : 'gray',
    padding: '1rem',
    borderRadius: '0.25rem',
    borderWidth: '2px',
    borderStyle: 'solid',
  }

  return (
    <div className="relative" style={nodeStyle}>
      {!data.isStartNode && (
        <Handle
          type="target"
          position="top"
          style={{ background: data.color }}
        />
      )}
      <Handle
        type="source"
        position="bottom"
        style={{ background: data.color }}
      />

      {data.isStartNode && <p className="text-white font-bold">Start Node</p>}

      {data.components.length === 0 && (
        <p className="text-black border border-gray-500 rounded-md">
          Drag & Drop Here
        </p>
      )}

      {data.components.map((Component, index) => (
        <DraggableComponentWithHandles
          key={index}
          Component={Component}
          index={index}
          color={data.color}
        />
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
      className="bg-green-300 p-2 m-1 rounded-md"
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
    <div ref={drop} style={{ position: 'relative' }}>
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
    (params) => {
      const sourceNode = nodes.find((node) => node.id === params.source)
      const edgeColor = sourceNode?.data.color || '#000'

      const newEdge = {
        ...params,
        style: { stroke: edgeColor, strokeWidth: 2 }, // Set edge color and width
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [nodes]
  )

  const addNode = () => {
    const isStartNode = nodes.length === 0
    const newNode = {
      id: (nodes.length + 1).toString(),
      label: isStartNode ? 'Start Node' : 'Node',
      data: {
        components: [],
        isStartNode,
        color: isStartNode ? '#4CAF50' : '#FFC107', // Green for start node, orange for others
      },
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
          <DraggableComponent component={WelcomeMessage} />
          <DraggableComponent component={TextArea} />
          <DraggableComponent component={TextInput} />
          <DraggableComponent component={ButtonComponent} />
          <DraggableComponent component={ImageInput} />
          <DraggableComponent component={SelectComponent} />
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
