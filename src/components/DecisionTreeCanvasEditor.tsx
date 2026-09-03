import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  MarkerType,
  Node,
  Edge,
  Connection,
  NodeProps,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ArrowLeft,
  Save,
  GitBranch,
  FileText,
  Plus,
  Trash2,
  HelpCircle,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  FolderGit2,
  ChevronRight,
  Info,
  ListOrdered
} from 'lucide-react';
import { ServiceNode, ServiceNodeContentData, ContentBlock } from '../types';
import { MediaUploadField } from './MediaUploadField';

interface DecisionTreeCanvasEditorProps {
  tree: ServiceNode[];
  onSave: (newTree: ServiceNode[]) => void;
  onClose: () => void;
  serviceTitle?: string;
}

// Data payload stored inside each React Flow node
export interface DecisionNodeData extends Record<string, unknown> {
  title: string;
  nodeType: 'category' | 'content' | 'step';
  contentData: ServiceNodeContentData;
}

export type DecisionNodeType = Node<DecisionNodeData, 'decisionNode'>;

/* =========================================================================
   ADAPTER FUNCTIONS: ServiceNode[] <-> React Flow (nodes, edges)
   ========================================================================= */

/**
 * Converts recursive ServiceNode[] into flat React Flow nodes and edges
 * with automatic hierarchical (horizontal) layout.
 */
export function treeToFlow(tree: ServiceNode[]): { nodes: DecisionNodeType[]; edges: Edge[] } {
  if (!tree || tree.length === 0) {
    // Generate a default starter root node if completely empty
    const rootId = 'node_root_1';
    const initialNodes: DecisionNodeType[] = [
      {
        id: rootId,
        type: 'decisionNode',
        position: { x: 80, y: 120 },
        data: {
          title: 'Pregunta Inicial / Opción 1',
          nodeType: 'category',
          contentData: { text: '', imageUrl: '', videoUrl: '' }
        }
      }
    ];
    return { nodes: initialNodes, edges: [] };
  }

  let globalY = 60;
  const flowNodes: DecisionNodeType[] = [];
  const flowEdges: Edge[] = [];

  function traverse(node: ServiceNode, depth: number, parentId?: string): number {
    const x = depth * 320 + 80;
    let nodeY = globalY;

    if ((node.nodeType === 'category' || node.nodeType === 'step') && node.children && node.children.length > 0) {
      const childYs: number[] = [];
      for (const child of node.children) {
        const childY = traverse(child, depth + 1, node.id);
        childYs.push(childY);
      }
      // Center parent vertically relative to its children
      nodeY = (childYs[0] + childYs[childYs.length - 1]) / 2;
    } else {
      // Leaf node
      nodeY = globalY;
      globalY += 130;
    }

    flowNodes.push({
      id: node.id,
      type: 'decisionNode',
      position: { x, y: nodeY },
      data: {
        title: node.title || 'Nueva Opción',
        nodeType: node.nodeType,
        contentData: node.contentData ? { ...node.contentData } : { text: '', imageUrl: '', videoUrl: '' }
      }
    });

    if (parentId) {
      flowEdges.push({
        id: `e_${parentId}_${node.id}`,
        source: parentId,
        target: node.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
        }
      });
    }

    return nodeY;
  }

  for (const root of tree) {
    traverse(root, 0);
    globalY += 50; // Spacing between multiple top-level trees
  }

  return { nodes: flowNodes, edges: flowEdges };
}

/**
 * Converts flat React Flow nodes and edges back into the recursive ServiceNode[] structure.
 */
export function flowToTree(nodes: DecisionNodeType[], edges: Edge[]): ServiceNode[] {
  if (!nodes || nodes.length === 0) return [];

  const nodeMap = new Map<string, DecisionNodeType>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  // Build adjacency list for parent -> children
  const childrenMap = new Map<string, string[]>();
  const incomingDegree = new Map<string, number>();
  nodes.forEach(n => incomingDegree.set(n.id, 0));

  edges.forEach(e => {
    if (!childrenMap.has(e.source)) {
      childrenMap.set(e.source, []);
    }
    childrenMap.get(e.source)!.push(e.target);
    incomingDegree.set(e.target, (incomingDegree.get(e.target) || 0) + 1);
  });

  // Sort children by their visual Y position on canvas
  childrenMap.forEach((childIds) => {
    childIds.sort((a, b) => {
      const nodeA = nodeMap.get(a);
      const nodeB = nodeMap.get(b);
      return (nodeA?.position.y || 0) - (nodeB?.position.y || 0);
    });
  });

  // Root nodes are those without incoming connections (or top-level if isolated)
  const rootIds = nodes
    .filter(n => (incomingDegree.get(n.id) || 0) === 0)
    .sort((a, b) => a.position.y - b.position.y)
    .map(n => n.id);

  const visited = new Set<string>();

  function buildNode(id: string): ServiceNode | null {
    if (visited.has(id)) return null; // Avoid infinite loops in case of circular edges
    visited.add(id);

    const rawNode = nodeMap.get(id);
    if (!rawNode) return null;

    const data = rawNode.data;
    const nodeType = data.nodeType || 'category';

    const serviceNode: ServiceNode = {
      id: rawNode.id,
      title: data.title || 'Opción',
      nodeType: nodeType,
    };

    if (nodeType === 'category' || nodeType === 'step') {
      const childIds = childrenMap.get(id) || [];
      const children: ServiceNode[] = [];
      for (const cId of childIds) {
        const childNode = buildNode(cId);
        if (childNode) children.push(childNode);
      }
      serviceNode.children = children;
    }

    if (nodeType === 'content' || nodeType === 'step') {
      const blocks = data.contentData?.blocks && data.contentData.blocks.length > 0
        ? data.contentData.blocks
        : undefined;

      serviceNode.contentData = {
        text: data.contentData?.text || (blocks?.[0]?.text) || '',
        imageUrl: data.contentData?.imageUrl || (blocks?.[0]?.imageUrl) || '',
        videoUrl: data.contentData?.videoUrl || (blocks?.[0]?.videoUrl) || '',
        ...(blocks ? { blocks } : {})
      };
    }

    return serviceNode;
  }

  const result: ServiceNode[] = [];
  for (const rId of rootIds) {
    const rootNode = buildNode(rId);
    if (rootNode) result.push(rootNode);
  }

  // Pick up any orphaned nodes that were not reached
  for (const n of nodes) {
    if (!visited.has(n.id)) {
      const orphan = buildNode(n.id);
      if (orphan) result.push(orphan);
    }
  }

  return result;
}

/* =========================================================================
   CUSTOM FLOW NODE COMPONENT
   ========================================================================= */

const CustomDecisionNode: React.FC<NodeProps<DecisionNodeType>> = ({
  data,
  selected
}) => {
  const isCategory = data.nodeType === 'category';
  const isStep = data.nodeType === 'step';

  return (
    <div
      className={`w-64 bg-white rounded-xl border transition-all shadow-xs select-none ${
        selected
          ? isStep
            ? 'border-purple-600 ring-2 ring-purple-500/20 shadow-md'
            : isCategory
              ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
              : 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
          : isStep
            ? 'border-purple-200 hover:border-purple-400 hover:shadow-sm'
            : isCategory
              ? 'border-blue-200 hover:border-blue-400 hover:shadow-sm'
              : 'border-emerald-200 hover:border-emerald-400 hover:shadow-sm'
      }`}
    >
      {/* Target handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-slate-400 border-2 border-white rounded-full transition-transform hover:scale-125"
      />

      <div className="p-3">
        {/* Node header badge */}
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              isStep
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : isCategory
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
            }`}
          >
            {isStep ? (
              <>
                <ListOrdered className="w-3 h-3 text-purple-600" />
                <span>Paso</span>
              </>
            ) : isCategory ? (
              <>
                <FolderGit2 className="w-3 h-3 text-blue-600" />
                <span>Categoría</span>
              </>
            ) : (
              <>
                <FileText className="w-3 h-3 text-emerald-600" />
                <span>Contenido Final</span>
              </>
            )}
          </span>

          {/* Type Indicator Icon */}
          <div className="text-slate-400">
            {isStep ? (
              <ListOrdered className="w-3.5 h-3.5 text-purple-500" />
            ) : isCategory ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            )}
          </div>
        </div>

        {/* Node Title */}
        <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2">
          {data.title || 'Sin título'}
        </p>

        {/* Content snippet if content or step node */}
        {!isCategory && (data.contentData?.blocks?.[0]?.text || data.contentData?.text) && (
          <p className="text-[11px] text-gray-500 font-normal line-clamp-1 mt-1 italic">
            "{data.contentData?.blocks?.[0]?.text || data.contentData.text}"
          </p>
        )}
      </div>

      {/* Source handle (Right) - present for category AND step */}
      {(isCategory || isStep) && (
        <Handle
          type="source"
          position={Position.Right}
          className={`w-3 h-3 border-2 border-white rounded-full transition-transform hover:scale-125 ${
            isStep ? 'bg-purple-600' : 'bg-blue-600'
          }`}
        />
      )}
    </div>
  );
};

/* =========================================================================
   MAIN FULL-SCREEN CANVAS EDITOR COMPONENT
   ========================================================================= */

export const DecisionTreeCanvasEditor: React.FC<DecisionTreeCanvasEditorProps> = ({
  tree,
  onSave,
  onClose,
  serviceTitle = 'Trámite'
}) => {
  // Convert initial tree to React Flow graph
  const initialGraph = useMemo(() => treeToFlow(tree), [tree]);

  const [nodes, setNodes, onNodesChange] = useNodesState<DecisionNodeType>(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph.edges);

  // Selected node ID in the canvas
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    initialGraph.nodes.length > 0 ? initialGraph.nodes[0].id : null
  );

  // Define custom node types
  const nodeTypes = useMemo(() => ({ decisionNode: CustomDecisionNode }), []);

  // Find the currently selected node
  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Handle new connection between handles
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
          } as Edge,
          eds
        )
      );
    },
    [setEdges]
  );

  // Click on a node: select it for the properties sidebar
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Click on the empty canvas: deselect
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Update selected node data helper
  const updateSelectedNodeData = useCallback(
    (updates: Partial<DecisionNodeData>) => {
      if (!selectedNodeId) return;

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === selectedNodeId) {
            let nextContentData = updates.contentData !== undefined
              ? {
                  ...n.data.contentData,
                  ...updates.contentData,
                }
              : n.data.contentData;

            // Asegurar copia profunda del arreglo blocks y de cada bloque
            if (nextContentData?.blocks) {
              nextContentData = {
                ...nextContentData,
                blocks: nextContentData.blocks.map((b) => ({ ...b })),
              };
            }

            return {
              ...n,
              data: {
                ...n.data,
                ...updates,
                ...(nextContentData ? { contentData: nextContentData } : {}),
              },
            };
          }
          return n;
        })
      );
    },
    [selectedNodeId, setNodes]
  );

  // Add a new branch/child connected to the selected category node
  const handleAddChildBranch = useCallback(() => {
    if (!selectedNode) return;

    const newId = `node_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newX = selectedNode.position.x + 320;
    
    // Count existing children of this node to offset Y
    const existingChildrenEdges = edges.filter(e => e.source === selectedNode.id);
    const newY = selectedNode.position.y + (existingChildrenEdges.length * 130);

    const isStepParent = selectedNode.data.nodeType === 'step';

    const newNode: DecisionNodeType = {
      id: newId,
      type: 'decisionNode',
      position: { x: newX, y: newY },
      data: {
        title: isStepParent ? 'Siguiente' : 'Nueva Opción',
        nodeType: isStepParent ? 'step' : 'category',
        contentData: { text: '', imageUrl: '', videoUrl: '' }
      }
    };

    const newEdge: Edge = {
      id: `e_${selectedNode.id}_${newId}`,
      source: selectedNode.id,
      target: newId,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setSelectedNodeId(newId);
  }, [selectedNode, edges, setNodes, setEdges]);

  // Add a new root node
  const handleAddRootNode = useCallback(() => {
    const newId = `node_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const lowestY = nodes.reduce((max, n) => Math.max(max, n.position.y), 0);
    const newY = lowestY > 0 ? lowestY + 140 : 80;

    const newNode: DecisionNodeType = {
      id: newId,
      type: 'decisionNode',
      position: { x: 80, y: newY },
      data: {
        title: 'Nueva Pregunta / Opción Raíz',
        nodeType: 'category',
        contentData: { text: '', imageUrl: '', videoUrl: '' }
      }
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(newId);
  }, [nodes, setNodes]);

  // Delete the selected node
  const handleDeleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) return;

    // Remove node
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    // Remove any connected edges
    setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges]);

  // Auto-arrange layout
  const handleAutoArrange = useCallback(() => {
    const currentTree = flowToTree(nodes, edges);
    const arranged = treeToFlow(currentTree);
    setNodes(arranged.nodes);
    setEdges(arranged.edges);
  }, [nodes, edges, setNodes, setEdges]);

  // Step Blocks state and helpers for 'step' nodes
  const stepBlocks: ContentBlock[] = useMemo(() => {
    if (!selectedNode || selectedNode.data.nodeType !== 'step') return [];
    if (selectedNode.data.contentData?.blocks && selectedNode.data.contentData.blocks.length > 0) {
      return selectedNode.data.contentData.blocks;
    }
    return [
      {
        id: `block_${selectedNode.id}_1`,
        text: selectedNode.data.contentData?.text || '',
        imageUrl: selectedNode.data.contentData?.imageUrl || '',
        videoUrl: selectedNode.data.contentData?.videoUrl || '',
      },
    ];
  }, [selectedNode]);

  const handleAddBlock = useCallback(() => {
    if (!selectedNode) return;
    const currentBlocks: ContentBlock[] = (selectedNode.data.contentData?.blocks && selectedNode.data.contentData.blocks.length > 0)
      ? [...selectedNode.data.contentData.blocks]
      : [
          {
            id: `block_${selectedNode.id}_1`,
            text: selectedNode.data.contentData?.text || '',
            imageUrl: selectedNode.data.contentData?.imageUrl || '',
            videoUrl: selectedNode.data.contentData?.videoUrl || '',
          },
        ];

    const newBlock: ContentBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: '',
      imageUrl: '',
      videoUrl: '',
    };
    const updated = [...currentBlocks, newBlock];
    updateSelectedNodeData({
      contentData: {
        ...selectedNode.data.contentData,
        blocks: updated,
        text: updated[0]?.text || '',
        imageUrl: updated[0]?.imageUrl || '',
        videoUrl: updated[0]?.videoUrl || '',
      },
    });
  }, [selectedNode, updateSelectedNodeData]);

  const handleUpdateBlock = useCallback((blockId: string, patch: Partial<ContentBlock>) => {
    if (!selectedNode) return;
    const currentBlocks: ContentBlock[] = (selectedNode.data.contentData?.blocks && selectedNode.data.contentData.blocks.length > 0)
      ? [...selectedNode.data.contentData.blocks]
      : [
          {
            id: blockId,
            text: selectedNode.data.contentData?.text || '',
            imageUrl: selectedNode.data.contentData?.imageUrl || '',
            videoUrl: selectedNode.data.contentData?.videoUrl || '',
          },
        ];

    const updated = currentBlocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b));
    updateSelectedNodeData({
      contentData: {
        ...selectedNode.data.contentData,
        blocks: updated,
        text: updated[0]?.text || '',
        imageUrl: updated[0]?.imageUrl || '',
        videoUrl: updated[0]?.videoUrl || '',
      },
    });
  }, [selectedNode, updateSelectedNodeData]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    if (!selectedNode) return;
    const currentBlocks = selectedNode.data.contentData?.blocks || [];
    const filtered = currentBlocks.filter((b) => b.id !== blockId);
    const updated = filtered.length > 0 ? filtered : [
      {
        id: `block_${Date.now()}`,
        text: '',
        imageUrl: '',
        videoUrl: '',
      },
    ];
    updateSelectedNodeData({
      contentData: {
        ...selectedNode.data.contentData,
        blocks: updated,
        text: updated[0]?.text || '',
        imageUrl: updated[0]?.imageUrl || '',
        videoUrl: updated[0]?.videoUrl || '',
      },
    });
  }, [selectedNode, updateSelectedNodeData]);

  // Save and Close handler
  const handleSaveAndClose = () => {
    const finalTree = flowToTree(nodes, edges);
    onSave(finalTree);
  };

  return (
    <div className="w-screen h-screen fixed inset-0 z-50 bg-gray-50 flex flex-col overflow-hidden font-sans">
      {/* =========================================================================
          TOP NAVIGATION BAR
          ========================================================================= */}
      <header className="h-16 bg-white border-b border-gray-200 px-5 flex items-center justify-between shrink-0 z-10 shadow-2xs">
        {/* Left: Back & Save Action + Service Title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            title="Guardar cambios y volver a la vista anterior"
          >
            <Save className="w-4 h-4" />
            <span>Cerrar y Guardar</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            title="Descartar y volver sin guardar"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancelar</span>
          </button>

          <div className="h-6 w-px bg-gray-200 hidden sm:block" />

          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Editor de Diagrama de Flujo
            </span>
            <span className="text-sm font-bold text-gray-800 line-clamp-1 max-w-md">
              {serviceTitle}
            </span>
          </div>
        </div>

        {/* Right: Canvas Tools */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoArrange}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Reordenar automáticamente los nodos en columnas jerárquicas"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span className="hidden sm:inline">Auto-Organizar</span>
          </button>

          <button
            type="button"
            onClick={handleAddRootNode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Añadir una nueva opción de nivel principal"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>+ Rama Raíz</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN WORKSPACE: 75% CANVAS + 25% PROPERTIES SIDEBAR
          ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SECTION (75% width): React Flow Canvas */}
        <div className="flex-1 h-full bg-slate-50 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#3b82f6', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#cbd5e1" />
            <Controls className="bg-white border border-gray-200 rounded-xl shadow-xs p-1" />
            <MiniMap
              nodeColor={(n) => (n.data?.nodeType === 'step' ? '#9333ea' : n.data?.nodeType === 'content' ? '#10b981' : '#3b82f6')}
              className="bg-white/90 border border-gray-200 rounded-xl overflow-hidden shadow-xs"
              zoomable
              pannable
            />

            {/* Quick helper badge on canvas */}
            <Panel position="bottom-center" className="bg-white/90 backdrop-blur-xs border border-gray-200 px-3 py-1.5 rounded-full shadow-xs text-xs text-gray-500 font-medium flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Haz clic en cualquier nodo para editarlo o crear una rama hija</span>
            </Panel>
          </ReactFlow>
        </div>

        {/* RIGHT SECTION (25% width - Sidebar): Properties Editor */}
        <aside className="w-96 border-l border-gray-200 bg-white flex flex-col h-full overflow-y-auto shrink-0 z-10 shadow-xs">
          {selectedNode ? (
            <div className="flex-1 flex flex-col p-6 space-y-6 animate-fadeIn">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      selectedNode.data.nodeType === 'step'
                        ? 'bg-purple-50 text-purple-600 border border-purple-200'
                        : selectedNode.data.nodeType === 'category'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                    }`}
                  >
                    {selectedNode.data.nodeType === 'step' ? (
                      <ListOrdered className="w-4 h-4" />
                    ) : selectedNode.data.nodeType === 'category' ? (
                      <FolderGit2 className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      Propiedades del Nodo
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium">
                      ID: {selectedNode.id}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDeleteSelectedNode}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Eliminar este nodo del diagrama"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Título del Nodo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Título de la Opción / Pregunta
                </label>
                <input
                  type="text"
                  value={selectedNode.data.title}
                  onChange={(e) => updateSelectedNodeData({ title: e.target.value })}
                  placeholder="Ej: ¿Qué tipo de incapacidad tienes?"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all"
                />
                <p className="text-[11px] text-gray-400">
                  Es el texto que verá el colaborador en el botón de selección.
                </p>
              </div>

              {/* 2. Selector de Tipo de Nodo (3 columnas) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Tipo de Nodo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => updateSelectedNodeData({ nodeType: 'category' })}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      selectedNode.data.nodeType === 'category'
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 text-blue-950 shadow-2xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <FolderGit2 className={`w-3.5 h-3.5 ${selectedNode.data.nodeType === 'category' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="text-xs font-bold leading-tight">Categoría</span>
                    </div>
                    <span className="text-[10px] text-gray-500 leading-tight">
                      Solo botones
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const currentBlocks = (selectedNode.data.contentData?.blocks && selectedNode.data.contentData.blocks.length > 0)
                        ? selectedNode.data.contentData.blocks
                        : [
                            {
                              id: `block_${selectedNode.id}_1`,
                              text: selectedNode.data.contentData?.text || '',
                              imageUrl: selectedNode.data.contentData?.imageUrl || '',
                              videoUrl: selectedNode.data.contentData?.videoUrl || '',
                            }
                          ];
                      updateSelectedNodeData({
                        nodeType: 'step',
                        contentData: {
                          ...selectedNode.data.contentData,
                          blocks: currentBlocks,
                        }
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      selectedNode.data.nodeType === 'step'
                        ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600 text-purple-950 shadow-2xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ListOrdered className={`w-3.5 h-3.5 ${selectedNode.data.nodeType === 'step' ? 'text-purple-600' : 'text-gray-400'}`} />
                      <span className="text-xs font-bold leading-tight">Paso Tutorial</span>
                    </div>
                    <span className="text-[10px] text-gray-500 leading-tight">
                      Contenido + Botón
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSelectedNodeData({ nodeType: 'content' })}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      selectedNode.data.nodeType === 'content'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 text-emerald-950 shadow-2xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <FileText className={`w-3.5 h-3.5 ${selectedNode.data.nodeType === 'content' ? 'text-emerald-600' : 'text-gray-400'}`} />
                      <span className="text-xs font-bold leading-tight">Contenido</span>
                    </div>
                    <span className="text-[10px] text-gray-500 leading-tight">
                      Respuesta final
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. Contenido condicional según tipo */}
              <div className="space-y-4">
                {/* CAMPOS DE CONTENIDO PARA PASO DE TUTORIAL (MÚLTIPLES BLOQUES) */}
                {selectedNode.data.nodeType === 'step' && (
                  <div className="pt-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                        Bloques de Contenido del Paso
                      </label>
                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                        {stepBlocks.length} {stepBlocks.length === 1 ? 'bloque' : 'bloques'}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {stepBlocks.map((block, index) => (
                        <div
                          key={block.id}
                          className="p-3.5 bg-gray-50/90 border border-gray-200 rounded-xl space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-extrabold">
                                {index + 1}
                              </span>
                              Bloque #{index + 1}
                            </span>
                            {stepBlocks.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteBlock(block.id)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Eliminar bloque"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Textarea */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-gray-600 block">
                              Texto / Instrucciones
                            </label>
                            <textarea
                              rows={3}
                              value={block.text || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { text: e.target.value })}
                              placeholder="Escribe aquí las instrucciones de esta sección..."
                              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-normal text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-hidden transition-all leading-relaxed"
                            />
                          </div>

                          {/* MediaUploadField Imagen */}
                          <div className="space-y-1">
                            <MediaUploadField
                              type="image"
                              label="Imagen o Infografía (Opcional)"
                              value={block.imageUrl || ''}
                              onChange={(url) => handleUpdateBlock(block.id, { imageUrl: url })}
                              helperText="Sube una captura o infografía para este bloque."
                              idPrefix={`step_img_${block.id}`}
                            />
                          </div>

                          {/* Enlace de Video */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-gray-600 flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5 text-gray-500" />
                              Enlace de Video (YouTube, Vimeo o MP4)
                            </label>
                            <input
                              type="url"
                              value={block.videoUrl || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { videoUrl: e.target.value })}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-normal text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-hidden transition-all"
                            />
                          </div>
                        </div>
                      ))}

                      {/* Botón Añadir otro bloque de contenido */}
                      <button
                        type="button"
                        onClick={handleAddBlock}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-4 h-4 text-purple-600" />
                        <span>+ Añadir otro bloque de contenido</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* CAMPOS DE CONTENIDO: Se muestran para 'content' */}
                {selectedNode.data.nodeType === 'content' && (
                  <div className="pt-2 space-y-4">
                    {/* Texto Explicativo */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                        Texto Explicativo / Instrucciones
                      </label>
                      <textarea
                        rows={4}
                        value={selectedNode.data.contentData.text || ''}
                        onChange={(e) =>
                          updateSelectedNodeData({
                            contentData: {
                              ...selectedNode.data.contentData,
                              text: e.target.value,
                            },
                          })
                        }
                        placeholder="Escribe aquí los pasos detallados, requisitos o instrucciones..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-normal text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all leading-relaxed"
                      />
                    </div>

                    {/* Imagen / Infografía */}
                    <div className="space-y-1.5">
                      <MediaUploadField
                        type="image"
                        label="Imagen o Infografía (Opcional)"
                        value={selectedNode.data.contentData.imageUrl || ''}
                        onChange={(url) =>
                          updateSelectedNodeData({
                            contentData: {
                              ...selectedNode.data.contentData,
                              imageUrl: url,
                            },
                          })
                        }
                        helperText="Sube una captura del formato o una infografía explicativa."
                        idPrefix={`node_img_${selectedNode.id}`}
                      />
                    </div>

                    {/* Enlace de Video */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-gray-500" />
                        Enlace de Video (YouTube, Vimeo o MP4)
                      </label>
                      <input
                        type="url"
                        value={selectedNode.data.contentData.videoUrl || ''}
                        onChange={(e) =>
                          updateSelectedNodeData({
                            contentData: {
                              ...selectedNode.data.contentData,
                              videoUrl: e.target.value,
                            },
                          })
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-normal text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all"
                      />
                      <p className="text-[11px] text-gray-400">
                        Opcional. El video se reproducirá directamente en la tarjeta de respuesta.
                      </p>
                    </div>
                  </div>
                )}

                {/* ACCIONES DE RAMIFICACIÓN: Se muestran para 'category' y para 'step' */}
                {(selectedNode.data.nodeType === 'category' || selectedNode.data.nodeType === 'step') && (
                  <div className={`space-y-3 ${selectedNode.data.nodeType === 'step' ? 'pt-4 border-t border-gray-100' : 'pt-2'}`}>
                    <div className={`p-3.5 rounded-xl space-y-1.5 border ${
                      selectedNode.data.nodeType === 'step'
                        ? 'bg-purple-50/60 border-purple-100 text-purple-900'
                        : 'bg-blue-50/60 border-blue-100 text-blue-900'
                    }`}>
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        {selectedNode.data.nodeType === 'step' ? (
                          <>
                            <ListOrdered className="w-3.5 h-3.5 text-purple-600" />
                            Ramas y Pasos Siguientes
                          </>
                        ) : (
                          <>
                            <GitBranch className="w-3.5 h-3.5 text-blue-600" />
                            Opciones y Ramificaciones
                          </>
                        )}
                      </span>
                      <p className={`text-[11px] leading-relaxed font-normal ${
                        selectedNode.data.nodeType === 'step' ? 'text-purple-700' : 'text-blue-700'
                      }`}>
                        {selectedNode.data.nodeType === 'step'
                          ? 'Añade botones para avanzar al paso siguiente (ej: "Siguiente >", "Opción alternativa") que se renderizarán debajo del contenido.'
                          : 'Este nodo actúa como una bifurcación. Añade nuevas ramas para que el colaborador elija el siguiente paso en el flujo.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddChildBranch}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-dashed rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer group ${
                        selectedNode.data.nodeType === 'step'
                          ? 'border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-700'
                          : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-700'
                      }`}
                    >
                      <Plus className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        selectedNode.data.nodeType === 'step' ? 'text-purple-600' : 'text-blue-600'
                      }`} />
                      <span>
                        {selectedNode.data.nodeType === 'step'
                          ? '+ Añadir Paso Siguiente / Rama'
                          : '+ Añadir Nueva Rama / Opción'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty state when no node is selected */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 text-gray-400">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                <GitBranch className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-700">
                  Ningún Nodo Seleccionado
                </h4>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  Haz clic sobre cualquier tarjeta del lienzo para editar sus propiedades o conectar nuevas ramas.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRootNode}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Crear Nueva Rama Raíz</span>
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default DecisionTreeCanvasEditor;
