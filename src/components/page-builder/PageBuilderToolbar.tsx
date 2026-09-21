import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  Type, 
  Image as ImageIcon, 
  Video, 
  Columns, 
  LayoutGrid, 
  AlertTriangle, 
  HelpCircle, 
  FileDown, 
  GripVertical, 
  Plus,
  Sparkles,
  MousePointerClick,
  Minus
} from 'lucide-react';

export interface BlockTemplateItem {
  id: string;
  type: 'text' | 'image' | 'video' | 'columns-2' | 'columns-3' | 'alert' | 'faq' | 'pdf' | 'button' | 'divider';
  label: string;
  category: 'básicos' | 'multimedia' | 'estructuras' | 'componentes';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const AVAILABLE_BLOCKS: BlockTemplateItem[] = [
  {
    id: 'tpl-text',
    type: 'text',
    category: 'básicos',
    label: 'Texto / Párrafo',
    description: 'Edición directa inline en el lienzo con formato',
    icon: Type,
    color: 'text-blue-600 bg-blue-50 border-blue-100'
  },
  {
    id: 'tpl-divider',
    type: 'divider',
    category: 'básicos',
    label: 'Línea Divisora',
    description: 'Separador visual horizontal con estilo y espaciado',
    icon: Minus,
    color: 'text-slate-600 bg-slate-100 border-slate-200'
  },
  {
    id: 'tpl-columns-2',
    type: 'columns-2',
    category: 'estructuras',
    label: '2 Columnas',
    description: 'Estructura dividida al 50% / 50% para soltar bloques',
    icon: Columns,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
  },
  {
    id: 'tpl-columns-3',
    type: 'columns-3',
    category: 'estructuras',
    label: '3 Columnas',
    description: 'Cuadrícula de 3 columnas para organizar contenidos',
    icon: LayoutGrid,
    color: 'text-violet-600 bg-violet-50 border-violet-100'
  },
  {
    id: 'tpl-image',
    type: 'image',
    category: 'multimedia',
    label: 'Imagen / Infografía',
    description: 'Foto o diagrama con alineación y tamaños ajustables',
    icon: ImageIcon,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
  },
  {
    id: 'tpl-video',
    type: 'video',
    category: 'multimedia',
    label: 'Video Tutorial',
    description: 'Video explicativo YouTube, Vimeo o MP4',
    icon: Video,
    color: 'text-rose-600 bg-rose-50 border-rose-100'
  },
  {
    id: 'tpl-pdf',
    type: 'pdf',
    category: 'multimedia',
    label: 'Documento PDF',
    description: 'Botón para abrir o descargar formato oficial',
    icon: FileDown,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-100'
  },
  {
    id: 'tpl-button',
    type: 'button',
    category: 'componentes',
    label: 'Botón de Acción',
    description: 'Enlace o llamada a la acción con estilo primario o secundario',
    icon: MousePointerClick,
    color: 'text-blue-600 bg-blue-50 border-blue-100'
  },
  {
    id: 'tpl-alert',
    type: 'alert',
    category: 'componentes',
    label: 'Aviso Destacado',
    description: 'Alerta informativa, advertencia o notificación',
    icon: AlertTriangle,
    color: 'text-amber-600 bg-amber-50 border-amber-100'
  },
  {
    id: 'tpl-faq',
    type: 'faq',
    category: 'componentes',
    label: 'Preguntas Frecuentes',
    description: 'Lista desplegable interactiva de dudas comunes',
    icon: HelpCircle,
    color: 'text-purple-600 bg-purple-50 border-purple-100'
  }
];

interface DraggableBlockItemProps {
  item: BlockTemplateItem;
  onAdd: (type: BlockTemplateItem['type']) => void;
}

const DraggableBlockItem: React.FC<DraggableBlockItemProps> = ({ item, onAdd }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${item.id}`,
    data: {
      isTemplate: true,
      templateType: item.type
    }
  });

  const Icon = item.icon;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`group relative bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-blue-400 rounded-xl p-3 cursor-grab active:cursor-grabbing shadow-2xs hover:shadow-xs transition-all flex items-start gap-3 select-none ${
        isDragging ? 'opacity-40 ring-2 ring-blue-500 scale-98' : ''
      }`}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${item.color}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0 pr-6">
        <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
          {item.label}
        </h4>
        <p className="text-[11px] text-slate-500 leading-tight line-clamp-2 mt-0.5">
          {item.description}
        </p>
      </div>

      {/* Quick Add Button on hover or click */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAdd(item.type);
        }}
        className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-500 hover:scale-105 transition-all cursor-pointer shadow-2xs"
        title="Añadir al lienzo"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* Visual drag grip indicator */}
      <div className="absolute bottom-2.5 right-2 opacity-0 group-hover:opacity-40 transition-opacity text-slate-400">
        <GripVertical className="w-3 h-3" />
      </div>
    </div>
  );
};

interface PageBuilderToolbarProps {
  onAddBlock: (type: BlockTemplateItem['type']) => void;
}

export const PageBuilderToolbar: React.FC<PageBuilderToolbarProps> = ({ onAddBlock }) => {
  return (
    <aside className="w-full h-full bg-gray-50 border-r border-slate-200 flex flex-col overflow-hidden select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200/80 bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-1.5 text-blue-700">
          <Sparkles className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Librería de Bloques</span>
        </div>
        <p className="text-xs text-slate-500 mt-1 leading-snug">
          Arrastra bloques hacia el lienzo o haz clic en <span className="font-semibold text-slate-700">+</span> para agregarlos.
        </p>
      </div>

      {/* Scrollable Blocks List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar">
        {/* Section: Estructuras y Columnas */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Estructuras y Columnas
          </span>
          <div className="space-y-2">
            {AVAILABLE_BLOCKS.filter(b => b.category === 'estructuras').map(item => (
              <DraggableBlockItem key={item.id} item={item} onAdd={onAddBlock} />
            ))}
          </div>
        </div>

        {/* Section: Contenido y Texto */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Contenido y Texto
          </span>
          <div className="space-y-2">
            {AVAILABLE_BLOCKS.filter(b => b.category === 'básicos').map(item => (
              <DraggableBlockItem key={item.id} item={item} onAdd={onAddBlock} />
            ))}
          </div>
        </div>

        {/* Section: Multimedia */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Multimedia y Archivos
          </span>
          <div className="space-y-2">
            {AVAILABLE_BLOCKS.filter(b => b.category === 'multimedia').map(item => (
              <DraggableBlockItem key={item.id} item={item} onAdd={onAddBlock} />
            ))}
          </div>
        </div>

        {/* Section: Componentes B2B */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Componentes Especiales
          </span>
          <div className="space-y-2">
            {AVAILABLE_BLOCKS.filter(b => b.category === 'componentes').map(item => (
              <DraggableBlockItem key={item.id} item={item} onAdd={onAddBlock} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Footer Tip */}
      <div className="p-3 border-t border-slate-200/80 bg-white/70 text-center shrink-0">
        <p className="text-[11px] text-slate-400">
          💡 Puedes soltar bloques uno al lado del otro dentro de las columnas
        </p>
      </div>
    </aside>
  );
};
