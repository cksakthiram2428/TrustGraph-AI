import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function NetworkGraph({ nodes, edges }) {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  useEffect(() => {
    if (!nodes || nodes.length === 0 || !edges || edges.length === 0) return;

    // Ensure edges have source/target properties
    const formattedEdges = edges.map(e => ({
      source: e.source ?? e.fromId ?? e[0],
      target: e.target ?? e.toId ?? e[1]
    }));

    const svg = d3.select(svgRef.current);
    const width = +svg.attr("width") || 600;
    const height = +svg.attr("height") || 400;

    svg.selectAll("*").remove();

    // Links
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(formattedEdges)
      .join("line")
      .attr("stroke-width", 1.5);

    // Nodes
    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.size ?? 10)
      .attr("fill", (d) => {
        if (d.score >= 80) return "#4ade80";
        if (d.score >= 50) return "#eab308";
        return "#f87171";
      });

    // Labels
    const label = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#fff")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.label || d.id)
      .attr("x", 12)
      .attr("y", 4);

    // Force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(formattedEdges).id((d) => d.id ?? d).distance(80).strength(0.5))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(20))
      .on("tick", () => {
        link
          .attr("x1", (d) => d.source.x ?? d.source)
          .attr("y1", (d) => d.source.y ?? d.source)
          .attr("x2", (d) => d.target.x ?? d.target)
          .attr("y2", (d) => d.target.y ?? d.target);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        label.attr("x", (d) => (d.x ?? 0) + 12).attr("y", (d) => (d.y ?? 0) + 4);
      });

    simulationRef.current = simulation;

    node
      .on("mouseover", (event, d) => setHoveredNodeId(d.id))
      .on("mouseout", () => setHoveredNodeId(null));

    return () => simulation.stop();
  }, [nodes, edges]);

  const hoveredNode = nodes?.find((n) => n.id === hoveredNodeId);

  return (
    <div className="w-full h-full relative">
      <svg ref={svgRef} width="100%" height="100%" style={{ display: "block" }} />
      {hoveredNode && (
        <div className="absolute glass-panel p-3 rounded-lg pointer-events-none" style={{ top: "10px", right: "10px", backgroundColor: 'rgba(18, 19, 20, 0.9)' }}>
          <div className="font-bold text-white mb-1">{hoveredNode.label}</div>
          <div className="text-sm text-gray-300">
            Score: <span className={hoveredNode.score >= 80 ? "text-green-400" : hoveredNode.score >= 50 ? "text-yellow-400" : "text-red-400"}>{hoveredNode.score}</span>
          </div>
        </div>
      )}
    </div>
  );
}