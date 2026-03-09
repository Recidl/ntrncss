import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, Mail, Clock, Phone, AlertCircle, Upload, X, Image as ImageIcon, Maximize2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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

const CONTACT_DRAFT_STORAGE_KEY = "nontronics-contact-draft-v1";

const EMPTY_FORM_DATA = {
  name: "",
  email: "",
  phone: "",
  service: "",
  category: "",
  area: "",
  budget: "",
  message: "",
};

export default function Contact() {
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
    area: false,
    budget: false,
    message: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Service/category behavior
  const categoryOptions = SERVICE_CATEGORIES[formData.service] || [];
  const requiresBudget = ["modifications", "builds"].includes(formData.service);
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
    setSubmitError("");
    removePhoto();
    sessionStorage.removeItem(CONTACT_DRAFT_STORAGE_KEY);
  };

  useEffect(() => {
    const savedDraftRaw = sessionStorage.getItem(CONTACT_DRAFT_STORAGE_KEY);
    if (!savedDraftRaw) return;

    try {
      const savedDraft = JSON.parse(savedDraftRaw);
      if (savedDraft && typeof savedDraft === "object") {
        setFormData((prev) => ({ ...prev, ...savedDraft }));
      }
    } catch {
      sessionStorage.removeItem(CONTACT_DRAFT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!isFormDirty) {
      sessionStorage.removeItem(CONTACT_DRAFT_STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(CONTACT_DRAFT_STORAGE_KEY, JSON.stringify(formData));
  }, [formData, isFormDirty]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Custom validation
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
        area: false,
        budget: false,
        message: false,
      });
      return;
    }
    
    setSubmitting(true);

    try {
      const response = await fetch("/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          photoBase64: photoBase64,
          photoFileName: uploadedPhoto?.name || null,
          meta: {
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
            referrer: typeof document !== "undefined" ? document.referrer : "",
          },
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send message.");
      }

      setSubmitted(true);
      sessionStorage.removeItem(CONTACT_DRAFT_STORAGE_KEY);
    } catch (error) {
      // Error already communicated to user via setSubmitError
      setSubmitError(
        "There was a problem sending your message. Please try again in a moment or email us directly at Nontronics@gmail.com."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: "EMAIL", value: "Nontronics@gmail.com" },
    { icon: Phone, label: "PHONE", value: "(331) 274-5836" },
    { icon: MapPin, label: "LOCATION", value: "Aurora, Illinois, United States (60505)" },
    { icon: Clock, label: "HOURS", value: "Mon — Sat, 10am — 7pm" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 px-5 md:px-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&q=80"
            alt="Contact us"
            className="w-full h-full object-cover opacity-50 dark:opacity-[0.30]"
          />
          <div className="absolute inset-0" style={{ background: "var(--bg-overlay)" }} />
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
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight text-foreground"
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
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                          budget: ["modifications", "builds"].includes(v) ? formData.budget : "",
                        });
                        if (errors.service) setErrors({...errors, service: null});
                        if (errors.category) setErrors({...errors, category: null});
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
                          setFormData({...formData, category: v});
                          if (errors.category) setErrors({...errors, category: null});
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
                        placeholder="$500 or $500-650"
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

                  {submitError && (
                    <p className="text-red-500 text-xs font-light">
                      {submitError}
                    </p>
                  )}

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

                  <div className="pt-1 text-right">
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
          <AnimatePresence>
            {expandedPhoto && photoBase64 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setExpandedPhoto(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
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
          </AnimatePresence>

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