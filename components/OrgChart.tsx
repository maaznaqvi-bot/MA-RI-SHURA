
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ShuraMember, HierarchyNode } from '../types';
import { COLORS } from '../constants';

interface OrgChartProps {
  data: ShuraMember[];
  allowZoom?: boolean;
  onNodeClick?: (member: ShuraMember) => void;
}

const OrgChart: React.FC<OrgChartProps> = ({ data, allowZoom = false, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [intrinsicHeight, setIntrinsicHeight] = useState<string | number>('auto');

  useEffect(() => {
    if (!svgRef.current || !data.length || !tooltipRef.current) return;

    const tooltip = d3.select(tooltipRef.current);

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    try {
      const stratify = d3.stratify<ShuraMember>()
        .id(d => d.id)
        .parentId(d => d.parentId);

      const root = stratify(data);

      const nodeWidth = 240; 
      const nodeHeight = 110;
      
      const horizontalGap = allowZoom ? 300 : 280;
      const verticalGap = allowZoom ? 180 : 160;

      const treeLayout = d3.tree<HierarchyNode>()
        .nodeSize([horizontalGap, verticalGap]); 

      const treeData = treeLayout(root as any);

      let minX = 0, maxX = 0, minY = 0, maxY = 0;
      treeData.each((d: any) => {
        if (d.x < minX) minX = d.x;
        if (d.x > maxX) maxX = d.x;
        if (d.y < minY) minY = d.y;
        if (d.y > maxY) maxY = d.y;
      });

      const marginX = 60;
      const marginY = 60;
      const totalWidth = maxX - minX + nodeWidth + marginX * 2;
      const totalHeight = maxY - minY + nodeHeight + marginY * 2;

      // Set intrinsic aspect ratio
      const aspectRatio = totalHeight / totalWidth;
      if (!allowZoom) {
        // If not zooming, we can let the chart grow proportionally to its width
        setIntrinsicHeight('auto');
      } else {
        // For zoomable charts, we need a stable container height
        setIntrinsicHeight(500);
      }

      const svgMain = d3.select(svgRef.current)
        .attr('viewBox', `${minX - nodeWidth/2 - marginX} ${minY - marginY} ${totalWidth} ${totalHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .style('width', '100%')
        .style('height', allowZoom ? '100%' : 'auto');

      const container = svgMain.append('g');

      if (allowZoom) {
        const zoom = d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.1, 8])
          .on('zoom', (event) => {
            container.attr('transform', event.transform);
          });
        svgMain.call(zoom as any);
        svgMain.style('cursor', 'grab');
        
        // Initial fit for charts
        if (data.length > 3) {
           svgMain.transition().duration(500).call(zoom.scaleTo as any, 0.9);
        }
      }

      container.selectAll('.link')
        .data(treeData.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', COLORS.accent)
        .attr('stroke-width', 2.5)
        .attr('opacity', 0.5)
        .attr('d', d3.linkVertical()
          .x((d: any) => d.x)
          .y((d: any) => d.y) as any);

      const nodes = container.selectAll('.node')
        .data(treeData.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d: any) => `translate(${d.x - nodeWidth / 2}, ${d.y - nodeHeight / 2})`)
        .style('cursor', 'pointer')
        .on('click', (event, d: any) => {
          if (onNodeClick) onNodeClick(d.data);
        })
        .on('mouseover', (event, d: any) => {
          const member = d.data as ShuraMember;
          tooltip.transition().duration(200).style('opacity', 1);
          tooltip.html(`
            <div class="flex flex-col gap-1">
              <div class="text-[11px] font-black uppercase tracking-widest" style="color: ${COLORS.accent}">${member.role}</div>
              <div class="text-sm font-bold text-white">${member.name}</div>
              <div class="text-[10px] text-white/60 font-medium italic mt-1">Click for full profile</div>
            </div>
          `);
        })
        .on('mousemove', (event) => {
          tooltip.style('left', (event.pageX + 15) + 'px').style('top', (event.pageY - 15) + 'px');
        })
        .on('mouseout', () => {
          tooltip.transition().duration(200).style('opacity', 0);
        });

      nodes.append('rect')
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('rx', 16)
        .attr('ry', 16)
        .attr('fill', d => {
          if (d.depth === 0 && d.data.role === 'SRC') return '#062d22';
          if (d.data.role === 'NNC') return '#1e40af'; 
          if (d.data.role === 'Core Team') return '#374151'; 
          return COLORS.primary; 
        })
        .attr('stroke', COLORS.accent)
        .attr('stroke-width', 2.5)
        .style('filter', 'drop-shadow(0px 6px 12px rgba(0,0,0,0.15))');

      nodes.append('text')
        .attr('x', nodeWidth / 2)
        .attr('y', nodeHeight / 2 - 2)
        .attr('text-anchor', 'middle')
        .attr('fill', COLORS.white)
        .attr('font-weight', '700')
        .attr('font-size', '15px')
        .attr('pointer-events', 'none')
        .text((d: any) => d.data.name);

      nodes.append('text')
        .attr('x', nodeWidth / 2)
        .attr('y', nodeHeight / 2 + 25)
        .attr('text-anchor', 'middle')
        .attr('fill', COLORS.accent)
        .attr('font-size', '11px')
        .attr('text-transform', 'uppercase')
        .attr('font-weight', '800')
        .attr('letter-spacing', '0.8px')
        .attr('pointer-events', 'none')
        .text((d: any) => d.data.role);

    } catch (e) {
      console.error("D3 OrgChart render error:", e);
    }
  }, [data, allowZoom, onNodeClick]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden relative transition-all duration-500 p-4`}
      style={{ height: intrinsicHeight }}
    >
      <svg ref={svgRef} className={`block transition-all`} />
      <div ref={tooltipRef} className="fixed pointer-events-none bg-[#0b3d2e] border border-[#c8a951]/30 p-4 rounded-xl shadow-2xl opacity-0 z-[9999] min-w-[180px] max-w-[320px]" style={{ transition: 'opacity 0.2s ease-out' }}></div>
      
      {allowZoom && (
        <div className="absolute top-4 right-4 bg-[#0b3d2e]/80 backdrop-blur text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-md z-10 pointer-events-none flex items-center gap-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          Zoom
        </div>
      )}
    </div>
  );
};

export default OrgChart;
