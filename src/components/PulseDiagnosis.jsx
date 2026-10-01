import React, { useState } from 'react';
import { Activity, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react';

export default function PulseDiagnosis({ onBack }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState('');

  const questions = [
    {
      id: 1,
      title: "نبض کا مقام محسوس کریں",
      options: [
        { value: 'عضلاتی', label: 'نبض باالکل اوپر، انگلی رکھتے ہی محسوس ہو رہی ہے۔ کبھی آنکھوں سے بھی ہلتی نظر آتی ہے۔' },
        { value: 'غدی', label: 'نبض باالکل اوپر نہیں، ہلکا سا دباؤ دینے پر محسوس ہوتی ہے۔(درمیان)' },
        { value: 'اعصابی', label: 'نبض ہلکا سا دباؤ دینے سے بھی محسوس نہیں ہوتی بہت زیادہ دباؤ دینے پر نیچے محسوس ہوتی ہے۔' }
      ]
    },
    {
      id: 2,
      title: "نبض کی لمبائی کو محسوس کریں",
      options: [
        { value: 'عضلاتی', label: 'نبض کی لمبائی چار انگلیاں یا اس سے بھی زیادہ لمبی ہے۔' },
        { value: 'غدی', label: 'نبض کی لمبائی دو انگلی یا تین انگلی تک ہے۔تین سے زیادہ نہیں۔' },
        { value: 'اعصابی', label: 'نبض کی لمبائی ایک انگلی یا ڈیڑھ انگلی ہے۔(حرارت باالکل نہیں)' }
      ]
    },
    {
      id: 3,
      title: "نبض کا حجم محسوس کریں",
      options: [
        { value: 'عضلاتی', label: 'نبض چوڑی نہیں ہے بلکہ دھاگے کی طرح باریک ہے۔(نصف پورے سے کم)' },
        { value: 'غدی', label: 'نبض معمولی چوڑی ہے۔یعنی دو یا تین دھاگوں کے برابر(نصف پورے تک)' },
        { value: 'اعصابی', label: 'نبض زیادہ چوڑی اور نرم ہے۔(نصف پورے سے زیادہ)' }
      ]
    },
    {
      id: 4,
      title: "نبض کی رفتار محسوس کریں",
      options: [
        { value: 'عضلاتی', label: 'نبض بہت تیز رفتار ہے۔(سریع)' },
        { value: 'غدی', label: 'رفتار سست یا درمیانی ہے، مگر نبض تنگ ہے۔' },
        { value: 'اعصابی', label: 'رفتار سست ہے، مگر نبض چوڑی ہے۔(سست)' }
      ]
    },
    {
      id: 5,
      title: "نبض کی ٹھوکر محسوس کریں",
      options: [
        { value: 'عضلاتی', label: 'نبض زور دار ٹھوکر مارتی ہے گویا انگلیوں کو اٹھا دیتی ہے۔(قوی)' },
        { value: 'غدی', label: 'نبض کی ٹھوکر معمولی یا درمیانی ہے، مگر نبض تنگ ہے۔(ضعیف)' },
        { value: 'اعصابی', label: 'نبض کی ٹھوکر معمولی ہے، مگر نبض چوڑی ہے۔(ضعیف)' }
      ]
    },
    {
      id: 6,
      title: "نبض کی سختی کو محسوس کریں",
      options: [
        { value: 'عضلاتی', label: 'نبض بہت سخت ہے۔(صلب)' },
        { value: 'غدی', label: 'نبض معتدل ہے۔' },
        { value: 'اعصابی', label: 'نبض بہت نرم ہے۔(لین)' }
      ]
    }
  ];

  const handleSelect = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const calculateDiagnosis = () => {
    const values = Object.values(answers);
    if (values.length < 6) {
      alert("براہ کرم تمام سوالات کے جوابات منتخب کریں۔");
      return;
    }

    const counts = {};
    values.forEach(v => {
      counts[v] = (counts[v] || 0) + 1;
    });

    const sortedAnswers = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    let res = '';

    if (sortedAnswers.length > 0) {
      res += sortedAnswers[0][0];
      if (sortedAnswers.length > 1 && sortedAnswers[1][1] > 0) {
        res += ' ' + sortedAnswers[1][0];
      }
    }
    setResult(res);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setAnswers({});
    setResult('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right" dir="rtl">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 mb-8 shadow-sm border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-600" />
            <span>نبض کیلکولیٹر (Pulse Diagnosis)</span>
          </h1>
          <p className="text-slate-500 font-sans">قانون مفرد اعضاء کی بنیاد پر اپنی نبض کی تشخیص کریں</p>
        </div>
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors font-bold text-sm shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
            واپس جائیں
          </button>
        )}
      </div>

      {result && (
        <div className="bg-emerald-50 rounded-3xl p-8 mb-8 border-2 border-emerald-500 text-center shadow-lg animate-fade-in">
          <h3 className="text-xl font-bold text-emerald-800 mb-4">تشخیص کا نتیجہ</h3>
          <p className="text-slate-600 mb-2">آپ کی نبض کا مزاج ہے:</p>
          <div className="text-4xl font-extrabold text-emerald-700 font-heading mb-6">
            {result}
          </div>
          <button 
            onClick={resetForm}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            دوبارہ تشخیص کریں
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span>{q.title}</span>
            </h3>
            <div className="space-y-3 pl-10">
              {q.options.map((opt, oIdx) => (
                <label 
                  key={oIdx} 
                  className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${answers[q.id] === opt.value ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}
                >
                  <input 
                    type="radio" 
                    name={`q-${q.id}`} 
                    value={opt.value} 
                    checked={answers[q.id] === opt.value}
                    onChange={() => handleSelect(q.id, opt.value)}
                    className="mt-1 w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 font-medium leading-relaxed select-none">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-6">
          <button 
            onClick={calculateDiagnosis}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 text-lg flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            تشخیص مکمل کریں
          </button>
        </div>
      </div>
    </div>
  );
}
