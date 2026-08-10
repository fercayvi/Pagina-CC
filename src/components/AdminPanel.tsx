import React, { useState } from 'react';
import { 
  LogOut, 
  Layers, 
  Newspaper, 
  Plus, 
  Edit3, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCircle2, 
  X, 
  Building2, 
  FileText, 
  Sparkles,
  ShieldCheck,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import { Service, NewsItem, ServiceId } from '../types';

interface AdminPanelProps {
  services: (Service & { hidden?: boolean })[];
  onUpdateServices: (services: (Service & { hidden?: boolean })[]) => void;
  news: NewsItem[];
  onUpdateNews: (news: NewsItem[]) => void;
  onLogout: () => void;
}

export default function AdminPanel({
  services,
  onUpdateServices,
  news,
  onUpdateNews,
  onLogout
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'tramites' | 'noticias'>('tramites');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Service Edit / Create Modal state
  const [editingService, setEditingService] = useState<(Service & { hidden?: boolean }) | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [isNewService, setIsNewService] = useState<boolean>(false);

  // News Edit / Create Modal state
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState<boolean>(false);
  const [isNewNews, setIsNewNews] = useState<boolean>(false);

  // Helper for notification toast
  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // --- SERVICE HANDLERS ---
  const handleToggleHideService = (id: string) => {
    const updated = services.map(s => s.id === id ? { ...s, hidden: !s.hidden } : s);
    onUpdateServices(updated);
    showToast('Estado del trámite actualizado correctamente.');
  };

  const handleDeleteService = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este trámite de la lista?')) {
      const updated = services.filter(s => s.id !== id);
      onUpdateServices(updated);
      showToast('Trámite eliminado con éxito.');
    }
  };

  const handleOpenNewServiceModal = () => {
    setIsNewService(true);
    setEditingService({
      id: `custom_${Date.now()}` as ServiceId,
      title: '',
      iconName: 'FileText',
      shortDesc: '',
      category: 'Nómina y Pagos',
      hidden: false
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditServiceModal = (service: Service & { hidden?: boolean }) => {
    setIsNewService(false);
    setEditingService({ ...service });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title.trim()) return;

    if (isNewService) {
      onUpdateServices([editingService, ...services]);
      showToast('¡Nuevo trámite creado e integrado al portal!');
    } else {
      const updated = services.map(s => s.id === editingService.id ? editingService : s);
      onUpdateServices(updated);
      showToast('Trámite modificado y guardado con éxito.');
    }
    setIsServiceModalOpen(false);
  };

  // --- NEWS HANDLERS ---
  const handleDeleteNews = (id: string) => {
    if (confirm('¿Deseas eliminar esta noticia?')) {
      const updated = news.filter(n => n.id !== id);
      onUpdateNews(updated);
      showToast('Noticia eliminada correctamente.');
    }
  };

  const handleOpenNewNewsModal = () => {
    setIsNewNews(true);
    setEditingNews({
      id: `news_${Date.now()}`,
      title: '',
      summary: '',
      content: '',
      date: 'Hoy',
      imageName: 'welcome_team',
      category: 'comunicado'
    });
    setIsNewsModalOpen(true);
  };

  const handleOpenEditNewsModal = (item: NewsItem) => {
    setIsNewNews(false);
    setEditingNews({ ...item });
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews || !editingNews.title.trim()) return;

    if (isNewNews) {
      onUpdateNews([editingNews, ...news]);
      showToast('¡Nueva noticia publicada en el boletín!');
    } else {
      const updated = news.map(n => n.id === editingNews.id ? editingNews : n);
      onUpdateNews(updated);
      showToast('Noticia actualizada correctamente.');
    }
    setIsNewsModalOpen(false);
  };

  return (
    <div id="admin-panel-container" className="space-y-4 animate-fadeIn pb-12">
      {/* Toast Alert */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2.5 animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{successMessage}</span>
        </div>
      )}

      {/* Top Header Dashboard Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded-md border border-blue-800/60">
                Panel Administrador
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                Lic. Patricia Morales (RH)
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight font-display">
              Gestión de Contenidos y Trámites
            </h2>
          </div>
        </div>

        <button
          id="btn-admin-logout"
          onClick={onLogout}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 self-start md:self-auto active:scale-95 shadow-2xs"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          id="admin-tab-tramites"
          onClick={() => setActiveTab('tramites')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'tramites'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Gestionar Trámites ({services.length})</span>
        </button>

        <button
          id="admin-tab-noticias"
          onClick={() => setActiveTab('noticias')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'noticias'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Gestionar Noticias ({news.length})</span>
        </button>
      </div>

      {/* VIEW A: GESTIONAR TRÁMITES */}
      {activeTab === 'tramites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Catálogo Oficial de Trámites
              </h3>
              <p className="text-xs text-slate-500">
                Edita, agrega u oculta los servicios disponibles para los colaboradores de la planta.
              </p>
            </div>
            <button
              id="btn-add-service"
              onClick={handleOpenNewServiceModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nuevo Trámite</span>
            </button>
          </div>

          {/* Services List */}
          <div className="space-y-2.5">
            {services.map((service) => (
              <div
                key={service.id}
                className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  service.hidden ? 'opacity-60 border-slate-200 bg-slate-50' : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        {service.category}
                      </span>
                      {service.hidden ? (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">
                          Oculto
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          Visible
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {service.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {service.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleToggleHideService(service.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                      service.hidden 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                    title={service.hidden ? 'Hacer visible' : 'Ocultar trámite'}
                  >
                    {service.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{service.hidden ? 'Mostrar' : 'Ocultar'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditServiceModal(service)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-colors"
                    title="Eliminar trámite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW B: GESTIONAR NOTICIAS */}
      {activeTab === 'noticias' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Boletín de Noticias Internas
              </h3>
              <p className="text-xs text-slate-500">
                Publica y edita comunicados, avisos y reconocimientos de la planta.
              </p>
            </div>
            <button
              id="btn-add-news"
              onClick={handleOpenNewNewsModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Nueva Noticia</span>
            </button>
          </div>

          {/* News List */}
          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
                    <Newspaper className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.date}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleOpenEditNewsModal(item)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Textos</span>
                  </button>

                  <button
                    onClick={() => handleDeleteNews(item.id)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-colors"
                    title="Eliminar noticia"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODAL FOR ADDING / EDITING SERVICE --- */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {isNewService ? 'Agregar Nuevo Trámite' : 'Editar Trámite'}
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título del Trámite
                </label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="Ej. Constancia de Percepciones"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Módulo / Categoría
                </label>
                <select
                  value={editingService.category}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                >
                  <option value="Nómina y Pagos">Nómina y Pagos</option>
                  <option value="Tarjetas y Créditos">Tarjetas y Créditos</option>
                  <option value="Control y Asistencia">Control y Asistencia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Descripción Corta
                </label>
                <textarea
                  rows={3}
                  value={editingService.shortDesc}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  placeholder="Resumen del trámite para la tarjeta principal..."
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL FOR ADDING / EDITING NEWS --- */}
      {isNewsModalOpen && editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {isNewNews ? 'Publicar Nueva Noticia' : 'Editar Noticia'}
              </h3>
              <button onClick={() => setIsNewsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título del Comunicado
                </label>
                <input
                  type="text"
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  placeholder="Ej. Jornada de Evaluación en Planta"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Categoría
                </label>
                <select
                  value={editingNews.category}
                  onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                >
                  <option value="comunicado">Comunicado Oficial</option>
                  <option value="evento">Evento / Capacitación</option>
                  <option value="logro">Logro de Equipo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Resumen Corto
                </label>
                <input
                  type="text"
                  value={editingNews.summary}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  placeholder="Texto visible en la vista previa..."
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contenido Completo
                </label>
                <textarea
                  rows={4}
                  value={editingNews.content}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  placeholder="Detalle de la noticia..."
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publicar Noticia</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
