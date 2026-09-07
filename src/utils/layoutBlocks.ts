import { LayoutBlock, TextLayoutBlock, AlertLayoutBlock, FAQLayoutBlock, MediaLayoutBlock, Service } from '../types';

export function generateBlockId(prefix: string = 'block'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function createNewTextBlock(): TextLayoutBlock {
  return {
    id: generateBlockId('txt'),
    type: 'text',
    title: '',
    content: ''
  };
}

export function createNewAlertBlock(): AlertLayoutBlock {
  return {
    id: generateBlockId('alt'),
    type: 'alert',
    level: 'warning',
    title: 'Aviso Importante',
    message: ''
  };
}

export function createNewFAQBlock(): FAQLayoutBlock {
  return {
    id: generateBlockId('faq'),
    type: 'faq',
    title: 'Preguntas Frecuentes',
    items: [
      { q: '', a: '' }
    ]
  };
}

export function createNewMediaBlock(): MediaLayoutBlock {
  return {
    id: generateBlockId('med'),
    type: 'media',
    mediaType: 'image',
    title: '',
    url: '',
    caption: ''
  };
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
  if (service.alertNotice && service.alertNotice.trim().length > 0) {
    blocks.push({
      id: generateBlockId('alt'),
      type: 'alert',
      level: 'warning',
      title: 'Aviso Importante',
      message: service.alertNotice.trim()
    });
  }

  // 2. Imagen / Infografía previa
  if (service.imageUrl && service.imageUrl.trim().length > 0) {
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
  if (service.videoUrl && service.videoUrl.trim().length > 0) {
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
  if (service.pdfUrl && service.pdfUrl.trim().length > 0) {
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
      items: service.faqs.map(f => ({ q: f.question, a: f.answer }))
    });
  }

  return blocks;
}
