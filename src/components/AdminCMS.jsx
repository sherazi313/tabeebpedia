import React, { useState, useRef, useEffect } from 'react';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  UploadCloud, 
  Database, 
  FileText, 
  UserCheck, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  X,
  Eye,
  Save,
  RefreshCw,
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
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Palette,
  Type,
  Maximize2,
  Minimize2,
  ArrowRight,
  Globe,
  Lock,
  Calendar,
  Layers,
  Search,
  SlidersHorizontal,
  FolderOpen,
  Check,
  Undo,
  Redo,
  Eraser,
  Code,
  Minus,
  Paperclip,
  ChevronDown,
  BoxSelect,
  AlertTriangle,
  Info,
  Heart,
  Settings,
  Phone,
  MessageCircle,
  Share2,
  Home,
  Layout,
  Table as TableIcon,
  HelpCircle,
  Highlighter,
  Subscript,
  Superscript,
  Indent,
  Outdent,
  BookOpen,
  FileSpreadsheet,
  Music,
  CheckSquare,
  ArrowLeftRight,
  ExternalLink,
  Sliders,
  Crop,
  Move,
  CornerUpRight,
  Copy,
  Clock,
  Mail
} from 'lucide-react';
import { ARTICLES, DOCTORS, CATEGORIES, SPECIALTIES } from '../data/mockData';

// Slug Generator Helper (Supports Urdu and English clean URL friendly slugs)
const generateSlugFromTitle = (title) => {
  if (!title) return '';
  return title
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, '-')
    .replace(/[^\w\u0600-\u06FF\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function AdminCMS({ 
  onBackToWebsite, 
  initialTab = 'articles', 
  siteSettings, 
  setSiteSettings, 
  onViewArticle,
  articlesList: propArticlesList,
  setArticlesList: propSetArticlesList,
  doctorsList: propDoctorsList,
  setDoctorsList: propSetDoctorsList
}) {
  const [adminTab, setAdminTab] = useState(initialTab); // 'articles', 'new-article', 'doctors', 'migration', 'settings'
  const [internalArticlesList, setInternalArticlesList] = useState(ARTICLES);
  const articlesList = propArticlesList || internalArticlesList;
  const setArticlesList = propSetArticlesList || setInternalArticlesList;

  const [internalDoctorsList, setInternalDoctorsList] = useState(DOCTORS);
  const doctorsList = propDoctorsList || internalDoctorsList;
  const setDoctorsList = propSetDoctorsList || setInternalDoctorsList;

  // Search & Filter in Articles table
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Doctor Approvals & Management States
  const [doctorTabFilter, setDoctorTabFilter] = useState('pending'); // 'pending', 'approved', 'all'
  const [doctorSearchFilter, setDoctorSearchFilter] = useState('');
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [doctorForm, setDoctorForm] = useState(null);
  const [passwordRequests, setPasswordRequests] = useState([]);
  
  useEffect(() => {
    try {
      const reqs = JSON.parse(localStorage.getItem('tabeeb_password_requests') || '[]');
      setPasswordRequests(reqs);
    } catch(err) {}
  }, [adminTab]);
  
  const handleClearPasswordRequest = (id) => {
    try {
      const updated = passwordRequests.filter(r => r.id !== id);
      localStorage.setItem('tabeeb_password_requests', JSON.stringify(updated));
      setPasswordRequests(updated);
    } catch(err) {}
  };

  // Editing state
  const [editingArticleId, setEditingArticleId] = useState(null);

  // Permalink Edit Mode States
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [tempSlug, setTempSlug] = useState('');

  // Article Form State
  const [articleForm, setArticleForm] = useState({
    title: '',
    slug: '',
    category: 'tibb-unani',
    status: 'published', // 'published', 'private'
    excerpt: '',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    imageType: 'url', // 'url' or 'upload'
    tags: 'طب یونانی, جڑی بوٹیاں, صحت',
    author: 'حکیم محمد طارق محمود',
    readingTime: '5 منٹ',
  });

  // Editor styling states
  const [editorFont, setEditorFont] = useState('nastaliq');
  const [editorFontSize, setEditorFontSize] = useState('14px');
  const [editorMode, setEditorMode] = useState('visual'); // 'visual', 'code', 'preview'
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved'
  const [isFocusMode, setIsFocusMode] = useState(false);
  const autoSaveTimerRef = useRef(null);
  
  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (adminTab !== 'new-article') return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setAutoSaveStatus('saving');
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        const draftContent = editorMode === 'visual' && visualEditorRef.current 
          ? visualEditorRef.current.innerHTML 
          : articleForm.content;
        const draft = { ...articleForm, content: draftContent, savedAt: new Date().toISOString() };
        localStorage.setItem('tabeeb_article_draft', JSON.stringify(draft));
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(''), 2500);
      } catch(e) { setAutoSaveStatus(''); }
    }, 30000);
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
  }, [articleForm, adminTab]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Interactive Selected Image State (Clicked Inside Editor Canvas)
  const [selectedImgElement, setSelectedImgElement] = useState(null);
  const [selectedImgProps, setSelectedImgProps] = useState({
    src: '',
    alt: '',
    widthPercent: 100,
    align: 'center', // 'center', 'right', 'left', 'full'
    borderRadius: '16px',
    border: 'none',
    caption: ''
  });

  // Modals & Menus
  const [showBoxMenu, setShowBoxMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showSpecialChars, setShowSpecialChars] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showFindReplaceModal, setShowFindReplaceModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [activeMenuDropdown, setActiveMenuDropdown] = useState(null); // 'file', 'edit', 'view', 'insert', 'format', 'tools', 'table'

  // Find & Replace state
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');

  // Media Modal state
  const [mediaTab, setMediaTab] = useState('upload'); // 'upload', 'url', 'library'
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaAlignment, setMediaAlignment] = useState('center'); // 'center', 'right', 'left', 'full'
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaWidth, setMediaWidth] = useState('100%');

  // WordPress Sidebar State (Tags & Categories)
  const [tagInput, setTagInput] = useState('');
  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [availableCategories, setAvailableCategories] = useState(CATEGORIES.filter(c => c.id !== 'all'));

  // Form Modal state
  const [formType, setFormType] = useState('consultation'); // 'consultation', 'order', 'question'

  // Word count & stats
  const [stats, setStats] = useState({ words: 0, chars: 0, readingTime: 1 });

  // Live Active Format Detection for Toolbar Highlight
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    heading: 'p', // 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote'
    align: 'right', // 'right', 'center', 'left', 'justify'
    ul: false,
    ol: false,
    subscript: false,
    superscript: false
  });

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState(siteSettings || {
    siteName: 'طبیب پیڈیا',
    tagline: 'جامع ہربل و طبی انسائیکلوپیڈیا',
    logoUrl: '',
    helplinePhone: '0300-1234567',
    whatsappNumber: '923001234567',
    topbarNotice: 'طب یونانی، قانون مفرد اعضاء اور پاکستان کے مستند اطباء کی ڈائریکٹری',
    heroTitle: 'مستند اطباء اور حکماء سے مفت آن لائن رہنمائی و فوری رابطہ',
    heroSubtitle: 'طب یونانی، قانون مفرد اعضاء، ہربل علاج اور مستند سائنسی و طبی مضامین کا سب سے بڑا ڈیجیٹل خزانہ',
    footerAbout: 'پاکستان کا سب سے معتبر ڈیجیٹل ہربل پورٹل۔ ہمارا مقصد طب یونانی، طب نبوی اور قانون مفرد اعضاء کو جدید سائنسی معیار اور سہولت کے ساتھ ہر فرد تک پہنچانا ہے۔',
    copyrightText: 'تمام جملہ حقوق محفوظ ہیں۔',
    facebookUrl: 'https://facebook.com/tabeebpedia',
    instagramUrl: 'https://instagram.com/tabeebpedia',
    youtubeUrl: 'https://youtube.com/tabeebpedia',
    metaTitle: 'طبیب پیڈیا - طب یونانی، قانون مفرد اعضاء اور اطباء ڈائریکٹری',
    metaDescription: 'طبیب پیڈیا: پاکستان کی سب سے بڑی اور مستند طب یونانی، جڑی بوٹیاں اور اطباء و ڈاکٹرز ڈائریکٹری۔'
  });

  const visualEditorRef = useRef(null);
  const savedSelectionRef = useRef(null); // Saves exact caret/cursor position!
  const fileInputRef = useRef(null);
  const mediaFileInputRef = useRef(null);
  const replaceImageFileInputRef = useRef(null);
  const logoFileInputRef = useRef(null);

  // Stock library images for easy 1-click media insertion
  const STOCK_MEDIA = [
    { title: 'کلونجی بیج اور فوائد', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', cat: 'Herbs' },
    { title: 'اسگندھ ناگوری جڑ', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', cat: 'Herbs' },
    { title: 'خالص شہد و دارچینی', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', cat: 'Remedies' },
    { title: 'ادرک اور سونف جوشاندہ', url: 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&w=800&q=80', cat: 'Remedies' },
    { title: 'نبض شناسی و معائنہ', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', cat: 'Clinic' },
    { title: 'جڑی بوٹیوں کی تیاری', url: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80', cat: 'Herbs' },
  ];

  // Special characters & Islamic honorifics
  const SPECIAL_SYMBOLS = [
    { label: 'ﷺ', desc: 'صلی اللہ علیہ وسلم' },
    { label: 'ؓ', desc: 'رضی اللہ عنہ' },
    { label: 'ؒ', desc: 'رحمۃ اللہ علیہ' },
    { label: 'ؑ', desc: 'علیہ السلام' },
    { label: 'ﷻ', desc: 'جل جلالہ' },
    { label: '﷽', desc: 'بسم اللہ الرحمن الرحیم' },
    { label: '℞', desc: 'نسخہ علامت (Prescription)' },
    { label: '℃', desc: 'سینٹی گریڈ درجہ حرارت' },
    { label: '℉', desc: 'فارن ہائیٹ' },
    { label: '٪', desc: 'فیصد علامت' },
    { label: '✓', desc: 'درست ٹک' },
    { label: '★', desc: 'ستارہ' },
    { label: '±', desc: 'جمع یا منفی' },
    { label: '÷', desc: 'تقسیم' },
    { label: '×', desc: 'ضرب' },
    { label: '≠', desc: 'برابر نہیں' },
    { label: '©', desc: 'کاپی رائٹ' },
    { label: '®', desc: 'رجسٹرڈ' },
    { label: '™', desc: 'ٹریڈ مارک' },
    { label: '«', desc: 'قوسین شروع' },
    { label: '»', desc: 'قوسین ختم' },
    { label: '؟', desc: 'اردو سوالیہ نشان' },
  ];

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // =========================================================
  // PRECISE CARET / CURSOR PRESERVATION ENGINE
  // =========================================================
  const saveCurrentSelection = () => {
    if (editorMode !== 'visual' || !visualEditorRef.current) return;
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (
          visualEditorRef.current.contains(range.commonAncestorContainer) || 
          range.commonAncestorContainer === visualEditorRef.current
        ) {
          savedSelectionRef.current = range.cloneRange();
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const restoreSelection = () => {
    if (!visualEditorRef.current) return false;
    visualEditorRef.current.focus();
    if (savedSelectionRef.current) {
      try {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
        return true;
      } catch (err) {
        // range may be detached
      }
    }
    return false;
  };

  // Live calculation of words, characters, and reading time
  const updateStats = () => {
    if (!visualEditorRef.current) return;
    const text = visualEditorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const readingTime = Math.max(1, Math.ceil(words / 150));
    setStats({ words, chars, readingTime });
  };

  // Check and update what format is applied at the current cursor position
  const updateActiveFormats = () => {
    if (editorMode !== 'visual' || !visualEditorRef.current) return;
    
    try {
      const bold = document.queryCommandState('bold');
      const italic = document.queryCommandState('italic');
      const underline = document.queryCommandState('underline');
      const strike = document.queryCommandState('strikeThrough');
      const ul = document.queryCommandState('insertUnorderedList');
      const ol = document.queryCommandState('insertOrderedList');
      const subscript = document.queryCommandState('subscript');
      const superscript = document.queryCommandState('superscript');
      const justifyRight = document.queryCommandState('justifyRight');
      const justifyCenter = document.queryCommandState('justifyCenter');
      const justifyLeft = document.queryCommandState('justifyLeft');
      const justifyFull = document.queryCommandState('justifyFull');

      let heading = 'p';
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node = selection.anchorNode;
        while (node && node !== visualEditorRef.current) {
          if (node.nodeType === 1) {
            const tagName = node.tagName?.toLowerCase();
            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'pre'].includes(tagName)) {
              heading = tagName;
              break;
            }
          }
          node = node.parentNode;
        }
      }

      let align = 'right';
      if (justifyCenter) align = 'center';
      else if (justifyLeft) align = 'left';
      else if (justifyFull) align = 'justify';

      setActiveFormats({
        bold,
        italic,
        underline,
        strike,
        heading,
        align,
        ul,
        ol,
        subscript,
        superscript
      });

      updateStats();
    } catch (e) {
      // ignore
    }
  };

  // Sync content into visual editor whenever form or tab changes
  useEffect(() => {
    if (adminTab === 'new-article' && editorMode === 'visual' && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== articleForm.content) {
        visualEditorRef.current.innerHTML = articleForm.content || '';
      }
      visualEditorRef.current.style.fontSize = '14px';
      updateStats();
    }
  }, [adminTab, editingArticleId, editorMode]);

  // Close menus on outside click
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuDropdown(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Open New Article Editor
  const handleOpenNewArticle = () => {
    setSelectedImgElement(null);
    setEditingArticleId(null);
    setIsEditingSlug(false);
    setTempSlug('');
    setEditorFont('nastaliq');
    setEditorFontSize('14px');
    setArticleForm({
      title: '',
      slug: '',
      category: 'tibb-unani',
      status: 'published',
      excerpt: '',
      content: '<p>یہاں اپنا تفصیلی اردو طبی مضمون تحریر کریں...</p>',
      featuredImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      imageType: 'url',
      tags: 'طب یونانی, جڑی بوٹیاں',
      author: 'حکیم محمد طارق محمود',
      readingTime: '5 منٹ',
    });
    setEditorMode('visual');
    setAdminTab('new-article');
  };

  // Open Edit Article (Safe & Robust)
  const handleEditArticle = (art) => {
    setSelectedImgElement(null);
    setEditingArticleId(art.id);
    setIsEditingSlug(false);
    setEditorFont('nastaliq');
    setEditorFontSize('14px');
    const initialSlug = art.slug || generateSlugFromTitle(art.title);
    setTempSlug(initialSlug);
    setArticleForm({
      title: art.title || '',
      slug: initialSlug,
      category: art.category || 'tibb-unani',
      status: art.status || 'published',
      excerpt: art.excerpt || '',
      content: art.content || '<p></p>',
      featuredImage: art.featuredImage || '',
      imageType: 'url',
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : (art.tags || ''),
      author: art.author || 'حکیم محمد طارق محمود',
      readingTime: art.readingTime || '5 منٹ',
    });
    setEditorMode('visual');
    setAdminTab('new-article');
  };

  // Toggle Status (Public / Private)
  const handleToggleStatus = (id) => {
    setArticlesList(articlesList.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'private' ? 'published' : 'private';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
    showNotification('مضمون کا پبلشنگ اسٹیٹس کامیابی سے تبدیل ہو گیا');
  };

  // Delete Article
  const handleDeleteArticle = (id) => {
    if (confirm('کیا آپ واقعی یہ مضمون مکمل ڈیلیٹ کرنا چاہتے ہیں؟')) {
      setArticlesList(articlesList.filter(a => a.id !== id));
      showNotification('مضمون کامیابی سے ڈیلیٹ کر دیا گیا');
    }
  };

  // Save Article (Create or Update)
  const handleSaveArticle = (e) => {
    if (e) e.preventDefault();
    if (!articleForm.title.trim()) {
      alert('براہ کرم مضمون کا عنوان درج کریں');
      return;
    }

    // Clean any editor selection outline before saving
    if (selectedImgElement) {
      selectedImgElement.style.outline = 'none';
      setSelectedImgElement(null);
    }

    let finalContent = articleForm.content;
    if (editorMode === 'visual' && visualEditorRef.current) {
      finalContent = visualEditorRef.current.innerHTML;
    }

    const catObj = CATEGORIES.find(c => c.id === articleForm.category);
    const categoryName = catObj ? catObj.name : 'طب یونانی';

    let updatedList;
    if (editingArticleId) {
      updatedList = articlesList.map(a => {
        if (a.id === editingArticleId) {
          return {
            ...a,
            ...articleForm,
            content: finalContent,
            categoryName,
            tags: typeof articleForm.tags === 'string' ? articleForm.tags.split(',').map(t => t.trim()).filter(Boolean) : articleForm.tags,
            readingTime: `${stats.readingTime} منٹ`,
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return a;
      });
      setArticlesList(updatedList);
      showNotification('مضمون کی تمام تبدیلیاں کامیابی سے محفوظ ہو گئیں!');
    } else {
      const newArticle = {
        id: Date.now(),
        ...articleForm,
        content: finalContent,
        slug: articleForm.slug || generateSlugFromTitle(articleForm.title),
        categoryName,
        readingTime: `${stats.readingTime} منٹ`,
        publishedAt: new Date().toISOString().split('T')[0],
        views: 1,
        authorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
        tags: typeof articleForm.tags === 'string' ? articleForm.tags.split(',').map(t => t.trim()).filter(Boolean) : articleForm.tags,
      };
      updatedList = [newArticle, ...articlesList];
      setArticlesList(updatedList);
      showNotification('نیا مضمون کامیابی کے ساتھ پبلش ہو گیا!');
    }

    try {
      localStorage.setItem('tabeeb_articles_data_v1', JSON.stringify(updatedList));
    } catch (err) {}

    setAdminTab('articles');
  };

  // Tag helper functions
  const handleAddTag = (tagToAdd) => {
    const t = (tagToAdd || tagInput).trim();
    if (!t) return;
    const currentTags = typeof articleForm.tags === 'string' 
      ? articleForm.tags.split(',').map(s => s.trim()).filter(Boolean)
      : (articleForm.tags || []);
    if (!currentTags.includes(t)) {
      const updated = [...currentTags, t];
      setArticleForm(prev => ({ ...prev, tags: updated.join(', ') }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = typeof articleForm.tags === 'string' 
      ? articleForm.tags.split(',').map(s => s.trim()).filter(Boolean)
      : (articleForm.tags || []);
    const updated = currentTags.filter(t => t !== tagToRemove);
    setArticleForm(prev => ({ ...prev, tags: updated.join(', ') }));
  };

  const handleAddNewCategory = () => {
    if (!newCatName.trim()) return;
    const newId = newCatName.trim().toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '-');
    const newCat = { id: newId, name: newCatName.trim(), count: 0 };
    setAvailableCategories(prev => [...prev, newCat]);
    setArticleForm(prev => ({ ...prev, category: newId }));
    setNewCatName('');
    setShowNewCatModal(false);
    showNotification(`نئی کیٹیگری شامل ہو گئی: ${newCat.name}`);
  };

  // Local Thumbnail Upload Handler
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setArticleForm({
          ...articleForm,
          featuredImage: uploadEvent.target.result,
          imageType: 'upload'
        });
        showNotification('تھمبنل تصویر کامیابی کے ساتھ لوڈ ہو گئی');
      };
      reader.readAsDataURL(file);
    }
  };

  // Logo File Upload Handler for Settings
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSettingsForm({
          ...settingsForm,
          logoUrl: uploadEvent.target.result
        });
        showNotification('لوگو تصویر کامیابی سے اپلوڈ ہو گئی');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Website Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (setSiteSettings) {
      setSiteSettings(settingsForm);
    }
    showNotification('ویب سائٹ کی تمام ترتیبات (لوگو، ہیڈر، فوٹر) کامیابی کے ساتھ محفوظ ہو گئیں!');
  };

  // Visual WYSIWYG Command Executor
  const execCmd = (command, value = null) => {
    if (editorMode !== 'visual') return;
    restoreSelection();
    document.execCommand(command, false, value);
    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }
    saveCurrentSelection();
    setTimeout(updateActiveFormats, 50);
  };

  // =========================================================
  // INTERACTIVE IMAGE SELECTION & EDITING METHODS
  // =========================================================
  const handleEditorClick = (e) => {
    // Check if clicked element is an <img>
    if (e.target && e.target.tagName === 'IMG') {
      e.stopPropagation();
      const img = e.target;

      // Remove outline from previous image
      if (selectedImgElement && selectedImgElement !== img) {
        selectedImgElement.style.outline = 'none';
      }

      // Add prominent blue selection outline
      img.style.outline = '4px solid #2563eb';
      img.style.outlineOffset = '3px';
      img.style.cursor = 'pointer';

      setSelectedImgElement(img);

      // Determine width
      let widthNum = 100;
      const w = img.style.width || '100%';
      if (w.includes('%')) {
        widthNum = parseInt(w) || 100;
      } else if (w.includes('px')) {
        widthNum = Math.min(100, Math.round((parseInt(w) / 700) * 100));
      }

      // Determine alignment
      let align = 'center';
      if (img.style.float === 'right') align = 'right';
      else if (img.style.float === 'left') align = 'left';
      else if (w === '100%') align = 'full';

      setSelectedImgProps({
        src: img.src,
        alt: img.alt || '',
        widthPercent: widthNum,
        align: align,
        borderRadius: img.style.borderRadius || '16px',
        border: img.style.border || 'none',
        caption: img.getAttribute('data-caption') || ''
      });
    } else {
      // If clicked elsewhere, deselect image
      if (selectedImgElement) {
        selectedImgElement.style.outline = 'none';
        setSelectedImgElement(null);
      }
    }
    saveCurrentSelection();
  };

  // Apply Image Width / Size
  const applyImageWidth = (percent) => {
    if (!selectedImgElement) return;
    const widthStr = `${percent}%`;
    selectedImgElement.style.width = widthStr;
    selectedImgElement.removeAttribute('width');
    
    setSelectedImgProps(prev => ({ ...prev, widthPercent: percent }));
    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }
    showNotification(`تصویر کا سائز: ${percent}%`);
  };

  // Apply Image Alignment
  const applyImageAlign = (align) => {
    if (!selectedImgElement) return;

    if (align === 'right') {
      selectedImgElement.style.float = 'right';
      selectedImgElement.style.margin = '0 0 1rem 1.5rem';
      selectedImgElement.style.display = 'inline-block';
    } else if (align === 'left') {
      selectedImgElement.style.float = 'left';
      selectedImgElement.style.margin = '0 1.5rem 1rem 0';
      selectedImgElement.style.display = 'inline-block';
    } else if (align === 'center') {
      selectedImgElement.style.float = 'none';
      selectedImgElement.style.margin = '1.5rem auto';
      selectedImgElement.style.display = 'block';
    } else if (align === 'full') {
      selectedImgElement.style.float = 'none';
      selectedImgElement.style.margin = '1.5rem auto';
      selectedImgElement.style.display = 'block';
      selectedImgElement.style.width = '100%';
      setSelectedImgProps(prev => ({ ...prev, widthPercent: 100 }));
    }

    setSelectedImgProps(prev => ({ ...prev, align }));
    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }
    showNotification(
      align === 'center' ? 'تصویر درمیان میں سیٹ ہوئی' :
      align === 'right' ? 'تصویر دائیں طرف لپٹی ہوئی (Float Right)' :
      align === 'left' ? 'تصویر بائیں طرف لپٹی ہوئی (Float Left)' : 'تصویر فل اسکرین سیٹ ہوئی'
    );
  };

  // Apply Image Border Radius
  const applyImageRadius = (radius) => {
    if (!selectedImgElement) return;
    selectedImgElement.style.borderRadius = radius;
    setSelectedImgProps(prev => ({ ...prev, borderRadius: radius }));
    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }
  };

  // Delete Selected Image
  const handleDeleteSelectedImage = () => {
    if (!selectedImgElement) return;
    selectedImgElement.remove();
    setSelectedImgElement(null);
    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }
    showNotification('تصویر مضمون سے حذف کر دی گئی');
  };

  // Replace Selected Image from Computer
  const handleReplaceImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedImgElement) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        selectedImgElement.src = uploadEvent.target.result;
        setSelectedImgProps(prev => ({ ...prev, src: uploadEvent.target.result }));
        if (visualEditorRef.current) {
          setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
        }
        showNotification('تصویر کامیابی کے ساتھ تبدیل کر دی گئی');
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply specific inline style (fontSize, fontFamily) to the user's selected text or active block element
  const applyInlineStyle = (styleProp, styleVal) => {
    if (editorMode !== 'visual' || !visualEditorRef.current) return;
    restoreSelection();
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      // If cursor is inside a block element without dragging selection, apply style to the enclosing element
      let node = selection.anchorNode;
      while (node && node !== visualEditorRef.current) {
        if (node.nodeType === 1 && ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'LI', 'BLOCKQUOTE', 'DIV', 'SPAN'].includes(node.tagName)) {
          node.style[styleProp] = styleVal;
          if (visualEditorRef.current) {
            setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
          }
          return;
        }
        node = node.parentNode;
      }
      return;
    }

    try {
      const fragment = range.extractContents();
      const span = document.createElement('span');
      span.style[styleProp] = styleVal;
      span.appendChild(fragment);
      range.insertNode(span);

      // Re-select the modified span
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(newRange);
      savedSelectionRef.current = newRange.cloneRange();

      if (visualEditorRef.current) {
        setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
      }
    } catch (err) {
      console.error('Error applying inline style:', err);
    }
  };

  // Apply Font Family to selected text
  const applyFontFamily = (font) => {
    setEditorFont(font);
    let fontVal = '"Noto Nastaliq Urdu", serif';
    if (font === 'tajawal') fontVal = '"Tajawal", sans-serif';
    if (font === 'cairo') fontVal = '"Cairo", sans-serif';
    if (font === 'almarai') fontVal = '"Almarai", sans-serif';
    if (font === 'georgia') fontVal = 'Georgia, serif';
    if (font === 'arial') fontVal = 'Arial, sans-serif';
    if (font === 'times') fontVal = '"Times New Roman", serif';
    if (font === 'segoe') fontVal = '"Segoe UI", sans-serif';

    applyInlineStyle('fontFamily', fontVal);
    showNotification(`منتخب متن کا فونٹ تبدیل ہو گیا`);
  };

  // Apply Font Size to selected text
  const applyFontSize = (size) => {
    setEditorFontSize(size);
    applyInlineStyle('fontSize', size);
    showNotification(`منتخب متن کا سائز: ${size}`);
  };

  // Text Direction Handler (RTL / LTR)
  const setDirection = (dir) => {
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node = selection.anchorNode;
        while (node && node !== visualEditorRef.current) {
          if (node.nodeType === 1) {
            node.setAttribute('dir', dir);
            node.style.textAlign = dir === 'rtl' ? 'right' : 'left';
            break;
          }
          node = node.parentNode;
        }
      }
      showNotification(dir === 'rtl' ? 'سمت: دائیں سے بائیں (RTL)' : 'سمت: بائیں سے دائیں (LTR)');
    }
  };

  // Insert Special Symbol at exact cursor position
  const handleInsertSymbol = (sym) => {
    restoreSelection();
    execCmd('insertHTML', `<span>${sym}</span>&nbsp;`);
    setShowSpecialChars(false);
  };

  // Insert Custom Callout Box / Highlight Cards at exact cursor position
  const insertBox = (type) => {
    setShowBoxMenu(false);
    restoreSelection();

    let boxHTML = '';
    
    if (type === 'green') {
      boxHTML = `
        <div class="my-6 p-5 rounded-2xl bg-emerald-50 border-r-4 border-emerald-600 text-emerald-950 shadow-xs" style="direction: rtl; text-align: right;">
          <h4 class="font-bold text-base text-emerald-900 mb-2 font-simple">🌿 کلونجی اور ہربل فوائد کا خلاصہ:</h4>
          <ul class="list-disc pr-6 space-y-1 text-slate-800 font-normal">
            <li><strong>معدے اور پیٹ کی گیس:</strong> تبخیر، ریاح اور پیٹ کے پھولنے میں فوری آرام دیتی ہے۔</li>
            <li><strong>قوت مدافعت میں اضافہ:</strong> جسم کو موسمی وائرل اور انفیکشنز سے محفوظ رکھتی ہے۔</li>
            <li><strong>کولیسٹرول و شریانیں:</strong> خون کی نالیوں میں جمی چکنائی اور فاسد مادوں کو خارج کرتی ہے۔</li>
          </ul>
        </div>
        <p><br></p>
      `;
    } else if (type === 'blue') {
      boxHTML = `
        <div class="my-6 p-5 rounded-2xl bg-blue-50 border-r-4 border-blue-600 text-blue-950 shadow-xs" style="direction: rtl; text-align: right;">
          <h4 class="font-bold text-base text-blue-900 mb-2 font-simple">💊 طبی نسخہ و مقدارِ خوراک (Prescription):</h4>
          <p class="text-slate-800 leading-relaxed mb-2"><strong>اجزاء:</strong> سونف 50 گرام، ملٹھی 50 گرام، ریوند خطائی 50 گرام۔</p>
          <p class="text-slate-800 leading-relaxed"><strong>ترکیب و خوراک:</strong> تمام ادویہ کا باریک سفوف بنا لیں۔ روزانہ صبح اور شام کھانے کے آدھے گھنٹے بعد آدھا چمچ ہمراہ نیم گرم پانی استعمال کریں۔</p>
        </div>
        <p><br></p>
      `;
    } else if (type === 'amber') {
      boxHTML = `
        <div class="my-6 p-5 rounded-2xl bg-amber-50 border-r-4 border-amber-600 text-amber-950 shadow-xs" style="direction: rtl; text-align: right;">
          <h4 class="font-bold text-base text-amber-900 mb-1 font-simple">⚠️ پرہیز و احتیاطی تدابیر (Diet Precautions):</h4>
          <p class="text-slate-800 leading-relaxed">گرم مصالحہ جات، برائلر مرغی، بازاری تلی ہوئی اشیاء اور کولڈ ڈرنکس سے مکمل پرہیز کریں۔ تازہ سلاد اور پانی کا استعمال زیادہ کریں۔</p>
        </div>
        <p><br></p>
      `;
    } else if (type === 'red') {
      boxHTML = `
        <div class="my-6 p-5 rounded-2xl bg-red-50 border-r-4 border-red-600 text-red-950 shadow-xs" style="direction: rtl; text-align: right;">
          <h4 class="font-bold text-base text-red-900 mb-1 font-simple">🛑 طبی انتباہ (Medical Warning):</h4>
          <p class="text-slate-800 leading-relaxed">حاملہ خواتین اور ہائی بلڈ پریشر کے مریض معالج یا مستند حکیم کے مشورے کے بغیر یہ نسخہ ہرگز استعمال نہ کریں۔</p>
        </div>
        <p><br></p>
      `;
    }

    execCmd('insertHTML', boxHTML);
    showNotification('کارڈ کرسر کی جگہ پر شامل ہو گیا');
  };

  // Insert Tables at exact cursor position
  const handleInsertTable = (type) => {
    setShowTableMenu(false);
    restoreSelection();

    let tableHTML = '';

    if (type === '2x2') {
      tableHTML = `
        <div class="my-6 overflow-x-auto">
          <table class="w-full border-collapse border border-slate-300 rounded-xl text-right text-sm" style="direction: rtl;">
            <thead>
              <tr class="bg-blue-50 text-blue-950 font-bold border-b border-slate-300">
                <th class="p-3 border border-slate-300">کالم 1</th>
                <th class="p-3 border border-slate-300">کالم 2</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-200 hover:bg-slate-50">
                <td class="p-3 border border-slate-300">ڈیٹا 1</td>
                <td class="p-3 border border-slate-300">ڈیٹا 2</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="p-3 border border-slate-300">ڈیٹا 3</td>
                <td class="p-3 border border-slate-300">ڈیٹا 4</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><br></p>
      `;
    } else if (type === '3x3') {
      tableHTML = `
        <div class="my-6 overflow-x-auto">
          <table class="w-full border-collapse border border-slate-300 rounded-xl text-right text-sm" style="direction: rtl;">
            <thead>
              <tr class="bg-blue-50 text-blue-950 font-bold border-b border-slate-300">
                <th class="p-3 border border-slate-300">نمبر شمار</th>
                <th class="p-3 border border-slate-300">عنوان / مرض</th>
                <th class="p-3 border border-slate-300">علامات و تفصیل</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-200 hover:bg-slate-50">
                <td class="p-3 border border-slate-300">1</td>
                <td class="p-3 border border-slate-300">عضلاتی تحریک</td>
                <td class="p-3 border border-slate-300">خشکی، گیس، قبض</td>
              </tr>
              <tr class="border-b border-slate-200 hover:bg-slate-50">
                <td class="p-3 border border-slate-300">2</td>
                <td class="p-3 border border-slate-300">غدی تحریک</td>
                <td class="p-3 border border-slate-300">گرمی، جلن، صفراء کی زیادتی</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="p-3 border border-slate-300">3</td>
                <td class="p-3 border border-slate-300">اعصابی تحریک</td>
                <td class="p-3 border border-slate-300">تری، بلغم، سستی</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><br></p>
      `;
    } else if (type === 'dosage') {
      tableHTML = `
        <div class="my-6 overflow-x-auto">
          <table class="w-full border-collapse border border-emerald-300 rounded-xl text-right text-sm" style="direction: rtl;">
            <thead>
              <tr class="bg-emerald-100 text-emerald-950 font-bold border-b border-emerald-300">
                <th class="p-3 border border-emerald-300">جڑی بوٹی / جزو</th>
                <th class="p-3 border border-emerald-300">وزن / مقدار</th>
                <th class="p-3 border border-emerald-300">طریقہ و وقت استعمال</th>
                <th class="p-3 border border-emerald-300">خصوصی فائدہ</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-emerald-200 bg-emerald-50/40">
                <td class="p-3 border border-emerald-200 font-bold">ملٹھی سفوف</td>
                <td class="p-3 border border-emerald-200">50 گرام</td>
                <td class="p-3 border border-emerald-200">صبح نہار منہ چوتھائی چمچ</td>
                <td class="p-3 border border-emerald-200">معدے کا السر اور گلے کی سوزش</td>
              </tr>
              <tr class="border-b border-emerald-200">
                <td class="p-3 border border-emerald-200 font-bold">سونف دیسی</td>
                <td class="p-3 border border-emerald-200">50 گرام</td>
                <td class="p-3 border border-emerald-200">بعد از غذا ہمراہ پانی</td>
                <td class="p-3 border border-emerald-200">ہاضمہ اور تبخیر معدہ دور کرے</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><br></p>
      `;
    }

    execCmd('insertHTML', tableHTML);
    showNotification('ٹیبل کرسر کی جگہ داخل ہو گیا');
  };

  // Insert Link Prompt at exact cursor position
  const handleInsertLink = () => {
    saveCurrentSelection();
    const url = prompt('براہ کرم ویب لنک (URL) درج کریں:', 'https://');
    if (url) {
      restoreSelection();
      execCmd('createLink', url);
    }
  };

  // Find & Replace Execution
  const handleExecuteFindReplace = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    if (visualEditorRef.current) {
      const currentHtml = visualEditorRef.current.innerHTML;
      const regex = new RegExp(searchTerm, 'g');
      const count = (currentHtml.match(regex) || []).length;
      
      if (count === 0) {
        alert('مطلوبہ لفظ مضمون میں نہیں ملا');
        return;
      }

      const updatedHtml = currentHtml.replace(regex, replaceTerm);
      visualEditorRef.current.innerHTML = updatedHtml;
      setArticleForm({ ...articleForm, content: updatedHtml });
      setShowFindReplaceModal(false);
      showNotification(`${count} جگہوں پر لفظ کامیابی سے تبدیل کر دیا گیا`);
    }
  };

  // =========================================================
  // INSERT MEDIA AT EXACT CURSOR POSITION
  // =========================================================
  const handleInsertMediaFromModal = (imageUrl = null) => {
    const finalUrl = imageUrl || mediaUrlInput;
    if (!finalUrl) {
      alert('براہ کرم تصویر منتخب کریں یا لنک درج کریں');
      return;
    }

    let styleClass = 'my-4 rounded-2xl border border-slate-200 shadow-md max-w-full h-auto cursor-pointer transition-all';
    let floatStyle = 'none';
    let marginStyle = '1.5rem auto';
    let displayStyle = 'block';

    if (mediaAlignment === 'right') {
      floatStyle = 'right';
      marginStyle = '0 0 1rem 1.5rem';
      displayStyle = 'inline-block';
    } else if (mediaAlignment === 'left') {
      floatStyle = 'left';
      marginStyle = '0 1.5rem 1rem 0';
      displayStyle = 'inline-block';
    }

    // Restore exact cursor location before insertion
    restoreSelection();

    const mediaHTML = `
      <img 
        src="${finalUrl}" 
        alt="${mediaCaption || 'مضمون کی تصویر'}" 
        class="${styleClass}" 
        style="width: ${mediaWidth}; float: ${floatStyle}; margin: ${marginStyle}; display: ${displayStyle}; border-radius: 16px; object-fit: cover;" 
      />
      <p><br></p>
    `;

    document.execCommand('insertHTML', false, mediaHTML);

    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }

    saveCurrentSelection();
    setShowMediaModal(false);
    setMediaUrlInput('');
    setMediaCaption('');
    showNotification('تصویر کرسر کے عین مقام پر شامل کر دی گئی!');
  };

  // Media Modal: File Upload Handler
  const handleModalFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        handleInsertMediaFromModal(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Modal: Insert Interactive Form Card at exact cursor position
  const handleInsertFormWidget = () => {
    restoreSelection();

    let formHTML = '';

    if (formType === 'consultation') {
      formHTML = `
        <div class="my-8 p-6 rounded-3xl bg-blue-50 border-2 border-blue-200 shadow-md text-right" style="direction: rtl;">
          <div class="flex items-center gap-2 text-blue-900 font-bold text-lg mb-2 font-simple">
            <span>🩺 معالج و طبیب سے آن لائن مشورہ طلب کریں</span>
          </div>
          <p class="text-xs text-blue-800 mb-4 font-sans">اپنی علامات اور مرض کی تفصیل لکھ کر مستند حکیم سے فوری رہنمائی حاصل کریں:</p>
          <div class="space-y-3">
            <input type="text" placeholder="آپ کا نام..." class="w-full bg-white border border-blue-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none" />
            <input type="tel" placeholder="واٹس ایپ / فون نمبر..." class="w-full bg-white border border-blue-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none font-sans" />
            <textarea rows="2" placeholder="مرض یا مسئلہ کی مختصر تفصیل..." class="w-full bg-white border border-blue-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"></textarea>
            <button type="button" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs font-simple">
              آن لائن رہنمائی کے لیے درخواست بھیجیں
            </button>
          </div>
        </div>
        <p><br></p>
      `;
    } else if (formType === 'order') {
      formHTML = `
        <div class="my-8 p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 shadow-md text-right" style="direction: rtl;">
          <div class="flex items-center gap-2 text-emerald-900 font-bold text-lg mb-2 font-simple">
            <span>📦 خالص طبی نسخہ / دوا گھر بیٹھے منگوائیں</span>
          </div>
          <p class="text-xs text-emerald-800 mb-4 font-sans">اس مضمون میں بیان کردہ اجزاء پر مشتمل 100% خالص سفوف یا شربت کی ہوم ڈیلیوری:</p>
          <div class="space-y-3">
            <input type="text" placeholder="خریدار کا نام..." class="w-full bg-white border border-emerald-200 rounded-xl p-2.5 text-xs text-slate-800" />
            <input type="tel" placeholder="واٹس ایپ نمبر اور شہر کا نام..." class="w-full bg-white border border-emerald-200 rounded-xl p-2.5 text-xs text-slate-800 font-sans" />
            <input type="text" placeholder="مکمل ہوم ایڈریس..." class="w-full bg-white border border-emerald-200 rounded-xl p-2.5 text-xs text-slate-800" />
            <button type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs font-simple">
              کیش آن ڈیلیوری آرڈر کنفرم کریں
            </button>
          </div>
        </div>
        <p><br></p>
      `;
    } else if (formType === 'question') {
      formHTML = `
        <div class="my-8 p-6 rounded-3xl bg-purple-50 border-2 border-purple-200 shadow-md text-right" style="direction: rtl;">
          <div class="flex items-center gap-2 text-purple-900 font-bold text-lg mb-2 font-simple">
            <span>❓ اس مضمون کے متعلق سوال پوچھیں</span>
          </div>
          <p class="text-xs text-purple-800 mb-4 font-sans">ہمارے ریسرچ پینل اور حکماء آپ کے سوال کا 24 گھنٹوں میں تفصیلی جواب دیں گے:</p>
          <div class="space-y-3">
            <input type="text" placeholder="آپ کا نام و ای میل..." class="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-xs text-slate-800" />
            <textarea rows="2" placeholder="اپنا سوال تحریر کریں..." class="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-xs text-slate-800"></textarea>
            <button type="button" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs font-simple">
              سوال جمع کرائیں
            </button>
          </div>
        </div>
        <p><br></p>
      `;
    }

    document.execCommand('insertHTML', false, formHTML);
    if (visualEditorRef.current) {
      setArticleForm(prev => ({ ...prev, content: visualEditorRef.current.innerHTML }));
    }
    saveCurrentSelection();
    setShowFormModal(false);
    showNotification('رابطہ فارم کرسر کی جگہ شامل ہو گیا');
  };

  // Filtered list of articles for table
  const filteredArticles = articlesList.filter(art => {
    const matchSearch = !searchFilter.trim() ||
      art.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      art.author?.toLowerCase().includes(searchFilter.toLowerCase());
    
    const artStatus = art.status || 'published';
    const matchStatus = statusFilter === 'all' || artStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-100 flex flex-col font-urdu text-right select-text ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto bg-slate-950' : ''}`} dir="rtl">
      
      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-bold animate-in fade-in-50 duration-200 font-simple">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{notification}</span>
        </div>
      )}

      {/* Hidden File Input for Image Replacement */}
      <input
        type="file"
        ref={replaceImageFileInputRef}
        onChange={handleReplaceImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Admin Navbar */}
      {!isFullscreen && (
        <header className="bg-slate-950 border-b border-slate-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white font-simple">طبیب پیڈیا ایڈمن CMS پورٹل</h1>
                  <span className="text-[10px] bg-blue-900 text-blue-200 font-sans font-bold px-2 py-0.5 rounded">
                    v2.5 Pro Editor
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans">
                  اردو رچ ایڈیٹر، ہوم پیج، لوگو، ہیڈر، فوٹر اور اطباء ترتیبات
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onBackToWebsite}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-700 font-simple"
              >
                <ArrowRight className="w-4 h-4 text-blue-400" />
                <span>ویب سائٹ پر واپس جائیں</span>
              </button>
            </div>

          </div>
        </header>
      )}

      {/* Main Admin Layout */}
      <div className={`flex-1 ${isFullscreen ? 'w-full p-4 max-w-7xl mx-auto' : adminTab === 'new-article' ? 'w-full max-w-[1920px] mx-auto px-2 sm:px-4 py-3' : 'max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'}`}>
        
        {/* Sidebar Navigation */}
        {!isFullscreen && adminTab !== 'new-article' && (
          <aside className="lg:col-span-3 bg-slate-950/80 border border-slate-800/80 rounded-3xl p-4 space-y-6 sticky top-6 backdrop-blur-md">
            
            {/* Action Button */}
            <button
              onClick={handleOpenNewArticle}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all font-simple"
            >
              <PlusCircle className="w-4 h-4" />
              <span>نیا مضمون لکھیں</span>
            </button>

            {/* Navigation Links */}
            <div className="space-y-1 text-xs font-bold font-simple">
              {(() => {
                const pendingDoctorsCount = doctorsList.filter(d => d && (d.isApproved === false || d.status === 'pending')).length;
                const approvedDoctorsCount = doctorsList.filter(d => d && (d.isApproved !== false && d.status !== 'pending')).length;
                
                return [
                  { id: 'articles', label: `مضامین مینیجر (${articlesList.length})`, icon: FileText, badge: null },
                  { 
                    id: 'doctors', 
                    label: pendingDoctorsCount > 0 
                      ? `اطباء و درخواستیں` 
                      : `اطباء و کلینکس (${approvedDoctorsCount})`, 
                    icon: UserCheck,
                    badge: pendingDoctorsCount > 0 ? `${pendingDoctorsCount} نئی درخواستیں` : null
                  },
                  { id: 'settings', label: 'ویب سائٹ ترتیبات (لوگو، ہیڈر، فوٹر)', icon: Settings, badge: null },
                  { id: 'migration', label: 'ورڈپریس مائیگریشن ٹول', icon: Database, badge: null },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = adminTab === item.id || (item.id === 'articles' && adminTab === 'new-article');
                  return (
                    <button
                      key={item.id}
                      onClick={() => setAdminTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                });
              })()}
            </div>

            {/* Quick Stats */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>پبلک مضامین:</span>
                <strong className="text-emerald-400 font-sans">{articlesList.filter(a => a.status !== 'private').length}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>پرائیویٹ / ڈرافٹ:</span>
                <strong className="text-amber-400 font-sans">{articlesList.filter(a => a.status === 'private').length}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>زیرِ جائزہ درخواستیں:</span>
                <strong className="text-amber-400 font-sans font-bold">
                  {doctorsList.filter(d => d && (d.isApproved === false || d.status === 'pending')).length}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>منظور شدہ اطباء:</span>
                <strong className="text-emerald-400 font-sans font-bold">
                  {doctorsList.filter(d => d && (d.isApproved !== false && d.status !== 'pending')).length}
                </strong>
              </div>
            </div>

          </aside>
        )}

        {/* Content Area */}
        <main className={`${isFullscreen ? 'w-full' : adminTab === 'new-article' ? 'w-full' : 'lg:col-span-9'} space-y-4`}>
          
          {/* ========================================================= */}
          {/* VIEW 1: WORDPRESS / TINYMCE STYLE VISUAL WYSIWYG EDITOR */}
          {/* ========================================================= */}
          {adminTab === 'new-article' && (
            <div className="space-y-4">
              
              {/* WordPress Top Action Bar */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFullscreen(false);
                      setAdminTab('articles');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 font-simple"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    <span>تمام مضامین</span>
                  </button>
                  <span className="text-slate-700 hidden sm:inline">|</span>
                  <div className="hidden sm:block">
                    <h2 className="text-xs sm:text-sm font-bold text-white font-simple">
                      {editingArticleId ? 'مضمون میں ترمیم کریں (Post Editor)' : 'نیا اردو طبی مضمون تحریر کریں'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (editorMode === 'visual' && visualEditorRef.current) {
                        setArticleForm({...articleForm, content: visualEditorRef.current.innerHTML});
                      }
                      setEditorMode(editorMode === 'preview' ? 'visual' : 'preview');
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border font-simple ${
                      editorMode === 'preview' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>{editorMode === 'preview' ? 'ویژول موڈ' : 'پیش نظارہ (Preview)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setArticleForm(prev => ({ ...prev, status: 'private' }));
                      handleSaveArticle();
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors font-simple border border-slate-700"
                  >
                    ڈرافٹ محفوظ کریں
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveArticle}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/30 transition-all font-simple"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingArticleId ? 'تبدیلیاں محفوظ کریں (Update)' : 'پبلش کریں (Publish)'}</span>
                  </button>
                </div>
              </div>

              {/* WordPress 2-Column Main Form Grid */}
              <form onSubmit={handleSaveArticle} className="flex flex-col lg:flex-row gap-3.5 items-start w-full">
                
                {/* ========================================================= */}
                {/* 1. MAIN POST CONTENT AREA (Takes ~80% of width) */}
                {/* ========================================================= */}
                <div className="flex-1 min-w-0 w-full space-y-3.5">
                  
                  {/* Title Input & Permalink Bar (WordPress Style) */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-lg space-y-2.5">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1 font-simple">
                        عنوان (Add Title) *
                      </label>
                      <input
                        type="text"
                        required
                        value={articleForm.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setArticleForm(prev => ({
                            ...prev,
                            title: newTitle,
                            slug: isEditingSlug ? prev.slug : (prev.slug && editingArticleId ? prev.slug : generateSlugFromTitle(newTitle))
                          }));
                        }}
                        placeholder="یہاں مضمون کا تفصیلی عنوان درج کریں (Add Title)..."
                        className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl p-2.5 sm:p-3 text-lg sm:text-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-simple transition-all shadow-inner"
                      />
                    </div>

                    {/* WordPress-Style Interactive Permalink Bar */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-sans px-0.5 pt-1.5 border-t border-slate-800/80">
                      <span className="font-bold text-slate-400 font-simple">مستقل لنک (Permalink):</span>
                      
                      <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-mono dir-ltr">
                        <span className="text-slate-400 select-none">https://tabeebpedia.com/articles/</span>
                        
                        {isEditingSlug ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={tempSlug}
                              onChange={(e) => setTempSlug(e.target.value.toLowerCase().replace(/[\s_]+/g, '-'))}
                              placeholder="custom-slug"
                              className="bg-slate-950 border border-blue-500 rounded px-2 py-0.5 text-xs text-emerald-300 font-mono focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-[150px]"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const finalSlug = tempSlug.trim() || generateSlugFromTitle(articleForm.title);
                                  setArticleForm(prev => ({ ...prev, slug: finalSlug }));
                                  setIsEditingSlug(false);
                                  showNotification('پرما لنک محفوظ ہو گیا');
                                } else if (e.key === 'Escape') {
                                  setIsEditingSlug(false);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const finalSlug = tempSlug.trim() || generateSlugFromTitle(articleForm.title);
                                setArticleForm(prev => ({ ...prev, slug: finalSlug }));
                                setIsEditingSlug(false);
                                showNotification('پرما لنک محفوظ ہو گیا');
                              }}
                              className="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold font-simple transition-colors"
                            >
                              OK (محفوظ کریں)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTempSlug(articleForm.slug);
                                setIsEditingSlug(false);
                              }}
                              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-[11px] font-simple transition-colors"
                            >
                              منسوخ
                            </button>
                          </div>
                        ) : (
                          <span className="font-bold text-emerald-400 px-1 select-all font-mono">
                            {articleForm.slug || generateSlugFromTitle(articleForm.title) || 'untitled-article'}
                          </span>
                        )}
                      </div>

                      {!isEditingSlug && (
                        <div className="flex items-center gap-1.5 font-simple">
                          <button
                            type="button"
                            onClick={() => {
                              setTempSlug(articleForm.slug || generateSlugFromTitle(articleForm.title));
                              setIsEditingSlug(true);
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white rounded-lg border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                            title="پرما لنک اپنی مرضی سے ایڈٹ کریں"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>ایڈٹ کریں (Edit)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const autoSlug = generateSlugFromTitle(articleForm.title);
                              setArticleForm(prev => ({ ...prev, slug: autoSlug }));
                              setTempSlug(autoSlug);
                              showNotification('پرما لنک عنوان کے مطابق خودکار ری سیٹ ہو گیا');
                            }}
                            className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 text-[11px] transition-colors"
                            title="عنوان کے مطابق خودکار ری سیٹ کریں"
                          >
                            خودکار ری سیٹ
                          </button>

                          {(articleForm.slug || articleForm.title) && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentSlug = articleForm.slug || generateSlugFromTitle(articleForm.title);
                                  const fullUrl = `https://tabeebpedia.com/articles/${currentSlug}`;
                                  navigator.clipboard.writeText(fullUrl);
                                  showNotification('مکمل پرما لنک کاپی ہو گیا!');
                                }}
                                className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-800 text-[11px] transition-colors flex items-center gap-1"
                                title="لنک کاپی کریں"
                              >
                                <Copy className="w-3 h-3" />
                                <span>کاپی لنک</span>
                              </button>

                              <a
                                href={`?article=${articleForm.slug || editingArticleId || generateSlugFromTitle(articleForm.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white rounded-lg border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                                title="مضمون کو نئی ونڈو / ٹیب میں لائیو کھولیں"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>مضمون دیکھیں (View)</span>
                              </a>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. ADVANCED WORDPRESS / TINYMCE VISUAL WYSIWYG EDITOR COMPONENT */}
                  <div className="border border-slate-700 bg-slate-900 rounded-2xl shadow-xl relative">
                  
                  {/* STICKY TOP TOOLBAR HEADER - Stays pinned to top when scrolling down */}
                  <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md rounded-t-2xl border-b border-slate-700 shadow-md">
                    
                    {/* Top Action Bar with Add Media, Add Form, Quick Save, and Visual/Code switches */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 px-3 border-b border-slate-800/80">
                      
                      {/* Left Quick Inserters: Add Media & Add Form */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onMouseDown={() => saveCurrentSelection()}
                          onClick={() => {
                            saveCurrentSelection();
                            setShowMediaModal(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-bold transition-all shadow-xs font-simple"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                          <span>Add Media (میڈیا)</span>
                        </button>

                        <button
                          type="button"
                          onMouseDown={() => saveCurrentSelection()}
                          onClick={() => {
                            saveCurrentSelection();
                            setShowFormModal(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold transition-all shadow-xs font-simple"
                        >
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Add Form (فارم)</span>
                        </button>
                      </div>

                      {/* Right Quick Actions & Visual / Code Toggles */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleSaveArticle}
                          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all font-simple"
                          title="مضمون محفوظ کریں (Save Article)"
                        >
                          <Save className="w-3 h-3" />
                          <span>محفوظ کریں</span>
                        </button>

                        <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded-lg text-xs font-simple border border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              if (editorMode === 'code' && visualEditorRef.current) {
                                visualEditorRef.current.innerHTML = articleForm.content;
                              }
                              setEditorMode('visual');
                            }}
                            className={`px-2.5 py-0.5 rounded-md transition-colors font-bold ${editorMode === 'visual' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
                          >
                            Visual (ویژول)
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (editorMode === 'visual' && visualEditorRef.current) {
                                setArticleForm({...articleForm, content: visualEditorRef.current.innerHTML});
                              }
                              setEditorMode('code');
                            }}
                            className={`px-2.5 py-0.5 rounded-md transition-colors font-bold ${editorMode === 'code' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
                          >
                            Code (کوڈ)
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (editorMode === 'visual' && visualEditorRef.current) {
                                setArticleForm({...articleForm, content: visualEditorRef.current.innerHTML});
                              }
                              setEditorMode('preview');
                            }}
                            className={`px-2.5 py-0.5 rounded-md transition-colors font-bold ${editorMode === 'preview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
                          >
                            Preview (پریویو)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ========================================================= */}
                    {/* INTERACTIVE SELECTED IMAGE FLOATING CONTROL TOOLBAR */}
                    {/* Appears smoothly when an image inside the editor is clicked */}
                    {/* ========================================================= */}
                    {selectedImgElement && (
                      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b-2 border-blue-500 p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs z-30 animate-in slide-in-from-top-2 duration-200 font-simple">
                        
                        {/* Image Identifier */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-blue-400 shrink-0">
                              <img src={selectedImgProps.src} alt="thumbnail" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="font-bold text-white block">تصویر منتخب ہے:</span>
                              <span className="text-[10px] text-blue-300 font-sans">{selectedImgProps.widthPercent}% چوڑائی • {selectedImgProps.align}</span>
                            </div>
                          </div>

                          {/* Quick Size Buttons & Live Slider */}
                          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700">
                            <span className="text-slate-300 font-bold">سائز:</span>
                            {[25, 50, 75, 100].map(pct => (
                              <button
                                key={pct}
                                type="button"
                                onClick={() => applyImageWidth(pct)}
                                className={`px-2 py-0.5 rounded-lg text-xs font-sans font-bold transition-all ${
                                  selectedImgProps.widthPercent === pct 
                                    ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                                    : 'bg-slate-800 text-slate-300 hover:text-white'
                                }`}
                              >
                                {pct}%
                              </button>
                            ))}

                            <div className="flex items-center gap-1.5 mr-2">
                              <input
                                type="range"
                                min="15"
                                max="100"
                                value={selectedImgProps.widthPercent}
                                onChange={(e) => applyImageWidth(Number(e.target.value))}
                                className="w-20 accent-blue-500 cursor-pointer"
                                title="اپنی مرضی کا سائز سلائیڈ کریں"
                              />
                            </div>
                          </div>

                          {/* Quick Alignment Buttons */}
                          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700">
                            <span className="text-slate-300 font-bold px-1.5">پوزیشن:</span>
                            
                            <button
                              type="button"
                              onClick={() => applyImageAlign('right')}
                              className={`px-2 py-1 rounded-lg text-xs transition-colors font-bold ${selectedImgProps.align === 'right' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                              title="دائیں طرف رکھیں اور ٹیکسٹ بائیں لپٹائیں (Float Right)"
                            >
                              ⬅ دائیں ریپ
                            </button>

                            <button
                              type="button"
                              onClick={() => applyImageAlign('center')}
                              className={`px-2 py-1 rounded-lg text-xs transition-colors font-bold ${selectedImgProps.align === 'center' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                              title="درمیان میں رکھیں (Center Block)"
                            >
                              ⬛ درمیان
                            </button>

                            <button
                              type="button"
                              onClick={() => applyImageAlign('left')}
                              className={`px-2 py-1 rounded-lg text-xs transition-colors font-bold ${selectedImgProps.align === 'left' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                              title="بائیں طرف رکھیں اور ٹیکسٹ دائیں لپٹائیں (Float Left)"
                            >
                              ➡ بائیں ریپ
                            </button>

                            <button
                              type="button"
                              onClick={() => applyImageAlign('full')}
                              className={`px-2 py-1 rounded-lg text-xs transition-colors font-bold ${selectedImgProps.align === 'full' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                              title="فل اسکرین بینر (Full Width 100%)"
                            >
                              ↔ فل بینر
                            </button>
                          </div>

                          {/* Rounded Corner Styles */}
                          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700">
                            <span className="text-slate-300 font-bold px-1">گولائی:</span>
                            {[
                              { label: 'سادہ', val: '0px' },
                              { label: 'نرم', val: '12px' },
                              { label: 'گول', val: '24px' },
                            ].map(item => (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => applyImageRadius(item.val)}
                                className={`px-2 py-0.5 rounded-lg text-xs transition-colors ${selectedImgProps.borderRadius === item.val ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>

                          {/* Image Actions: Replace, Delete, Close */}
                          <div className="flex items-center gap-1.5 mr-auto">
                            <button
                              type="button"
                              onClick={() => replaceImageFileInputRef.current?.click()}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              title="کمپیوٹر سے نئی تصویر منتخب کریں"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>تصویر بدلیں</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleDeleteSelectedImage}
                              className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-red-800"
                              title="تصویر مضمون سے ڈیلیٹ کریں"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف کریں</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (selectedImgElement) selectedImgElement.style.outline = 'none';
                                setSelectedImgElement(null);
                              }}
                              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                              title="سلیکشن بند کریں"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      )}

                    {/* ========================================================= */}
                    {/* UNIFIED COMPACT FORMATTING TOOLBAR (Single Modern Row) */}
                    {/* ========================================================= */}
                    <div className="bg-slate-900/95 px-2 py-1.5 border-b border-slate-800 flex flex-wrap items-center gap-1 text-xs text-slate-300 select-none">
                      
                      {/* 1. Format / Heading Dropdown */}
                      <div className="flex items-center gap-0.5 bg-slate-800 px-1.5 py-0.5 rounded-lg border border-slate-700 font-simple">
                        <select
                          value={activeFormats.heading}
                          onChange={(e) => {
                            const tag = e.target.value;
                            if (tag === 'blockquote') {
                              execCmd('formatBlock', '<blockquote>');
                            } else if (tag === 'pre') {
                              execCmd('formatBlock', '<pre>');
                            } else {
                              execCmd('formatBlock', `<${tag}>`);
                            }
                          }}
                          className="bg-transparent border-0 text-xs text-white focus:outline-none cursor-pointer font-bold pr-0.5"
                          title="ہیڈنگ یا پیراگراف منتخب کریں"
                        >
                          <option value="p" className="bg-slate-900 text-white">Paragraph (نارمل متن)</option>
                          <option value="h1" className="bg-slate-900 text-white">Heading 1 (مین سرخی)</option>
                          <option value="h2" className="bg-slate-900 text-white">Heading 2 (بڑی سرخی)</option>
                          <option value="h3" className="bg-slate-900 text-white">Heading 3 (درمیانی سرخی)</option>
                          <option value="h4" className="bg-slate-900 text-white">Heading 4 (چھوٹی سرخی)</option>
                          <option value="blockquote" className="bg-slate-900 text-white">Quote (اقتباس)</option>
                          <option value="pre" className="bg-slate-900 text-white">Preformatted</option>
                        </select>
                      </div>

                      {/* 2. Font Family Dropdown */}
                      <div className="flex items-center gap-0.5 bg-slate-800 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <Type className="w-3 h-3 text-blue-400 shrink-0" />
                        <select
                          value={editorFont}
                          onMouseDown={() => saveCurrentSelection()}
                          onFocus={() => saveCurrentSelection()}
                          onChange={(e) => applyFontFamily(e.target.value)}
                          className="bg-transparent border-0 text-xs text-white focus:outline-none cursor-pointer pr-0.5 font-simple font-bold"
                          title="فونٹ کا انداز تبدیل کریں"
                        >
                          <option value="nastaliq" className="bg-slate-900 text-white">نستعلیق (Noto Nastaliq)</option>
                          <option value="almarai" className="bg-slate-900 text-white">المری سادہ (Almarai)</option>
                          <option value="tajawal" className="bg-slate-900 text-white">تجوال (Tajawal)</option>
                          <option value="cairo" className="bg-slate-900 text-white">قاہرہ (Cairo)</option>
                          <option value="segoe" className="bg-slate-900 text-white">Segoe UI</option>
                          <option value="georgia" className="bg-slate-900 text-white">Georgia</option>
                          <option value="arial" className="bg-slate-900 text-white">Arial</option>
                          <option value="times" className="bg-slate-900 text-white">Times New Roman</option>
                        </select>
                      </div>

                      {/* 3. Font Size Dropdown (Default 14px) */}
                      <div className="flex items-center gap-0.5 bg-slate-800 px-1.5 py-0.5 rounded-lg border border-slate-700">
                        <span className="text-[10px] text-slate-400 font-sans">سائز:</span>
                        <select
                          value={editorFontSize}
                          onMouseDown={() => saveCurrentSelection()}
                          onFocus={() => saveCurrentSelection()}
                          onChange={(e) => applyFontSize(e.target.value)}
                          className="bg-transparent border-0 text-xs text-white focus:outline-none cursor-pointer pr-0.5 font-sans font-bold"
                          title="فونٹ سائز تبدیل کریں"
                        >
                          <option value="12px" className="bg-slate-900 text-white">12px</option>
                          <option value="14px" className="bg-slate-900 text-white">14px (معیاری)</option>
                          <option value="16px" className="bg-slate-900 text-white">16px</option>
                          <option value="18px" className="bg-slate-900 text-white">18px</option>
                          <option value="20px" className="bg-slate-900 text-white">20px</option>
                          <option value="24px" className="bg-slate-900 text-white">24px</option>
                          <option value="28px" className="bg-slate-900 text-white">28px</option>
                          <option value="32px" className="bg-slate-900 text-white">32px</option>
                          <option value="36px" className="bg-slate-900 text-white">36px</option>
                          <option value="48px" className="bg-slate-900 text-white">48px</option>
                        </select>
                      </div>

                      <div className="h-4 w-px bg-slate-700 mx-0.5" />

                      {/* 4. Text Styles: Bold, Italic, Underline, Strikethrough */}
                      <button
                        type="button"
                        onClick={() => execCmd('bold')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.bold 
                            ? 'bg-blue-600 text-white font-bold ring-1 ring-blue-400' 
                            : 'hover:bg-slate-800 text-white'
                        }`}
                        title="بولڈ (Bold: Ctrl+B)"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('italic')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.italic 
                            ? 'bg-blue-600 text-white font-bold ring-1 ring-blue-400' 
                            : 'hover:bg-slate-800 text-white'
                        }`}
                        title="اٹالک (Italic: Ctrl+I)"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('underline')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.underline 
                            ? 'bg-blue-600 text-white font-bold ring-1 ring-blue-400' 
                            : 'hover:bg-slate-800 text-white'
                        }`}
                        title="انڈر لائن (Underline: Ctrl+U)"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('strikeThrough')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.strike 
                            ? 'bg-blue-600 text-white font-bold ring-1 ring-blue-400' 
                            : 'hover:bg-slate-800 text-white'
                        }`}
                        title="اسٹرائیک تھرو (Strikethrough)"
                      >
                        <Strikethrough className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-700 mx-0.5" />

                      {/* 5. Colors: Text Color & Highlight */}
                      <div className="flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded-md" title="ٹیکسٹ کا رنگ (Text Color)">
                        <span className="font-extrabold font-serif text-xs text-amber-400">A</span>
                        <input
                          type="color"
                          defaultValue="#0f172a"
                          onChange={(e) => execCmd('foreColor', e.target.value)}
                          className="w-3.5 h-3.5 bg-transparent border-0 cursor-pointer rounded"
                        />
                      </div>

                      <div className="flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded-md" title="ہائی لائٹر رنگ (Highlight Color)">
                        <Highlighter className="w-3 h-3 text-yellow-300" />
                        <input
                          type="color"
                          defaultValue="#fef08a"
                          onChange={(e) => execCmd('hiliteColor', e.target.value)}
                          className="w-3.5 h-3.5 bg-transparent border-0 cursor-pointer rounded"
                        />
                      </div>

                      <div className="h-4 w-px bg-slate-700 mx-0.5" />

                      {/* 6. Alignment */}
                      <button
                        type="button"
                        onClick={() => execCmd('justifyRight')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.align === 'right' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-white'
                        }`}
                        title="دائیں سے الائن (Right Align)"
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('justifyCenter')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.align === 'center' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-white'
                        }`}
                        title="درمیان الائن (Center Align)"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('justifyLeft')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.align === 'left' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-white'
                        }`}
                        title="بائیں سے الائن (Left Align)"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('justifyFull')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.align === 'justify' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-white'
                        }`}
                        title="مکمل پھیلاؤ (Justify Full)"
                      >
                        <AlignJustify className="w-3.5 h-3.5" />
                      </button>

                      {/* Text Direction RTL / LTR */}
                      <button
                        type="button"
                        onClick={() => setDirection('rtl')}
                        className="p-1 hover:bg-slate-800 rounded-md text-emerald-400 font-bold"
                        title="دائیں سے بائیں تحریر (RTL Direction)"
                      >
                        <span className="text-[11px] font-mono">¶⮞</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDirection('ltr')}
                        className="p-1 hover:bg-slate-800 rounded-md text-blue-400 font-bold"
                        title="بائیں سے دائیں تحریر (LTR Direction)"
                      >
                        <span className="text-[11px] font-mono">⮜¶</span>
                      </button>

                      <div className="h-4 w-px bg-slate-700 mx-0.5" />

                      {/* 7. Lists & Indentation */}
                      <button
                        type="button"
                        onClick={() => execCmd('insertUnorderedList')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.ul ? 'bg-blue-600 text-white font-bold ring-1 ring-blue-400' : 'hover:bg-slate-800 text-white'
                        }`}
                        title="غیر ترتیبی فہرست (Bulleted List)"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('insertOrderedList')}
                        className={`p-1 rounded-md transition-all ${
                          activeFormats.ol ? 'bg-blue-600 text-white font-bold ring-1 ring-blue-400' : 'hover:bg-slate-800 text-white'
                        }`}
                        title="نمبر وار فہرست (Numbered List)"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('formatBlock', '<blockquote>')}
                        className="p-1 hover:bg-slate-800 rounded-md text-white"
                        title="اقتباس بلاک (Blockquote)"
                      >
                        <Quote className="w-3.5 h-3.5 text-amber-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('indent')}
                        className="p-1 hover:bg-slate-800 rounded-md text-slate-300"
                        title="انڈینٹ آگے بڑھائیں (Increase Indent)"
                      >
                        <Indent className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('outdent')}
                        className="p-1 hover:bg-slate-800 rounded-md text-slate-300"
                        title="انڈینٹ پیچھے ہٹائیں (Decrease Indent)"
                      >
                        <Outdent className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('insertHorizontalRule')}
                        className="p-1 hover:bg-slate-800 rounded-md text-slate-300"
                        title="افقی لکیر (Horizontal Divider)"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-700 mx-0.5" />

                      {/* 8. Media, Links, Tables, Symbols */}
                      <button
                        type="button"
                        onMouseDown={() => saveCurrentSelection()}
                        onClick={() => {
                          saveCurrentSelection();
                          setShowMediaModal(true);
                        }}
                        className="p-1 hover:bg-slate-800 rounded-md text-emerald-400"
                        title="تصویر شامل کریں (Insert Image)"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={handleInsertLink}
                        className="p-1 hover:bg-slate-800 rounded-md text-blue-300"
                        title="ویب لنک لگائیں (Insert Link)"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('unlink')}
                        className="p-1 hover:bg-slate-800 rounded-md text-slate-400"
                        title="لنک ختم کریں (Remove Link)"
                      >
                        <Unlink className="w-3.5 h-3.5" />
                      </button>

                      {/* Special Character / Symbols (Ω) */}
                      <div className="relative">
                        <button
                          type="button"
                          onMouseDown={() => saveCurrentSelection()}
                          onClick={() => {
                            saveCurrentSelection();
                            setShowSpecialChars(!showSpecialChars);
                          }}
                          className="p-1 hover:bg-slate-800 rounded-md text-white font-bold"
                          title="خاص علامات و اسلامی القابات (Special Characters: Ω)"
                        >
                          <span className="font-sans font-bold text-xs text-blue-300">Ω</span>
                        </button>

                        {showSpecialChars && (
                          <div className="absolute top-full right-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-xl p-2.5 shadow-2xl z-50 text-right space-y-1.5 font-simple">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                              <span className="text-xs font-bold text-slate-200">خاص علامات و رموز</span>
                              <button type="button" onClick={() => setShowSpecialChars(false)} className="text-slate-400 hover:text-white">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto p-0.5">
                              {SPECIAL_SYMBOLS.map((sym, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => handleInsertSymbol(sym.label)}
                                  className="p-1.5 text-center bg-slate-800 hover:bg-blue-600 hover:text-white rounded-md text-xs transition-colors"
                                  title={sym.desc}
                                >
                                  {sym.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Table Menu (⊞ ▾) */}
                      <div className="relative">
                        <button
                          type="button"
                          onMouseDown={() => saveCurrentSelection()}
                          onClick={() => {
                            saveCurrentSelection();
                            setShowTableMenu(!showTableMenu);
                          }}
                          className="p-1 hover:bg-slate-800 rounded-md text-blue-300 flex items-center gap-0.5"
                          title="ٹیبل داخل کریں (Insert Table)"
                        >
                          <TableIcon className="w-3.5 h-3.5" />
                          <ChevronDown className="w-2.5 h-2.5 opacity-70" />
                        </button>

                        {showTableMenu && (
                          <div className="absolute top-full right-0 mt-1 w-52 bg-slate-900 border border-slate-700 rounded-xl p-1.5 shadow-2xl z-50 text-right space-y-1 font-simple">
                            <div className="text-[10px] text-slate-400 font-bold px-2 py-0.5 border-b border-slate-800 font-sans">
                              ٹیبل منتخب کریں:
                            </div>
                            <button
                              type="button"
                              onClick={() => handleInsertTable('2x2')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 text-xs font-bold"
                            >
                              2x2 سادہ ٹیبل
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertTable('3x3')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 text-xs font-bold"
                            >
                              3x3 علامات و امراض ٹیبل
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertTable('dosage')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-emerald-950/60 text-emerald-300 text-xs font-bold"
                            >
                              4-کالم طبی نسخہ و مقدار ٹیبل
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 1-Click Callout Box Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onMouseDown={() => saveCurrentSelection()}
                          onClick={() => {
                            saveCurrentSelection();
                            setShowBoxMenu(!showBoxMenu);
                          }}
                          className="px-2 py-1 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-md flex items-center gap-1 text-[11px] font-bold shadow-xs font-simple"
                          title="خوبصورت باکس / نسخہ کارڈ لگائیں"
                        >
                          <BoxSelect className="w-3.5 h-3.5" />
                          <span>باکس کارڈ</span>
                          <ChevronDown className="w-2.5 h-2.5" />
                        </button>

                        {showBoxMenu && (
                          <div className="absolute top-full right-0 mt-1 w-60 bg-slate-900 border border-slate-700 rounded-xl p-1.5 shadow-2xl z-50 space-y-1 text-right font-simple">
                            <div className="text-[10px] text-slate-400 font-bold px-2 py-0.5 border-b border-slate-800 font-sans">
                              باکس کا ڈیزائن منتخب کریں:
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => insertBox('green')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-emerald-950/60 text-emerald-300 flex items-center justify-between text-xs font-bold transition-colors"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span>سبز ہربل و فوائد باکس</span>
                              </div>
                              <Check className="w-3 h-3 text-emerald-400" />
                            </button>

                            <button
                              type="button"
                              onClick={() => insertBox('blue')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-blue-950/60 text-blue-300 flex items-center gap-1.5 text-xs font-bold transition-colors"
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                              <span>نیلا نسخہ و مقدار باکس</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => insertBox('amber')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-amber-950/60 text-amber-300 flex items-center gap-1.5 text-xs font-bold transition-colors"
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                              <span>پیلا پرہیز و احتیاط باکس</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => insertBox('red')}
                              className="w-full text-right p-1.5 rounded-lg hover:bg-red-950/60 text-red-300 flex items-center gap-1.5 text-xs font-bold transition-colors"
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                              <span>سرخ طبی انتباہ باکس</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="h-4 w-px bg-slate-700 mx-0.5" />

                      {/* 9. Utilities: Clear Formatting, Undo, Redo, Find/Replace, Shortcuts, Fullscreen */}
                      <button
                        type="button"
                        onClick={() => execCmd('removeFormat')}
                        className="p-1 hover:bg-slate-800 rounded-md text-slate-400"
                        title="فارمیٹنگ ختم کریں (Clear Formatting)"
                      >
                        <Eraser className="w-3.5 h-3.5 text-amber-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('undo')}
                        className="p-1 hover:bg-slate-800 rounded-md text-white"
                        title="واپس (Undo: Ctrl+Z)"
                      >
                        <Undo className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd('redo')}
                        className="p-1 hover:bg-slate-800 rounded-md text-white"
                        title="دوبارہ (Redo: Ctrl+Y)"
                      >
                        <Redo className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowFindReplaceModal(true)}
                        className="p-1 hover:bg-slate-800 rounded-md text-slate-300"
                        title="تلاش اور تبدیلی (Find & Replace)"
                      >
                        <Search className="w-3.5 h-3.5 text-cyan-300" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowShortcutsModal(true)}
                        className="p-1 hover:bg-slate-800 rounded-md text-slate-400"
                        title="کی بورڈ شارٹ کٹس (Help & Shortcuts)"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1 hover:bg-slate-800 rounded-md text-white mr-auto"
                        title={isFullscreen ? "عام موڈ پر واپس جائیں" : "فل اسکرین لکھائی موڈ (Fullscreen)"}
                      >
                        {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-amber-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      </button>

                    </div>

                    </div>
                    {/* End of STICKY TOP TOOLBAR HEADER */}

                    {/* VISUAL CONTENTEDITABLE CANVAS */}
                    {editorMode === 'visual' && (
                      <div className="relative">
                        <div
                          ref={visualEditorRef}
                          contentEditable
                          onClick={handleEditorClick}
                          onInput={() => {
                            if (visualEditorRef.current) {
                              setArticleForm({ ...articleForm, content: visualEditorRef.current.innerHTML });
                            }
                            saveCurrentSelection();
                            updateActiveFormats();
                          }}
                          onKeyUp={() => {
                            saveCurrentSelection();
                            updateActiveFormats();
                          }}
                          onMouseUp={(e) => {
                            handleEditorClick(e);
                            saveCurrentSelection();
                            updateActiveFormats();
                          }}
                          onSelect={() => {
                            saveCurrentSelection();
                            updateActiveFormats();
                          }}
                          onTouchEnd={(e) => {
                            handleEditorClick(e);
                            saveCurrentSelection();
                            updateActiveFormats();
                          }}
                          onBlur={() => {
                            saveCurrentSelection();
                          }}
                          className={`w-full bg-white text-slate-900 p-8 sm:p-12 min-h-[700px] lg:min-h-[800px] focus:outline-none focus:ring-0 visual-editor-content article-rendered-content selection:bg-blue-200 text-sm shadow-inner ${isFullscreen ? 'min-h-[85vh]' : ''}`}
                          style={{ direction: 'rtl', textAlign: 'right', fontSize: '14px' }}
                        />

                        {/* Bottom Status Bar */}
                        <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 rounded-b-3xl flex items-center justify-between text-xs text-slate-400 font-sans">
                          <div className="flex items-center gap-3">
                            <span>طبیب پیڈیا ویژول ایڈیٹر (Visual Canvas)</span>
                            <span>•</span>
                            <span>{selectedImgElement ? '🟢 تصویر منتخب ہے (ایڈٹ پینل فعال)' : 'حالت: فعال'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span>{stats.chars} حروف</span>
                            <span>•</span>
                            <span>{stats.words} الفاظ</span>
                            <span>•</span>
                            <span>{stats.readingTime} منٹ مطالعہ</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* HTML SOURCE CODE MODE */}
                    {editorMode === 'code' && (
                      <div className="border-t border-slate-800 rounded-b-3xl overflow-hidden">
                        <div className="bg-slate-900 px-4 py-2 text-xs text-emerald-400 font-mono border-b border-slate-800 flex items-center justify-between">
                          <span>HTML Source Code View</span>
                          <span className="text-[11px] text-slate-400">کوڈ میں براہ راست ترمیم کر سکتے ہیں</span>
                        </div>
                        <textarea
                          rows={24}
                          value={articleForm.content}
                          onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                          placeholder="HTML Source Code..."
                          className="w-full bg-slate-950 text-emerald-400 p-6 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed min-h-[600px]"
                          style={{ direction: 'ltr', textAlign: 'left' }}
                        />
                      </div>
                    )}

                    {/* LIVE PREVIEW MODE */}
                    {editorMode === 'preview' && (
                      <div className="bg-white text-slate-900 border-t border-slate-800 rounded-b-3xl p-8 sm:p-12 min-h-[600px] overflow-y-auto space-y-6 font-nastaliq leading-[2.2] text-right">
                        <div className="border-b pb-4">
                          <span className="text-xs bg-emerald-100 text-emerald-900 font-sans font-bold px-2.5 py-1 rounded-full">
                            لائیو پریویو
                          </span>
                          <h1 className="text-3xl font-bold font-simple text-slate-900 mt-3">
                            {articleForm.title || 'مضمون کا عنوان'}
                          </h1>
                        </div>
                        
                        {articleForm.featuredImage && (
                          <img src={articleForm.featuredImage} alt="Featured" className="w-full max-h-96 object-cover rounded-3xl shadow-sm" />
                        )}

                        <div 
                          className="prose max-w-none text-slate-800 text-sm leading-loose"
                          dangerouslySetInnerHTML={{ __html: articleForm.content || '<p class="text-slate-400">کوئی مواد درج نہیں کیا گیا...</p>' }}
                        />
                      </div>
                    )}

                  </div>

                  {/* 3. Short Excerpt Meta Box (خلاصہ سب سے آخر میں) */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-lg space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <label className="text-xs sm:text-sm font-bold text-white font-simple flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>مختصر خلاصہ (Excerpt)</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-sans">اختیاری (Optional)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-simple">
                      مضمون کا خلاصہ جو ہوم پیج کارڈز، سرچ رزلٹس اور سوشل میڈیا پر نظر آئے گا:
                    </p>
                    <textarea
                      rows={2}
                      value={articleForm.excerpt}
                      onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})}
                      placeholder="مضمون کا جامع خلاصہ یہاں درج کریں..."
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none font-nastaliq leading-relaxed shadow-inner"
                    />
                  </div>

                  {/* 4. Author & Reading Time Meta Box */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 font-simple">مصنف / طبیب (Author)</label>
                      <input
                        type="text"
                        value={articleForm.author}
                        onChange={(e) => setArticleForm({...articleForm, author: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-simple"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 font-simple">مطالعہ کا تخمینی وقت (Reading Time)</label>
                      <input
                        type="text"
                        value={articleForm.readingTime}
                        onChange={(e) => setArticleForm({...articleForm, readingTime: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-simple"
                      />
                    </div>
                  </div>

                </div>

                {/* ========================================================= */}
                {/* 2. WORDPRESS DOCUMENT SIDEBAR (Right: Narrow ~280px-300px) */}
                {/* ========================================================= */}
                <div className="w-full lg:w-[280px] xl:w-[300px] shrink-0 space-y-3.5 sticky top-3">
                  
                  {/* Meta Box 1: Publish / Status */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h3 className="text-xs font-bold text-white font-simple flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>پبلش و اسٹیٹس (Publish)</span>
                      </h3>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-sans ${articleForm.status === 'published' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                        {articleForm.status === 'published' ? 'پبلک' : 'پرائیویٹ'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-simple">
                      <div>
                        <label className="text-slate-400 block mb-1 text-[11px]">پبلشنگ اسٹیٹس:</label>
                        <select
                          value={articleForm.status}
                          onChange={(e) => setArticleForm({...articleForm, status: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                        >
                          <option value="published">🌐 پبلک (لائیو شائع کریں)</option>
                          <option value="private">🔒 ڈرافٹ (محفوظ رکھیں)</option>
                        </select>
                      </div>

                      <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span>مطالعہ کا دورانیہ:</span>
                        <strong className="text-white font-sans">{stats.readingTime} منٹ ({stats.words} الفاظ)</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      {editingArticleId ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteArticle(editingArticleId)}
                          className="text-red-400 hover:text-red-300 text-[11px] font-bold underline font-simple"
                        >
                          ڈیلیٹ
                        </button>
                      ) : <span />}

                      <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg text-xs font-bold shadow-md transition-all font-simple"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingArticleId ? 'محفوظ کریں' : 'پبلش کریں'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Meta Box 2: Categories */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h3 className="text-xs font-bold text-white font-simple flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        <span>زمرہ جات (Categories)</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowNewCatModal(!showNewCatModal)}
                        className="text-[11px] text-blue-400 hover:text-blue-300 font-bold font-simple"
                      >
                        + نیا زمرہ
                      </button>
                    </div>

                    {/* New Category Inline Input */}
                    {showNewCatModal && (
                      <div className="p-2 bg-slate-900 rounded-xl border border-slate-700 space-y-1.5 animate-in fade-in-50">
                        <input
                          type="text"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          placeholder="نئی کیٹیگری کا نام..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddNewCategory}
                          className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg font-simple"
                        >
                          شامل کریں
                        </button>
                      </div>
                    )}

                    {/* Categories List */}
                    <div className="space-y-1.5 max-h-40 overflow-y-auto p-0.5 font-simple text-xs">
                      {availableCategories.map(cat => (
                        <label
                          key={cat.id}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                            articleForm.category === cat.id
                              ? 'bg-blue-600/20 border-blue-500/40 text-white font-bold'
                              : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="articleCategory"
                              checked={articleForm.category === cat.id}
                              onChange={() => setArticleForm({...articleForm, category: cat.id})}
                              className="accent-blue-500 w-3.5 h-3.5 cursor-pointer"
                            />
                            <span className="text-xs">{cat.name}</span>
                          </div>
                          {articleForm.category === cat.id && (
                            <Check className="w-3.5 h-3.5 text-blue-400" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Meta Box 3: Featured Image */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h3 className="text-xs font-bold text-white font-simple flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                        <span>فیچرڈ تصویر (Featured Image)</span>
                      </h3>
                    </div>

                    <div className="space-y-2.5">
                      {/* Image Preview Box */}
                      <div className="h-36 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden relative flex items-center justify-center group shadow-inner">
                        {articleForm.featuredImage ? (
                          <>
                            <img
                              src={articleForm.featuredImage}
                              alt="Featured preview"
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-2.5 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg shadow-md font-simple"
                              >
                                تصویر بدلیں
                              </button>
                              <button
                                type="button"
                                onClick={() => setArticleForm({...articleForm, featuredImage: ''})}
                                className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg shadow-md font-simple"
                              >
                                ہٹائیں
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-slate-500 text-xs p-3">
                            <ImageIcon className="w-8 h-8 mx-auto mb-1.5 opacity-40 text-slate-400" />
                            <span className="block font-simple font-bold text-slate-400 text-xs">کوئی تصویر نہیں</span>
                            <span className="text-[10px] text-slate-500">نیچے سے منتخب کریں</span>
                          </div>
                        )}
                      </div>

                      {/* Upload Options */}
                      <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg text-xs font-simple border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setArticleForm({...articleForm, imageType: 'upload'})}
                          className={`flex-1 py-1 rounded-md text-center text-[11px] font-bold transition-colors ${articleForm.imageType === 'upload' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                          کمپیوٹر سے
                        </button>
                        <button
                          type="button"
                          onClick={() => setArticleForm({...articleForm, imageType: 'url'})}
                          className={`flex-1 py-1 rounded-md text-center text-[11px] font-bold transition-colors ${articleForm.imageType === 'url' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                          آن لائن لنک
                        </button>
                      </div>

                      {articleForm.imageType === 'upload' ? (
                        <div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleThumbnailUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border border-dashed border-slate-800 hover:border-blue-500 rounded-xl p-3 text-center text-xs text-slate-300 hover:text-white transition-all space-y-0.5 bg-slate-900/50"
                          >
                            <UploadCloud className="w-5 h-5 mx-auto text-blue-400" />
                            <span className="font-bold block font-simple text-[11px]">کمپیوٹر سے تصویر منتخب کریں</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="url"
                            value={articleForm.featuredImage}
                            onChange={(e) => setArticleForm({...articleForm, featuredImage: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-sans"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Meta Box 5: SEO Settings */}
                  <div className="bg-slate-950 border border-blue-900/40 rounded-2xl p-3.5 shadow-md space-y-3">
                    <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <h3 className="text-xs font-bold text-white font-simple flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        <span>SEO / سرچ انجن سیٹنگز</span>
                      </h3>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1 text-[11px] font-simple">SEO عنوان (Google Title):</label>
                        <input
                          type="text"
                          value={articleForm.seoTitle || articleForm.title}
                          onChange={(e) => setArticleForm({...articleForm, seoTitle: e.target.value})}
                          placeholder="Google پر نظر آنے والا عنوان..."
                          maxLength={60}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-simple"
                        />
                        <span className="text-[10px] text-slate-500 mt-0.5 block font-sans">{(articleForm.seoTitle || articleForm.title || '').length}/60</span>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 text-[11px] font-simple">SEO تفصیل (Meta Description):</label>
                        <textarea
                          value={articleForm.seoDescription || articleForm.excerpt}
                          onChange={(e) => setArticleForm({...articleForm, seoDescription: e.target.value})}
                          placeholder="Google میں نظر آنے والی مختصر تفصیل (160 حروف)..."
                          maxLength={160}
                          rows={3}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-simple resize-none"
                        />
                        <span className="text-[10px] text-slate-500 mt-0.5 block font-sans">{(articleForm.seoDescription || articleForm.excerpt || '').length}/160</span>
                      </div>
                      {/* Google Preview */}
                      <div className="bg-white rounded-lg p-2.5 border border-slate-300 text-left">
                        <div className="text-[11px] text-green-700 font-sans truncate">tabeebpedia.com › {articleForm.slug || 'article-slug'}</div>
                        <div className="text-[12px] text-blue-700 font-bold font-sans truncate mt-0.5">{(articleForm.seoTitle || articleForm.title || 'مضمون کا عنوان').substring(0, 55)}</div>
                        <div className="text-[10px] text-slate-600 font-sans mt-0.5 line-clamp-2">{(articleForm.seoDescription || articleForm.excerpt || 'مضمون کی تفصیل یہاں نظر آئے گی...').substring(0, 140)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Meta Box 4: Tags */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h3 className="text-xs font-bold text-white font-simple flex items-center gap-1.5">
                        <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>ٹیگز (Tags)</span>
                      </h3>
                    </div>

                    <div className="space-y-2.5">
                      {/* Tag Input Field with Button */}
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          placeholder="ٹیگ لکھیں..."
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-simple"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTag()}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold font-simple transition-colors"
                        >
                          + شامل کریں
                        </button>
                      </div>

                      {/* Active Tag Pills */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {(typeof articleForm.tags === 'string' ? articleForm.tags.split(',').map(t => t.trim()).filter(Boolean) : (articleForm.tags || [])).map(t => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 bg-blue-950/80 text-blue-200 border border-blue-800/80 px-2 py-0.5 rounded-lg text-[11px] font-simple shadow-xs"
                          >
                            <span>{t}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(t)}
                              className="hover:text-red-400 transition-colors"
                              title="ٹیگ ہٹائیں"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Popular Suggested Tags */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] text-slate-500 block font-simple">اکثر استعمال ہونے والے ٹیگز:</span>
                        <div className="flex flex-wrap gap-1">
                          {['طب یونانی', 'قانون مفرد اعضاء', 'جڑی بوٹیاں', 'معدہ و تبخیر', 'ہربل نسخے', 'علاج بالغذائ'].map(pt => (
                            <button
                              key={pt}
                              type="button"
                              onClick={() => handleAddTag(pt)}
                              className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-1.5 py-0.5 rounded border border-slate-800 font-simple transition-colors"
                            >
                              +{pt}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </form>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: ARTICLES LIST & MANAGEMENT TABLE */}
          {/* ========================================================= */}
          {adminTab === 'articles' && (
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-simple">
                    شائع شدہ اور پرائیویٹ مضامین
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-sans">
                    تمام 300 تا 400 آرٹیکلز کی مکمل مانیٹرنگ، ایڈیٹنگ اور اسٹیٹس کنٹرول
                  </p>
                </div>

                <button
                  onClick={handleOpenNewArticle}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md font-simple"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>نیا مضمون لکھیں</span>
                </button>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="مضمون کا عنوان یا مصنف تلاش کریں..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-simple"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 font-sans">اسٹیٹس:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer font-sans font-bold"
                  >
                    <option value="all">تمام مضامین</option>
                    <option value="published">صرف پبلک (Live)</option>
                    <option value="private">صرف پرائیویٹ (Private/Draft)</option>
                  </select>
                </div>
              </div>

              {/* Articles Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
                {filteredArticles.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="font-bold font-simple">کوئی مضمون نہیں ملا</p>
                  </div>
                ) : (
                  filteredArticles.map(art => {
                    const isPrivate = art.status === 'private';
                    return (
                      <div
                        key={art.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-4">
                          <img
                            src={art.featuredImage}
                            alt={art.title}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-800 shrink-0"
                          />
                          <div className="space-y-1 text-right">
                            <div className="flex flex-wrap items-center gap-2">
                              <a 
                                href={`/${art.slug || art.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  // If clicked normally without modifier keys, open in editor
                                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                                    e.preventDefault();
                                    handleEditArticle(art);
                                  }
                                }}
                                className="text-sm sm:text-base font-bold text-white hover:text-blue-400 font-simple transition-colors inline-block cursor-pointer"
                                title="کلک پر ایڈٹ کریں، یا رائٹ کلک کر کے نئی ونڈو / ٹیب میں کھولیں"
                              >
                                {art.title}
                              </a>
                              {isPrivate ? (
                                <span className="inline-flex items-center gap-1 bg-amber-950 text-amber-300 border border-amber-800 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
                                  <Lock className="w-3 h-3" />
                                  پرائیویٹ / ڈرافٹ
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
                                  <Globe className="w-3 h-3" />
                                  پبلک (لائیو)
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-sans">
                              <span>کیٹیگری: <strong>{art.categoryName || art.category}</strong></span>
                              <span>•</span>
                              <span>مصنف: {art.author}</span>
                              <span>•</span>
                              <span>تاریخ: {art.publishedAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 font-simple">
                          {/* View Live Article in New Tab Button */}
                          <a
                            href={`/${art.slug || art.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                            title="مضمون کو نئی ونڈو / ٹیب میں لائیو کھولیں (Open in New Tab)"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="hidden md:inline">دیکھیں (View)</span>
                          </a>

                          {/* Toggle Public / Private Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(art.id)}
                            className={`p-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                              isPrivate
                                ? 'bg-amber-900/40 text-amber-300 hover:bg-amber-900/60 border border-amber-700'
                                : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-700'
                            }`}
                            title={isPrivate ? 'پبلک کریں' : 'پرائیویٹ بنائیں'}
                          >
                            {isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                            <span className="hidden md:inline">{isPrivate ? 'پرائیویٹ ہے' : 'پبلک ہے'}</span>
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleEditArticle(art)}
                            className="p-2 bg-blue-900/40 text-blue-300 hover:bg-blue-900/70 border border-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                            title="ترمیم کریں (Edit)"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span className="hidden md:inline">ایڈٹ کریں</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-2 bg-red-950 text-red-400 hover:bg-red-900/60 border border-red-800 rounded-xl transition-colors"
                            title="ڈیلیٹ کریں"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: DOCTORS APPROVAL & CLINICS MANAGEMENT */}
          {/* ========================================================= */}
          {adminTab === 'doctors' && (() => {
            const pendingDoctors = doctorsList.filter(d => d && (d.isApproved === false || d.status === 'pending'));
            const approvedDoctors = doctorsList.filter(d => d && (d.isApproved !== false && d.status !== 'pending'));

            const handleApproveDoctor = (doctorId) => {
              const docToApprove = doctorsList.find(d => d.id === doctorId);
              setDoctorsList(prev => prev.map(d => {
                if (d.id === doctorId) {
                  return {
                    ...d,
                    isApproved: true,
                    status: 'active',
                    isVerified: true
                  };
                }
                return d;
              }));
              showNotification(`طبیب ${docToApprove?.name || ''} کی رجسٹریشن منظور کر لی گئی ہے اور ویب سائٹ پر پبلش ہو چکی ہے!`);
            };

            
            const handleEditDoctor = (docItem) => {
              setEditingDoctorId(docItem.id);
              setDoctorForm({ ...docItem });
            };

            const handleSaveDoctor = async () => {
              if (!editingDoctorId) return;
              try {
                // Here we update internal state
                setDoctorsList(prev => prev.map(d => d.id === editingDoctorId ? { ...d, ...doctorForm } : d));
                try {
                  const savedDocs = JSON.parse(localStorage.getItem('tabeeb_doctors_data_v1') || '[]');
                  const updatedDocs = savedDocs.map(d => d.id === editingDoctorId ? { ...d, ...doctorForm } : d);
                  localStorage.setItem('tabeeb_doctors_data_v1', JSON.stringify(updatedDocs));
                } catch(e) {}
                
                // If there's a Firebase backend, it should be updated here (assuming doc() and updateDoc() are available or similar to handleApproveDoctor)
                // We leave it to the same mock/state strategy as the rest.
                showNotification('طبیب کی تفصیلات اپڈیٹ ہو گئیں۔');
                setEditingDoctorId(null);
                setDoctorForm(null);
              } catch (error) {
                console.error('Error saving doctor:', error);
                showNotification('ایرر: ' + error.message, 'error');
              }
            };


            const handleRejectDoctor = (doctorId) => {
              const docToReject = doctorsList.find(d => d.id === doctorId);
              if (window.confirm(`کیا آپ واقعی ${docToReject?.name || 'اس طبیب'} کی رجسٹریشن درخواست مسترد اور حذف کرنا چاہتے ہیں؟`)) {
                setDoctorsList(prev => prev.filter(d => d.id !== doctorId));
                showNotification(`طبیب ${docToReject?.name || ''} کی درخواست مسترد کر دی گئی۔`);
              }
            };

            const handleToggleDoctorVerified = (doctorId) => {
              setDoctorsList(prev => prev.map(d => {
                if (d.id === doctorId) {
                  return { ...d, isVerified: !d.isVerified };
                }
                return d;
              }));
              showNotification('ویریفیکیشن اسٹیٹس تبدیل کر دیا گیا');
            };

            const handleToggleDoctorFeatured = (doctorId) => {
              setDoctorsList(prev => prev.map(d => {
                if (d.id === doctorId) {
                  return { ...d, isFeatured: !d.isFeatured };
                }
                return d;
              }));
              showNotification('ہوم پیج نمایاں اسٹیٹس تبدیل کر دیا گیا');
            };

            const handleUnpublishDoctor = (doctorId) => {
              const doc = doctorsList.find(d => d.id === doctorId);
              if (window.confirm(`کیا آپ ${doc?.name || 'اس طبیب'} کو غیر پبلش (زیرِ التواء) کرنا چاہتے ہیں؟`)) {
                setDoctorsList(prev => prev.map(d => {
                  if (d.id === doctorId) {
                    return { ...d, isApproved: false, status: 'pending' };
                  }
                  return d;
                }));
                showNotification('طبیب کو پبلک ڈائریکٹری سے ہٹا دیا گیا');
              }
            };

            let currentList = doctorTabFilter === 'pending'
              ? pendingDoctors
              : doctorTabFilter === 'approved'
                ? approvedDoctors
                : doctorsList;

            if (doctorSearchFilter.trim()) {
              const q = doctorSearchFilter.trim().toLowerCase();
              currentList = currentList.filter(d => 
                (d.name && d.name.toLowerCase().includes(q)) ||
                (d.clinicName && d.clinicName.toLowerCase().includes(q)) ||
                (d.cityName && d.cityName.toLowerCase().includes(q)) ||
                (d.email && d.email.toLowerCase().includes(q)) ||
                (d.whatsapp && d.whatsapp.includes(q)) ||
                (d.phone && d.phone.includes(q))
              );
            }

            return (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                
                
                {/* Password Requests Section */}
                {passwordRequests.length > 0 && (
                  <div className="bg-amber-950/20 border border-amber-900/50 rounded-2xl p-4 md:p-6 shadow-sm mb-8 animate-in fade-in duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-900/30 text-amber-400 rounded-xl">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-amber-400 font-simple">پاسورڈ بھولنے کی درخواستیں ({passwordRequests.length})</h3>
                          <p className="text-[11px] text-amber-500/70 mt-1 font-simple">مندرجہ ذیل اطباء نے پاسورڈ بھول جانے کی اطلاع دی ہے۔ ان کی پروفائل ایڈٹ کر کے پاسورڈ تبدیل کریں اور انہیں مطلع کریں۔</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {passwordRequests.map(req => (
                        <div key={req.id} className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 flex justify-between items-center shadow-inner">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-simple mb-0.5">شناخت (ای میل یا فون):</span>
                            <strong className="text-slate-200 text-sm font-sans tracking-wide">{req.identifier}</strong>
                            <span className="text-[10px] text-slate-500 block mt-1 font-sans">{new Date(req.date).toLocaleString('ur-PK')}</span>
                          </div>
                          <button
                            onClick={() => handleClearPasswordRequest(req.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 font-bold rounded-lg text-[10px] transition-colors flex items-center gap-1.5 font-simple shadow-sm"
                            title="درخواست کو فہرست سے ہٹائیں"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            مکمل / حذف
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-simple flex items-center gap-2">
                      <UserCheck className="w-6 h-6 text-blue-400" />
                      <span>اطباء و کلینکس مینجمنٹ اور رجسٹریشن منظوری</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      نئی رجسٹریشن کی درخواستوں کا جائزہ لیں، قبول کریں یا مسترد کریں۔ صرف منظور شدہ اطباء ہی پبلک ویب سائٹ پر نظر آئیں گے۔
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const testDoc = {
                          id: Date.now(),
                          name: 'حکیم سید وقار علی شاہ',
                          slug: `tabeeb-${Date.now()}`,
                          email: `waqar.shah.${Date.now().toString().slice(-4)}@gmail.com`,
                          password: 'password123',
                          title: 'ماہر نباض، موروثی معالج طب یونانی',
                          qualifications: 'فاضل طب والجراحت (FTJ), گولڈ میڈلسٹ',
                          councilRegNo: 'NCT-99412',
                          experience: 12,
                          rating: 5.0,
                          reviewsCount: 0,
                          city: 'islamabad',
                          cityName: 'اسلام آباد / راولپنڈی',
                          specialties: ['امراض معدہ، گیس و تبخیر', 'جوڑوں و پٹھوں کا درد (عرق النساء)'],
                          treatmentType: 'طب یونانی',
                          clinicName: 'شاہ شفا خانہ و طب یونانی سنٹر',
                          address: 'سٹی سینٹر، صدر بازار، راولپنڈی',
                          timing: 'شام 5:00 تا رات 9:00',
                          fee: 700,
                          phone: '03009876543',
                          whatsapp: '923009876543',
                          image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
                          isVerified: false,
                          emailVerified: false,
                          isApproved: false, // ⚠️ Pending Admin Approval
                          status: 'pending',
                          isFeatured: false,
                          appliedDate: new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' }),
                          about: 'موروثی حکمت کے خاندانی نسخہ جات اور نبض شناسی سے کامیاب علاج۔',
                          services: ['مفت آن لائن رہنمائی', 'نبض شناسی و مزاج تشخیص', 'قدرتی ہربل نسخہ جات'],
                          education: [
                            { degree: 'فاضل طب والجراحت (FTJ)', institute: 'طبیہ کالج' }
                          ]
                        };
                        setDoctorsList(prev => {
                          const updated = [testDoc, ...prev];
                          try {
                            localStorage.setItem('tabeeb_doctors_data_v1', JSON.stringify(updated));
                          } catch (e) {}
                          return updated;
                        });
                        setDoctorTabFilter('pending');
                        showNotification('ٹیسٹ رجسٹریشن کی درخواست ایڈمن پینل میں شامل کر دی گئی ہے!');
                      }}
                      className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl transition-all font-simple"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ فرضی ٹیسٹ درخواست شامل کریں</span>
                    </button>

                    <span className="text-xs bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl font-bold font-sans">
                      کل اطباء: <strong className="text-blue-400">{doctorsList.length}</strong>
                    </span>
                  </div>
                </div>

                {/* Sub-Tabs & Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  
                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 font-simple text-xs">
                    <button
                      type="button"
                      onClick={() => setDoctorTabFilter('pending')}
                      className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                        doctorTabFilter === 'pending'
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>نئی درخواستیں برائے منظوری</span>
                      {pendingDoctors.length > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-extrabold ${
                          doctorTabFilter === 'pending' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {pendingDoctors.length} نئی
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDoctorTabFilter('approved')}
                      className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                        doctorTabFilter === 'approved'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>منظور شدہ اطباء ({approvedDoctors.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDoctorTabFilter('all')}
                      className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                        doctorTabFilter === 'all'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>تمام ({doctorsList.length})</span>
                    </button>
                  </div>

                  {/* Search input */}
                  <div className="relative min-w-[220px]">
                    <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                    <input
                      type="text"
                      value={doctorSearchFilter}
                      onChange={(e) => setDoctorSearchFilter(e.target.value)}
                      placeholder="ڈاکٹر، کلینک، شہر، فون سے تلاش کریں..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-simple"
                    />
                  </div>

                </div>

                {/* Content List */}
                <div className="space-y-4">
                  {currentList.length === 0 ? (
                    <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-300 font-simple">
                        {doctorTabFilter === 'pending'
                          ? 'اس وقت کوئی نئی رجسٹریشن کی درخواست زیرِ جائزہ نہیں ہے۔'
                          : 'کوئی معالج یا کلینک نہیں ملا۔'}
                      </p>
                      <p className="text-xs text-slate-500 font-simple">
                        {doctorTabFilter === 'pending'
                          ? 'جب بھی کوئی طبیب ای میل تصدیق کے ساتھ نیا فارم بھرے گا، وہ یہاں منظوری کے لیے ظاہر ہوگا۔'
                          : 'براہ کرم سرچ فلٹر تبدیل کر کے دوبارہ کوشش کریں۔'}
                      </p>
                    </div>
                  ) : (
                    currentList.map(doc => {
                      const isPending = doc.isApproved === false || doc.status === 'pending';

                      return (
                        <div
                          key={doc.id}
                          className={`rounded-3xl border p-5 sm:p-6 space-y-4 transition-all ${
                            isPending
                              ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-950/20'
                              : 'bg-slate-900 border-slate-800'
                          }`}
                        >
                          {/* Doctor Top Header Row */}
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
                            
                            <div className="flex items-start gap-4">
                              <img
                                src={doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                                alt={doc.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-700 shrink-0 bg-slate-800"
                              />

                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-lg font-bold text-white font-simple">
                                    {doc.name}
                                  </h3>

                                  {isPending ? (
                                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 font-sans">
                                      <Clock className="w-3 h-3" />
                                      <span>زیرِ جائزہ (Pending Approval)</span>
                                    </span>
                                  ) : (
                                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 font-sans">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>پبلش شدہ و فعال (Live)</span>
                                    </span>
                                  )}

                                  {doc.emailVerified && (
                                    <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold font-sans">
                                      ای میل تصدیق شدہ ✓
                                    </span>
                                  )}

                                  {doc.isFeatured && (
                                    <span className="bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold font-sans">
                                      ہوم پیج پر نمایاں ★
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-blue-400 font-bold font-simple">{doc.title}</p>
                                <p className="text-[11px] text-slate-400 font-sans">
                                  {doc.qualifications} {doc.councilRegNo ? `• رجسٹریشن نمبر: ${doc.councilRegNo}` : ''}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons for this doctor */}
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end font-simple text-xs">
                              {isPending ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveDoctor(doc.id)}
                                    className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>قبول کریں اور پبلش کریں (Approve)</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleRejectDoctor(doc.id)}
                                    className="p-2 bg-red-950 text-red-400 hover:bg-red-900 border border-red-800 rounded-xl transition-all"
                                    title="پروفائل مسترد کریں"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleEditDoctor(doc)}
                                    className="p-2 bg-blue-900/50 hover:bg-blue-800 border border-blue-700/50 text-blue-300 font-bold rounded-xl transition-all"
                                    title="تفصیلات تبدیل کریں"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>

                                  <a
                                    href={'https://wa.me/' + (doc.whatsapp?.replace(new RegExp('[^0-9]', 'g'), '') || doc.phone?.replace(new RegExp('[^0-9]', 'g'), '') || '')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-green-900/50 hover:bg-green-800 border border-green-700/50 text-green-300 font-bold rounded-xl transition-all"
                                    title="طبیب کو وٹس اپ میسج کریں"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleDoctorVerified(doc.id)}
                                    className={'px-3 py-2 rounded-xl font-bold border transition-all ' + (doc.isVerified ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white')}
                                    title="طبیب کی تصدیق کا سٹیٹس بدلیں"
                                  >
                                    {doc.isVerified ? 'تصدیق شدہ' : 'تصدیق کریں'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleDoctorFeatured(doc.id)}
                                    className={'px-3 py-2 rounded-xl font-bold border transition-all ' + (doc.isFeatured ? 'bg-purple-950/60 border-purple-800 text-purple-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white')}
                                    title="ہوم پیج پر نمایاں کریں"
                                  >
                                    {doc.isFeatured ? 'نمایاں' : 'نمایاں کریں'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleUnpublishDoctor(doc.id)}
                                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl transition-all"
                                    title="پروفائل کو غیر پبلش کریں"
                                  >
                                    ان پبلش کریں
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleRejectDoctor(doc.id)}
                                    className="p-2 bg-red-950 text-red-400 hover:bg-red-900 border border-red-800 rounded-xl transition-all"
                                    title="پروفائل ڈیلیٹ کریں"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleEditDoctor(doc)}
                                    className="p-2 bg-blue-900/50 hover:bg-blue-800 border border-blue-700/50 text-blue-300 font-bold rounded-xl transition-all"
                                    title="تفصیلات تبدیل کریں"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>

                                  <a
                                    href={'https://wa.me/' + (doc.whatsapp?.replace(new RegExp('[^0-9]', 'g'), '') || doc.phone?.replace(new RegExp('[^0-9]', 'g'), '') || '')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-green-900/50 hover:bg-green-800 border border-green-700/50 text-green-300 font-bold rounded-xl transition-all"
                                    title="طبیب کو وٹس اپ میسج کریں"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>
                                </>
                              )}
                            </div>

                          </div>

                          {/* Doctor Information Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                            
                            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 space-y-1">
                              <span className="text-[10px] text-slate-400 font-simple block">مطب / کلینک کا نام:</span>
                              <strong className="text-slate-200 block font-simple">{doc.clinicName || 'مطب کا نام درج نہیں'}</strong>
                              <span className="text-[11px] text-slate-400 font-sans block">{doc.address || doc.cityName}</span>
                            </div>

                            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 space-y-1">
                              <span className="text-[10px] text-slate-400 font-simple block">رابطہ و ای میل:</span>
                              <div className="text-emerald-400 font-sans font-bold flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{doc.whatsapp || doc.phone || 'نمبر موجود نہیں'}</span>
                              </div>
                              <div className="text-blue-300 font-sans truncate flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{doc.email || 'ای میل موجود نہیں'}</span>
                              </div>
                            </div>

                            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 space-y-1">
                              <span className="text-[10px] text-slate-400 font-simple block">طریقہ علاج، تجربہ و فیس:</span>
                              <div className="text-amber-300 font-simple font-bold">{doc.treatmentType}</div>
                              <div className="text-slate-300 font-sans">
                                تجربہ: <strong className="text-white">{doc.experience} سال</strong> • فیس: <strong className="text-white">Rs. {doc.fee}</strong>
                              </div>
                            </div>

                          </div>

                          {/* Specialties Chips */}
                          {doc.specialties && Array.isArray(doc.specialties) && doc.specialties.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[11px] text-slate-400 font-simple ml-1">منتخب شعبہ جات:</span>
                              {doc.specialties.map((spec, i) => (
                                <span
                                  key={i}
                                  className="bg-blue-950/70 border border-blue-800/80 text-blue-300 text-[11px] px-2.5 py-0.5 rounded-full font-simple"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* About Doctor Bio (if present) */}
                          {doc.about && (
                            <p className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 leading-relaxed font-simple">
                              <strong className="text-slate-300">تعارف: </strong>
                              {doc.about}
                            </p>
                          )}

                          {/* Application timestamp (if pending) */}
                          {isPending && doc.appliedDate && (
                            <div className="text-[11px] text-amber-400/80 font-sans text-left">
                              درخواست تاریخ: {doc.appliedDate}
                            </div>
                          )}

                        </div>
                      );
                    })
                  )}
                </div>


                {/* Edit Doctor Modal */}
                {editingDoctorId && doctorForm && (
                  <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white font-simple">طبیب کی تفصیلات تبدیل کریں</h3>
                        <button onClick={() => { setEditingDoctorId(null); setDoctorForm(null); }} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="p-4 overflow-y-auto space-y-4 font-simple text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 mb-1 text-xs">نام</label>
                            <input 
                              type="text" 
                              value={doctorForm.name || ''} 
                              onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1 text-xs">ٹائٹل / عہدہ</label>
                            <input 
                              type="text" 
                              value={doctorForm.title || ''} 
                              onChange={(e) => setDoctorForm({...doctorForm, title: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1 text-xs">مطب کا نام</label>
                            <input 
                              type="text" 
                              value={doctorForm.clinicName || ''} 
                              onChange={(e) => setDoctorForm({...doctorForm, clinicName: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1 text-xs">شہر / پتہ</label>
                            <input 
                              type="text" 
                              value={doctorForm.cityName || doctorForm.address || ''} 
                              onChange={(e) => setDoctorForm({...doctorForm, cityName: e.target.value, address: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1 text-xs">وٹس اپ نمبر</label>
                            <input 
                              type="text" 
                              value={doctorForm.whatsapp || ''} 
                              onChange={(e) => setDoctorForm({...doctorForm, whatsapp: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                              dir="ltr"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1 text-xs">ای میل</label>
                            <input 
                              type="text" 
                              value={doctorForm.email || ''} 
                              onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                              dir="ltr"
                            />
                          </div>
                          <div className="bg-blue-950/40 p-2.5 rounded-xl border border-blue-600/60">
                            <label className="block text-blue-300 mb-1 text-xs font-bold font-simple flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-blue-400" />
                              <span>لاگ ان پاسورڈ (Login Password):</span>
                            </label>
                            <input 
                              type="text" 
                              value={doctorForm.password || 'password123'} 
                              onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})}
                              placeholder="طبیب کا پاسورڈ..."
                              className="w-full bg-slate-900 border border-blue-500 rounded-lg p-2 text-emerald-400 font-bold focus:border-blue-400 outline-none text-xs tracking-wider"
                              dir="ltr"
                            />
                            <span className="text-[10px] text-slate-400 mt-1 block font-simple">ایڈمن یہاں سے پاسورڈ دیکھ اور تبدیل کر سکتا ہے۔</span>
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1 text-xs">فیس (Rs)</label>
                            <input 
                              type="text" 
                              value={doctorForm.fee || ''} 
                              onChange={(e) => setDoctorForm({...doctorForm, fee: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1 text-xs">تجربہ</label>
                            <input 
                              type="text" 
                              value={doctorForm.experience || ''} 
                              onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1 text-xs">تعارف</label>
                          <textarea 
                            value={doctorForm.about || ''} 
                            onChange={(e) => setDoctorForm({...doctorForm, about: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none h-24"
                          ></textarea>
                        </div>
                      </div>
                      
                      <div className="p-4 border-t border-slate-800 flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingDoctorId(null); setDoctorForm(null); }}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-all text-xs"
                        >
                          کینسل
                        </button>
                        <button 
                          onClick={handleSaveDoctor}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all text-xs flex items-center gap-1"
                        >
                          <Save className="w-4 h-4" />
                          محفوظ کریں
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })()}

          {/* ========================================================= */}
          {/* VIEW 4: COMPREHENSIVE WEBSITE SETTINGS (LOGO, HEADER, FOOTER) */}
          {/* ========================================================= */}
          {adminTab === 'settings' && (
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-simple">
                    ویب سائٹ ترتیبات (لوگو، ہیڈر، ہوم پیج و فوٹر)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ویب سائٹ کے لوگو، ہیڈر فون نمبر، سوشل میڈیا اور فوٹر مواد کو کنٹرول کریں
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all font-simple"
                >
                  <Save className="w-4 h-4" />
                  <span>تمام ترتیبات محفوظ کریں</span>
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-8">
                
                {/* 1. Logo & Branding Settings */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-blue-300 font-simple flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span>لوگو اور برانڈنگ ترتیبات</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">ویب سائٹ کا نام (Site Name)</label>
                      <input
                        type="text"
                        value={settingsForm.siteName}
                        onChange={(e) => setSettingsForm({...settingsForm, siteName: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-simple font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">ٹیگ لائن (Tagline)</label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({...settingsForm, tagline: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">کسٹم لوگو امیج (Upload Logo Image)</label>
                    <input
                      type="file"
                      ref={logoFileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-bold rounded-xl transition-colors font-simple flex items-center gap-2"
                      >
                        <UploadCloud className="w-4 h-4 text-blue-400" />
                        <span>کمپیوٹر سے لوگو منتخب کریں</span>
                      </button>
                      <input
                        type="url"
                        value={settingsForm.logoUrl}
                        onChange={(e) => setSettingsForm({...settingsForm, logoUrl: e.target.value})}
                        placeholder="یا آن لائن لوگو URL درج کریں..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Header & Helpline Settings */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-emerald-400 font-simple flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>ہیڈر، ہیلپ لائن اور ٹاپ بار میسج</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">کال ہیلپ لائن نمبر</label>
                      <input
                        type="text"
                        value={settingsForm.helplinePhone}
                        onChange={(e) => setSettingsForm({...settingsForm, helplinePhone: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">واٹس ایپ نمبر (مریضوں سے رابطے کے لیے)</label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({...settingsForm, whatsappNumber: e.target.value})}
                        placeholder="923001234567"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">ٹاپ بار اعلان / نوٹس ٹیکسٹ</label>
                    <input
                      type="text"
                      value={settingsForm.topbarNotice}
                      onChange={(e) => setSettingsForm({...settingsForm, topbarNotice: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* 3. Homepage Hero Banner Content */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-amber-300 font-simple flex items-center gap-2">
                    <Home className="w-4 h-4 text-amber-400" />
                    <span>ہوم پیج ہیرو بینر ٹیکسٹ</span>
                  </h3>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">مرکزی ہیرو ہیڈنگ (Hero Title)</label>
                    <input
                      type="text"
                      value={settingsForm.heroTitle}
                      onChange={(e) => setSettingsForm({...settingsForm, heroTitle: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-simple font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">ہیرو سب ٹائٹل (Hero Subtitle)</label>
                    <textarea
                      rows={2}
                      value={settingsForm.heroSubtitle}
                      onChange={(e) => setSettingsForm({...settingsForm, heroSubtitle: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* 4. Footer & Social Media Settings */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-indigo-400 font-simple flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-indigo-400" />
                    <span>فوٹر مواد اور سوشل لنکس</span>
                  </h3>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">فوٹر تعارفی پیراگراف (About Text)</label>
                    <textarea
                      rows={2}
                      value={settingsForm.footerAbout}
                      onChange={(e) => setSettingsForm({...settingsForm, footerAbout: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">فیس بک پیج URL</label>
                      <input
                        type="url"
                        value={settingsForm.facebookUrl}
                        onChange={(e) => setSettingsForm({...settingsForm, facebookUrl: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">انسٹاگرام URL</label>
                      <input
                        type="url"
                        value={settingsForm.instagramUrl}
                        onChange={(e) => setSettingsForm({...settingsForm, instagramUrl: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">یوٹیوب چینل URL</label>
                      <input
                        type="url"
                        value={settingsForm.youtubeUrl}
                        onChange={(e) => setSettingsForm({...settingsForm, youtubeUrl: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 flex justify-end font-simple">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-900/30 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>تمام ترتیبات محفوظ کریں</span>
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 5: WORDPRESS MIGRATION ENGINE */}
          {/* ========================================================= */}
          {adminTab === 'migration' && (
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="bg-blue-950/60 border border-blue-800 p-6 rounded-3xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-lg font-simple">
                  <Database className="w-6 h-6 text-blue-400" />
                  <span>ورڈپریس ٹو کسٹم ڈیٹا امپورٹ انجن (WordPress Migration)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  ورڈپریس ڈیٹا بیس کی تمام 300 سے 400 پوسٹس، تصاویر اور Doctreat تھیم سے ڈاکٹرز کا ڈیٹا 100% تحفظ اور پرانے یو آر ایل اسلگز (URL Slugs) کے ساتھ منتقل کرنے کے لیے یہ ٹول ڈیزائن کیا گیا ہے۔
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-sm font-simple">1. ورڈپریس SQL فائل</h4>
                  <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center space-y-2 cursor-pointer transition-colors">
                    <UploadCloud className="w-8 h-8 text-blue-400 mx-auto" />
                    <p className="text-xs text-slate-300 font-bold font-simple">ورڈپریس کا SQL ڈیٹا بیس یہاں اپلوڈ کریں</p>
                    <span className="text-[10px] text-slate-500 font-sans block">.sql, .sql.gz, .xml فارمیٹس</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-sm font-simple">2. میڈیا مائیگریشن (uploads.zip)</h4>
                  <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center space-y-2 cursor-pointer transition-colors">
                    <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-xs text-slate-300 font-bold font-simple">تمام تصاویر کا زپ فولڈر اپلوڈ کریں</p>
                    <span className="text-[10px] text-slate-500 font-sans block">wp-content/uploads.zip</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD MEDIA (COMPUTER UPLOAD, URL, STOCK LIBRARY) */}
      {/* ========================================================= */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl text-right animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-simple">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">میڈیا مینیجر (Add Media)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Tabs */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-simple">
              <button
                type="button"
                onClick={() => setMediaTab('upload')}
                className={`flex-1 py-2 rounded-xl transition-all font-bold ${mediaTab === 'upload' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                کمپیوٹر سے اپلوڈ کریں
              </button>
              <button
                type="button"
                onClick={() => setMediaTab('url')}
                className={`flex-1 py-2 rounded-xl transition-all font-bold ${mediaTab === 'url' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                ویب لنک (Image URL)
              </button>
              <button
                type="button"
                onClick={() => setMediaTab('library')}
                className={`flex-1 py-2 rounded-xl transition-all font-bold ${mediaTab === 'library' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                طبی و ہربل گیلری لائبریری
              </button>
            </div>

            {/* TAB 1: Local File Upload */}
            {mediaTab === 'upload' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={mediaFileInputRef}
                  onChange={handleModalFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => mediaFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-3xl p-10 text-center space-y-3 cursor-pointer transition-colors bg-slate-950/50"
                >
                  <UploadCloud className="w-10 h-10 text-blue-400 mx-auto" />
                  <p className="text-sm font-bold text-white font-simple">کمپیوٹر سے فائل منتخب کریں</p>
                  <span className="text-xs text-slate-400 block font-sans">JPG, PNG, GIF, WebP (کوئی بھی سائز)</span>
                </div>
              </div>
            )}

            {/* TAB 2: Direct URL */}
            {mediaTab === 'url' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1 font-simple">تصویر کا براہ راست URL:</label>
                  <input
                    type="url"
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
                {mediaUrlInput && (
                  <div className="h-40 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
                    <img src={mediaUrlInput} alt="Preview" className="h-full object-cover" />
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Stock Library */}
            {mediaTab === 'library' && (
              <div className="grid grid-cols-3 gap-3 max-h-56 overflow-y-auto p-1">
                {STOCK_MEDIA.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleInsertMediaFromModal(item.url)}
                    className="group rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500 cursor-pointer bg-slate-950 transition-all space-y-1 p-1.5"
                  >
                    <img src={item.url} alt={item.title} className="w-full h-20 object-cover rounded-xl group-hover:scale-105 transition-transform" />
                    <p className="text-[11px] font-bold text-slate-200 line-clamp-1 font-simple">{item.title}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Common Image Options (Alignment, Caption, Width) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 font-simple text-xs">
              <div>
                <label className="block text-slate-400 mb-1">الائنمنٹ:</label>
                <select
                  value={mediaAlignment}
                  onChange={(e) => setMediaAlignment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                >
                  <option value="center">درمیان (Center)</option>
                  <option value="right">دائیں لپٹا ہوا (Float Right)</option>
                  <option value="left">بائیں لپٹا ہوا (Float Left)</option>
                  <option value="full">مکمل چوڑائی (Full Width)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">چوڑائی سائز:</label>
                <select
                  value={mediaWidth}
                  onChange={(e) => setMediaWidth(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-sans"
                >
                  <option value="100%">100% (بڑا)</option>
                  <option value="75%">75% (درمیانہ)</option>
                  <option value="50%">50% (نصف)</option>
                  <option value="35%">35% (چھوٹا)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">تصویر کا کیپشن (اختیاری):</label>
                <input
                  type="text"
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                  placeholder="تصویر کے نیچے تحریر..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>
            </div>

            {/* Insert Button */}
            {mediaTab === 'url' && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleInsertMediaFromModal()}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors font-simple"
                >
                  مضمون میں تصویر لگائیں
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD FORM (CONSULTATION, ORDER, QUESTION) */}
      {/* ========================================================= */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl text-right animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-simple">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">فارم شامل کریں (Add Form)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-simple">
              <label className="text-xs text-slate-300 font-bold block">مضمون کے اندر کس قسم کا فارم شامل کرنا چاہتے ہیں؟</label>
              
              <div
                onClick={() => setFormType('consultation')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  formType === 'consultation' ? 'bg-blue-950/60 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <h4 className="font-bold text-sm text-blue-300">1. طبیب سے آن لائن مشورہ فارم</h4>
                <p className="text-xs text-slate-400 mt-1">مریض مضمون پڑھنے کے دوران اپنا نام، واٹس ایپ اور علامات درج کر کے رابطہ کر سکے گا۔</p>
              </div>

              <div
                onClick={() => setFormType('order')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  formType === 'order' ? 'bg-emerald-950/60 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <h4 className="font-bold text-sm text-emerald-300">2. ہربل نسخہ / دوا ہوم ڈیلیوری فارم</h4>
                <p className="text-xs text-slate-400 mt-1">مضمون میں بتائے گئے نسخہ کی کیش آن ڈیلیوری آرڈر حاصل کرنے کے لیے فارم بکس۔</p>
              </div>

              <div
                onClick={() => setFormType('question')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  formType === 'question' ? 'bg-purple-950/60 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <h4 className="font-bold text-sm text-purple-300">3. سوال پوچھیں و فیڈ بیک فارم</h4>
                <p className="text-xs text-slate-400 mt-1">مضمون کے متعلق قارئین سے طبی سوالات اور رائے حاصل کرنے کا فارم۔</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800 font-simple">
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                منسوخ
              </button>
              <button
                type="button"
                onClick={handleInsertFormWidget}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                فارم مضمون میں داخل کریں
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: FIND & REPLACE */}
      {/* ========================================================= */}
      {showFindReplaceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-right animate-in zoom-in-95 duration-150 font-simple">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">تلاش اور تبدیلی (Find & Replace)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFindReplaceModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteFindReplace} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">مطلوبہ لفظ (Find):</label>
                <input
                  type="text"
                  required
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="وہ لفظ جو تلاش کرنا ہے..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">نئے لفظ سے تبدیل کریں (Replace with):</label>
                <input
                  type="text"
                  value={replaceTerm}
                  onChange={(e) => setReplaceTerm(e.target.value)}
                  placeholder="نیا متبادل لفظ..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFindReplaceModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  بند کریں
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs"
                >
                  تمام کو تبدیل کریں (Replace All)
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: KEYBOARD SHORTCUTS & HELP */}
      {/* ========================================================= */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-right animate-in zoom-in-95 duration-150 font-simple">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">کی بورڈ شارٹ کٹس (Shortcuts)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-800 font-sans">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300 font-simple">بولڈ (Bold)</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200">Ctrl + B</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300 font-simple">اٹالک (Italic)</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200">Ctrl + I</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300 font-simple">انڈر لائن (Underline)</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200">Ctrl + U</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300 font-simple">واپس (Undo)</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200">Ctrl + Z</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300 font-simple">دوبارہ (Redo)</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200">Ctrl + Y</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300 font-simple">سب منتخب کریں</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200">Ctrl + A</kbd>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
              >
                ٹھیک ہے
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}




