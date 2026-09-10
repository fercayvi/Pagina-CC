import { 
  LayoutBlock, 
  TextLayoutBlock, 
  AlertLayoutBlock, 
  FAQLayoutBlock, 
  MediaLayoutBlock, 
  ColumnsLayoutBlock, 
  ColumnSlot, 
  Service 
} from '../types';

export function generateBlockId(prefix: string = 'block'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function createNewTextBlock(initialContent: string = ''): TextLayoutBlock {
  return {
    id: generateBlockId('txt'),
    type: 'text',
    title: '',
    content: initialContent || '',
    align: 'left',
    style: 'normal'
  };
}

export function createNewColumnsBlock(columnsCount: number = 2, layout: 'equal' | '1-2' | '2-1' = 'equal'): ColumnsLayoutBlock {
  const columns: ColumnSlot[] = Array.from({ length: columnsCount }, (_, i) => ({
    id: generateBlockId(`col_${i + 1}`),
    blocks: []
  }));

  return {
    id: generateBlockId('cols'),
    type: 'columns',
    columnsCount,
    layout,
    columns
  };
}

export function createNewImageBlock(): MediaLayoutBlock {
  return {
    id: generateBlockId('img'),
    type: 'media',
    mediaType: 'image',
    title: '',
    url: '',
    caption: '',
    alignment: 'center',
    size: 'full'
  };
}

export function createNewVideoBlock(): MediaLayoutBlock {
  return {
    id: generateBlockId('vid'),
    type: 'media',
    mediaType: 'video',
    title: 'Video Tutorial Explicativo',
    url: '',
    caption: ''
  };
}

export function createNewPdfBlock(): MediaLayoutBlock {
  return {
    id: generateBlockId('pdf'),
    type: 'media',
    mediaType: 'pdf',
    title: 'Descargar Formato Oficial (PDF)',
    url: '',
    caption: 'Haz clic para abrir o descargar el documento adjunto'
  };
}

export function createNewAlertBlock(): AlertLayoutBlock {
  return {
    id: generateBlockId('alt'),
    type: 'alert',
    level: 'warning',
    title: 'Aviso Importante',
    message: 'Escribe aquí la notificación o advertencia relevante para el personal...'
  };
}

export function createNewFAQBlock(): FAQLayoutBlock {
  return {
    id: generateBlockId('faq'),
    type: 'faq',
    title: 'Preguntas Frecuentes',
    items: [
      { q: '¿Cuál es el tiempo de respuesta estimado?', a: 'El trámite se procesa habitualmente en un lapso de 24 a 48 horas hábiles.' }
    ]
  };
}

export function createNewMediaBlock(): MediaLayoutBlock {
  return createNewImageBlock();
}

/**
 * Convierte los campos heredados de un trámite en bloques de layout modular.
 * Si el servicio ya cuenta con layoutBlocks, se devuelven intactos.
 */
export function ensureServiceLayoutBlocks(service: Partial<Service>): LayoutBlock[] {
  if (service.layoutBlocks && Array.isArray(service.layoutBlocks) && service.layoutBlocks.length > 0) {
    return service.layoutBlocks;
  }

  const blocks: LayoutBlock[] = [];

  // 1. Aviso de alerta previo
  if (typeof service.alertNotice === 'string' && service.alertNotice.trim().length > 0) {
    blocks.push({
      id: generateBlockId('alt'),
      type: 'alert',
      level: 'warning',
      title: 'Aviso Importante',
      message: service.alertNotice.trim()
    });
  }

  // 2. Imagen / Infografía previa
  if (typeof service.imageUrl === 'string' && service.imageUrl.trim().length > 0) {
    blocks.push({
      id: generateBlockId('med'),
      type: 'media',
      mediaType: 'image',
      title: 'Infografía del Procedimiento',
      url: service.imageUrl.trim(),
      caption: ''
    });
  }

  // 3. Video explicativo previo
  if (typeof service.videoUrl === 'string' && service.videoUrl.trim().length > 0) {
    blocks.push({
      id: generateBlockId('med'),
      type: 'media',
      mediaType: 'video',
      title: 'Video Tutorial Explicativo',
      url: service.videoUrl.trim(),
      caption: ''
    });
  }

  // 4. Formatos PDF / Documentos previos
  if (typeof service.pdfUrl === 'string' && service.pdfUrl.trim().length > 0) {
    blocks.push({
      id: generateBlockId('med'),
      type: 'media',
      mediaType: 'pdf',
      title: service.pdfTitle?.trim() || 'Formato Oficial para Descargar (PDF)',
      url: service.pdfUrl.trim(),
      caption: 'Descarga este formato oficial para presentar tu trámite'
    });
  }

  // 5. Pasos del procedimiento previos
  if (service.steps && service.steps.length > 0) {
    const stepsText = service.steps
      .map((st, i) => `${st.num || i + 1}. **${st.title || 'Paso'}**: ${st.desc}`)
      .join('\n\n');
    blocks.push({
      id: generateBlockId('txt'),
      type: 'text',
      title: 'Paso a Paso del Trámite',
      content: stepsText
    });
  }

  // 6. Requisitos previos
  if (service.requirements && service.requirements.length > 0) {
    const reqsText = service.requirements.map(req => `• ${req}`).join('\n');
    blocks.push({
      id: generateBlockId('txt'),
      type: 'text',
      title: 'Requisitos Necesarios',
      content: reqsText
    });
  }

  // 7. Atención y Ubicación previas
  const contactLines: string[] = [];
  if (service.location?.trim()) contactLines.push(`📍 **Ubicación**: ${service.location.trim()}`);
  if (service.schedule?.trim()) contactLines.push(`⏰ **Horario de Atención**: ${service.schedule.trim()}`);
  if (service.contact?.trim()) contactLines.push(`📞 **Contacto directo**: ${service.contact.trim()}`);

  if (contactLines.length > 0) {
    blocks.push({
      id: generateBlockId('txt'),
      type: 'text',
      title: 'Atención y Ubicación',
      content: contactLines.join('\n\n')
    });
  }

  // 8. Preguntas Frecuentes previas
  if (service.faqs && service.faqs.length > 0) {
    blocks.push({
      id: generateBlockId('faq'),
      type: 'faq',
      title: 'Preguntas Frecuentes',
      items: service.faqs.map(f => ({ q: f.question || '', a: f.answer || '' }))
    });
  }

  return blocks;
}
