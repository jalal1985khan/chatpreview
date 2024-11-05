'use client'
import React, { useState } from 'react'

const ChartModule = ({ nodes }) => {
  const [toggle, setToggle] = useState(false)

  return (
    <div className="absolute right-0 bottom-0 p-10">
      {toggle && (
        <div className="lg:col-span-2 w-full bg-white rounded-t-lg">
          <div className="relative flex items-center p-3 border-b border-gray-300 bg-blue-400 rounded-t-lg">
            <span className="block ml-2 font-bold text-white">
              Chat Preview
            </span>
          </div>
          <div className="relative w-full p-6 overflow-y-auto h-auto">
            {nodes.map((node, index) => (
              <div key={node.id} className="mb-4">
                <h4 className="text-gray-800 font-semibold">Node {node.id}</h4>
                {node.data.components.length === 0 ? (
                  <p className="text-gray-500">No components added</p>
                ) : (
                  node.data.components.map((Component, compIndex) => (
                    <div key={compIndex} className="mb-2">
                      <Component /> {/* Render component preview */}
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="w-[500px] flex items-end justify-end">
        <div
          className="bg-red-400 text-black p-2 rounded-md cursor-pointer mt-4 w-[113px]"
          onClick={() => setToggle(!toggle)}
        >
          Chat Preview
        </div>
      </div>
    </div>
  )
}

export default ChartModule
