import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Layers, 
  Video, 
  Image as ImageIcon,
  CheckCircle2,
  Info
} from 'lucide-react';
import { ServiceNode, ServiceNodeContentData } from '../types';
import { MediaUploadField } from './MediaUploadField';

interface DecisionTreeBuilderProps {
  tree: ServiceNode[];
  onChange: (tree: ServiceNode[]) => void;
  serviceTitle?: string;
}

// Helper to generate unique ID
function generateNodeId(): string {
  return 'node_' + Math.random().toString(36).substr(2, 9);
}

// Recursive Node Editor Component
interface NodeItemEditorProps {
  key?: React.Key;
  node: ServiceNode;
  path: number[];
  depth: number;
  onUpdateNode: (path: number[], updated: ServiceNode) => void;
  onDeleteNode: (path: number[]) => void;
  onMoveNode: (path: number[], direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

function NodeItemEditor({
  node,
  path,
  depth,
  onUpdateNode,
  onDeleteNode,
  onMoveNode,
  isFirst,
  isLast
}: NodeItemEditorProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showContentEditor, setShowContentEditor] = useState<boolean>(true);

  const isCategory = node.nodeType === 'category';

  const handleTitleChange = (newTitle: string) => {
    onUpdateNode(path, { ...node, title: newTitle });
  };

  const handleToggleType = (newType: 'category' | 'content') => {
    if (newType === node.nodeType) return;
    if (newType === 'category') {
      onUpdateNode(path, {
        ...node,
        nodeType: 'category',
        children: node.children && node.children.length > 0 ? node.children : [],
        contentData: undefined
      });
    } else {
      onUpdateNode(path, {
        ...node,
        nodeType: 'content',
        children: undefined,
        contentData: node.contentData || { text: '' }
      });
    }
  };

  const handleContentDataChange = (field: keyof ServiceNodeContentData, val: string) => {
    const prevContent = node.contentData || {};
    onUpdateNode(path, {
      ...node,
      contentData: {
        ...prevContent,
        [field]: val
      }
    });
  };

  const handleAddChild = (childType: 'category' | 'content') => {
    const newChild: ServiceNode = {
      id: generateNodeId(),
      title: childType === 'category' ? 'Nueva opción' : 'Respuesta o resolución',
      nodeType: childType,
      children: childType === 'category' ? [] : undefined,
      contentData: childType === 'content' ? { text: 'Describe aquí la solución o información para el colaborador.' } : undefined
    };

    const currentChildren = node.children || [];
    onUpdateNode(path, {
      ...node,
      nodeType: 'category',
      children: [...currentChildren, newChild]
    });
    setIsExpanded(true);
  };

  const handleUpdateChild = (childPath: number[], updatedChild: ServiceNode) => {
    // childPath is relative to the parent path: [childIndex, ...rest]
    const childIndex = childPath[0];
    const restPath = childPath.slice(1);
    const newChildren = [...(node.children || [])];

    if (restPath.length === 0) {
      newChildren[childIndex] = updatedChild;
    } else {
      // Deeper recursion handled inside
      return;
    }
    onUpdateNode(path, { ...node, children: newChildren });
  };

  const handleDeleteChild = (childIndex: number) => {
    const newChildren = (node.children || []).filter((_, i) => i !== childIndex);
    onUpdateNode(path, { ...node, children: newChildren });
  };

  const handleMoveChild = (childIndex: number, direction: 'up' | 'down') => {
    const children = [...(node.children || [])];
    const targetIdx = direction === 'up' ? childIndex - 1 : childIndex + 1;
    if (targetIdx < 0 || targetIdx >= children.length) return;
    const temp = children[childIndex];
    children[childIndex] = children[targetIdx];
    children[targetIdx] = temp;
    onUpdateNode(path, { ...node, children });
  };

  // Color badges depending on node type
  const typeBorder = isCategory 
    ? 'border-blue-200 bg-white hover:border-blue-300' 
    : 'border-emerald-200 bg-white hover:border-emerald-300';

  return (
    <div className="space-y-2 relative group">
      {/* Node Header Box */}
      <div className={`rounded-xl border-2 p-3 sm:p-3.5 shadow-2xs transition-all ${typeBorder}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          
          {/* Left: Type Icon & Title Input */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isCategory ? (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 hover:bg-blue-200 transition-colors"
                title={isExpanded ? "Colapsar sub-pasos" : "Expandir sub-pasos"}
              >
                {isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={node.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Texto del botón para el empleado (ej. '¿Tengo dudas con mi sueldo?')..."
                className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-slate-50 hover:bg-white focus:bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Right: Type Toggle Switch & Action Buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            {/* Type selector toggle */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleToggleType('category')}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  isCategory 
                    ? 'bg-blue-600 text-white shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Categoría: Muestra sub-botones"
              >
                <Folder className="w-3 h-3" />
                <span>Categoría</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleType('content')}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  !isCategory 
                    ? 'bg-emerald-600 text-white shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Contenido Final: Muestra la respuesta directa"
              >
                <FileText className="w-3 h-3" />
                <span>Respuesta Final</span>
              </button>
            </div>

            {/* Reorder Buttons */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => onMoveNode(path, 'up')}
                disabled={isFirst}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Mover arriba"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onMoveNode(path, 'down')}
                disabled={isLast}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Mover abajo"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => onDeleteNode(path)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Eliminar este nodo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Content Node Details Editor */}
        {!isCategory && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5 bg-emerald-50/40 rounded-lg p-3 border border-emerald-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Contenido de la Respuesta Final (Para el colaborador)
              </span>
              <button
                type="button"
                onClick={() => setShowContentEditor(!showContentEditor)}
                className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900"
              >
                {showContentEditor ? 'Ocultar campos' : 'Editar campos'}
              </button>
            </div>

            {showContentEditor && (
              <div className="space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Explicación, Solución o Instrucciones *
                  </label>
                  <textarea
                    rows={3}
                    value={node.contentData?.text || ''}
                    onChange={(e) => handleContentDataChange('text', e.target.value)}
                    placeholder="Escribe la solución detallada, pasos a seguir, horarios o qué hacer..."
                    className="w-full text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <MediaUploadField
                      type="image"
                      label="Imagen o Infografía (Opcional)"
                      value={node.contentData?.imageUrl || ''}
                      onChange={(val) => handleContentDataChange('imageUrl', val)}
                      placeholderUrl="https://ejemplo.com/infografia.png o .jpg"
                      helperText="Infografía que aclara la duda del colaborador."
                      idPrefix={`tree-img-${node.id}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-blue-600" />
                      Video Explicativo o Tutorial (Opcional)
                    </label>
                    <input
                      type="text"
                      value={node.contentData?.videoUrl || ''}
                      onChange={(e) => handleContentDataChange('videoUrl', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full text-xs text-slate-800 bg-white p-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Enlace de YouTube o video directo .mp4
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Children Sub-tree (Nested List) */}
      {isCategory && isExpanded && (
        <div className="pl-4 sm:pl-6 border-l-2 border-blue-200/80 ml-3 sm:ml-4 space-y-2.5 pt-1">
          {node.children && node.children.length > 0 ? (
            node.children.map((child, childIdx) => (
              <NodeItemEditor
                key={child.id || `child-${childIdx}`}
                node={child}
                path={[childIdx]}
                depth={depth + 1}
                onUpdateNode={(subPath, updated) => {
                  const newChildren = [...(node.children || [])];
                  if (subPath.length === 1) {
                    newChildren[subPath[0]] = updated;
                  } else {
                    // Deep nested update helper
                    const updateDeep = (curr: ServiceNode, p: number[], up: ServiceNode): ServiceNode => {
                      if (p.length === 1) {
                        const nextKids = [...(curr.children || [])];
                        nextKids[p[0]] = up;
                        return { ...curr, children: nextKids };
                      }
                      const [first, ...rest] = p;
                      const nextKids = [...(curr.children || [])];
                      nextKids[first] = updateDeep(nextKids[first], rest, up);
                      return { ...curr, children: nextKids };
                    };
                    const updatedNode = updateDeep(node, [childIdx, ...subPath.slice(1)], updated);
                    onUpdateNode(path, updatedNode);
                    return;
                  }
                  onUpdateNode(path, { ...node, children: newChildren });
                }}
                onDeleteNode={(subPath) => {
                  if (subPath.length === 1) {
                    handleDeleteChild(subPath[0]);
                  } else {
                    const deleteDeep = (curr: ServiceNode, p: number[]): ServiceNode => {
                      if (p.length === 1) {
                        return { ...curr, children: (curr.children || []).filter((_, i) => i !== p[0]) };
                      }
                      const [first, ...rest] = p;
                      const nextKids = [...(curr.children || [])];
                      nextKids[first] = deleteDeep(nextKids[first], rest);
                      return { ...curr, children: nextKids };
                    };
                    const updatedNode = deleteDeep(node, [childIdx, ...subPath.slice(1)]);
                    onUpdateNode(path, updatedNode);
                  }
                }}
                onMoveNode={(subPath, dir) => {
                  if (subPath.length === 1) {
                    handleMoveChild(subPath[0], dir);
                  }
                }}
                isFirst={childIdx === 0}
                isLast={childIdx === (node.children?.length || 0) - 1}
              />
            ))
          ) : (
            <div className="py-2.5 px-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
              <p className="text-xs text-slate-500 font-medium">
                Esta categoría está vacía. Agrega una sub-opción o respuesta final abajo:
              </p>
            </div>
          )}

          {/* Buttons to Add Sub-items inside this Category */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
            <button
              type="button"
              onClick={() => handleAddChild('category')}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
            >
              <Folder className="w-3.5 h-3.5 text-blue-600" />
              <span>+ Añadir sub-paso (Categoría)</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddChild('content')}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Añadir contenido final (Respuesta)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const DecisionTreeBuilder: React.FC<DecisionTreeBuilderProps> = ({
  tree,
  onChange,
  serviceTitle
}) => {
  const handleAddRoot = (nodeType: 'category' | 'content') => {
    const newNode: ServiceNode = {
      id: generateNodeId(),
      title: nodeType === 'category' ? 'Nueva opción' : 'Respuesta o solución',
      nodeType,
      children: nodeType === 'category' ? [] : undefined,
      contentData: nodeType === 'content' ? { text: 'Información directa para el colaborador.' } : undefined
    };
    onChange([...tree, newNode]);
  };

  const handleUpdateRootNode = (path: number[], updated: ServiceNode) => {
    const newTree = [...tree];
    const rootIndex = path[0];
    newTree[rootIndex] = updated;
    onChange(newTree);
  };

  const handleDeleteRootNode = (path: number[]) => {
    const rootIndex = path[0];
    const newTree = tree.filter((_, i) => i !== rootIndex);
    onChange(newTree);
  };

  const handleMoveRootNode = (path: number[], direction: 'up' | 'down') => {
    const rootIndex = path[0];
    const targetIdx = direction === 'up' ? rootIndex - 1 : rootIndex + 1;
    if (targetIdx < 0 || targetIdx >= tree.length) return;
    const newTree = [...tree];
    const temp = newTree[rootIndex];
    newTree[rootIndex] = newTree[targetIdx];
    newTree[targetIdx] = temp;
    onChange(newTree);
  };

  // Preset Template generator to test instantly
  const handleApplyPresetTemplate = () => {
    const preset: ServiceNode[] = [
      {
        id: generateNodeId(),
        title: 'Soy de nuevo ingreso',
        nodeType: 'category',
        children: [
          {
            id: generateNodeId(),
            title: '¿Cuándo recibo mi primer pago de nómina?',
            nodeType: 'content',
            contentData: {
              text: 'Tu primer pago se deposita el siguiente viernes hábil después de tu fecha de alta oficial. Asegúrate de haber entregado tu cuenta CLABE o de recoger tu tarjeta física en el módulo de Talento y Cultura.'
            }
          },
          {
            id: generateNodeId(),
            title: '¿Cómo obtengo mi tarjeta de vales y nómina?',
            nodeType: 'content',
            contentData: {
              text: 'Acude al módulo de Servicios al Personal junto a Ropería de lunes a viernes en horario de 9:00 am a 12:00 pm con tu INE original.'
            }
          }
        ]
      },
      {
        id: generateNodeId(),
        title: 'Ya tengo tiempo laborando',
        nodeType: 'category',
        children: [
          {
            id: generateNodeId(),
            title: 'Tengo una duda con mis deducciones',
            nodeType: 'category',
            children: [
              {
                id: generateNodeId(),
                title: 'Deducción de Fondo o Caja de Ahorro',
                nodeType: 'content',
                contentData: {
                  text: 'El descuento del fondo de ahorro corresponde al 5% de tu sueldo base semanal. Puedes consultar tu acumulado en cualquier momento.'
                }
              },
              {
                id: generateNodeId(),
                title: 'Retención de Impuesto ISR o Seguro Social',
                nodeType: 'content',
                contentData: {
                  text: 'Las retenciones de IMSS e ISR se calculan automáticamente con las tablas oficiales vigentes del SAT. Acude con tu recibo timbrado a Talento y Cultura si notas alguna discrepancia.'
                }
              }
            ]
          },
          {
            id: generateNodeId(),
            title: 'Aclaración de horas extras o prima dominical',
            nodeType: 'content',
            contentData: {
              text: 'Las horas extras deben ser aprobadas previamente por tu supervisor de línea antes de cada corte semanal los días miércoles.'
            }
          }
        ]
      }
    ];

    onChange(preset);
  };

  const handleClearTree = () => {
    if (tree.length > 0 && !window.confirm('¿Seguro que deseas vaciar el árbol de decisiones de este trámite?')) {
      return;
    }
    onChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Informative Header Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900 font-display">
                Árbol de Decisiones Dinámico (Divulgación Progresiva)
              </h4>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              Crea un flujo interactivo paso a paso. Los empleados verán botones grandes que los guiarán rama por rama hasta la solución exacta, evitando leer textos largos innecesarios.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {tree.length === 0 && (
              <button
                type="button"
                onClick={handleApplyPresetTemplate}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Cargar estructura de ejemplo recomendada"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Cargar Plantilla Ejemplo</span>
              </button>
            )}

            {tree.length > 0 && (
              <button
                type="button"
                onClick={handleClearTree}
                className="px-2.5 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                title="Vaciar árbol"
              >
                Vaciar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Recursive Nodes List */}
      <div className="space-y-3">
        {tree.map((node, index) => (
          <NodeItemEditor
            key={node.id || `root-${index}`}
            node={node}
            path={[index]}
            depth={0}
            onUpdateNode={handleUpdateRootNode}
            onDeleteNode={handleDeleteRootNode}
            onMoveNode={handleMoveRootNode}
            isFirst={index === 0}
            isLast={index === tree.length - 1}
          />
        ))}

        {tree.length === 0 && (
          <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-slate-800">
                Aún no has configurado un árbol de decisiones
              </h5>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Puedes añadir opciones principales con los botones inferiores o hacer clic en "Cargar Plantilla Ejemplo" para empezar con un flujo prediseñado.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Add Root Node Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAddRoot('category')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Folder className="w-4 h-4" />
            <span>+ Añadir Categoría Principal</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddRoot('content')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>+ Añadir Respuesta Directa</span>
          </button>
        </div>

        <span className="text-[11px] font-bold text-slate-400">
          Total de ramas principales: {tree.length}
        </span>
      </div>
    </div>
  );
};

export default DecisionTreeBuilder;
