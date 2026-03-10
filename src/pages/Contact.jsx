import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, Mail, Clock, Phone, AlertCircle, Upload, X, Image as ImageIcon, Maximize2, ChevronDown, FileText, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createPageUrl } from "@/utils";
import { notifySite } from "@/lib/notify";
import { secureFetch } from "@/lib/http";
import GlassCard from "../components/nontronics/GlassCard";

// US States list
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const SERVICE_GROUPS = [
  { value: "general_inquiry", label: "General Inquiry / Question" },
  { value: "repairs", label: "Repairs" },
  { value: "modifications", label: "Modifications" },
  { value: "builds", label: "Builds" },
];

const SERVICE_CATEGORIES = {
  repairs: [
    { value: "general_damage", label: "General Damage" },
    { value: "screen_replacement", label: "Screen Replacement" },
    { value: "battery_service", label: "Battery Service" },
    { value: "controller_repair", label: "Controller Repair" },
    { value: "firmware_recovery_repair", label: "Firmware Recovery & Repair" },
    { value: "diagnostics_troubleshooting", label: "Diagnostics & Troubleshooting" },
  ],
  modifications: [
    { value: "pc_modifications", label: "PC Modifications" },
    { value: "controller_modifications", label: "Controller Modifications" },
    { value: "console_modifications", label: "Console Modifications" },
    { value: "custom_shells_aesthetics", label: "Custom Shells & Aesthetics" },
    { value: "led_modifications", label: "LED Modifications" },
  ],
  builds: [
    { value: "gaming_pc_builds", label: "Gaming PC Builds" },
    { value: "workstation_builds", label: "Workstation Builds" },
    { value: "compact_itx_builds", label: "Compact & ITX Builds" },
  ],
  general_inquiry: [
    { value: "general_question", label: "General Question" },
    { value: "quote_question", label: "Quote / Pricing Question" },
    { value: "order_or_status_question", label: "Order or Status Question" },
    { value: "business_or_partnership", label: "Business / Partnership Inquiry" },
    { value: "other_non_service", label: "Other (Non-Service)" },
  ],
};

const REPAIR_DEVICE_OPTIONS = [
  { value: "phone", label: "Phone" },
  { value: "tablet", label: "Tablet" },
  { value: "laptop", label: "Laptop" },
  { value: "desktop_pc", label: "Desktop PC" },
  { value: "tv", label: "TV" },
  { value: "monitor", label: "Monitor" },
  { value: "smartwatch", label: "Smartwatch" },
  { value: "console", label: "Console" },
  { value: "controller", label: "Controller" },
  { value: "handheld", label: "Handheld" },
  { value: "audio_device", label: "Audio Device" },
  { value: "other", label: "Other" },
];

const REPAIR_BRAND_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "samsung", label: "Samsung" },
  { value: "google", label: "Google" },
  { value: "sony", label: "Sony" },
  { value: "lg", label: "LG" },
  { value: "microsoft", label: "Microsoft" },
  { value: "nintendo", label: "Nintendo" },
  { value: "valve", label: "Valve" },
  { value: "asus", label: "ASUS" },
  { value: "acer", label: "Acer" },
  { value: "dell", label: "Dell" },
  { value: "hp", label: "HP" },
  { value: "lenovo", label: "Lenovo" },
  { value: "msi", label: "MSI" },
  { value: "razer", label: "Razer" },
  { value: "other", label: "Other" },
];

const CONSOLE_BRAND_OPTIONS = [
  { value: "sony", label: "Sony / PlayStation" },
  { value: "microsoft", label: "Microsoft / Xbox" },
  { value: "nintendo", label: "Nintendo" },
  { value: "valve", label: "Valve / Steam" },
  { value: "other", label: "Other Console Brand" },
];

const BUILD_PERFORMANCE_OPTIONS = [
  { value: "budget_low_end", label: "Budget / Low End" },
  { value: "entry_mid_range", label: "Entry Mid-Range" },
  { value: "mid_range", label: "Mid-Range" },
  { value: "high_end", label: "High End" },
  { value: "enthusiast", label: "Enthusiast" },
  { value: "ultra_high_end", label: "Ultra High End" },
];

const CONTACT_DRAFT_COOKIE_KEY = "nontronics_contact_draft_v1";
const CONTACT_DRAFT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const CONTACT_PROGRESS_STORAGE_KEY = "nontronics_contact_progress_v1";
const MAX_DRAFT_COUNT = 8;
const MAX_DRAFT_COOKIE_SIZE = 3500;
const MESSAGE_WORD_TARGET = 100;

const EMPTY_FORM_DATA = {
  name: "",
  email: "",
  phone: "",
  service: "",
  category: "",
  device: "",
  brand: "",
  performance: "",
  area: "",
  budget: "",
  message: "",
};

const EMPTY_LEGAL_AGREEMENTS = {
  shipping: false,
  repair: false,
};

const readCookie = (name) => {
  if (typeof document === "undefined") return "";
  const encoded = encodeURIComponent(name);
  const cookieParts = document.cookie ? document.cookie.split("; ") : [];
  const found = cookieParts.find((entry) => entry.startsWith(`${encoded}=`));
  return found ? found.split("=").slice(1).join("=") : "";
};

const writeCookie = (name, value, maxAgeSeconds) => {
  if (typeof document === "undefined") return;
  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value);
  const secureFlag = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodedName}=${encodedValue}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secureFlag}`;
};

const deleteCookie = (name) => {
  if (typeof document === "undefined") return;
  const encodedName = encodeURIComponent(name);
  const secureFlag = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodedName}=; path=/; max-age=0; SameSite=Lax${secureFlag}`;
};

const parseDraftCookie = (rawCookieValue) => {
  if (!rawCookieValue) return [];

  try {
    const parsed = JSON.parse(decodeURIComponent(rawCookieValue));

    if (Array.isArray(parsed)) {
      return parsed.filter((draft) => draft?.id && draft?.formData && typeof draft.formData === "object");
    }

    // Backward compatibility for old single-draft format.
    if (parsed && typeof parsed === "object") {
      return [
        {
          id: `legacy-${Date.now()}`,
          savedAt: new Date().toISOString(),
          formData: parsed,
        },
      ];
    }
  } catch {
    return [];
  }

  return [];
};

const formatDraftStamp = (savedAt) => {
  if (!savedAt) return "Saved recently";
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return "Saved recently";

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const buildDraftLabel = (data) => {
  const serviceLabel =
    SERVICE_GROUPS.find((item) => item.value === data.service)?.label ||
    (data.service ? data.service.replace(/_/g, " ") : "");

  const categoryLabel =
    (SERVICE_CATEGORIES[data.service] || []).find((item) => item.value === data.category)?.label ||
    (data.category ? data.category.replace(/_/g, " ") : "");

  if (serviceLabel && categoryLabel) return `${serviceLabel} - ${categoryLabel}`;
  if (serviceLabel) return serviceLabel;
  if (categoryLabel) return categoryLabel;
  return "Untitled Draft";
};

const formatPhoneNumber = (value) => {
  const digitsOnly = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (!digitsOnly) return "";

  if (digitsOnly.length <= 3) {
    return `(${digitsOnly}`;
  }

  if (digitsOnly.length <= 6) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  }

  return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
};

const loadStoredProgress = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(CONTACT_PROGRESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
};

const clearStoredProgress = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(CONTACT_PROGRESS_STORAGE_KEY);
};

export default function Contact() {
  const location = useLocation();
  const navigate = useNavigate();
  const lastPrefillRef = useRef("");
  const configuratorRef = useRef(null);
  const formStartedAtRef = useRef(Math.floor(Date.now() / 1000));
  const honeypotRef = useRef("");

  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [expandedPhoto, setExpandedPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    phone: null,
    service: null,
    category: null,
    device: null,
    brand: null,
    performance: null,
    area: null,
    budget: null,
    message: null,
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    service: false,
    category: false,
    device: false,
    brand: false,
    performance: false,
    area: false,
    budget: false,
    message: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmSendNotice, setConfirmSendNotice] = useState("");
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [legalAgreements, setLegalAgreements] = useState(EMPTY_LEGAL_AGREEMENTS);
  const [agreementError, setAgreementError] = useState("");
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [isConfiguratorHighlighted, setIsConfiguratorHighlighted] = useState(false);
  const didRestoreProgressRef = useRef(false);

  // Service/category behavior
  const categoryOptions = SERVICE_CATEGORIES[formData.service] || [];
  const requiresBudget = ["modifications", "builds"].includes(formData.service);
  const showRepairDeviceDropdown = formData.service === "repairs";
  const showModificationBrandDropdown =
    formData.service === "modifications" &&
    ["console_modifications", "controller_modifications"].includes(formData.category);
  const showBrandDropdown = showRepairDeviceDropdown || showModificationBrandDropdown;
  const showBuildPerformanceDropdown = formData.service === "builds";
  const brandOptions = showRepairDeviceDropdown ? REPAIR_BRAND_OPTIONS : CONSOLE_BRAND_OPTIONS;
  const selectedServiceLabel = SERVICE_GROUPS.find((item) => item.value === formData.service)?.label || "";
  const selectedCategoryLabel =
    (SERVICE_CATEGORIES[formData.service] || []).find((item) => item.value === formData.category)?.label || "";

  const messageWordCount = useMemo(() => {
    const words = formData.message.trim().match(/\S+/g);
    return words ? words.length : 0;
  }, [formData.message]);

  const quoteReadiness = useMemo(() => {
    const score = Math.min(100, Math.round((messageWordCount / MESSAGE_WORD_TARGET) * 100));
    const wordsRemaining = Math.max(0, MESSAGE_WORD_TARGET - messageWordCount);
    const tone = messageWordCount >= MESSAGE_WORD_TARGET
      ? "Optimal"
      : messageWordCount >= 60
        ? "Good"
        : "Needs More Detail";
    return {
      score,
      wordsRemaining,
      tone,
      optimal: messageWordCount >= MESSAGE_WORD_TARGET,
    };
  }, [messageWordCount]);

  const isFormDirty = useMemo(() => {
    const hasTextData = Object.values(formData).some((value) => String(value || "").trim() !== "");
    return hasTextData || !!uploadedPhoto || !!photoBase64;
  }, [formData, uploadedPhoto, photoBase64]);

  // Allowed image formats
  const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  // Photo upload handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
      setPhotoError(`Invalid file format. Only JPEG, PNG, and WebP images are allowed.`);
      setUploadedPhoto(null);
      setPhotoBase64(null);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("File is too large. Maximum size is 10MB.");
      setUploadedPhoto(null);
      setPhotoBase64(null);
      return;
    }

    setPhotoError("");
    setIsUploading(true);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((p) => (p >= 90 ? 90 : p + Math.random() * 30));
    }, 200);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      const base64 = event.target?.result;
      setPhotoBase64(base64);
      setUploadedPhoto({
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 800);
    };
    reader.onerror = () => {
      clearInterval(progressInterval);
      setPhotoError("Failed to upload photo. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setUploadedPhoto(null);
    setPhotoBase64(null);
    setUploadProgress(0);
    setPhotoError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearFormState = () => {
    setFormData(EMPTY_FORM_DATA);
    setErrors({});
    setTouched({});
    setConfirmSendNotice("");
    setAgreementError("");
    setLegalAgreements(EMPTY_LEGAL_AGREEMENTS);
    setShowSendConfirm(false);
    setActiveDraftId(null);
    formStartedAtRef.current = Math.floor(Date.now() / 1000);
    honeypotRef.current = "";
    removePhoto();
  };

  const persistDrafts = (drafts) => {
    if (!Array.isArray(drafts) || drafts.length === 0) {
      deleteCookie(CONTACT_DRAFT_COOKIE_KEY);
      return true;
    }

    const serialized = JSON.stringify(drafts);
    if (serialized.length > MAX_DRAFT_COOKIE_SIZE) {
      return false;
    }

    writeCookie(CONTACT_DRAFT_COOKIE_KEY, serialized, CONTACT_DRAFT_COOKIE_MAX_AGE);
    return true;
  };

  useEffect(() => {
    const savedDraftRaw = readCookie(CONTACT_DRAFT_COOKIE_KEY);
    if (!savedDraftRaw) return;

    const parsedDrafts = parseDraftCookie(savedDraftRaw);
    if (!parsedDrafts.length) {
      deleteCookie(CONTACT_DRAFT_COOKIE_KEY);
      return;
    }

    setSavedDrafts(parsedDrafts);
  }, []);

  useEffect(() => {
    if (didRestoreProgressRef.current) return;

    const savedProgress = loadStoredProgress();
    didRestoreProgressRef.current = true;
    if (!savedProgress) return;

    if (savedProgress.formData && typeof savedProgress.formData === "object") {
      setFormData((prev) => ({
        ...prev,
        ...savedProgress.formData,
      }));
    }

    if (savedProgress.legalAgreements && typeof savedProgress.legalAgreements === "object") {
      setLegalAgreements((prev) => ({
        ...prev,
        ...savedProgress.legalAgreements,
      }));
    }

    if (typeof savedProgress.activeDraftId === "string" || savedProgress.activeDraftId === null) {
      setActiveDraftId(savedProgress.activeDraftId);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceValue = params.get("service");
    const categoryValue = params.get("category");
    const fromServiceCard = params.get("from") === "service-card";

    if (!serviceValue || !categoryValue) {
      return;
    }

    const selectedService = SERVICE_GROUPS.find((item) => item.value === serviceValue);
    const selectedCategory = (SERVICE_CATEGORIES[serviceValue] || []).find((item) => item.value === categoryValue);

    if (!selectedService || !selectedCategory) {
      return;
    }

    const selectionKey = `${serviceValue}:${categoryValue}`;
    if (lastPrefillRef.current === selectionKey) {
      return;
    }

    lastPrefillRef.current = selectionKey;

    setFormData((prev) => ({
      ...prev,
      service: serviceValue,
      category: categoryValue,
      device: "",
      brand: "",
      performance: "",
      budget: ["modifications", "builds"].includes(serviceValue) ? prev.budget : "",
    }));

    setErrors((prev) => ({
      ...prev,
      service: null,
      category: null,
      device: null,
      brand: null,
      performance: null,
    }));

    if (fromServiceCard) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsConfiguratorHighlighted(true);
        });
      });
    }

    notifySite({
      title: "Service Selected",
      message: `Selected ${selectedCategory.label} for ${selectedService.label}. Write your request!`,
      variant: "success",
      duration: 4600,
    });

    navigate(createPageUrl("Contact"), { replace: true });
  }, [location.search, navigate]);

  useEffect(() => {
    if (!isConfiguratorHighlighted) {
      return;
    }

    const target = configuratorRef.current;
    if (target) {
      const targetRect = target.getBoundingClientRect();
      const targetTop = window.scrollY + targetRect.top;
      const centeredTop = Math.max(0, targetTop - (window.innerHeight / 2) + (targetRect.height / 2));

      window.scrollTo({
        top: centeredTop,
        behavior: "smooth",
      });
    }

    const timeoutId = window.setTimeout(() => {
      setIsConfiguratorHighlighted(false);
    }, 2400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isConfiguratorHighlighted]);

  useEffect(() => {
    if (!isFormDirty || submitted) {
      return;
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormDirty, submitted]);

  useEffect(() => {
    if (submitted) {
      clearStoredProgress();
      return;
    }

    if (typeof window === "undefined") return;

    const payload = {
      formData,
      legalAgreements,
      activeDraftId,
      savedAt: new Date().toISOString(),
    };

    try {
      window.sessionStorage.setItem(CONTACT_PROGRESS_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota and privacy mode failures.
    }
  }, [formData, legalAgreements, activeDraftId, submitted]);

  const formatBudget = (value) => {
    if (!value || value.trim() === '') return '';
    
    // Remove all $ symbols first to avoid duplication
    let cleaned = value.replace(/\$/g, '').trim();
    
    if (!cleaned) return '';
    
    // Check if it's a range (contains -)
    if (cleaned.includes('-')) {
      const parts = cleaned.split('-').map(p => p.trim()).filter(p => p);
      if (parts.length === 2) {
        // Format both parts with $
        return `$${parts[0]}-$${parts[1]}`;
      } else if (parts.length === 1 && cleaned.endsWith('-')) {
        // User is typing a range, format first part
        return `$${parts[0]}-`;
      }
    }
    
    // Single value - add $ if not already there
    return `$${cleaned}`;
  };

  const handleBudgetChange = (e) => {
    let value = e.target.value;
    
    // If user is deleting, allow it
    if (value === '') {
      setFormData({...formData, budget: ''});
      if (errors.budget) {
        setErrors({...errors, budget: null});
      }
      return;
    }
    
    // Remove $ symbols for validation
    let cleaned = value.replace(/\$/g, '');
    
    // Allow numbers, commas, periods, spaces, and dash for ranges
    const validPattern = /^[\d.,\s-]*$/;
    
    if (validPattern.test(cleaned)) {
      // Auto-format with $ symbol
      const formatted = formatBudget(cleaned);
      setFormData({...formData, budget: formatted});
      
      // Clear error when user starts typing
      if (errors.budget) {
        setErrors({...errors, budget: null});
      }
    } else {
      // Show warning for invalid characters
      setErrors({...errors, budget: "Only numbers, currency symbols ($), commas, periods, and dash (-) for ranges are allowed"});
    }
  };

  const handleBudgetBlur = (e) => {
    // Final format on blur to ensure proper formatting
    const value = e.target.value;
    if (value) {
      const formatted = formatBudget(value.replace(/\$/g, ''));
      setFormData({...formData, budget: formatted});
    }
  };

  const handleFieldFocus = (fieldName) => {
    setTouched({...touched, [fieldName]: true});
    // Clear error when user focuses on field
    if (errors[fieldName]) {
      setErrors({...errors, [fieldName]: null});
    }
  };

  const handlePhoneChange = (event) => {
    const formatted = formatPhoneNumber(event.target.value);
    setFormData({ ...formData, phone: formatted });
    if (errors.phone) {
      setErrors({ ...errors, phone: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check required fields
    if (!formData.name.trim()) {
      newErrors.name = true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = true;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.service) {
      newErrors.service = true;
    }
    if (!formData.category) {
      newErrors.category = true;
    }
    if (showRepairDeviceDropdown && !formData.device) {
      newErrors.device = true;
    }
    if (showBrandDropdown && !formData.brand) {
      newErrors.brand = true;
    }
    if (showBuildPerformanceDropdown && !formData.performance) {
      newErrors.performance = true;
    }
    if (requiresBudget && !formData.budget.trim()) {
      newErrors.budget = true;
    }
    if (!formData.message.trim()) {
      newErrors.message = true;
    }
    if (!formData.area) {
      newErrors.area = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({
        name: newErrors.name || null,
        email: newErrors.email || null,
        phone: newErrors.phone || null,
        service: newErrors.service || null,
        category: newErrors.category || null,
        device: newErrors.device || null,
        brand: newErrors.brand || null,
        performance: newErrors.performance || null,
        area: newErrors.area || null,
        budget: newErrors.budget || null,
        message: newErrors.message || null,
      });
      setTouched({
        name: false,
        email: false,
        phone: false,
        service: false,
        category: false,
        device: false,
        brand: false,
        performance: false,
        area: false,
        budget: false,
        message: false,
      });
      return false;
    }

    return true;
  };

  const sendContactRequest = async () => {
    setSubmitting(true);
    setConfirmSendNotice("");
    
    try {
      const { response, data } = await secureFetch("/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        timeoutMs: 12000,
        retries: 1,
        body: JSON.stringify({
          ...formData,
          website: honeypotRef.current,
          formStartedAt: formStartedAtRef.current,
          photoBase64: photoBase64,
          photoFileName: uploadedPhoto?.name || null,
          meta: {
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
            referrer: typeof document !== "undefined" ? document.referrer : "",
          },
        }),
      });

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send message.");
      }

      setSubmitted(true);
      setShowSendConfirm(false);
      setAgreementError("");
      setConfirmSendNotice("");
      setLegalAgreements(EMPTY_LEGAL_AGREEMENTS);
      notifySite({
        title: "Message Sent",
        message: "Your request was submitted successfully.",
        variant: "success",
      });
    } catch {
      setConfirmSendNotice(
        "Notice: Your message could not be sent right now. Please try again in a moment, or contact us directly at Nontronics@gmail.com."
      );
      notifySite({
        title: "Send Failed",
        message: "Message could not be sent. Please retry.",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    if (!isFormDirty) {
      notifySite({
        title: "Nothing To Save",
        message: "Fill at least one field before saving a draft.",
        variant: "warning",
      });
      return;
    }

    const draftPayload = {
      ...formData,
    };

    const nextDraft = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      savedAt: new Date().toISOString(),
      formData: draftPayload,
    };

    let nextDrafts = [nextDraft, ...savedDrafts].slice(0, MAX_DRAFT_COUNT);

    while (nextDrafts.length > 0 && JSON.stringify(nextDrafts).length > MAX_DRAFT_COOKIE_SIZE) {
      nextDrafts = nextDrafts.slice(0, -1);
    }

    if (!nextDrafts.length || !persistDrafts(nextDrafts)) {
      notifySite({
        title: "Draft Too Large",
        message: "Shorten your message to save drafts in cookies.",
        variant: "error",
      });
      return;
    }

    setSavedDrafts(nextDrafts);
    setActiveDraftId(nextDraft.id);
    notifySite({
      title: "Draft Saved",
      message: "Saved in browser cookies. Clearing cookies removes this draft.",
      variant: "info",
    });
  };

  const handleLoadDraft = (draftId) => {
    const selectedDraft = savedDrafts.find((draft) => draft.id === draftId);
    if (!selectedDraft) return;

    const hasUnsavedCurrentChanges = isFormDirty && activeDraftId !== draftId;
    if (hasUnsavedCurrentChanges) {
      const confirmed = window.confirm(
        "Load this draft and replace your current unsaved form details?"
      );
      if (!confirmed) return;
    }

    setFormData({ ...EMPTY_FORM_DATA, ...selectedDraft.formData });
    setErrors({});
    setTouched({});
    setSubmitted(false);
    setConfirmSendNotice("");
    setAgreementError("");
    setLegalAgreements(EMPTY_LEGAL_AGREEMENTS);
    setShowSendConfirm(false);
    removePhoto();
    setActiveDraftId(draftId);

    notifySite({
      title: "Draft Loaded",
      message: "Selected draft has been loaded into the form.",
      variant: "success",
    });
  };

  const handleDeleteDraft = (draftId) => {
    const confirmed = window.confirm("Delete this saved draft permanently?");
    if (!confirmed) return;

    const nextDrafts = savedDrafts.filter((draft) => draft.id !== draftId);

    if (!persistDrafts(nextDrafts)) {
      notifySite({
        title: "Delete Failed",
        message: "Could not update saved drafts. Please retry.",
        variant: "error",
      });
      return;
    }

    setSavedDrafts(nextDrafts);
    if (activeDraftId === draftId) {
      setActiveDraftId(null);
    }

    notifySite({
      title: "Draft Deleted",
      message: "The selected draft was removed.",
      variant: "warning",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmSendNotice("");

    if (!validateForm()) {
      return;
    }

    setAgreementError("");
    setConfirmSendNotice("");
    setShowSendConfirm(true);
  };

  const handleAgreementToggle = (key) => {
    setLegalAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
    setAgreementError("");
    setConfirmSendNotice("");
  };

  const handleConfirmSend = async () => {
    const allAccepted = Object.values(legalAgreements).every(Boolean);
    if (!allAccepted) {
      setAgreementError("You must accept the Shipping Policy and Repair / Service Terms before sending your request.");
      return;
    }

    await sendContactRequest();
  };

  const contactInfo = [
    { icon: Mail, label: "EMAIL", value: "Nontronics@gmail.com" },
    { icon: Phone, label: "PHONE", value: "(331) 274-5836" },
    { icon: MapPin, label: "LOCATION", value: "Aurora, Illinois, United States (60505)" },
    { icon: Clock, label: "HOURS", value: "Mon — Sat, 10am — 7pm" },
  ];

  return (
    <div>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showSendConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-background/70 dark:bg-black/70 backdrop-blur-md grid place-items-center p-4"
              onClick={() => {
                if (submitting) return;
                setShowSendConfirm(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel-strong border border-border p-6 md:p-10"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (submitting) return;
                    setShowSendConfirm(false);
                  }}
                  className="absolute top-4 right-4 w-9 h-9 border border-border bg-background/80 hover:bg-background transition-colors flex items-center justify-center"
                  aria-label="Close confirmation dialog"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>

                <h3 className="font-display text-2xl md:text-3xl tracking-wide text-foreground">CONFIRM & SEND REQUEST</h3>
                <p className="mt-3 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                  Please review and confirm that you agree to the legal documents below before submitting your request.
                </p>

                <div className="mt-6 border border-border bg-background/45 p-4 md:p-6">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Quote Readiness</span>
                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                      {quoteReadiness.score}% {quoteReadiness.tone}
                    </span>
                  </div>
                  <div className="h-2 bg-background/70 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${quoteReadiness.score}%` }}
                      transition={{ duration: 0.35 }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground font-light">
                    Strong recommendation: include at least {MESSAGE_WORD_TARGET} words in your message so we can quote without requesting more details.
                  </p>
                  {!quoteReadiness.optimal && (
                    <div className="mt-3 flex items-start gap-2 border border-amber-400/30 bg-amber-500/10 px-3 py-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-300 font-light leading-relaxed">
                        You can still send now, but adding about {quoteReadiness.wordsRemaining} more words will improve quote accuracy.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-4 border border-border bg-background/50 p-4 md:p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={legalAgreements.shipping}
                      onChange={() => handleAgreementToggle("shipping")}
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <span className="text-sm text-foreground/90 leading-relaxed">
                      I agree to the <Link to={createPageUrl("ShippingPolicy")} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Shipping Policy</Link>.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={legalAgreements.repair}
                      onChange={() => handleAgreementToggle("repair")}
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <span className="text-sm text-foreground/90 leading-relaxed">
                      I agree to the <Link to={createPageUrl("RepairServiceTerms")} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Repair / Service Terms</Link>.
                    </span>
                  </label>

                  <p className="text-xs text-muted-foreground font-light">
                    By using this website, you agree to our <Link to={createPageUrl("TermsOfService")} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Terms of Service</Link> and <Link to={createPageUrl("PrivacyPolicy")} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</Link>.
                  </p>
                </div>

                {agreementError && (
                  <p className="mt-4 text-sm text-red-500">{agreementError}</p>
                )}

                {confirmSendNotice && (
                  <p className="mt-3 text-sm text-red-500">{confirmSendNotice}</p>
                )}

                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={() => setShowSendConfirm(false)}
                    disabled={submitting}
                    className="h-11 bg-background text-foreground border border-border hover:bg-secondary"
                  >
                    Exit
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirmSend}
                    disabled={submitting}
                    className="h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? "Sending..." : confirmSendNotice ? "Retry Send" : "Agree and Send"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      {/* Hero */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 px-5 md:px-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&q=80"
            alt="Contact us"
            className="w-full h-full object-cover opacity-50 dark:opacity-[0.30]"
          />
          <div className="absolute inset-0" style={{ background: "var(--bg-overlay)" }} />
          <div className="absolute inset-0 grid-overlay" />
        </div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-primary/8 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary">Get in Touch</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight text-black dark:text-foreground"
          >
            CONTACT <span className="text-primary">US</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-muted-foreground text-sm md:text-base font-light leading-relaxed max-w-lg"
          >
            Have a project in mind? Need a quote? Drop us a message and we'll get back to you.
          </motion.p>
        </div>
      </section>

      {/* divider above form and info section */}
      <div className="flex items-center justify-center my-8">
        <div className="flex-1 h-px bg-border" />
        <span className="px-4 text-xs font-mono tracking-widest text-muted-foreground uppercase">CONTACTS</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Contact Content */}
      <section className="px-5 md:px-12 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative glass-panel-strong p-6 md:p-12"
            >
              {/* small title in corner */}
              <h2 className="absolute top-4 left-4 text-xs font-mono uppercase text-muted-foreground pointer-events-none flex items-center gap-2">
                <span className="inline-block w-1 h-1 bg-muted" />
                Contact Form
              </h2>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div
                    style={{ position: "absolute", left: "-10000px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}
                    aria-hidden="true"
                  >
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypotRef.current}
                      onChange={(event) => {
                        honeypotRef.current = event.target.value;
                      }}
                    />
                  </div>

                  {savedDrafts.length > 0 && (
                    <div className="border border-border bg-background/40 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-primary" />
                        <h3 className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Saved Drafts</h3>
                      </div>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {savedDrafts.map((draft) => (
                          <div
                            key={draft.id}
                            className={`flex items-start gap-2 border px-3 py-2 ${
                              activeDraftId === draft.id
                                ? "border-primary/50 bg-primary/10"
                                : "border-border bg-background/40"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleLoadDraft(draft.id)}
                              className="flex-1 text-left min-w-0"
                            >
                              <p className="font-mono text-[11px] tracking-wide text-foreground truncate">
                                {buildDraftLabel(draft.formData)}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-1">{formatDraftStamp(draft.savedAt)}</p>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDraft(draft.id)}
                              className="mt-0.5 text-muted-foreground hover:text-red-500 transition-colors"
                              aria-label="Delete draft"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(selectedServiceLabel || selectedCategoryLabel) && (
                    <div
                      ref={configuratorRef}
                      className={`border border-primary/35 bg-primary/10 p-4 md:p-5 transition-all duration-500 ${
                        isConfiguratorHighlighted ? "request-configurator-highlight" : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Request Configurator</span>
                        {selectedServiceLabel && (
                          <span className="text-[10px] font-mono uppercase tracking-[0.15em] px-2 py-1 border border-primary/40 bg-background/40 text-foreground">
                            {selectedServiceLabel}
                          </span>
                        )}
                        {selectedCategoryLabel && (
                          <span className="text-[10px] font-mono uppercase tracking-[0.15em] px-2 py-1 border border-primary/40 bg-background/40 text-foreground">
                            {selectedCategoryLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-light">
                        Your selection is locked in. Add details below and we will scope your quote faster.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="name" className={`font-mono text-[10px] tracking-[0.2em] uppercase ${errors.name ? 'text-red-500' : 'text-muted-foreground'}`}>
                          Name
                        </Label>
                        {errors.name && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <Input
                        id="name"
                        aria-label="Full name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({...formData, name: e.target.value});
                          if (errors.name) setErrors({...errors, name: null});
                        }}
                        onFocus={() => handleFieldFocus('name')}
                        placeholder="Your name"
                        className={`bg-background/50 h-12 transition-colors ${
                          errors.name 
                            ? 'border-red-500 focus-visible:ring-red-500' 
                            : 'border-border'
                        }`}
                      />
                      {errors.name && !touched.name && (
                        <p className="text-red-500 text-xs font-light">Field is required to be filled.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="email" className={`font-mono text-[10px] tracking-[0.2em] uppercase ${errors.email ? 'text-red-500' : 'text-muted-foreground'}`}>
                          Email
                        </Label>
                        {errors.email && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <Input
                        id="email"
                        type="email"
                        aria-label="Email address"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({...formData, email: e.target.value});
                          if (errors.email) setErrors({...errors, email: null});
                        }}
                        onFocus={() => handleFieldFocus('email')}
                        placeholder="your@email.com"
                        className={`bg-background/50 h-12 transition-colors ${
                          errors.email 
                            ? 'border-red-500 focus-visible:ring-red-500' 
                            : 'border-border'
                        }`}
                      />
                      {errors.email && !touched.email && (
                        <p className="text-red-500 text-xs font-light">
                          {typeof errors.email === 'string' ? errors.email : 'Field is required to be filled.'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      aria-label="Phone number"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="(000) 000-0000"
                      className="bg-background/50 border-border h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="service" className={`font-mono text-[10px] tracking-[0.2em] uppercase ${errors.service ? 'text-red-500' : 'text-muted-foreground'}`}>
                        Service
                      </Label>
                      {errors.service && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <Select 
                      value={formData.service} 
                      onValueChange={(v) => {
                        setFormData({
                          ...formData, 
                          service: v,
                          category: "",
                          device: "",
                          brand: "",
                          performance: "",
                          budget: ["modifications", "builds"].includes(v) ? formData.budget : "",
                        });
                        if (errors.service) setErrors({...errors, service: null});
                        if (errors.category || errors.device || errors.brand || errors.performance) {
                          setErrors({
                            ...errors,
                            category: null,
                            device: null,
                            brand: null,
                            performance: null,
                          });
                        }
                      }}
                      onOpenChange={(open) => {
                        if (open && errors.service) {
                          setTouched({...touched, service: true});
                          setErrors({...errors, service: null});
                        }
                      }}
                    >
                      <SelectTrigger 
                        id="service"
                        aria-label="Select a service"
                        className={`bg-background/50 h-12 transition-colors ${
                          errors.service 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-border'
                        }`}
                      >
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_GROUPS.map((serviceGroup) => (
                          <SelectItem key={serviceGroup.value} value={serviceGroup.value}>
                            {serviceGroup.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service && !touched.service && (
                      <p className="text-red-500 text-xs font-light">Field is required to be filled.</p>
                    )}
                  </div>

                  {formData.service && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className={`font-mono text-[10px] tracking-[0.2em] uppercase ${errors.category ? 'text-red-500' : 'text-muted-foreground'}`}>
                          Category
                        </Label>
                        {errors.category && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <Select
                        value={formData.category}
                        onValueChange={(v) => {
                          const requiresConsoleBrand =
                            formData.service === "modifications" &&
                            ["console_modifications", "controller_modifications"].includes(v);

                          setFormData({
                            ...formData,
                            category: v,
                            brand: requiresConsoleBrand || formData.service === "repairs" ? formData.brand : "",
                          });
                          if (errors.category) setErrors({...errors, category: null});
                          if (!requiresConsoleBrand && formData.service === "modifications" && errors.brand) {
                            setErrors({ ...errors, brand: null });
                          }
                        }}
                        onOpenChange={(open) => {
                          if (open && errors.category) {
                            setTouched({...touched, category: true});
                            setErrors({...errors, category: null});
                          }
                        }}
                      >
                        <SelectTrigger className={`bg-background/50 h-12 transition-colors ${
                          errors.category
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-border'
                        }`}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && !touched.category && (
                        <p className="text-red-500 text-xs font-light">Field is required to be filled.</p>
                      )}
                      <p className="text-muted-foreground text-xs font-light italic">
                        Choose the closest category; include exact details in the message field.
                      </p>
                    </div>
                  )}

                  {showRepairDeviceDropdown && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className={`font-mono text-[10px] tracking-[0.2em] uppercase ${errors.device ? 'text-red-500' : 'text-muted-foreground'}`}>
                            Device
                          </Label>
                          {errors.device && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <Select
                          value={formData.device}
                          onValueChange={(v) => {
                            setFormData({ ...formData, device: v });
                            if (errors.device) setErrors({ ...errors, device: null });
                          }}
                          onOpenChange={(open) => {
                            if (open && errors.device) {
                              setTouched({ ...touched, device: true });
                              setErrors({ ...errors, device: null });
                            }
                          }}
                        >
                          <SelectTrigger className={`bg-background/50 h-12 transition-colors ${
                            errors.device ? 'border-red-500 focus:ring-red-500' : 'border-border'
                          }`}>
                            <SelectValue placeholder="Select a device" />
                          </SelectTrigger>
                          <SelectContent>
                            {REPAIR_DEVICE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.device && !touched.device && (
                          <p className="text-red-500 text-xs font-light">Field is required to be filled.</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className={`font-mono text-[10px] tracking-[0.2em] uppercase ${errors.brand ? 'text-red-500' : 'text-muted-foreground'}`}>
                            Brand
                          </Label>
                          {errors.brand && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <Select
                          value={formData.brand}
                          onValueChange={(v) => {
                            setFormData({ ...formData, brand: v });
                            if (errors.brand) setErrors({ ...errors, brand: null });
                          }}
                          onOpenChange={(open) => {
                            if (open && errors.brand) {
                              setTouched({ ...touched, brand: true });
                              setErrors({ ...errors, brand: null });
                            }
                          }}
                        >
                          <SelectTrigger className={`bg-background/50 h-12 transition-colors ${
                            errors.brand ? 'border-red-500 focus:ring-red-500' : 'border-border'
                          }`}>
                            <SelectValue placeholder="Select a brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {REPAIR_BRAND_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.brand && !touched.brand && (
                          <p className="text-red-500 text-xs font-light">Field is required to be filled.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {showModificationBrandDropdown && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className={`font-mono text-[10px] tracking-[0.2em] uppercase ${errors.brand ? 'text-red-500' : 'text-muted-foreground'}`}>
                          Brand
                        </Label>
                        {errors.brand && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <Select
                        value={formData.brand}
                        onValueChange={(v) => {
                          setFormData({ ...formData, brand: v });
                          if (errors.brand) setErrors({ ...errors, brand: null });
                        }}
                        onOpenChange={(open) => {
                          if (open && errors.brand) {
                            setTouched({ ...touched, brand: true });
                            setErrors({ ...errors, brand: null });
                          }
                        }}
                      >
                        <SelectTrigger className={`bg-background/50 h-12 transition-colors ${
                          errors.brand ? 'border-red-500 focus:ring-red-500' : 'border-border'
                        }`}>
                          <SelectValue placeholder="Select a console brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brandOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.brand && !touched.brand && (
                        <p className="text-red-500 text-xs font-light">Field is required to be filled.</p>
                      )}
                    </div>
                  )}

                  {showBuildPerformanceDropdown && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className={`font-mono text-[10px] tracking-[0.2em] uppercase ${errors.performance ? 'text-red-500' : 'text-muted-foreground'}`}>
                          Performance
                        </Label>
                        {errors.performance && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <Select
                        value={formData.performance}
                        onValueChange={(v) => {
                          setFormData({ ...formData, performance: v });
                          if (errors.performance) setErrors({ ...errors, performance: null });
                        }}
                        onOpenChange={(open) => {
                          if (open && errors.performance) {
                            setTouched({ ...touched, performance: true });
                            setErrors({ ...errors, performance: null });
                          }
                        }}
                      >
                        <SelectTrigger className={`bg-background/50 h-12 transition-colors ${
                          errors.performance ? 'border-red-500 focus:ring-red-500' : 'border-border'
                        }`}>
                          <SelectValue placeholder="Select performance tier" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUILD_PERFORMANCE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.performance && !touched.performance && (
                        <p className="text-red-500 text-xs font-light">Field is required to be filled.</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className={`font-mono text-[10px] tracking-[0.2em] uppercase ${errors.area ? 'text-red-500' : 'text-muted-foreground'}`}>
                        Area
                      </Label>
                      {errors.area && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <Select 
                      value={formData.area} 
                      onValueChange={(v) => {
                        setFormData({...formData, area: v});
                        if (errors.area) setErrors({...errors, area: null});
                      }}
                      onOpenChange={(open) => {
                        if (open && errors.area) {
                          setTouched({...touched, area: true});
                          setErrors({...errors, area: null});
                        }
                      }}
                    >
                      <SelectTrigger className={`bg-background/50 h-12 transition-colors ${
                        errors.area 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-border'
                      }`}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '_')}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.area && !touched.area && (
                      <p className="text-red-500 text-xs font-light">Field is required to be filled.</p>
                    )}
                    <p className="text-muted-foreground text-xs font-light italic">
                      Full address will be requested upon quote confirmation (not displayed on website)
                    </p>
                  </div>

                  {requiresBudget && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className={`font-mono text-[10px] tracking-[0.2em] uppercase ${errors.budget ? 'text-red-500' : 'text-muted-foreground'}`}>
                          Budget (USD)
                        </Label>
                        {errors.budget && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <Input
                        type="text"
                        value={formData.budget}
                        onChange={handleBudgetChange}
                        onBlur={handleBudgetBlur}
                        onFocus={() => handleFieldFocus('budget')}
                        placeholder="$000 or $000-000"
                        className={`bg-background/50 h-12 transition-colors ${
                          errors.budget 
                            ? 'border-red-500 focus-visible:ring-red-500' 
                            : 'border-border'
                        }`}
                      />
                      {errors.budget && !touched.budget && (
                        <p className="text-red-500 text-xs font-light">
                          {typeof errors.budget === 'string' ? errors.budget : 'Field is required to be filled.'}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className={`font-mono text-[10px] tracking-[0.2em] uppercase ${errors.message ? 'text-red-500' : 'text-muted-foreground'}`}>
                        Message
                      </Label>
                      {errors.message && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <Textarea
                      id="message"
                      aria-label="Your message"
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({...formData, message: e.target.value});
                        if (errors.message) setErrors({...errors, message: null});
                      }}
                      onFocus={() => handleFieldFocus('message')}
                      placeholder="Tell us about your project or issue..."
                      className={`bg-background/50 min-h-32 transition-colors resize-none ${
                        errors.message 
                          ? 'border-red-500 focus-visible:ring-red-500' 
                          : 'border-border'
                      }`}
                    />
                    {errors.message && !touched.message && (
                      <p className="text-red-500 text-xs font-light">Field is required to be filled.</p>
                    )}
                    <div className="flex items-center justify-between text-[11px] font-light">
                      <span className="text-muted-foreground">
                        Recommendation: 100+ words gives us enough context to quote with fewer follow-ups.
                      </span>
                      <span className={`font-mono uppercase tracking-[0.12em] ${messageWordCount >= MESSAGE_WORD_TARGET ? "text-primary" : "text-muted-foreground"}`}>
                        {messageWordCount} words
                      </span>
                    </div>
                  </div>

                  {/* Photo Upload Section */}
                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                      Upload Photo (Optional)
                    </Label>
                    <div className="bg-background/30 border-2 border-dashed border-border p-6 text-center cursor-pointer hover:bg-background/50 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        aria-label="Upload photo"
                        id="photo-upload"
                      />
                      {!uploadedPhoto ? (
                        <label htmlFor="photo-upload" className="cursor-pointer block">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
                              <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-mono text-sm tracking-wider uppercase text-foreground">
                                Click to upload a photo
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPEG, or WebP • Max 10MB
                              </p>
                            </div>
                          </div>
                        </label>
                      ) : (
                        <div className="space-y-3">
                          {isUploading ? (
                            <div className="space-y-2">
                              <div className="w-full h-2 bg-background/50 overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Uploading... {Math.round(uploadProgress)}%
                              </p>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start gap-3 justify-center">
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                                  <ImageIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-left">
                                  <p className="font-mono text-sm tracking-wider uppercase text-foreground">
                                    {uploadedPhoto.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {(uploadedPhoto.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                              {photoBase64 && (
                                <div className="relative group">
                                  <img
                                    src={photoBase64}
                                    alt="Photo preview"
                                    className="w-full h-32 object-cover border border-border cursor-pointer transition-all duration-200 group-hover:brightness-75"
                                    onClick={() => setExpandedPhoto(true)}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center pointer-events-none">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-1">
                                      <Maximize2 className="w-5 h-5 text-white" />
                                      <span className="text-white text-xs font-mono tracking-wide">Expand Image</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={removePhoto}
                                className="flex items-center justify-center gap-2 w-full text-red-500 hover:text-red-600 font-mono text-xs uppercase tracking-wide transition-colors py-2"
                              >
                                <X className="w-4 h-4" />
                                Remove Photo
                              </button>
                            </>
                          )}
                        </div>
                      )}
                      {photoError && (
                        <p className="text-red-500 text-xs font-light mt-2">
                          {photoError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground font-mono tracking-wider">SUBMIT</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting || isUploading}
                    className="w-full h-12 bg-primary text-primary-foreground font-mono text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="text-[11px] font-light text-muted-foreground transition-colors hover:text-primary"
                    >
                      Save as draft
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isFormDirty) return;
                        const confirmed = window.confirm(
                          "Clear this form? Any unsent details will be removed."
                        );
                        if (confirmed) {
                          clearFormState();
                        }
                      }}
                      className="text-[11px] font-light text-muted-foreground transition-colors hover:text-red-500"
                    >
                      Clear form
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Send className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-3xl tracking-wide text-foreground mb-3">MESSAGE SENT</h3>
                  <p className="text-muted-foreground text-sm font-light max-w-sm mx-auto">
                    Thank you for reaching out to Nontronics Group. We&apos;ve emailed you a copy of your request, and we will personally reply soon to begin discussing your quote.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      clearFormState();
                    }}
                    className="mt-8 font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground border-b border-border pb-1 hover:text-foreground hover:border-foreground transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Expanded Image Modal */}
          {typeof document !== "undefined" && createPortal(
            <AnimatePresence>
              {expandedPhoto && photoBase64 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setExpandedPhoto(false)}
                  className="fixed inset-0 z-[115] bg-background/60 dark:bg-black/60 backdrop-blur-sm grid place-items-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative max-w-2xl max-h-[80vh] bg-background overflow-hidden shadow-2xl border border-border"
                  >
                    <button
                      onClick={() => setExpandedPhoto(false)}
                      className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 hover:bg-background flex items-center justify-center transition-colors border border-border"
                      aria-label="Close image"
                    >
                      <ChevronDown className="w-5 h-5 text-foreground transform rotate-90" />
                    </button>
                    <img
                      src={photoBase64}
                      alt="Expanded photo preview"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}

          {/* Info Cards */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info, i) => (
              <GlassCard key={info.label} hover={false}>
                {info.label === "LOCATION" ? (
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                        <info.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{info.label}</span>
                        <p className="text-foreground text-sm font-light mt-1">{info.value}</p>
                      </div>
                    </div>
                    <div className="w-full h-64 overflow-hidden border border-border">
                      <iframe
                        src="https://www.google.com/maps?q=Aurora,Illinois&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Aurora, Illinois Location"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                      <info.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{info.label}</span>
                      <p className="text-foreground text-sm font-light mt-1">{info.value}</p>
                    </div>
                  </div>
                )}
              </GlassCard>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-8 mt-4"
            >
              <h3 className="font-display text-xl tracking-wide text-foreground mb-3">MAIL-IN SERVICE</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                Can't come in person? We accept mail-in devices for repairs and modifications. Ship your device to us and we'll handle the rest — return shipping included.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}