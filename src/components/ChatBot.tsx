import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

interface ChatBotProps {
  user: UserProfile;
}

export default function ChatBot({ user }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: `¡Hola! Soy Sofía, tu asistente virtual de Recursos Humanos de la planta. 🙋‍♀️ Estoy aquí para orientarte de manera libre sobre trámites, nómina, transporte, reglamentos y servicios. ¿En qué puedo ayudarte hoy?`,
      time: '11:00 AM'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickOptions = [
    { label: '💰 Día de Pago', query: 'pago' },
    { label: '🐷 Fondo de Ahorro', query: 'fondo' },
    { label: '🚌 Rutas de Transporte', query: 'ruta' },
    { label: '👕 Cambiar Uniforme', query: 'uniforme' },
    { label: '🏥 Permiso de Enfermedad', query: 'permiso' },
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newMsg: Message = {
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking and answering
    setTimeout(() => {
      const botResponseText = getBotResponse(text);
      const botMsg: Message = {
        sender: 'bot',
        text: botResponseText,
        time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('pago') || q.includes('nomina') || q.includes('nómina') || q.includes('viernes') || q.includes('dinero')) {
      return `💵 **Sobre tus Pagos:** Para los operarios de planta, el pago se realiza todos los **VIERNES** por la mañana. Los recibos de nómina se envían directamente a tu correo electrónico o puedes solicitar su impresión con tu supervisor, Héctor Ramírez.`;
    }
    if (q.includes('fondo') || q.includes('ahorro') || q.includes('piggy')) {
      return `🐷 **Sobre tu Fondo de Ahorro:** Se te retiene el **8%** de tu sueldo base semanal de forma automática y la empresa te regala otro **8%** idéntico. Todo este dinero acumulado se te deposita en la primera semana de diciembre. ¡Es un excelente aguinaldo extra! Tu saldo estimado actual es de **$1,840.50 MXN**.`;
    }
    if (q.includes('ruta') || q.includes('transporte') || q.includes('camion') || q.includes('camión') || q.includes('autobus')) {
      return `🚌 **Sobre el Transporte:** Contamos con las rutas Norte, Oriente y Poniente. Si el camión se llega a retrasar por tráfico o falla mecánica, tu retardo está **100% justificado**. Solo repórtalo de inmediato en el grupo de WhatsApp de tu ruta.`;
    }
    if (q.includes('uniforme') || q.includes('talla') || q.includes('bota') || q.includes('calzado') || q.includes('camisa')) {
      return `👕 **Sobre tu Uniforme:** Se te entregan 2 pantalones, 2 playeras polo y botas de seguridad Berrendo gratis al entrar. Para reemplazos por desgaste, tu supervisor debe firmar un vale de almacén. La entrega es los jueves de 11:00 AM a 3:00 PM en Almacén General.`;
    }
    if (q.includes('permiso') || q.includes('falta') || q.includes('enfermo') || q.includes('imss') || q.includes('receta')) {
      return `🏥 **Incapacidades y Permisos:** Si te enfermas, acude a tu clínica del IMSS asignada. La receta o incapacidad original del IMSS es el **único documento válido** para justificar tu inasistencia. Debes entregarla a Recursos Humanos máximo 48 horas después de regresar.`;
    }
    if (q.includes('gafete') || q.includes('perdi') || q.includes('perdí') || q.includes('badge')) {
      return `🎫 **Gafete extraviado:** Reporta de inmediato en la caseta de seguridad para que te den un acceso temporal. La primera reposición es gratis, a partir de la segunda cuesta $50 MXN y se descuenta de tu nómina semanal.`;
    }
    if (q.includes('vacacion') || q.includes('vacaciones') || q.includes('descanso') || q.includes('dias') || q.includes('días')) {
      return `📅 **Sobre tus Vacaciones:** Tienes derecho a **12 días** hábiles de vacaciones pagadas al cumplir tu primer año. Debes solicitar la fecha con al menos 2 semanas de anticipación con tu supervisor Héctor Ramírez para que no afecte la línea de producción.`;
    }
    if (q.includes('hola') || q.includes('buenos dias') || q.includes('buenas tardes')) {
      return `¡Hola de nuevo Juan Carlos! 😊 ¿Tienes alguna duda específica sobre tus beneficios, transporte, nómina o uniformes? Cuéntame y te respondo de volada.`;
    }

    return `Entiendo tu consulta sobre "${query}". Para darte el mejor servicio rápido, te comento que puedes resolver esto directo en la pestaña de **Servicios** tocando la tarjeta correspondiente, o bien comunicándote directamente a la Ext. 202 de Recursos Humanos. ¿Te puedo ayudar en algo más?`;
  };

  return (
    <div id="chatbot-container" className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col h-96 shadow-inner">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mb-3 scroll-smooth">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none shadow-sm' 
                : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-2xs'
            }`}>
              {/* Bot icon inside bot messages */}
              {msg.sender === 'bot' && (
                <div className="flex items-center gap-1.5 mb-1 text-blue-600 font-bold text-[9px] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                  Sofía (RH Virtual)
                </div>
              )}
              <p className="whitespace-pre-line font-medium">{msg.text}</p>
              <span className={`text-[8px] block text-right mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-2xs">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick click options for operators */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {quickOptions.map((opt, i) => (
          <button
            key={i}
            id={`quick-option-${i}`}
            onClick={() => handleSendMessage(opt.label.substring(4))} // strip emoji for query
            className="shrink-0 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 text-[10px] font-bold py-1.5 px-3 rounded-full transition-all focus:outline-none"
            style={{ minHeight: '32px' }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Send manual text box */}
      <div className="relative flex items-center">
        <input
          id="chat-input-field"
          type="text"
          placeholder="Escribe tu duda aquí..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          id="chat-send-btn"
          onClick={() => handleSendMessage(inputText)}
          className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          style={{ minWidth: '32px', minHeight: '32px' }}
          aria-label="Enviar"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
