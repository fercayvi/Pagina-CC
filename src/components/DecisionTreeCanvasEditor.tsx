import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
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
  ListOrdered,
  Undo2,
  Redo2,
  Compass,
  Edit3,
  Layers,
  AlertTriangle,
  X
} from 'lucide-react';
import { ServiceNode, ServiceNodeContentData, ContentBlock, LayoutBlock } from '../types';
import { PageBuilderFullScreenEditor } from './PageBuilderFullScreenEditor';

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
  blocks?: LayoutBlock[];
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
        contentData: node.contentData ? { ...node.contentData } : { text: '', imageUrl: '', videoUrl: '' },
        blocks: node.blocks || node.contentData?.layoutBlocks || []
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
      blocks: data.blocks && data.blocks.length > 0 ? data.blocks : undefined,
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
      const layoutBlocks = data.blocks && data.blocks.length > 0
        ? data.blocks
        : data.contentData?.layoutBlocks && data.contentData.layoutBlocks.length > 0
          ? data.contentData.layoutBlocks
          : undefined;

      serviceNode.contentData = {
        text: data.contentData?.text || '',
        imageUrl: data.contentData?.imageUrl || '',
        videoUrl: data.contentData?.videoUrl || '',
        ...(layoutBlocks ? { layoutBlocks } : {})
      };

      if (layoutBlocks) {
        serviceNode.blocks = layoutBlocks;
      }
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

/**
 * Returns all node IDs reachable from a given node by following outgoing edges.
 */
export function getDescendants(startId: string, currentEdges: Edge[]): Set<string> {
  const toDelete = new Set<string>();
  const queue = [startId];
  toDelete.add(startId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const outgoing = currentEdges.filter(e => e.source === current);
    for (const edge of outgoing) {
      if (!toDelete.has(edge.target)) {
        toDelete.add(edge.target);
        queue.push(edge.target);
      }
    }
  }
  return toDelete;
}

/**
 * Checks whether adding an edge source -> target would form a cycle in currentEdges.
 */
export function wouldFormCycle(sourceId: string, targetId: string, currentEdges: Edge[]): boolean {
  if (sourceId === targetId) return true;

  const visited = new Set<string>();
  const queue = [targetId];
  visited.add(targetId);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === sourceId) return true;

    const outgoing = currentEdges.filter(e => e.source === curr);
    for (const edge of outgoing) {
      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        queue.push(edge.target);
      }
    }
  }
  return false;
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
          {(!data.title || data.title.trim() === '' || data.title === '-') ? 'Continuar' : data.title}
        </p>

        {/* Content snippet or blocks count if content or step node */}
        {!isCategory && (
          <div className="mt-1.5">
            {data.blocks && data.blocks.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.5 rounded-md">
                <Layers className="w-3 h-3 text-indigo-600" />
                {data.blocks.length} {data.blocks.length === 1 ? 'bloque' : 'bloques'}
              </span>
            ) : (data.contentData?.blocks?.[0]?.text || data.contentData?.text) ? (
              <p className="text-[11px] text-gray-500 font-normal line-clamp-1 italic">
                "{data.contentData?.blocks?.[0]?.text || data.contentData.text}"
              </p>
            ) : null}
          </div>
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

  // Track if initial tree arrived empty
  const initialTreeWasEmptyRef = useRef<boolean>(!tree || tree.length === 0);
  // Track initial serialized tree for Cancel confirmation
  const initialTreeJsonRef = useRef<string>(JSON.stringify(tree || []));

  // History State for Undo/Redo
  interface HistoryStep {
    nodes: DecisionNodeType[];
    edges: Edge[];
  }
  const [history, setHistory] = useState<HistoryStep[]>([
    { nodes: initialGraph.nodes, edges: initialGraph.edges }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const debounceHistoryTimerRef = useRef<any>(null);
  const [showMinimap, setShowMinimap] = useState<boolean>(true);

  // In-app modal confirmation states (prevents silent iframe browser dialog suppression)
  const [deleteModal, setDeleteModal] = useState<{
    nodeId: string;
    count: number;
    title: string;
  } | null>(null);
  const [typeChangeModal, setTypeChangeModal] = useState<{
    outgoingCount: number;
  } | null>(null);
  const [saveWarningsModal, setSaveWarningsModal] = useState<string[] | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);

  const pushHistorySnapshot = useCallback((newNodes: DecisionNodeType[], newEdges: Edge[]) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, { nodes: newNodes, edges: newEdges }].slice(-30);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 29));
  }, [historyIndex]);

  const scheduleDebouncedHistory = useCallback((newNodes: DecisionNodeType[], newEdges: Edge[]) => {
    if (debounceHistoryTimerRef.current) {
      clearTimeout(debounceHistoryTimerRef.current);
    }
    debounceHistoryTimerRef.current = setTimeout(() => {
      pushHistorySnapshot(newNodes, newEdges);
    }, 500);
  }, [pushHistorySnapshot]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const target = history[prevIdx];
      setNodes(target.nodes);
      setEdges(target.edges);
      setHistoryIndex(prevIdx);
    }
  }, [historyIndex, history, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const target = history[nextIdx];
      setNodes(target.nodes);
      setEdges(target.edges);
      setHistoryIndex(nextIdx);
    }
  }, [historyIndex, history, setNodes, setEdges]);

  // Atajos de teclado: Ctrl+Z para Deshacer, Ctrl+Y o Ctrl+Shift+Z para Rehacer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

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

  // Validar conexiones en ReactFlow (rechazar self-loop, nodo con padre previo, ciclos)
  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      const source = connection.source;
      const target = connection.target;
      if (!source || !target) return false;
      // 1. Rechazar conexiones de un nodo consigo mismo
      if (source === target) return false;

      // 2. Rechazar conexiones hacia un nodo que ya tiene padre (cada nodo solo puede tener un padre)
      const edgeId = 'id' in connection ? connection.id : undefined;
      const targetAlreadyHasParent = edges.some(e => e.target === target && e.id !== edgeId);
      if (targetAlreadyHasParent) return false;

      // 3. Rechazar conexiones que formen ciclos
      if (wouldFormCycle(source, target, edges)) return false;

      return true;
    },
    [edges]
  );

  // Handle new connection between handles (sin llamar pushHistorySnapshot dentro del updater de setEdges)
  const onConnect = useCallback(
    (params: Connection) => {
      if (!isValidConnection(params)) return;

      const newEdge: Edge = {
        ...params,
        id: `e_${params.source}_${params.target}`,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
      };

      const nextEdges = addEdge(newEdge, edges);
      setEdges(nextEdges);
      pushHistorySnapshot(nodes, nextEdges);
    },
    [isValidConnection, edges, nodes, setEdges, pushHistorySnapshot]
  );

  // Registrar movimiento de nodos en el historial al soltar
  const onNodeDragStop = useCallback(() => {
    pushHistorySnapshot(nodes, edges);
  }, [nodes, edges, pushHistorySnapshot]);

  // Click on a node: select it for the properties sidebar
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Click on the empty canvas: deselect
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Update selected node data helper con debounce de 500ms
  const updateSelectedNodeData = useCallback(
    (updates: Partial<DecisionNodeData>, immediateHistory: boolean = false, overrideEdges?: Edge[]) => {
      if (!selectedNodeId) return;

      const currentEdges = overrideEdges || edges;
      const nextNodes = nodes.map((n) => {
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
      });

      setNodes(nextNodes);

      if (immediateHistory) {
        if (debounceHistoryTimerRef.current) clearTimeout(debounceHistoryTimerRef.current);
        pushHistorySnapshot(nextNodes, currentEdges);
      } else {
        scheduleDebouncedHistory(nextNodes, currentEdges);
      }
    },
    [selectedNodeId, nodes, edges, setNodes, pushHistorySnapshot, scheduleDebouncedHistory]
  );

  // Cambiar tipo de nodo con confirmación si se cambia a Contenido y tiene ramas conectadas
  const handleChangeNodeType = useCallback(
    (newType: 'category' | 'step' | 'content') => {
      if (!selectedNode) return;
      const currentType = selectedNode.data.nodeType;
      if (currentType === newType) return;

      if (newType === 'content' && (currentType === 'category' || currentType === 'step')) {
        const outgoingEdges = edges.filter((e) => e.source === selectedNode.id);
        if (outgoingEdges.length > 0) {
          setTypeChangeModal({ outgoingCount: outgoingEdges.length });
          return;
        }
      }

      updateSelectedNodeData({ nodeType: newType }, true);
    },
    [selectedNode, edges, updateSelectedNodeData]
  );

  const confirmTypeChange = useCallback(() => {
    if (!selectedNode || !typeChangeModal) return;

    const nextEdges = edges.filter((e) => e.source !== selectedNode.id);
    setEdges(nextEdges);
    updateSelectedNodeData({ nodeType: 'content' }, true, nextEdges);
    setTypeChangeModal(null);
  }, [selectedNode, typeChangeModal, edges, setEdges, updateSelectedNodeData]);

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

    const nextNodes = [...nodes, newNode];
    const nextEdges = [...edges, newEdge];
    setNodes(nextNodes);
    setEdges(nextEdges);
    pushHistorySnapshot(nextNodes, nextEdges);
    setSelectedNodeId(newId);
  }, [selectedNode, edges, nodes, setNodes, setEdges, pushHistorySnapshot]);

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

    const nextNodes = [...nodes, newNode];
    setNodes(nextNodes);
    pushHistorySnapshot(nextNodes, edges);
    setSelectedNodeId(newId);
  }, [nodes, edges, setNodes, pushHistorySnapshot]);

  // Delete the selected node and all its descendants (opens in-app confirmation modal)
  const handleDeleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;

    const toDelete = getDescendants(selectedNode.id, edges);
    const count = toDelete.size;

    setDeleteModal({
      nodeId: selectedNode.id,
      count,
      title: selectedNode.data.title || 'Continuar'
    });
  }, [selectedNode, edges]);

  const confirmDeleteNode = useCallback(() => {
    if (!deleteModal) return;

    const toDelete = getDescendants(deleteModal.nodeId, edges);
    const nextNodes = nodes.filter((n) => !toDelete.has(n.id));
    const nextEdges = edges.filter((e) => !toDelete.has(e.source) && !toDelete.has(e.target));

    setNodes(nextNodes);
    setEdges(nextEdges);
    pushHistorySnapshot(nextNodes, nextEdges);
    setSelectedNodeId(null);
    setDeleteModal(null);
  }, [deleteModal, edges, nodes, setNodes, setEdges, pushHistorySnapshot]);

  // Auto-arrange layout
  const handleAutoArrange = useCallback(() => {
    const currentTree = flowToTree(nodes, edges);
    const arranged = treeToFlow(currentTree);
    setNodes(arranged.nodes);
    setEdges(arranged.edges);
    pushHistorySnapshot(arranged.nodes, arranged.edges);
  }, [nodes, edges, setNodes, setEdges, pushHistorySnapshot]);

  // Full-screen Page Builder Modal state for editing node blocks
  const [isPageBuilderOpen, setIsPageBuilderOpen] = useState(false);
  const [editorBlocks, setEditorBlocks] = useState<LayoutBlock[]>([]);

  // Compute LayoutBlock[] for selectedNode, migrating legacy contentData if needed
  const selectedNodeBlocks: LayoutBlock[] = useMemo(() => {
    if (!selectedNode) return [];
    if (selectedNode.data.blocks && selectedNode.data.blocks.length > 0) {
      return selectedNode.data.blocks;
    }
    if ((selectedNode as any).blocks && (selectedNode as any).blocks.length > 0) {
      return (selectedNode as any).blocks;
    }
    if (selectedNode.data.contentData?.layoutBlocks && selectedNode.data.contentData.layoutBlocks.length > 0) {
      return selectedNode.data.contentData.layoutBlocks;
    }
    // Fallback: migrate legacy contentData into LayoutBlock[]
    const fallback: LayoutBlock[] = [];
    if (selectedNode.data.contentData?.blocks && selectedNode.data.contentData.blocks.length > 0) {
      selectedNode.data.contentData.blocks.forEach((b, idx) => {
        if (b.text) {
          fallback.push({
            id: `b_txt_${b.id || idx}`,
            type: 'text',
            content: b.text,
            align: 'left',
            style: 'normal'
          });
        }
        if (b.imageUrl) {
          fallback.push({
            id: `b_img_${b.id || idx}`,
            type: 'media',
            mediaType: 'image',
            url: b.imageUrl,
            size: 'full',
            alignment: 'center'
          });
        }
        if (b.videoUrl) {
          fallback.push({
            id: `b_vid_${b.id || idx}`,
            type: 'media',
            mediaType: 'video',
            url: b.videoUrl,
            size: 'full',
            alignment: 'center'
          });
        }
      });
    } else if (selectedNode.data.contentData) {
      if (selectedNode.data.contentData.text) {
        fallback.push({
          id: `b_txt_${selectedNode.id}`,
          type: 'text',
          content: selectedNode.data.contentData.text,
          align: 'left',
          style: 'normal'
        });
      }
      if (selectedNode.data.contentData.imageUrl) {
        fallback.push({
          id: `b_img_${selectedNode.id}`,
          type: 'media',
          mediaType: 'image',
          url: selectedNode.data.contentData.imageUrl,
          size: 'full',
          alignment: 'center'
        });
      }
      if (selectedNode.data.contentData.videoUrl) {
        fallback.push({
          id: `b_vid_${selectedNode.id}`,
          type: 'media',
          mediaType: 'video',
          url: selectedNode.data.contentData.videoUrl,
          size: 'full',
          alignment: 'center'
        });
      }
    }
    return fallback;
  }, [selectedNode]);

  const handleSaveAndClosePageBuilder = useCallback((blocksToSave: LayoutBlock[]) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              blocks: blocksToSave,
              contentData: {
                ...node.data.contentData,
                layoutBlocks: blocksToSave,
              },
            },
          };
        }
        return node;
      })
    );
    setIsPageBuilderOpen(false);
  }, [selectedNode, setNodes]);

  const handleSaveNodeBlocks = useCallback((newBlocks: LayoutBlock[]) => {
    if (!selectedNode) return;
    updateSelectedNodeData({
      blocks: newBlocks,
      contentData: {
        ...selectedNode.data.contentData,
        layoutBlocks: newBlocks,
      }
    });
  }, [selectedNode, updateSelectedNodeData]);

  // Cancel with unsaved changes confirmation
  const handleCancel = useCallback(() => {
    const currentTree = flowToTree(nodes, edges);
    const hasChanges = JSON.stringify(currentTree) !== initialTreeJsonRef.current;
    if (hasChanges) {
      setCancelModalOpen(true);
      return;
    }
    onClose();
  }, [nodes, edges, onClose]);

  // Save and Close handler with validations and starter node check
  const handleSaveAndClose = useCallback(() => {
    // 7. Si el árbol llegó vacío y sigue siendo solo el nodo inicial de ejemplo no editado, no guardarlo (guardar vacío)
    if (initialTreeWasEmptyRef.current && nodes.length === 1 && edges.length === 0) {
      const single = nodes[0];
      const isDefaultTitle = single.data.title === 'Pregunta Inicial / Opción 1';
      const isDefaultType = single.data.nodeType === 'category';
      const hasNoContent = (!single.data.blocks || single.data.blocks.length === 0) &&
                           (!single.data.contentData?.text || single.data.contentData.text.trim() === '');
      if (isDefaultTitle && isDefaultType && hasNoContent) {
        onSave([]);
        return;
      }
    }

    // 4. Validar y avisar con un mensaje claro antes de guardar
    const warnings: string[] = [];

    // Nodos sueltos sin conexión que se volverían opciones principales (si hay más de 1 nodo)
    const isolatedNodes = nodes.filter(
      (n) => nodes.length > 1 && !edges.some((e) => e.source === n.id) && !edges.some((e) => e.target === n.id)
    );
    if (isolatedNodes.length > 0) {
      warnings.push(`• ${isolatedNodes.length} ${isolatedNodes.length === 1 ? 'nodo suelto sin conexión' : 'nodos sueltos sin conexión'} (se mostrarían como opciones principales al inicio).`);
    }

    // Categorías sin ramas
    const emptyCategories = nodes.filter(
      (n) => n.data.nodeType === 'category' && !edges.some((e) => e.source === n.id)
    );
    if (emptyCategories.length > 0) {
      warnings.push(`• ${emptyCategories.length} ${emptyCategories.length === 1 ? 'categoría sin ramas conectadas' : 'categorías sin ramas conectadas'} (no conducen a ningún paso o contenido).`);
    }

    // Nodos de Contenido o Paso sin bloques de contenido
    const emptyContentNodes = nodes.filter((n) => {
      if (n.data.nodeType !== 'content' && n.data.nodeType !== 'step') return false;
      const blks = n.data.blocks || n.data.contentData?.layoutBlocks || [];
      const txt = n.data.contentData?.text?.trim() || '';
      return blks.length === 0 && !txt;
    });
    if (emptyContentNodes.length > 0) {
      warnings.push(`• ${emptyContentNodes.length} ${emptyContentNodes.length === 1 ? 'nodo de Contenido o Paso sin bloques de contenido' : 'nodos de Contenido o Paso sin bloques de contenido'}.`);
    }

    // Nodos sin título
    const untitledNodes = nodes.filter(
      (n) => !n.data.title || n.data.title.trim() === '' || n.data.title.trim() === '-'
    );
    if (untitledNodes.length > 0) {
      warnings.push(`• ${untitledNodes.length} ${untitledNodes.length === 1 ? 'nodo sin título' : 'nodos sin título'}.`);
    }

    if (warnings.length > 0) {
      setSaveWarningsModal(warnings);
      return;
    }

    const finalTree = flowToTree(nodes, edges);
    onSave(finalTree);
  }, [nodes, edges, onSave]);

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
            onClick={handleCancel}
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

        {/* Right: Canvas Tools with Undo / Redo */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo Group */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200 shadow-2xs">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                canUndo
                  ? 'text-gray-700 hover:text-blue-700 hover:bg-white shadow-2xs'
                  : 'text-gray-400 opacity-40 cursor-not-allowed'
              }`}
              title="Deshacer último cambio (Ctrl + Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deshacer</span>
            </button>

            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                canRedo
                  ? 'text-gray-700 hover:text-blue-700 hover:bg-white shadow-2xs'
                  : 'text-gray-400 opacity-40 cursor-not-allowed'
              }`}
              title="Rehacer cambio (Ctrl + Y o Ctrl + Shift + Z)"
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rehacer</span>
            </button>
          </div>

          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

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
            onNodeDragStop={onNodeDragStop}
            isValidConnection={isValidConnection}
            deleteKeyCode={null}
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

            {/* Structured Minimap Widget in Bottom Corner */}
            <Panel position="bottom-right" className="m-3">
              <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl shadow-md overflow-hidden transition-all max-w-[220px]">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-blue-600" />
                    Minimapa
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowMinimap(!showMinimap)}
                    className="text-[10px] text-slate-500 hover:text-slate-800 px-1.5 py-0.5 rounded hover:bg-slate-200 cursor-pointer transition-colors"
                  >
                    {showMinimap ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                
                {showMinimap && (
                  <div className="p-2 space-y-1.5 bg-slate-50/50">
                    <MiniMap
                      nodeColor={(n) => (n.data?.nodeType === 'step' ? '#9333ea' : n.data?.nodeType === 'content' ? '#10b981' : '#3b82f6')}
                      className="!relative !m-0 !w-44 !h-28 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-inner"
                      zoomable
                      pannable
                    />
                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold px-1 pt-1 border-t border-slate-200/60">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Opción</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Paso</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Fin</span>
                    </div>
                  </div>
                )}
              </div>
            </Panel>

            {/* Quick helper badge on canvas */}
            <Panel position="bottom-center" className="bg-white/90 backdrop-blur-xs border border-gray-200 px-3 py-1.5 rounded-full shadow-xs text-xs text-gray-500 font-medium flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Haz clic en cualquier nodo para editarlo • Usa Ctrl+Z para deshacer</span>
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
                  placeholder="Dejar en blanco para 'Continuar' o escribir opción (ej. Sí / No)"
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
                    onClick={() => handleChangeNodeType('category')}
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
                    onClick={() => handleChangeNodeType('step')}
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
                    onClick={() => handleChangeNodeType('content')}
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

              {/* 3. Contenido condicional según tipo: Integración con Page Builder para 'step' y 'content' */}
              <div className="space-y-4">
                {(selectedNode.data.nodeType === 'step' || selectedNode.data.nodeType === 'content') && (
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                        Contenido del {selectedNode.data.nodeType === 'step' ? 'Paso' : 'Nodo'}
                      </label>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                        selectedNode.data.nodeType === 'step'
                          ? 'text-purple-700 bg-purple-50 border-purple-200'
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}>
                        {selectedNodeBlocks.length} {selectedNodeBlocks.length === 1 ? 'bloque' : 'bloques'}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            Page Builder Enriquecido
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                            Diseña este paso con texto formateado, infografías, videos, acordeones FAQ y alertas interactivas.
                          </p>
                        </div>
                      </div>

                      {/* Resumen visual de bloques existentes */}
                      {selectedNodeBlocks.length > 0 && (
                        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 space-y-1.5 max-h-36 overflow-y-auto">
                          {selectedNodeBlocks.map((b, idx) => {
                            const subLabel = 'title' in b && b.title 
                              ? b.title 
                              : b.type === 'button' 
                                ? b.label 
                                : b.type === 'text' && b.content 
                                  ? b.content.slice(0, 25) 
                                  : '';
                            return (
                              <div key={b.id || idx} className="flex items-center justify-between text-[11px] text-slate-700 py-0.5 px-1 rounded hover:bg-slate-50">
                                <span className="font-semibold flex items-center gap-1.5 truncate pr-2">
                                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[9px] font-extrabold shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="capitalize">{b.type === 'media' ? (b.mediaType === 'video' ? 'Video' : 'Imagen') : b.type}</span>
                                  {subLabel && <span className="text-slate-400 font-normal truncate">({subLabel})</span>}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono shrink-0">#{b.type}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Botón primario grande: "Abrir Editor de Página para este Paso" */}
                      <button
                        type="button"
                        onClick={() => {
                          const blocksToEdit = selectedNode.data.blocks || (selectedNode as any).blocks || selectedNodeBlocks;
                          setEditorBlocks(blocksToEdit);
                          setIsPageBuilderOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-98 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Edit3 className="w-5 h-5" />
                        <span>Abrir Editor de Página para este Paso</span>
                      </button>
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

      {/* Modal a pantalla completa (un div con fixed inset-0 z-50 bg-white) */}
      {isPageBuilderOpen && selectedNode && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
          <PageBuilderFullScreenEditor
            blocks={editorBlocks}
            onChange={(newBlocks) => {
              setEditorBlocks(newBlocks);
            }}
            onClose={() => {
              // Botón de Guardar y Cerrar en el modal: actualiza el arreglo de blocks del nodo específico en nodes
              handleSaveAndClosePageBuilder(editorBlocks);
            }}
            onCancel={() => {
              setIsPageBuilderOpen(false);
            }}
            serviceTitle={selectedNode.data.title || serviceTitle || 'Paso del Trámite'}
          />
        </div>
      )}

      {/* 1. MODAL: CONFIRMAR ELIMINACIÓN DE NODO Y DESCENDIENTES */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900">
                  ¿Eliminar este nodo?
                </h3>
                <p className="text-xs text-slate-500 mt-1 truncate">
                  Nodo: <span className="font-semibold text-slate-700">"{deleteModal.title}"</span>
                </p>
                <div className="mt-2.5 text-xs text-slate-600 bg-red-50/60 border border-red-100/80 rounded-xl p-3">
                  {deleteModal.count === 1 ? (
                    <p>Esta acción eliminará este nodo del diagrama y no se puede deshacer.</p>
                  ) : (
                    <p>
                      Se eliminarán <strong className="text-red-700 font-bold">{deleteModal.count} nodos en total</strong> (el nodo seleccionado y todas sus ramas descendientes conectadas).
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteNode}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  Eliminar {deleteModal.count > 1 ? `(${deleteModal.count} nodos)` : 'nodo'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL: CAMBIO A TIPO CONTENIDO CON RAMAS EXISTENTES */}
      {typeChangeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900">
                  Cambiar a Contenido Final
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Este nodo tiene <strong className="text-slate-900">{typeChangeModal.outgoingCount} {typeChangeModal.outgoingCount === 1 ? 'rama conectada' : 'ramas conectadas'}</strong>. Un nodo de tipo "Contenido" es terminal y no puede tener ramas descendientes.
                </p>
                <p className="text-xs text-amber-800 font-medium bg-amber-50 rounded-xl p-2.5 mt-2 border border-amber-200/60">
                  ¿Deseas cambiar el tipo a Contenido y eliminar las ramas conectadas?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTypeChangeModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmTypeChange}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Cambiar y eliminar ramas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL: ADVERTENCIAS ANTES DE GUARDAR */}
      {saveWarningsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900">
                  Observaciones en el Árbol de Decisiones
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Se detectaron las siguientes situaciones antes de guardar:
                </p>
                <div className="mt-2.5 space-y-1.5 max-h-48 overflow-y-auto bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                  {saveWarningsModal.map((w, idx) => (
                    <p key={idx} className="text-xs text-slate-700">
                      {w}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSaveWarningsModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Corregir en el diagrama
              </button>
              <button
                type="button"
                onClick={() => {
                  setSaveWarningsModal(null);
                  const finalTree = flowToTree(nodes, edges);
                  onSave(finalTree);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Guardar de todos modos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: DESCARTAR CAMBIOS AL CANCELAR */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900">
                  ¿Descartar cambios no guardados?
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Tienes modificaciones sin guardar en el árbol de decisiones. Si sales ahora, se perderán estos cambios.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Seguir editando
              </button>
              <button
                type="button"
                onClick={() => {
                  setCancelModalOpen(false);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Descartar y salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionTreeCanvasEditor;
