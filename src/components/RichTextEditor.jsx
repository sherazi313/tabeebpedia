import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  RotateCcw,
  RotateCw,
  Code,
  Eye,
  Type,
  RemoveFormatting,
  Palette,
  ArrowRightLeft
} from 'lucide-react';

const FONT_SIZES = [
  { label: '12px (نہایت چھوٹا)', value: '12px' },
  { label: '14px (چھوٹا)', value: '14px' },
  { label: '16px (معمول / درمیانہ)', value: '16px' },
  { label: '18px (نمایاں متن)', value: '18px' },
  { label: '20px (ذیلی سرخی H3)', value: '20px' },
  { label: '24px (درمیانی سرخی H2)', value: '24px' },
  { label: '28px (بڑی سرخی H1)', value: '28px' },
  { label: '32px (جلی سرخی)', value: '32px' }
];

const COLORS = [
  { label: 'سیاہ (Black)', color: '#0f172a' },
  { label: 'سبز ہربل (Herbal Green)', color: '#047857' },
  { label: 'نیلا رائل (Royal Blue)', color: '#1d4ed8' },
  { label: 'سرخ گہرا (Deep Red)', color: '#b91c1c' },
  { label: 'سنہری عنبر (Amber)', color: '#b45309' },
  { label: 'جامنی (Purple)', color: '#6d28d9' },
  { label: 'فیروزی (Teal)', color: '#0f766e' },
  { label: 'سلیٹی گہرا (Slate)', color: '#334155' }
];

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'معالج کا تفصیلی تعارف، مطب کی تاریخ، طریقہ علاج اور فلسفہ شفاء تحریر فرمائیں...',
  minHeight = '240px'
}) {
  const editorRef = useRef(null);
  const [mode, setMode] = useState('visual'); // 'visual' | 'html'
  const [activeFontSize, setActiveFontSize] = useState('16px');
  const [activeDirection, setActiveDirection] = useState('rtl');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#047857');
  const isInternalChange = useRef(false);

  // Sync incoming value to contentEditable div when not typing internally
  useEffect(() => {
    if (editorRef.current && mode === 'visual') {
      if (!isInternalChange.current) {
        if (editorRef.current.innerHTML !== (value || '')) {
          editorRef.current.innerHTML = value || '';
        }
      }
      isInternalChange.current = false;
    }
  }, [value, mode]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      const html = editorRef.current.innerHTML;
      if (onChange) {
        onChange(html);
      }
    }
  };

  const execCmd = (command, val = null) => {
    if (mode !== 'visual') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleInput();
  };

  const applyFontSize = (size) => {
    setActiveFontSize(size);
    if (mode !== 'visual') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      if (editorRef.current) {
        editorRef.current.style.fontSize = size;
      }
      return;
    }

    document.execCommand('fontSize', false, '7');
    const fontElements = editorRef.current.querySelectorAll('font[size="7"]');
    fontElements.forEach(el => {
      const span = document.createElement('span');
      span.style.fontSize = size;
      span.innerHTML = el.innerHTML;
      el.parentNode.replaceChild(span, el);
    });
    handleInput();
  };

  const applyColor = (color) => {
    execCmd('foreColor', color);
    setShowColorPicker(false);
  };

  const setDirection = (dir) => {
    setActiveDirection(dir);
    if (editorRef.current) {
      editorRef.current.setAttribute('dir', dir);
      if (dir === 'rtl') {
        editorRef.current.style.textAlign = 'right';
      } else {
        editorRef.current.style.textAlign = 'left';
      }
      editorRef.current.focus();
    }
  };

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      {/* Rich Text Editor Header / Toolbar */}
      <div className="bg-slate-50/95 border-b border-slate-200 p-2 sm:p-2.5 flex flex-wrap items-center gap-1.5 select-none text-slate-700">
        
        {/* 1. Font Size Dropdown */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1 shadow-2xs">
          <Type className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <select
            value={activeFontSize}
            onChange={(e) => applyFontSize(e.target.value)}
            disabled={mode !== 'visual'}
            className="text-xs font-sans bg-transparent text-slate-800 focus:outline-none cursor-pointer"
            title="فونٹ سائز تبدیل کریں"
          >
            {FONT_SIZES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

        {/* 2. Headings (H1, H2, H3, P) */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<h1>')}
            disabled={mode !== 'visual'}
            title="بڑی سرخی (H1)"
            className="px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg hover:text-blue-600 transition-colors disabled:opacity-40 flex items-center gap-0.5"
          >
            <Heading1 className="w-3.5 h-3.5" />
            <span>H1</span>
          </button>
          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<h2>')}
            disabled={mode !== 'visual'}
            title="درمیانی سرخی (H2)"
            className="px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg hover:text-blue-600 transition-colors disabled:opacity-40 flex items-center gap-0.5"
          >
            <Heading2 className="w-3.5 h-3.5" />
            <span>H2</span>
          </button>
          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<h3>')}
            disabled={mode !== 'visual'}
            title="چھوٹی سرخی (H3)"
            className="px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg hover:text-blue-600 transition-colors disabled:opacity-40 flex items-center gap-0.5"
          >
            <Heading3 className="w-3.5 h-3.5" />
            <span>H3</span>
          </button>
          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<p>')}
            disabled={mode !== 'visual'}
            title="عام پیراگراف (Paragraph)"
            className="px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            P
          </button>
        </div>

        <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

        {/* 3. Text Formatting (Bold, Italic, Underline, Strikethrough) */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => execCmd('bold')}
            disabled={mode !== 'visual'}
            title="جلی (Bold)"
            className="p-1.5 hover:bg-slate-100 rounded-lg font-bold text-slate-800 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('italic')}
            disabled={mode !== 'visual'}
            title="ترچھا (Italic)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-800 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('underline')}
            disabled={mode !== 'visual'}
            title="خط کشیدہ (Underline)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-800 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('strikeThrough')}
            disabled={mode !== 'visual'}
            title="لکیر زدہ (Strikethrough)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-800 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

        {/* 4. Direction Controls (Right to Left & Left to Right) */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setDirection('rtl')}
            disabled={mode !== 'visual'}
            title="دائیں سے بائیں (Right-to-Left / RTL - اردو رسم الخط)"
            className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1 ${
              activeDirection === 'rtl' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>RTL</span>
            <span className="text-[10px]">دائیں</span>
          </button>
          <button
            type="button"
            onClick={() => setDirection('ltr')}
            disabled={mode !== 'visual'}
            title="بائیں سے دائیں (Left-to-Right / LTR - انگریزی)"
            className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1 ${
              activeDirection === 'ltr' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>LTR</span>
            <span className="text-[10px]">بائیں</span>
          </button>
        </div>

        <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

        {/* 5. Alignments (Right, Center, Left, Justify) */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => execCmd('justifyRight')}
            disabled={mode !== 'visual'}
            title="دائیں سیدھ (Right Align)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyCenter')}
            disabled={mode !== 'visual'}
            title="درمیانی سیدھ (Center Align)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyLeft')}
            disabled={mode !== 'visual'}
            title="بائیں سیدھ (Left Align)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyFull')}
            disabled={mode !== 'visual'}
            title="برابر سیدھ (Justify)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

        {/* 6. Lists & Quotes */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            disabled={mode !== 'visual'}
            title="بلٹ لسٹ (Bullet List)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            disabled={mode !== 'visual'}
            title="نمبر لسٹ (Numbered List)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<blockquote>')}
            disabled={mode !== 'visual'}
            title="اقتباس / کوٹیشن (Blockquote)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7. Color Picker Popover with Swatches + Custom Color */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            disabled={mode !== 'visual'}
            title="متن کا رنگ (Text Color)"
            className="p-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-emerald-700 transition-colors shadow-2xs disabled:opacity-40 flex items-center gap-1 text-xs"
          >
            <Palette className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] hidden sm:inline font-bold">رنگ</span>
          </button>
          {showColorPicker && (
            <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-1.5 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl z-30 space-y-2 min-w-[200px]">
              <span className="text-[11px] font-bold text-slate-600 block border-b border-slate-100 pb-1">
                متن کا رنگ منتخب کریں:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map(c => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => applyColor(c.color)}
                    className="w-7 h-7 rounded-xl border border-slate-200 transition-transform hover:scale-110 shadow-2xs flex items-center justify-center"
                    style={{ backgroundColor: c.color }}
                    title={c.label}
                  />
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    applyColor(e.target.value);
                  }}
                  className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
                  title="اپنی مرضی کا رنگ منتخب کریں"
                />
                <span className="text-[10px] text-slate-500">کسٹم رنگ چنیں</span>
              </div>
            </div>
          )}
        </div>

        {/* 8. Clear Formatting */}
        <button
          type="button"
          onClick={() => execCmd('removeFormat')}
          disabled={mode !== 'visual'}
          title="فارمیٹنگ ختم کریں (Clear Formatting)"
          className="p-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors shadow-2xs disabled:opacity-40"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        {/* 9. Undo & Redo */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => execCmd('undo')}
            disabled={mode !== 'visual'}
            title="واپس (Undo)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('redo')}
            disabled={mode !== 'visual'}
            title="دوبارہ (Redo)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors disabled:opacity-40"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1" />

        {/* 10. Visual vs Code Mode Toggle */}
        <button
          type="button"
          onClick={() => setMode(mode === 'visual' ? 'html' : 'visual')}
          title={mode === 'visual' ? 'HTML کوڈ موڈ میں تبدیل کریں' : 'بصری ایڈیٹر موڈ'}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
            mode === 'html'
              ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-2xs'
          }`}
        >
          {mode === 'visual' ? (
            <>
              <Code className="w-3.5 h-3.5" />
              <span>HTML سورس کوڈ</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>بصری ایڈیٹر (Visual)</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Content Area */}
      {mode === 'visual' ? (
        <div
          ref={editorRef}
          contentEditable
          dir={activeDirection}
          onInput={handleInput}
          onBlur={handleInput}
          style={{ minHeight, fontSize: activeFontSize, textAlign: activeDirection === 'rtl' ? 'right' : 'left' }}
          className="p-4 sm:p-5 focus:outline-none text-slate-800 leading-relaxed font-body empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none space-y-2 selection:bg-emerald-100"
          data-placeholder={placeholder}
        />
      ) : (
        <textarea
          dir="ltr"
          rows={10}
          value={value || ''}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
          }}
          style={{ minHeight }}
          className="w-full p-4 font-mono text-xs text-emerald-300 bg-slate-900 focus:outline-none leading-relaxed"
          placeholder="<html>...</html>"
        />
      )}
    </div>
  );
}
