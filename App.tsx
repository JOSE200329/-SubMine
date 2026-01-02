
import React, { useState, useEffect } from 'react';
import { 
  Pickaxe, 
  Construction, 
  Settings, 
  MessageSquare, 
  ChevronRight, 
  Download, 
  ShieldAlert, 
  HardHat, 
  Zap, 
  TrendingUp,
  Mail,
  Linkedin,
  Globe
} from 'lucide-react';
import { RockType, CalculationResult, OperationCosts as OpCostsType } from './types';
import { calculateFace, calculateBlastingManual, calculateOperation } from './calculations';
import { getTechnicalAnalysis, chatWithAssistant } from './geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'face' | 'blast' | 'op' | 'ai' | 'reviews' | 'training'>('home');

  // Calculation states
  const [faceInputs, setFaceInputs] = useState({ width: 3.5, height: 3.5, advance: 3, rockType: RockType.Media });
  const [faceResults, setFaceResults] = useState<CalculationResult | null>(null);
  const [faceAnalysis, setFaceAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const [blastInputs, setBlastInputs] = useState({ spacing: 1.1, burden: 1.0, width: 3.5, height: 3.5, advance: 3 });
  const [blastResults, setBlastResults] = useState<CalculationResult | null>(null);

  const [opInputs, setOpInputs] = useState({ advance: 3, holes: 40, length: 3.2, price: 15 });
  const [opResults, setOpResults] = useState<OpCostsType | null>(null);

  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Handle Home navigation via button
  const handleHomeNav = () => setActiveTab('home');

  // Automatic Face calculation
  useEffect(() => {
    const res = calculateFace(faceInputs.width, faceInputs.height, faceInputs.advance, faceInputs.rockType);
    setFaceResults(res);
  }, [faceInputs]);

  // Automatic Blast calculation
  useEffect(() => {
    const res = calculateBlastingManual(blastInputs.spacing, blastInputs.burden, blastInputs.width, blastInputs.height, blastInputs.advance);
    setBlastResults(res);
  }, [blastInputs]);

  // Automatic Op calculation
  useEffect(() => {
    const res = calculateOperation(opInputs.advance, opInputs.holes, opInputs.length, opInputs.price);
    setOpResults(res);
  }, [opInputs]);

  const handleFaceAnalysis = async () => {
    if (!faceResults) return;
    setLoadingAnalysis(true);
    const analysis = await getTechnicalAnalysis({ ...faceInputs, results: faceResults });
    setFaceAnalysis(analysis);
    setLoadingAnalysis(false);
  };

  const handleDownloadReport = () => {
    if (!faceResults) return;
    const content = `
REPORTE TÉCNICO SUBMINE
-----------------------
Datos de Entrada:
- Ancho: ${faceInputs.width}m
- Alto: ${faceInputs.height}m
- Avance: ${faceInputs.advance}m
- Roca: ${faceInputs.rockType}

Resultados:
- Espaciamiento: ${faceResults.spacing}m
- Burden: ${faceResults.burden}m
- Nro Taladros: ${faceResults.holesCount}
- Carga Explosiva Total: ${faceResults.totalExplosive.toFixed(2)} kg

Desglose de Costos (Soles):
- Dinamita: S/ ${faceResults.costs.dynamite.toFixed(2)}
- Detonador: S/ ${faceResults.costs.detonator.toFixed(2)}
- Cordón Detonante: S/ ${faceResults.costs.cord.toFixed(2)}
TOTAL OPERACIÓN: S/ ${faceResults.costs.total.toFixed(2)}

Análisis IA:
${faceAnalysis || "Análisis no generado."}
-----------------------
Generado por SubMine (c) 2024
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_SubMine_${Date.now()}.txt`;
    link.click();
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    const botResponse = await chatWithAssistant(userMsg);
    setChatMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#1a1a1a]/90 backdrop-blur-md border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Pickaxe className="text-gold w-8 h-8" />
            <span className="text-2xl font-bold font-industrial tracking-widest text-gold">SUBMINE</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-semibold uppercase tracking-wider">
            <button onClick={() => setActiveTab('home')} className={`hover:text-gold transition ${activeTab === 'home' ? 'text-gold' : 'text-gray-400'}`}>Inicio</button>
            <button onClick={() => setActiveTab('face')} className={`hover:text-gold transition ${activeTab === 'face' ? 'text-gold' : 'text-gray-400'}`}>Cálculos Frente</button>
            <button onClick={() => setActiveTab('blast')} className={`hover:text-gold transition ${activeTab === 'blast' ? 'text-gold' : 'text-gray-400'}`}>Voladura</button>
            <button onClick={() => setActiveTab('op')} className={`hover:text-gold transition ${activeTab === 'op' ? 'text-gold' : 'text-gray-400'}`}>Operación</button>
            <button onClick={() => setActiveTab('ai')} className={`hover:text-gold transition ${activeTab === 'ai' ? 'text-gold' : 'text-gray-400'}`}>Asistente IA</button>
            <button onClick={() => setActiveTab('reviews')} className={`hover:text-gold transition ${activeTab === 'reviews' ? 'text-gold' : 'text-gray-400'}`}>Casos Éxito</button>
          </div>
          {/* Mobile Menu Icon (Simplified) */}
          <div className="md:hidden">
            <select 
              className="bg-gray-800 text-gold border-none rounded p-1 text-xs"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
            >
              <option value="home">Inicio</option>
              <option value="face">Frente</option>
              <option value="blast">Voladura</option>
              <option value="op">Operación</option>
              <option value="ai">Asistente</option>
              <option value="reviews">Casos</option>
              <option value="training">Cursos</option>
            </select>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <section className="h-[90vh] flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <h1 className="text-5xl md:text-7xl font-industrial font-bold leading-tight drop-shadow-lg">
                BIENVENIDO A <span className="text-gold">SUBMINE</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                Tu copiloto inteligente para la perforación y voladura en minería subterránea. 
                Optimiza tus operaciones, reduce costos y garantiza la seguridad.
              </p>
              <button 
                onClick={handleHomeNav}
                className="bg-gold hover:brightness-110 text-black px-12 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 gold-glow flex items-center gap-2 mx-auto"
              >
                INICIO <ChevronRight size={20} />
              </button>
            </div>
          </section>
        )}

        {activeTab === 'face' && (
          <section className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
            <h2 className="text-4xl font-industrial text-gold border-l-4 border-gold pl-4 uppercase">Cálculos por Frente</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#1a1a1a]/80 p-8 rounded-xl border border-gray-800 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Ancho de Frente (m)</label>
                    <input 
                      type="number" step="0.1" value={faceInputs.width} 
                      onChange={e => setFaceInputs({...faceInputs, width: parseFloat(e.target.value) || 0})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold focus:ring-1 focus:ring-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Alto de Frente (m)</label>
                    <input 
                      type="number" step="0.1" value={faceInputs.height} 
                      onChange={e => setFaceInputs({...faceInputs, height: parseFloat(e.target.value) || 0})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold focus:ring-1 focus:ring-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Avance (m)</label>
                    <input 
                      type="number" step="0.1" value={faceInputs.advance} 
                      onChange={e => setFaceInputs({...faceInputs, advance: parseFloat(e.target.value) || 0})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold focus:ring-1 focus:ring-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Tipo de Roca</label>
                    <select 
                      value={faceInputs.rockType} 
                      onChange={e => setFaceInputs({...faceInputs, rockType: e.target.value as RockType})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold outline-none"
                    >
                      <option value={RockType.Blanda}>Blanda</option>
                      <option value={RockType.Media}>Media</option>
                      <option value={RockType.Dura}>Dura</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={handleFaceAnalysis} className="flex-1 bg-gold text-black py-3 rounded font-bold hover:brightness-110 flex items-center justify-center gap-2">
                    {loadingAnalysis ? "Analizando..." : <><Zap size={18} /> ANALIZAR IA</>}
                  </button>
                  <button onClick={handleDownloadReport} className="bg-gray-800 text-white px-4 rounded hover:bg-gray-700">
                    <Download size={20} />
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/50 p-8 rounded-xl border border-gold/30 space-y-8">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gold"><TrendingUp size={24}/> RESULTADOS AUTOMÁTICOS</h3>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="bg-black/40 p-4 rounded border border-gray-800">
                    <p className="text-gray-500 uppercase text-[10px]">Espaciamiento</p>
                    <p className="text-2xl font-bold">{faceResults?.spacing} m</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded border border-gray-800">
                    <p className="text-gray-500 uppercase text-[10px]">Burden</p>
                    <p className="text-2xl font-bold">{faceResults?.burden} m</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded border border-gray-800">
                    <p className="text-gray-500 uppercase text-[10px]">Nro Taladros</p>
                    <p className="text-2xl font-bold">{faceResults?.holesCount}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded border border-gray-800">
                    <p className="text-gray-500 uppercase text-[10px]">Carga Explosiva</p>
                    <p className="text-2xl font-bold">{faceResults?.totalExplosive.toFixed(1)} kg</p>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-6">
                  <p className="text-gold uppercase text-xs font-bold mb-4">Análisis de Costos (Soles)</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400"><span>Dinamita (S/ 25/kg):</span> <span>S/ {faceResults?.costs.dynamite.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-400"><span>Detonador (S/ 5/u):</span> <span>S/ {faceResults?.costs.detonator.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-400"><span>Cordón (S/ 2/m):</span> <span>S/ {faceResults?.costs.cord.toLocaleString()}</span></div>
                    <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-gray-800">
                      <span>COSTO TOTAL:</span> 
                      <span className="text-gold">S/ {faceResults?.costs.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {faceAnalysis && (
              <div className="bg-gray-800/80 p-8 rounded-xl border-l-4 border-gold animate-fadeIn">
                <h3 className="text-xl font-bold text-gold mb-4 flex items-center gap-2"><Settings size={22} /> INFORME TÉCNICO IA</h3>
                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                  {faceAnalysis}
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === 'blast' && (
          <section className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
            <h2 className="text-4xl font-industrial text-gold border-l-4 border-gold pl-4 uppercase">Cálculos de Voladura</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#1a1a1a]/80 p-8 rounded-xl border border-gray-800 space-y-6">
                <p className="text-gray-400 text-sm italic">Ingrese parámetros manuales para diseño específico de malla.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Espaciamiento (m)</label>
                    <input 
                      type="number" step="0.1" value={blastInputs.spacing} 
                      onChange={e => setBlastInputs({...blastInputs, spacing: parseFloat(e.target.value) || 0})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Burden (m)</label>
                    <input 
                      type="number" step="0.1" value={blastInputs.burden} 
                      onChange={e => setBlastInputs({...blastInputs, burden: parseFloat(e.target.value) || 0})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Ancho (m)</label>
                    <input 
                      type="number" value={blastInputs.width} 
                      onChange={e => setBlastInputs({...blastInputs, width: parseFloat(e.target.value) || 0})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Alto (m)</label>
                    <input 
                      type="number" value={blastInputs.height} 
                      onChange={e => setBlastInputs({...blastInputs, height: parseFloat(e.target.value) || 0})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Avance (m)</label>
                    <input 
                      type="number" value={blastInputs.advance} 
                      onChange={e => setBlastInputs({...blastInputs, advance: parseFloat(e.target.value) || 0})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 p-6 rounded border border-gray-800 text-center">
                      <p className="text-gold font-bold text-4xl">{blastResults?.holesCount}</p>
                      <p className="text-gray-500 text-xs uppercase">Taladros</p>
                    </div>
                    <div className="bg-gray-900 p-6 rounded border border-gray-800 text-center">
                      <p className="text-gold font-bold text-4xl">{blastResults?.totalExplosive.toFixed(1)}</p>
                      <p className="text-gray-500 text-xs uppercase">Carga (kg)</p>
                    </div>
                 </div>
                 <div className="bg-black/60 overflow-hidden rounded-xl border border-gray-800">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-800 text-gold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Insumo</th>
                          <th className="p-3">Unidad</th>
                          <th className="p-3 text-right">Costo (S/)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        <tr><td className="p-3">Dinamita</td><td className="p-3">kg</td><td className="p-3 text-right">S/ {blastResults?.costs.dynamite.toLocaleString()}</td></tr>
                        <tr><td className="p-3">Detonador</td><td className="p-3">und</td><td className="p-3 text-right">S/ {blastResults?.costs.detonator.toLocaleString()}</td></tr>
                        <tr><td className="p-3">Cordón</td><td className="p-3">mt</td><td className="p-3 text-right">S/ {blastResults?.costs.cord.toLocaleString()}</td></tr>
                        <tr className="bg-gold/10 font-bold"><td className="p-3">TOTAL</td><td className="p-3"></td><td className="p-3 text-right text-gold">S/ {blastResults?.costs.total.toLocaleString()}</td></tr>
                      </tbody>
                    </table>
                 </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'op' && (
          <section className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
            <h2 className="text-4xl font-industrial text-gold border-l-4 border-gold pl-4 uppercase">Costos de Operación</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-[#1a1a1a]/80 p-8 rounded-xl border border-gray-800 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Avance Lineal (m)</label>
                    <input 
                      type="number" value={opInputs.advance} 
                      onChange={e => setOpInputs({...opInputs, advance: parseFloat(e.target.value) || 0})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Número de Taladros</label>
                    <input 
                      type="number" value={opInputs.holes} 
                      onChange={e => setOpInputs({...opInputs, holes: parseInt(e.target.value) || 0})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Longitud de Taladro (m)</label>
                    <input 
                      type="number" step="0.1" value={opInputs.length} 
                      onChange={e => setOpInputs({...opInputs, length: parseFloat(e.target.value) || 0})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Precio por metro/unidad (S/)</label>
                    <input 
                      type="number" value={opInputs.price} 
                      onChange={e => setOpInputs({...opInputs, price: parseFloat(e.target.value) || 0})}
                      className="w-full bg-gray-900 border border-gray-700 p-3 rounded text-gold outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-6">
                <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gold/40 gold-glow">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Resumen de Inversión Operativa</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-400">Costo Total en Soles</p>
                      <p className="text-5xl font-industrial font-bold text-gold">S/ {opResults?.totalCost.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-6">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Costo por Taladro</p>
                        <p className="text-xl font-bold">S/ {opResults?.costPerHole.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Costo por Metro Lineal</p>
                        <p className="text-xl font-bold">S/ {opResults?.costPerMeter.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/40 p-4 rounded text-xs text-gray-400 flex items-center gap-3">
                  <ShieldAlert className="text-gold shrink-0" size={24} />
                  Cálculos referenciales basados en longitud efectiva de perforación y eficiencia de cara del 95%.
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'ai' && (
          <section className="max-w-4xl mx-auto p-6 md:p-12 space-y-6 h-[80vh] flex flex-col">
            <h2 className="text-3xl font-industrial text-gold border-l-4 border-gold pl-4 uppercase">Asistente Técnico IA</h2>
            <div className="flex-grow bg-[#1a1a1a]/80 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                    <MessageSquare size={48} className="opacity-20" />
                    <p>Consulta sobre normas de seguridad, malla de perforación<br/>o mejores prácticas ambientales en minería.</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg text-sm ${msg.role === 'user' ? 'bg-gold text-black font-bold' : 'bg-gray-800 text-gray-200'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-900 border-t border-gray-800 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ej: ¿Cuál es el tiempo de ventilación post-voladura recomendado?" 
                  className="flex-grow bg-black border border-gray-700 p-3 rounded text-gold outline-none placeholder:text-gray-600"
                />
                <button onClick={handleSendMessage} className="bg-gold text-black px-6 rounded font-bold hover:brightness-110">ENVIAR</button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'reviews' && (
          <section className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
            <h2 className="text-4xl font-industrial text-gold border-l-4 border-gold pl-4 uppercase">Casos de Éxito</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  loc: "Sorochuco (Cajamarca)",
                  points: [
                    "Se optimizó el diseño de malla reduciendo costos en 12%",
                    "Mejora de seguridad en zonas con alta presencia de gases"
                  ],
                  img: "https://picsum.photos/seed/mine1/600/400"
                },
                {
                  loc: "Algamarca (Cajamarca)",
                  points: [
                    "Reducción de consumo de explosivos sin comprometer el avance",
                    "Capacitación al personal técnico con herramientas inteligentes"
                  ],
                  img: "https://picsum.photos/seed/mine2/600/400"
                }
              ].map((caseStudy, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-gold transition-all">
                  <img src={caseStudy.img} alt={caseStudy.loc} className="w-full h-48 object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-gold">{caseStudy.loc}</h3>
                    <ul className="space-y-3">
                      {caseStudy.points.map((p, j) => (
                        <li key={j} className="flex gap-2 text-gray-300">
                          <ChevronRight className="text-gold shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'training' && (
          <section className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-industrial text-gold uppercase">Capacitaciones SubMine</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Potenciamos el talento técnico mediante formación de vanguardia con expertos de la industria.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Diseño de Malla Avanzado", icon: <Construction />, type: "Virtual / Presencial" },
                { title: "Gestión de Explosivos", icon: <Zap />, type: "Presencial" },
                { title: "Seguridad y Geomecánica", icon: <HardHat />, type: "Virtual" }
              ].map((course, i) => (
                <div key={i} className="bg-[#1a1a1a] p-8 rounded-xl border-t-4 border-gold shadow-2xl space-y-6 flex flex-col items-center text-center">
                  <div className="p-4 bg-gray-800 rounded-full text-gold">
                    {React.cloneElement(course.icon as React.ReactElement, { size: 40 })}
                  </div>
                  <h3 className="text-xl font-bold">{course.title}</h3>
                  <p className="text-gray-500 text-sm">Enfoque técnico-práctico con certificación oficial al finalizar.</p>
                  <p className="text-gold text-xs font-bold uppercase">{course.type}</p>
                  <button className="w-full border border-gold text-gold py-2 rounded hover:bg-gold hover:text-black transition">MÁS INFO</button>
                </div>
              ))}
            </div>
            <div className="bg-gray-900/80 p-12 rounded-2xl border border-gray-800 text-center space-y-6">
              <h3 className="text-2xl font-bold text-white">Nuestra Experiencia</h3>
              <p className="text-gray-400 max-w-3xl mx-auto italic">
                "Contamos con un equipo multidisciplinario de profesionales senior en voladura, geomecánica y seguridad industrial, 
                con más de 15 años operando en los yacimientos más complejos de la región andina."
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Pickaxe className="text-gold w-6 h-6" />
              <span className="text-xl font-bold font-industrial text-gold">SUBMINE</span>
            </div>
            <p className="text-gray-500 text-sm">La inteligencia aplicada a la roca. Líderes en tecnología de voladura subterránea.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-white">Contacto</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <p className="flex items-center gap-2"><Mail size={16} className="text-gold" /> contacto@submine.pe</p>
              <p className="flex items-center gap-2"><Globe size={16} className="text-gold" /> www.submine.pe</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-white">Legal</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <p className="hover:text-gold cursor-pointer transition">Términos y Condiciones</p>
              <p className="hover:text-gold cursor-pointer transition">Política de Privacidad</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-white">Siguenos</h4>
            <div className="flex gap-4">
              <button className="bg-gray-800 p-2 rounded hover:bg-gold hover:text-black transition"><Linkedin size={20} /></button>
              <button className="bg-gray-800 p-2 rounded hover:bg-gold hover:text-black transition"><Globe size={20} /></button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-900 mt-12 pt-8 text-center text-xs text-gray-600">
          © 2024 SubMine. Todos los derechos reservados. Tecnología e Innovación Minera.
        </div>
      </footer>
    </div>
  );
};

export default App;
