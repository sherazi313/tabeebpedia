import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  List,
  ListOrdered,
  Heading,
  RotateCcw,
  RotateCw,
  Code,
  Eye,
  Type,
  RemoveFormatting,
  Palette
} from 'lucide-react';

const FONT_SIZES = [
  { label: '12px (نہایت چھوٹا)', value: '12px' },
  { label: '14px (چھوٹا)', value: '14px' },
  { label: '16px (معمول / درمیانہ)', value: '16px' },
  { label: '18px (نمایاں متن)', value: '18px' },
  { label: '20px (ذیلی سرخی H3)', value: '20px' },
  { label: '24px (بڑی سرخی H2)', value: '24px' }
];

const COLORS = [
  { label: 'سیاہ مائل', color: '#1e293b' },
  { label: 'سبز ہربل', color: '#047857' },
  { label: 'نیلا رائل', color: '#1d4ed8' },
  { label: 'سرخ گہرا', color: '#b91c1c' },
  { label: 'سنہری عنبر', color: '#b45309' }
];

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'اپنے تجربے، مطب کی تاریخ، طریقہ علاج اور معالجاتی فلسفہ کی تفصیل تحریر فرمائیں...',
  minHeight = '180px'
}) {
  const editorRef = useRef(null);
  const [mode, setMode] = useState('visual'); // 'visual' | 'html'
  const [activeFontSize, setActiveFontSize] = useState('16px');
  const [showColorPicker, setShowColorPicker] = useState(false);
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
      // If no text is selected, style the whole editor or block
      if (editorRef.current) {
        editorRef.current.style.fontSize = size;
      }
      return;
    }

    // Apply inline span with font-size
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

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      {/* Rich Text Toolbar */}
      <div className="bg-slate-50/90 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1.5 select-none text-slate-700">
        
        {/* Font Size Selector */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs">
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

        {/* Text Alignments */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => execCmd('justifyRight')}
            disabled={mode !== 'visual'}
            title="دائیں سیدھ (Right Align)"
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyCenter')}
            disabled={mode !== 'visual'}
            title="درمیانی سیدھ (Center Align)"
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyLeft')}
            disabled={mode !== 'visual'}
            title="بائیں سیدھ (Left Align)"
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyFull')}
            disabled={mode !== 'visual'}
            title="برابر سیدھ (Justify)"
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

        {/* Bold, Italic, Underline */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => execCmd('bold')}
            disabled={mode !== 'visual'}
            title="جلی (Bold)"
            className="p-1.5 hover:bg-slate-100 rounded font-bold text-slate-800 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('italic')}
            disabled={mode !== 'visual'}
            title="ترچھا (Italic)"
            className="p-1.5 hover:bg-slate-100 rounded text-slate-800 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('underline')}
            disabled={mode !== 'visual'}
            title="خط کشیدہ (Underline)"
            className="p-1.5 hover:bg-slate-100 rounded text-slate-800 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

        {/* Headings & Lists */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<h3>')}
            disabled={mode !== 'visual'}
            title="ذیلی سرخی (H3)"
            className="px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded hover:text-blue-600 transition-colors disabled:opacity-40 flex items-center gap-0.5"
          >
            <Heading className="w-3 h-3" />
            <span>H3</span>
          </button>
          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<p>')}
            disabled={mode !== 'visual'}
            title="عام پیراگراف (Paragraph)"
            className="px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            P
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            disabled={mode !== 'visual'}
            title="بلٹ لسٹ (Bullet List)"
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            disabled={mode !== 'visual'}
            title="نمبر لسٹ (Numbered List)"
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-600 transition-colors disabled:opacity-40"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Color Picker Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            disabled={mode !== 'visual'}
            title="متن کا رنگ"
            className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-emerald-700 transition-colors shadow-2xs disabled:opacity-40"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl p-2 shadow-lg z-20 flex gap-1.5">
              {COLORS.map(c => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => applyColor(c.color)}
                  className="w-5 h-5 rounded-full border border-slate-300 transition-transform hover:scale-110"
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          )}
        </div>

        {/* Remove formatting & Undo/Redo */}
        <button
          type="button"
          onClick={() => execCmd('removeFormat')}
          disabled={mode !== 'visual'}
          title="فارمیٹنگ ختم کریں"
          className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors shadow-2xs disabled:opacity-40"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1" />

        {/* Visual vs Code Mode Toggle */}
        <button
          type="button"
          onClick={() => setMode(mode === 'visual' ? 'html' : 'visual')}
          title={mode === 'visual' ? 'HTML کوڈ موڈ میں تبدیل کریں' : 'بصری ایڈیٹر موڈ'}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition-colors ${
            mode === 'html'
              ? 'bg-blue-600 text-white border-blue-700'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {mode === 'visual' ? (
            <>
              <Code className="w-3.5 h-3.5" />
              <span>HTML کوڈ</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>بصری ایڈیٹر</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Content Area */}
      {mode === 'visual' ? (
        <div
          ref={editorRef}
          contentEditable
          dir="rtl"
          onInput={handleInput}
          onBlur={handleInput}
          style={{ minHeight, fontSize: activeFontSize }}
          className="p-4 focus:outline-none text-slate-800 leading-relaxed font-body empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
          data-placeholder={placeholder}
        />
      ) : (
        <textarea
          dir="ltr"
          rows={7}
          value={value || ''}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
          }}
          style={{ minHeight }}
          className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-900 text-emerald-300 focus:outline-none"
          placeholder="<html>...</html>"
        />
      )}
    </div>
  );
}
