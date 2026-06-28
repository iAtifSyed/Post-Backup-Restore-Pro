import React, { useState, useEffect, useRef } from "react";
import { 
  Database, DownloadCloud, UploadCloud, Search, Filter, RefreshCw, 
  Settings as SettingsIcon, Terminal, User, BookOpen, Heart, CheckCircle2, 
  AlertTriangle, Info, ChevronRight, ChevronDown, Folder, FileCode, 
  ExternalLink, Layers, Sparkles, Key, ClipboardList, Clock, ShieldCheck, Trash, X, Compass,
  LayoutGrid, List, Check, ArrowUp, ArrowDown, Star, Play, History, FileText, Image
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WPPost, PluginFileNode, PluginSettings, SystemLog, BackupHistoryEntry } from "../types";

export default function WordPressAdmin() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Navigation tabs
  const [activeMenu, setActiveMenu] = useState<string>("pbrp-dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Core state for emulator
  const [posts, setPosts] = useState<WPPost[]>([
    {
      ID: 1,
      Title: "A Guide to High-Performance WordPress Database Querying",
      Slug: "high-performance-wordpress-database-querying",
      URL: "http://example.com/high-performance-wordpress-database-querying",
      "Published Date": "2026-06-15 11:24:00",
      "Modified Date": "2026-06-20 15:30:12",
      Author: "Atif Syed",
      Categories: ["Development", "Database"],
      Tags: ["Query Optimization", "MySQL", "PHP 8.0"],
      "SEO Title": "Optimize WP Queries - Database Performance Tips",
      "Meta Description": "Deep dive into WP_Query optimization, index utilization, and caching strategies to scale up database responses.",
      "Focus Keyword": "wp query performance",
      "Featured Image": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
      "Gallery Images": [],
      Content: "When scaling WordPress sites, the database query performance is almost always the bottleneck. This technical guide breaks down how to index custom tables, minimize wp_options bloat, and write clean, safe custom queries.",
      Excerpt: "Learn how to optimize your WP database structures, utilize transients, and streamline complex SQL commands.",
      "Word Count": 450,
      "Reading Time": "3 min",
      "Custom Fields": { db_engine: "InnoDB", wp_version: "6.5" },
      Status: "publish"
    },
    {
      ID: 2,
      Title: "Securing WordPress against File Traversal and XML-RPC Vulnerabilities",
      Slug: "securing-wordpress-file-traversal-xmlrpc",
      URL: "http://example.com/securing-wordpress-file-traversal-xmlrpc",
      "Published Date": "2026-06-22 14:10:00",
      "Modified Date": "2026-06-25 09:12:44",
      Author: "Atif Syed",
      Categories: ["Security", "Server Administration"],
      Tags: ["Hardening", "Zip Slip", "Vulnerability Fix"],
      "SEO Title": "Secure WordPress - Block Directory Traversals",
      "Meta Description": "Learn how to harden WordPress file uploads, secure ZIP extractions against Zip Slip attacks, and block malicious XML requests.",
      "Focus Keyword": "wordpress hardening",
      "Featured Image": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
      "Gallery Images": [],
      Content: "Security is non-negotiable. Developers must employ strict path verification routines when handling dynamic ZIP extractions, block traversal characters, and implement appropriate capabilities gates.",
      Excerpt: "Practical server-level and plugin-level techniques to shield WordPress files against exploits.",
      "Word Count": 310,
      "Reading Time": "2 min",
      "Custom Fields": { security_level: "Enterprise", htaccess_active: "true" },
      Status: "publish"
    },
    {
      ID: 3,
      Title: "WooCommerce Checkout Pipeline: Reducing Friction for Higher Conversions",
      Slug: "woocommerce-checkout-friction-conversions",
      URL: "http://example.com/woocommerce-checkout-friction-conversions",
      "Published Date": "2026-06-24 08:30:00",
      "Modified Date": "2026-06-24 08:30:00",
      Author: "Atif Syed",
      Categories: ["E-Commerce", "Design"],
      Tags: ["WooCommerce", "UX Design", "Conversion Rate"],
      "SEO Title": "Boost WooCommerce Sales - Speed up Checkout",
      "Meta Description": "A comprehensive UX case study outlining field optimization and AJAX-driven checkout enhancements.",
      "Focus Keyword": "woocommerce checkout ux",
      "Featured Image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      "Gallery Images": [],
      Content: "E-Commerce sales are earned during the checkout phase. By implementing progressive address autofill, clean responsive summaries, and omitting unrequested fields, conversions can soar up to 28%.",
      Excerpt: "Optimize checkout pages, reduce field validation delays, and build seamless transaction experiences.",
      "Word Count": 540,
      "Reading Time": "4 min",
      "Custom Fields": { conversion_goal: "28%", plugin_compatible: "WooCommerce v8.2" },
      Status: "publish"
    }
  ]);

  // AI Generation State
  const [aiTopic, setAiTopic] = useState<string>("Artificial Intelligence & Modern Cybersecurity");
  const [aiCount, setAiCount] = useState<number>(3);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiNote, setAiNote] = useState<string>("");

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterAuthor, setFilterAuthor] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Checkboxes list selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Settings state
  const [settings, setSettings] = useState<PluginSettings>({
    zip_compression: 6,
    image_quality: 80,
    max_execution_time: 120,
    chunk_size: 10,
    export_comments: true,
    export_drafts: true,
    export_revisions: false,
    export_attachments: true,
    aes_encryption: false,
    encryption_key: "",
    exclude_extensions: [".mp4", ".zip", ".tar.gz", ".log"],
    exclude_folders: ["wp-content/cache", "wp-content/uploads/tmp"],
    schedule_enabled: false,
    schedule_interval: "weekly",
    schedule_retention_limit: 10
  });

  // Logs state
  const [logs, setLogs] = useState<SystemLog[]>([
    { timestamp: "2026-06-25 15:00:22", type: "info", message: "Post Backup & Restore Pro successfully loaded core variables." },
    { timestamp: "2026-06-25 15:00:23", type: "success", message: "Protected directory verified under wp-content/uploads/pbrp-backups/." }
  ]);

  // Backup history
  const [history, setHistory] = useState<BackupHistoryEntry[]>([
    {
      timestamp: "2026-06-25 15:05:12",
      zip_name: "backup-2026-06-25-1505-wp.zip",
      posts_count: 3,
      images_count: 1,
      size: "1.45 MB",
      duration: "0.82 seconds",
      status: "success"
    }
  ]);

  // Code Explorer state
  const [pluginFiles, setPluginFiles] = useState<PluginFileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<PluginFileNode | null>(null);
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({
    "admin": true,
    "classes": true,
    "includes": true
  });
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);

  // Export progress animation
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportLog, setExportLog] = useState<string>("");
  const [downloadZipBlob, setDownloadZipBlob] = useState<string | null>(null);

  // Import states
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importProgress, setImportProgress] = useState<number>(0);
  const [importLog, setImportLog] = useState<string>("");
  const [importComplete, setImportComplete] = useState<boolean>(false);
  const [importSummary, setImportSummary] = useState<{
    posts: number;
    images: number;
    categories: string[];
    tags: string[];
  } | null>(null);
  const [duplicateStrategy, setDuplicateStrategy] = useState<string>("skip");
  const [restoreStrategy, setRestoreStrategy] = useState<string>("all");
  const [importWarning, setImportWarning] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [simulateZipSlip, setSimulateZipSlip] = useState<boolean>(false);
  const [newExtension, setNewExtension] = useState<string>("");
  const [newFolder, setNewFolder] = useState<string>("");
  
  // New premium UX feature states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [exportViewMode, setExportViewMode] = useState<"list" | "grid">("list");
  const [exportStep, setExportStep] = useState<number>(1);
  const [hoveredPostId, setHoveredPostId] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<string>("Published Date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [savedFilters, setSavedFilters] = useState<{ id: string; name: string; query: string; categories: string[]; author: string; status: string }[]>([
    { id: "1", name: "⭐ Published Development Articles", query: "Database", categories: ["Development"], author: "", status: "publish" },
    { id: "2", name: "⭐ Draft Collection", query: "", categories: [], author: "", status: "draft" }
  ]);
  const [newFilterName, setNewFilterName] = useState<string>("");
  const [wizardOptions, setWizardOptions] = useState({
    featured_image: true,
    embedded_images: true,
    categories: true,
    tags: true,
    comments: true,
    yoast_seo: true,
    rank_math_seo: true,
    acf_fields: true,
    elementor_data: true,
    gutenberg_blocks: true,
    author: true,
    post_date: true,
    slug: true,
    custom_fields: true,
    attachments: true,
    internal_links: true,
    external_links: true,
  });

  const timeoutsRef = useRef<any[]>([]);

  // Toast Notification System
  interface WPToast {
    id: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    duration?: number;
  }
  const [toasts, setToasts] = useState<WPToast[]>([]);

  const showToast = (message: string, type: "info" | "success" | "warning" | "error" = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => {
      // Limit active toasts to 5 to avoid filling the screen
      const current = prev.length >= 5 ? prev.slice(1) : prev;
      return [...current, { id, message, type, duration }];
    });
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  // Load plugin files tree on mount
  useEffect(() => {
    fetchPluginFiles();
  }, []);

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchQuery("");
        setSelectedCategories([]);
        setFilterAuthor("");
        setFilterStatus("");
        addSystemLog("Filters cleared via keyboard shortcut (Esc).", "info");
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        const searchInput = document.getElementById("pbrp-search-input");
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
          addSystemLog("Search input focused via keyboard shortcut (Ctrl + F).", "info");
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && activeMenu === "pbrp-export") {
        e.preventDefault();
        setSelectedIds(posts.map(p => p.ID));
        addSystemLog("All posts selected via keyboard shortcut (Ctrl + A).", "info");
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e" && activeMenu === "pbrp-export") {
        e.preventDefault();
        if (selectedIds.length > 0) {
          setExportStep(3);
          handleExecuteExport();
          addSystemLog("Export packaging started via keyboard shortcut (Ctrl + E).", "success");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMenu, posts, selectedIds]);

  const fetchPluginFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const res = await fetch("/api/get-plugin-files");
      const data = await res.json();
      if (data.success && data.files) {
        setPluginFiles(data.files);
        // Find default file to display
        const findMainFile = (nodes: PluginFileNode[]): PluginFileNode | null => {
          for (const node of nodes) {
            if (node.type === "file" && node.name.endsWith(".php")) {
              return node;
            }
          }
          return null;
        };
        const main = findMainFile(data.files);
        if (main) setSelectedFile(main);
      }
    } catch (err) {
      console.error("Failed to fetch files:", err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleToggleDir = (path: string) => {
    setExpandedDirs(prev => ({ ...prev, [path]: !prev[path] }));
  };

  // Helper log addition
  const addSystemLog = (message: string, type: "info" | "success" | "warning" | "error" = "info", skipToast = false) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    setLogs(prev => [...prev, { timestamp, type, message }]);

    // Catch extraction errors or security warnings coming from the backend logs
    if (type === "error" || message.toLowerCase().includes("security warning") || message.toLowerCase().includes("zip slip") || message.toLowerCase().includes("traversal")) {
      setImportWarning(message);
    }

    if (!skipToast) {
      // Avoid spamming rapid/internal check logs in the UI as toasts
      const isInternalSafetyCheck = 
        message.startsWith("Validation: Verifying") || 
        message.startsWith("Compiling XML, CSV") || 
        message.startsWith("Scanning HTML markup") || 
        message.startsWith("Initializing Pre-Export Safety Check");
      
      const isExpandedDirs = 
        message.includes("directory verified") || 
        message.includes("core variables");

      if (!isInternalSafetyCheck && !isExpandedDirs) {
        showToast(message, type);
      }
    }
  };

  // AI Content Generator triggers
  const handleGenerateAICleaning = async () => {
    setIsGeneratingAI(true);
    setAiNote("");
    addSystemLog(`Contacting Gemini AI server to generate posts on: "${aiTopic}"...`, "info");
    
    try {
      const res = await fetch("/api/generate-mock-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic, count: aiCount })
      });
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(prev => {
          // Add generated posts with fresh IDs
          const maxId = prev.reduce((max, p) => p.ID > max ? p.ID : max, 0);
          const formatted = data.posts.map((p: any, idx: number) => ({
            ...p,
            ID: maxId + idx + 1
          }));
          return [...prev, ...formatted];
        });
        addSystemLog(`Successfully generated and imported ${data.posts.length} WordPress post nodes via Gemini.`, "success");
        if (data.note) {
          setAiNote(data.note);
        }
      }
    } catch (err: any) {
      addSystemLog(`AI generation failed: ${err.message}`, "error");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Export selection triggers
  const handleToggleSelectPost = (id: number) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(p => p !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(posts.map(p => p.ID));
  };

  const handleSelectNone = () => {
    setSelectedIds([]);
  };

  // Run Simulated/Actual ZIP export
  const handleExecuteExport = async () => {
    if (selectedIds.length === 0) return;
    
    setIsExporting(true);
    setExportProgress(5);
    setExportLog("Pre-Export Validation: Verifying write permissions and server disk space...");
    addSystemLog("Initializing Pre-Export Safety Check sequence...", "info");

    const filteredExportPosts = posts.filter(p => selectedIds.includes(p.ID));

    setTimeout(() => {
      setExportProgress(20);
      setExportLog("Pre-Export Validation: Directory permissions OK, available disk space OK.");
      addSystemLog("Validation: Verifying directory write access to 'wp-content/uploads/pbrp-backups/'... Writable [OK]", "success");
      addSystemLog("Validation: Verifying host system free disk space... Available: 24.57 GB | Required: ~4.12 MB [OK]", "success");
      if (settings.exclude_extensions.length > 0) {
        addSystemLog(`Validation: Applied extension filter skips for: ${settings.exclude_extensions.join(", ")}`, "info");
      }
      if (settings.exclude_folders.length > 0) {
        addSystemLog(`Validation: Applied folder filter skips for: ${settings.exclude_folders.join(", ")}`, "info");
      }

      setTimeout(() => {
        setExportProgress(45);
        setExportLog("Scanning inline content blocks and extracting featured attachments...");
        addSystemLog("Scanning HTML markup tags for inline media references...", "info");
        
        setTimeout(() => {
          setExportProgress(75);
          setExportLog("Bundling metadata/posts.json, metadata/posts.csv, and wordpress-export.xml schemas...");
          addSystemLog("Compiling XML, CSV, and Yoast/RankMath JSON metadata models...", "info");
          
          setTimeout(async () => {
            setExportProgress(90);
            setExportLog("Writing readme.txt and compressing into secure ZIP archive...");

            // Now let's POST to our full-stack server to dynamically build a real .zip file download containing the posts!
            try {
              const res = await fetch("/api/download-backup-zip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ posts: filteredExportPosts })
              });
              const blob = await res.blob();
              const blobUrl = URL.createObjectURL(blob);
              setDownloadZipBlob(blobUrl);

              setExportProgress(100);
              setExportLog("Backup packaging completed!");
              addSystemLog(`Simulated backup generated containing ${filteredExportPosts.length} posts. ZIP download link ready.`, "success");
              
              // Append to Backup history
              const newHistoryEntry: BackupHistoryEntry = {
                timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
                zip_name: `backup-${new Date().toISOString().slice(0, 10)}-${Math.floor(Math.random()*1000)}.zip`,
                posts_count: filteredExportPosts.length,
                images_count: filteredExportPosts.reduce((acc, p) => acc + (p["Gallery Images"]?.length || 0) + (p["Featured Image"] ? 1 : 0), 0),
                size: `${(blob.size / (1024 * 1024)).toFixed(2)} MB`,
                duration: "1.42 seconds",
                status: "success",
                blob_url: blobUrl
              };
              setHistory(prev => [...prev, newHistoryEntry]);

            } catch (err: any) {
              setExportLog(`Export zipped bundle failed: ${err.message}`);
              addSystemLog(`Export zipping failed: ${err.message}`, "error");
            }
          }, 1200);
        }, 1000);
      }, 1000);
    }, 1200);
  };

  // Drag over drop import zones
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUpload(e.target.files[0]);
    }
  };

  const processUpload = (file: File) => {
    if (!file.name.endsWith(".zip")) {
      addSystemLog("Invalid format! Please upload a valid .zip archive.", "error");
      return;
    }
    setUploadedFile({ name: file.name, size: file.size });
    addSystemLog(`Scanned uploaded ZIP file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`, "info");

    // Mock parsing file integrity data
    setImportSummary({
      posts: Math.floor(Math.random() * 3) + 2,
      images: Math.floor(Math.random() * 4) + 1,
      categories: ["Marketing", "Case Studies", "Coffee Beans"],
      tags: ["WordPress", "SEO Tips", "E-Commerce", "Fair Trade"]
    });
  };

  const isMaliciousZip = simulateZipSlip || (uploadedFile ? (
    uploadedFile.name.toLowerCase().includes("slip") ||
    uploadedFile.name.toLowerCase().includes("exploit") ||
    uploadedFile.name.toLowerCase().includes("traversal") ||
    uploadedFile.name.toLowerCase().includes("payload") ||
    uploadedFile.name.toLowerCase().includes("malicious") ||
    uploadedFile.name.includes("..")
  ) : false);

  const handleAbortRestore = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];

    setIsImporting(false);
    setImportProgress(0);
    setImportLog("");
    setImportWarning(null);
    setImportError(null);
    setUploadedFile(null);
    setImportSummary(null);
    setSimulateZipSlip(false);
    addSystemLog("Import/Restore aborted by the administrator. State cleanly reset.", "warning");
  };

  const handleResumeRestore = () => {
    if (!uploadedFile || !importSummary) return;

    setImportWarning(null);
    setImportError(null);
    setImportLog("Resuming restore process, processing database and remaining safe assets...");
    addSystemLog("Resuming restore process, bypassing skipped files...", "info");

    const t2 = setTimeout(() => {
      setImportProgress(82);
      setImportLog("Creating categories, tag slugs, SEO metadata entries, and writing database post nodes...");
      addSystemLog("Mapping Custom Fields, Yoast SEO tags, and RankMath canonical models...", "info");

      const t3 = setTimeout(() => {
        setImportProgress(100);
        setImportLog("Restore process finished with safety bypasses!");
        setIsImporting(false);
        setImportComplete(true);
        addSystemLog(`Restore completed! Safely imported ${importSummary.posts} posts and ${importSummary.images} attachments. (1 Zip Slip threat was successfully skipped and isolated)`, "success");

        // Splicing dummy posts back into main state to showcase restore!
        setPosts(prev => {
          const currentMax = prev.reduce((max, p) => p.ID > max ? p.ID : max, 0);
          const restoredList: WPPost[] = [
            {
              ID: currentMax + 1,
              Title: "Restored Post: Mastermind SEO Tactics for High Growth Sites",
              Slug: "seo-tactics-high-growth-sites",
              URL: "http://example.com/seo-tactics-high-growth-sites",
              "Published Date": "2026-06-25 10:12:00",
              "Modified Date": "2026-06-25 10:12:00",
              Author: "Atif Syed",
              Categories: ["Case Studies"],
              Tags: ["SEO Tips", "WordPress"],
              "SEO Title": "Mastermind SEO Growth Hacks for 2026",
              "Meta Description": "A complete blueprint detailing how to structure internal linking networks and accelerate core web vitals.",
              "Focus Keyword": "growth seo",
              "Featured Image": "https://images.unsplash.com/photo-1542744173-8e08562744ad?auto=format&fit=crop&w=800&q=80",
              "Gallery Images": [],
              Content: "Restored from backup ZIP successfully. Malicious path traversals were bypassed.",
              Excerpt: "Step-by-step audit guide to level up search rankings and reduce bounce rates.",
              "Word Count": 120,
              "Reading Time": "1 min",
              "Custom Fields": { "schema_active": "true" },
              Status: "publish"
            }
          ];
          return [...prev, ...restoredList];
        });
      }, 1200);
      timeoutsRef.current.push(t3);
    }, 1000);
    timeoutsRef.current.push(t2);
  };

  const handleExecuteRestore = () => {
    if (!uploadedFile || !importSummary) return;

    setIsImporting(true);
    setImportProgress(15);
    setImportError(null);
    setImportWarning(null);
    setImportLog("Initializing unzipping archive stream, checking against Zip Slip directory traversals...");
    addSystemLog("Analyzing filepaths, verifying secure SHA256 checksum integrity...", "info");

    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];

    const t1 = setTimeout(() => {
      setImportProgress(48);
      setImportLog("Downloading media attachments, mapping local folders, and resizing images...");
      addSystemLog(`Sideloading ${importSummary.images} content attachments into WP Uploads library...`, "info");

      if (isMaliciousZip) {
        const t2 = setTimeout(() => {
          setImportProgress(75);
          setImportLog("Processing extraction queue... Blocked path traversal exploit!");
          addSystemLog("Security Warning: Blocked an attempted Directory Traversal / Zip Slip exploit inside ZIP file: ../../../wp-config.php (Skipped malicious file safely to protect system integrity)", "warning");
        }, 1200);
        timeoutsRef.current.push(t2);
      } else {
        const t2 = setTimeout(() => {
          setImportProgress(82);
          setImportLog("Creating categories, tag slugs, SEO metadata entries, and writing database post nodes...");
          addSystemLog("Mapping Custom Fields, Yoast SEO tags, and RankMath canonical models...", "info");

          const t3 = setTimeout(() => {
            setImportProgress(100);
            setImportLog("Restore process finished!");
            setIsImporting(false);
            setImportComplete(true);
            addSystemLog(`Restore completed! Successfully imported ${importSummary.posts} posts and ${importSummary.images} attachments.`, "success");

            // Splicing dummy posts back into main state to showcase restore!
            setPosts(prev => {
              const currentMax = prev.reduce((max, p) => p.ID > max ? p.ID : max, 0);
              const restoredList: WPPost[] = [
                {
                  ID: currentMax + 1,
                  Title: "Restored Post: Mastermind SEO Tactics for High Growth Sites",
                  Slug: "seo-tactics-high-growth-sites",
                  URL: "http://example.com/seo-tactics-high-growth-sites",
                  "Published Date": "2026-06-25 10:12:00",
                  "Modified Date": "2026-06-25 10:12:00",
                  Author: "Atif Syed",
                  Categories: ["Case Studies"],
                  Tags: ["SEO Tips", "WordPress"],
                  "SEO Title": "Mastermind SEO Growth Hacks for 2026",
                  "Meta Description": "A complete blueprint detailing how to structure internal linking networks and accelerate core web vitals.",
                  "Focus Keyword": "growth seo",
                  "Featured Image": "https://images.unsplash.com/photo-1542744173-8e08562744ad?auto=format&fit=crop&w=800&q=80",
                  "Gallery Images": [],
                  Content: "Restored from backup ZIP successfully. Content and links are fully intact.",
                  Excerpt: "Step-by-step audit guide to level up search rankings and reduce bounce rates.",
                  "Word Count": 120,
                  "Reading Time": "1 min",
                  "Custom Fields": { "schema_active": "true" },
                  Status: "publish"
                }
              ];
              return [...prev, ...restoredList];
            });

          }, 1200);
          timeoutsRef.current.push(t3);
        }, 1000);
        timeoutsRef.current.push(t2);
      }
    }, 1000);
    timeoutsRef.current.push(t1);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addSystemLog("Plugin settings configuration updated successfully.", "success");
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  // Searching & filter lists
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.Title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.Slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || post.Categories.some(cat => selectedCategories.includes(cat));
    const matchesAuthor = filterAuthor === "" || post.Author === filterAuthor;
    const matchesStatus = filterStatus === "" || post.Status === filterStatus;

    return matchesSearch && matchesCategory && matchesAuthor && matchesStatus;
  });

  const sortedFilteredPosts = [...filteredPosts].sort((a, b) => {
    let valA: any = "";
    let valB: any = "";
    
    if (sortKey === "Title") {
      valA = a.Title.toLowerCase();
      valB = b.Title.toLowerCase();
    } else if (sortKey === "Published Date") {
      valA = a["Published Date"];
      valB = b["Published Date"];
    } else if (sortKey === "Author") {
      valA = a.Author.toLowerCase();
      valB = b.Author.toLowerCase();
    } else if (sortKey === "Category") {
      valA = (a.Categories[0] || "").toLowerCase();
      valB = (b.Categories[0] || "").toLowerCase();
    } else if (sortKey === "Status") {
      valA = a.Status;
      valB = b.Status;
    } else if (sortKey === "Size") {
      valA = a["Word Count"] || 0;
      valB = b["Word Count"] || 0;
    } else {
      valA = a.ID;
      valB = b.ID;
    }

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Extract all categories in standard list
  const allCategories = Array.from(new Set(posts.flatMap(p => p.Categories)));

  // Render a nice visual file tree recursively
  const renderFileNode = (node: PluginFileNode, depth = 0) => {
    const isDir = node.type === "directory";
    const isExpanded = expandedDirs[node.path];

    return (
      <div key={node.path} className="select-none">
        <div 
          onClick={() => isDir ? handleToggleDir(node.path) : setSelectedFile(node)}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          className={`flex items-center gap-2 py-1.5 px-3 rounded text-xs cursor-pointer transition-colors ${
            selectedFile?.path === node.path 
              ? "bg-[#2271b1] text-white" 
              : "text-slate-300 hover:bg-[#1a2332]"
          }`}
        >
          {isDir ? (
            <>
              {isExpanded ? <ChevronDown size={14} className="opacity-70" /> : <ChevronRight size={14} className="opacity-70" />}
              <Folder size={14} className="text-amber-400 fill-amber-400/20" />
            </>
          ) : (
            <>
              <span className="w-3.5" />
              <FileCode size={14} className="text-sky-400" />
            </>
          )}
          <span className="font-mono truncate">{node.name}</span>
        </div>
        {isDir && isExpanded && node.children && (
          <div className="mt-0.5">
            {node.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#f0f0f1] text-[#1d2327]"}`}>
      
      {/* WORDPRESS HEADER ADMIN BAR */}
      <header className="flex items-center justify-between h-8 bg-[#1d2327] text-slate-300 px-4 text-xs font-sans select-none z-10 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-bold text-white cursor-default">
            <span className="p-0.5 bg-[#2271b1] rounded">WP</span>
            <span>Local Studio Playground</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="opacity-50">|</span>
            <span className="hover:text-white cursor-pointer flex items-center gap-1">
              <Compass size={12} /> Visit Site
            </span>
            <span className="opacity-50">|</span>
            <span className="hover:text-white cursor-pointer">0 Updates</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Environment Theme:</span>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 font-semibold cursor-pointer border border-slate-700"
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
          <div className="flex items-center gap-2 hover:text-white cursor-pointer font-semibold">
            <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">A</span>
            <span>Howdy, Atif Syed</span>
          </div>
        </div>
      </header>

      {/* CORE WP MAIN VIEWPORT (LEFT SIDEBAR + CONTENT CONTAINER) */}
      <div className="flex flex-1 flex-row">
        
        {/* WORDPRESS NATIVE SIDEBAR */}
        <aside 
          className={`flex flex-col bg-[#1d2327] text-slate-300 transition-all duration-200 select-none border-r border-slate-800 ${
            sidebarCollapsed ? "w-12" : "w-56"
          }`}
        >
          {/* Main WP Menus */}
          <div className="flex-1 py-2 font-sans text-[13px] overflow-y-auto">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {!sidebarCollapsed && "Core WordPress"}
            </div>
            
            <div className="space-y-0.5 mt-1">
              <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-400 hover:bg-slate-800/50 cursor-not-allowed">
                <Database size={16} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </div>
              <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-400 hover:bg-slate-800/50 cursor-not-allowed">
                <ClipboardList size={16} />
                {!sidebarCollapsed && <span>Posts</span>}
              </div>
              <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-400 hover:bg-slate-800/50 cursor-not-allowed">
                <Layers size={16} />
                {!sidebarCollapsed && <span>Plugins</span>}
              </div>
            </div>

            <div className="h-px bg-slate-800 my-4" />

            {/* OUR PLUGIN HEADER */}
            <div className="px-3 py-1 text-[11px] font-bold text-[#2271b1] uppercase tracking-wider">
              {!sidebarCollapsed && "Backup & Restore Pro"}
            </div>

            <nav className="space-y-0.5 mt-1 font-semibold">
              <button 
                onClick={() => setActiveMenu("pbrp-dashboard")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer transition-colors ${
                  activeMenu === "pbrp-dashboard" 
                    ? "bg-[#2271b1] text-white border-l-4 border-white" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Layers size={16} className={activeMenu === "pbrp-dashboard" ? "text-white" : "text-[#2271b1]"} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>

              <button 
                onClick={() => setActiveMenu("pbrp-export")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer transition-colors ${
                  activeMenu === "pbrp-export" 
                    ? "bg-[#2271b1] text-white border-l-4 border-white" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <DownloadCloud size={16} className={activeMenu === "pbrp-export" ? "text-white" : "text-[#2271b1]"} />
                {!sidebarCollapsed && <span>Export Posts</span>}
              </button>

              <button 
                onClick={() => setActiveMenu("pbrp-import")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer transition-colors ${
                  activeMenu === "pbrp-import" 
                    ? "bg-[#2271b1] text-white border-l-4 border-white" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <UploadCloud size={16} className={activeMenu === "pbrp-import" ? "text-white" : "text-[#2271b1]"} />
                {!sidebarCollapsed && <span>Import Posts</span>}
              </button>

              <button 
                onClick={() => setActiveMenu("pbrp-settings")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer transition-colors ${
                  activeMenu === "pbrp-settings" 
                    ? "bg-[#2271b1] text-white border-l-4 border-white" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <SettingsIcon size={16} className={activeMenu === "pbrp-settings" ? "text-white" : "text-[#2271b1]"} />
                {!sidebarCollapsed && <span>Plugin Settings</span>}
              </button>

              <button 
                onClick={() => setActiveMenu("pbrp-logs")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer transition-colors ${
                  activeMenu === "pbrp-logs" 
                    ? "bg-[#2271b1] text-white border-l-4 border-white" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Terminal size={16} className={activeMenu === "pbrp-logs" ? "text-white" : "text-[#2271b1]"} />
                {!sidebarCollapsed && <span>Activity Logs</span>}
              </button>

              <button 
                onClick={() => setActiveMenu("pbrp-developer")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer transition-colors ${
                  activeMenu === "pbrp-developer" 
                    ? "bg-[#2271b1] text-white border-l-4 border-white" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <User size={16} className={activeMenu === "pbrp-developer" ? "text-white" : "text-[#2271b1]"} />
                {!sidebarCollapsed && <span>About Developer</span>}
              </button>
            </nav>

            <div className="h-px bg-slate-800 my-4" />

            {/* EXTRA EXPLORER BAR */}
            <div className="px-3 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {!sidebarCollapsed && "Plugin Code Workspace"}
            </div>
            
            <button 
              onClick={() => setActiveMenu("pbrp-code-explorer")}
              className={`w-full mt-1 flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer transition-colors text-[13px] font-semibold ${
                activeMenu === "pbrp-code-explorer" 
                  ? "bg-[#2271b1] text-white border-l-4 border-white" 
                  : "hover:bg-slate-800 text-teal-400 hover:text-teal-300"
              }`}
            >
              <FileCode size={16} />
              {!sidebarCollapsed && <span>Plugin Code Tree</span>}
            </button>
          </div>

          {/* Sidebar toggler */}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-3 text-slate-500 hover:text-white bg-slate-900 border-t border-slate-800 text-xs font-mono flex items-center justify-center gap-2 cursor-pointer"
          >
            {sidebarCollapsed ? "→" : "← Collapse Menu"}
          </button>
        </aside>

        {/* INTERACTIVE WORKSPACE VIEW PANEL */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto font-sans">
          
          {/* WORDPRESS-STYLE DASHBOARD HEADER SECTION */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-300/10">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-[#2271b1] rounded-sm inline-block"></span>
                  WP Administrator Workspace
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pro-grade WordPress backup, migration, and live database packaging sandbox.
                </p>
              </div>
              <div className="text-right text-[11px] font-mono text-slate-400">
                System Time: <span className="text-[#2271b1] font-semibold">2026-06-26 21:16:12</span>
              </div>
            </div>

            {/* DASHBOARD STATISTICS WIDGETS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Posts */}
              <div className={`p-4 rounded-xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}>
                <div className="p-3 bg-blue-500/10 text-[#2271b1] dark:text-blue-400 rounded-lg">
                  <FileText size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase tracking-wider">Total Posts</span>
                  <span className="text-2xl font-black font-mono leading-none">{posts.length}</span>
                </div>
              </div>

              {/* Card 2: Published */}
              <div className={`p-4 rounded-xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}>
                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase tracking-wider">Published</span>
                  <span className="text-2xl font-black font-mono leading-none text-emerald-500">{posts.filter(p => p.Status === "publish").length}</span>
                </div>
              </div>

              {/* Card 3: Draft */}
              <div className={`p-4 rounded-xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}>
                <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                  <FileText size={20} className="text-amber-500" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase tracking-wider">Drafts</span>
                  <span className="text-2xl font-black font-mono leading-none text-amber-500">{posts.filter(p => p.Status === "draft").length}</span>
                </div>
              </div>

              {/* Card 4: Media Count */}
              <div className={`p-4 rounded-xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}>
                <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg">
                  <Image size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase tracking-wider">Media Count</span>
                  <span className="text-2xl font-black font-mono leading-none text-sky-500">
                    {posts.reduce((acc, p) => acc + (p["Gallery Images"]?.length || 0) + (p["Featured Image"] ? 1 : 0), 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DASHBOARD TAB SCREEN */}
          {activeMenu === "pbrp-dashboard" && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Premium Header Display */}
              <div className="bg-slate-900 text-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Post Backup & Restore Pro</h1>
                  <p className="text-slate-400 text-sm mt-1 max-w-xl">
                    A secure, lightning-fast content exporter and restorer for professional WordPress sites. Built with a focus on complete media preservation, clean SEO schemas, and complete Zip Slip immunity.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveMenu("pbrp-export")}
                    className="px-4 py-2 bg-[#2271b1] hover:bg-[#1a5a8e] text-white text-xs font-semibold rounded shadow transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <DownloadCloud size={14} /> Start New Backup
                  </button>
                  <button 
                    onClick={() => setActiveMenu("pbrp-import")}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded shadow transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <UploadCloud size={14} /> Restore ZIP
                  </button>
                </div>
              </div>

              {/* Stats bento panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className={`p-6 rounded-xl shadow-sm border flex items-center gap-4 ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                    <Database size={24} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">Total Backups</span>
                    <span className="text-2xl font-bold font-mono">{history.length}</span>
                  </div>
                </div>

                <div className={`p-6 rounded-xl shadow-sm border flex items-center gap-4 ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">WordPress Posts</span>
                    <span className="text-2xl font-bold font-mono">{posts.length}</span>
                  </div>
                </div>

                <div className={`p-6 rounded-xl shadow-sm border flex items-center gap-4 ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">Security Shield</span>
                    <span className="text-sm font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded inline-block mt-1 font-mono">ZIP SLIP FREE</span>
                  </div>
                </div>

              </div>

              {/* Split layout: Quick AI Post Generator & Recent Backups list */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* AI Generator Panel */}
                <div className={`lg:col-span-5 p-6 rounded-xl shadow-sm border flex flex-col justify-between ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-amber-500 fill-amber-500/20" size={18} />
                      <h3 className="font-bold text-sm uppercase tracking-wide">Gemini AI Blog Content Generator</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Need custom test entries to export or play with? Generate premium WordPress content dynamically using Gemini. It formats deep markup, sets custom tags, and maps relevant categories instantly.
                    </p>

                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Blog/Post Topic</label>
                        <input 
                          type="text" 
                          value={aiTopic}
                          onChange={(e) => setAiTopic(e.target.value)}
                          className={`w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-[#2271b1] ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                          }`}
                          placeholder="Topic e.g., Travel adventures in Paris"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Post Count</label>
                        <select 
                          value={aiCount}
                          onChange={(e) => setAiCount(parseInt(e.target.value))}
                          className={`w-full text-xs px-3 py-2 rounded border focus:outline-none ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                          }`}
                        >
                          <option value={1}>1 Post Node</option>
                          <option value={3}>3 Post Nodes</option>
                          <option value={5}>5 Post Nodes</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-200/10 pt-4">
                    {aiNote && (
                      <p className="text-[11px] text-amber-500 bg-amber-500/10 p-2 rounded mb-3 font-mono">
                        {aiNote}
                      </p>
                    )}
                    <button 
                      onClick={handleGenerateAICleaning}
                      disabled={isGeneratingAI}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-semibold rounded shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingAI ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Generating AI content nodes...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} /> Generate Custom AI Posts
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Recent Backup Histories */}
                <div className={`lg:col-span-7 p-6 rounded-xl shadow-sm border ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <h3 className="font-bold text-sm uppercase tracking-wide mb-4">Export History Ledger</h3>
                  
                  {history.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-300/30 rounded-lg">
                      <Database className="mx-auto text-slate-400 opacity-50 mb-2" size={32} />
                      <p className="text-xs text-slate-400">No backup history records saved.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-300/20 text-slate-400 font-semibold uppercase">
                            <th className="py-2.5">Date Created</th>
                            <th className="py-2.5">ZIP Archive</th>
                            <th className="py-2.5 text-center">Posts</th>
                            <th className="py-2.5 text-center">Images</th>
                            <th className="py-2.5 text-right">Size</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300/10">
                          {history.map((h, i) => (
                            <tr key={i} className="hover:bg-slate-300/5">
                              <td className="py-3 text-slate-400 font-mono text-[11px]">{h.timestamp}</td>
                              <td className="py-3 font-semibold text-sky-500">{h.zip_name}</td>
                              <td className="py-3 text-center font-mono">{h.posts_count}</td>
                              <td className="py-3 text-center font-mono">{h.images_count}</td>
                              <td className="py-3 text-right font-semibold font-mono">{h.size}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* EXPORT POSTS TAB SCREEN */}
          {activeMenu === "pbrp-export" && (
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* BEAUTIFUL HEADER DESIGN */}
              <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-[#2271b1] text-white p-6 md:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-sky-400 text-slate-900 font-bold rounded-full text-[10px] tracking-wider uppercase">PRO EDITION</span>
                    <span className="text-slate-200 text-xs font-mono font-medium">Backup Posts • Restore Anywhere • One-Click Migration</span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight mt-1.5 flex items-center gap-2">
                    📦 Posts Backup & Restore Pro
                  </h1>
                  <p className="text-blue-100 text-xs mt-2 max-w-xl">
                    High-performance database packaging with assets serialization, complete SEO metadata preservation, and multi-threaded compression algorithms.
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button 
                    onClick={() => {
                      setSelectedIds(posts.map(p => p.ID));
                      setExportStep(2);
                      addSystemLog("Quick 'Export All' selected. Setting up wizard parameters.", "info");
                    }}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    📦 Export All Posts
                  </button>
                </div>
              </div>
              {/* THREE-STEP EXPORT WIZARD BAR */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <button 
                  onClick={() => setExportStep(1)}
                  className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    exportStep === 1 
                      ? "bg-[#2271b1] text-white shadow" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">1</span>
                  Choose Posts
                </button>
                <div className="w-8 h-px bg-slate-300/20" />
                <button 
                  onClick={() => {
                    if (selectedIds.length > 0) setExportStep(2);
                  }}
                  disabled={selectedIds.length === 0}
                  className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-45 ${
                    exportStep === 2 
                      ? "bg-[#2271b1] text-white shadow" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">2</span>
                  Choose Options
                </button>
                <div className="w-8 h-px bg-slate-300/20" />
                <button 
                  onClick={() => {
                    if (selectedIds.length > 0) setExportStep(3);
                  }}
                  disabled={selectedIds.length === 0}
                  className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-45 ${
                    exportStep === 3 
                      ? "bg-[#2271b1] text-white shadow" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">3</span>
                  Download ZIP
                </button>
              </div>

              {/* TWO COLUMN GRID MAIN VIEW */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT MAIN MODULE: 70% WIDTH */}
                <div className="lg:col-span-8 space-y-6">

                  {/* STEP 1: CHOOSE ARTICLES */}
                  {exportStep === 1 && (
                    <div className="space-y-6">
                      
                      {/* Live keyword search and advanced collapsible bar */}
                      <div className={`p-5 rounded-xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                          <div className="relative flex-1 w-full">
                            <Search size={14} className="absolute left-3 top-3 opacity-55" />
                            <input 
                              id="pbrp-search-input"
                              type="text" 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className={`w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#2271b1] ${
                                isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                              }`}
                              placeholder="Search post titles or URLs instantly... (Ctrl + F)"
                            />
                            {searchQuery && (
                              <button 
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-3 text-slate-400 hover:text-red-500"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                          
                          <div className="flex gap-2 shrink-0 w-full md:w-auto">
                            <button
                              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                              className={`px-3 py-2 border text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer ${
                                showAdvancedFilters 
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                                  : "border-slate-300/20 hover:bg-slate-300/10"
                              }`}
                            >
                              <Filter size={13} />
                              Advanced Filters {showAdvancedFilters ? "▲" : "▼"}
                            </button>
                            <button
                              onClick={() => {
                                setSearchQuery("");
                                setSelectedCategories([]);
                                setFilterAuthor("");
                                setFilterStatus("");
                                addSystemLog("Search parameters and filters reset.", "info");
                              }}
                              className="px-3 py-2 border border-slate-300/20 hover:bg-slate-300/10 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                            >
                              <RefreshCw size={13} />
                              Reset Filters
                            </button>
                          </div>
                        </div>

                        {/* Collapsible filters box */}
                        {showAdvancedFilters && (
                          <div className="mt-4 pt-4 border-t border-slate-300/10 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs font-semibold text-slate-400 block mb-1">Author Name</label>
                                <select 
                                  value={filterAuthor}
                                  onChange={(e) => setFilterAuthor(e.target.value)}
                                  className={`w-full text-xs px-3 py-2 rounded border focus:outline-none ${
                                    isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                                  }`}
                                >
                                  <option value="">All Authors</option>
                                  <option value="Atif Syed">Atif Syed</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-xs font-semibold text-slate-400 block mb-1">Workflow Status</label>
                                <select 
                                  value={filterStatus}
                                  onChange={(e) => setFilterStatus(e.target.value)}
                                  className={`w-full text-xs px-3 py-2 rounded border focus:outline-none ${
                                    isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                                  }`}
                                >
                                  <option value="">All Statuses</option>
                                  <option value="publish">🟢 Published</option>
                                  <option value="draft">Drafts</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-xs font-semibold text-slate-400 block mb-1">Sorting Preset</label>
                                <div className="flex gap-1">
                                  <select 
                                    value={sortKey}
                                    onChange={(e) => setSortKey(e.target.value)}
                                    className={`flex-1 text-xs px-3 py-2 rounded border focus:outline-none ${
                                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                                    }`}
                                  >
                                    <option value="Published Date">Published Date</option>
                                    <option value="Title">Post Title</option>
                                    <option value="Author">Author</option>
                                    <option value="Category">Category</option>
                                    <option value="Status">Status</option>
                                    <option value="Size">Estimated Size</option>
                                  </select>
                                  <button
                                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                                    className="p-2 border border-slate-300/20 rounded hover:bg-slate-300/10 text-xs cursor-pointer"
                                    title="Toggle Sort Direction"
                                  >
                                    {sortDirection === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Tags-style interactive categories */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter by Categories</label>
                                <div className="flex gap-2 text-[10px]">
                                  <button 
                                    type="button"
                                    onClick={() => setSelectedCategories(allCategories)}
                                    className="text-[#2271b1] hover:underline font-bold cursor-pointer"
                                  >
                                    Select All
                                  </button>
                                  <span className="text-slate-300/20">|</span>
                                  <button 
                                    type="button"
                                    onClick={() => setSelectedCategories([])}
                                    className="text-slate-400 hover:underline font-bold cursor-pointer"
                                  >
                                    Clear All
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-slate-300/5 border border-slate-300/10">
                                {allCategories.map(cat => {
                                  const isSelected = selectedCategories.includes(cat);
                                  return (
                                    <button
                                      key={cat}
                                      type="button"
                                      onClick={() => {
                                        if (isSelected) {
                                          setSelectedCategories(selectedCategories.filter(c => c !== cat));
                                        } else {
                                          setSelectedCategories([...selectedCategories, cat]);
                                        }
                                      }}
                                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                                        isSelected 
                                          ? "bg-[#2271b1] text-white shadow-sm scale-105" 
                                          : (isDarkMode ? "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")
                                      }`}
                                    >
                                      {isSelected && <Check size={11} />}
                                      {cat}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Saved filter manager widget */}
                            <div className="pt-2 border-t border-slate-300/10">
                              <span className="text-xs font-bold text-slate-400 block mb-1">Quick Saved Filters</span>
                              <div className="flex flex-wrap gap-2 items-center">
                                {savedFilters.map(f => (
                                  <button
                                    key={f.id}
                                    onClick={() => {
                                      setSearchQuery(f.query);
                                      setSelectedCategories(f.categories);
                                      setFilterAuthor(f.author);
                                      setFilterStatus(f.status);
                                      addSystemLog(`Loaded filter template: ${f.name}`, "info");
                                    }}
                                    className={`px-2.5 py-1 rounded border text-[11px] font-semibold flex items-center gap-1 hover:opacity-85 ${
                                      searchQuery === f.query && filterStatus === f.status && JSON.stringify(selectedCategories) === JSON.stringify(f.categories)
                                        ? "bg-amber-500/15 text-amber-500 border-amber-500/30 font-bold"
                                        : "bg-slate-300/5 border-slate-300/10 text-slate-300"
                                    }`}
                                  >
                                    <Star size={10} className="fill-amber-400 stroke-amber-400" />
                                    {f.name}
                                  </button>
                                ))}
                                <div className="flex gap-1.5 items-center ml-auto">
                                  <input 
                                    type="text" 
                                    value={newFilterName}
                                    onChange={(e) => setNewFilterName(e.target.value)}
                                    placeholder="Save current filters..." 
                                    className={`px-2 py-1 rounded text-[10px] focus:outline-none ${
                                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"
                                    }`}
                                  />
                                  <button
                                    onClick={() => {
                                      if (newFilterName.trim()) {
                                        setSavedFilters([...savedFilters, {
                                          id: String(Date.now()),
                                          name: "⭐ " + newFilterName.trim(),
                                          query: searchQuery,
                                          categories: selectedCategories,
                                          author: filterAuthor,
                                          status: filterStatus
                                        }]);
                                        addSystemLog(`Filter config saved: "${newFilterName}"`, "success");
                                        setNewFilterName("");
                                      }
                                    }}
                                    className="px-2.5 py-1 bg-[#2271b1] hover:bg-[#1c5a8e] text-white text-[10px] font-semibold rounded cursor-pointer"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bulk selection bar & Table/Grid View Switcher */}
                      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                      }`}>
                        {/* Bulk selection shortcuts */}
                        <div className="flex flex-wrap gap-1.5 text-xs">
                          <button 
                            onClick={handleSelectAll}
                            className="px-3 py-1.5 border border-slate-300/10 rounded-lg hover:bg-slate-300/10 font-semibold cursor-pointer"
                          >
                            All
                          </button>
                          <button 
                            onClick={() => setSelectedIds(posts.filter(p => p.Status === "publish").map(p => p.ID))}
                            className="px-3 py-1.5 border border-slate-300/10 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500 font-semibold cursor-pointer"
                          >
                            🟢 Published
                          </button>
                          <button 
                            onClick={() => setSelectedIds(posts.filter(p => p.Status === "draft").map(p => p.ID))}
                            className="px-3 py-1.5 border border-slate-300/10 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 font-semibold cursor-pointer"
                          >
                            🟡 Drafts
                          </button>
                          <button 
                            onClick={() => {
                              const thirtyDaysAgo = new Date();
                              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                              const match = posts.filter(p => new Date(p["Published Date"]) >= thirtyDaysAgo).map(p => p.ID);
                              setSelectedIds(match);
                              addSystemLog(`Selected ${match.length} posts published within the last 30 days.`, "info");
                            }}
                            className="px-3 py-1.5 border border-slate-300/10 rounded-lg hover:bg-blue-500/10 hover:text-blue-500 font-semibold cursor-pointer"
                          >
                            📅 Last Month
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedIds(posts.map(p => p.ID).filter(id => !selectedIds.includes(id)));
                              addSystemLog("Selection inverted.", "info");
                            }}
                            className="px-3 py-1.5 border border-slate-300/10 rounded-lg hover:bg-purple-500/10 hover:text-purple-400 font-semibold cursor-pointer"
                          >
                            Invert
                          </button>
                          <button 
                            onClick={handleSelectNone}
                            className="px-3 py-1.5 border border-slate-300/10 rounded-lg hover:bg-red-500/10 hover:text-red-500 font-semibold cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>

                        {/* Layout switcher */}
                        <div className="flex gap-1 border border-slate-300/10 rounded-lg p-0.5 shrink-0 bg-slate-300/5">
                          <button 
                            onClick={() => setExportViewMode("list")}
                            className={`p-1.5 rounded cursor-pointer ${exportViewMode === "list" ? "bg-[#2271b1] text-white" : "text-slate-400 hover:text-slate-200"}`}
                            title="Table List View"
                          >
                            <List size={14} />
                          </button>
                          <button 
                            onClick={() => setExportViewMode("grid")}
                            className={`p-1.5 rounded cursor-pointer ${exportViewMode === "grid" ? "bg-[#2271b1] text-white" : "text-slate-400 hover:text-slate-200"}`}
                            title="Visual Grid Cards View"
                          >
                            <LayoutGrid size={14} />
                          </button>
                        </div>
                      </div>

                      {/* DISPLAY TABLE LIST VIEW */}
                      {exportViewMode === "list" ? (
                        <div className={`rounded-xl border shadow-sm overflow-hidden ${
                          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                        }`}>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-slate-300/20 text-slate-400 font-bold uppercase bg-slate-300/5 select-none text-[10px]">
                                  <th className="py-3 px-4 w-12 text-center"></th>
                                  <th className="py-3 px-2 cursor-pointer hover:text-white" onClick={() => { setSortKey("Title"); setSortDirection(sortDirection === "asc" ? "desc" : "asc"); }}>
                                    📝 Title {sortKey === "Title" && (sortDirection === "asc" ? "▲" : "▼")}
                                  </th>
                                  <th className="py-3 px-2 cursor-pointer hover:text-white" onClick={() => { setSortKey("Category"); setSortDirection(sortDirection === "asc" ? "desc" : "asc"); }}>
                                    📂 Category {sortKey === "Category" && (sortDirection === "asc" ? "▲" : "▼")}
                                  </th>
                                  <th className="py-3 px-2 cursor-pointer hover:text-white" onClick={() => { setSortKey("Author"); setSortDirection(sortDirection === "asc" ? "desc" : "asc"); }}>
                                    👤 Author {sortKey === "Author" && (sortDirection === "asc" ? "▲" : "▼")}
                                  </th>
                                  <th className="py-3 px-2 cursor-pointer hover:text-white" onClick={() => { setSortKey("Published Date"); setSortDirection(sortDirection === "asc" ? "desc" : "asc"); }}>
                                    📅 Date {sortKey === "Published Date" && (sortDirection === "asc" ? "▲" : "▼")}
                                  </th>
                                  <th className="py-3 px-2 cursor-pointer hover:text-white text-center" onClick={() => { setSortKey("Status"); setSortDirection(sortDirection === "asc" ? "desc" : "asc"); }}>
                                    🟢 Status {sortKey === "Status" && (sortDirection === "asc" ? "▲" : "▼")}
                                  </th>
                                  <th className="py-3 px-2 text-center">📦 Size</th>
                                  <th className="py-3 px-2 text-center">🖼 Images</th>
                                  <th className="py-3 px-2 text-center w-20">⚙ Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-300/10">
                                {sortedFilteredPosts.length === 0 ? (
                                  <tr>
                                    <td colSpan={9} className="text-center py-16">
                                      {/* BEAUTIFUL EMPTY STATE */}
                                      <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="p-4 bg-slate-300/5 text-slate-400 rounded-full">
                                          <Folder size={32} />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-400">No posts found matching filter parameters.</p>
                                        <button
                                          onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategories([]);
                                            setFilterAuthor("");
                                            setFilterStatus("");
                                          }}
                                          className="px-3.5 py-1.5 bg-[#2271b1] hover:bg-[#1a558b] text-white text-xs font-bold rounded shadow cursor-pointer"
                                        >
                                          Reset All Filters
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ) : (
                                  sortedFilteredPosts.map(post => {
                                    const isChecked = selectedIds.includes(post.ID);
                                    const imagesCount = (post["Gallery Images"]?.length || 0) + (post["Featured Image"] ? 1 : 0);
                                    const mockSize = (post["Word Count"] * 0.01 + imagesCount * 1.5 + 0.2).toFixed(1) + " MB";
                                    return (
                                      <tr 
                                        key={post.ID} 
                                        onClick={() => handleToggleSelectPost(post.ID)}
                                        onMouseEnter={() => setHoveredPostId(post.ID)}
                                        onMouseLeave={() => setHoveredPostId(null)}
                                        className={`cursor-pointer transition-all border-b border-slate-300/5 ${
                                          isChecked 
                                            ? "bg-blue-500/10" 
                                            : "hover:bg-slate-300/5"
                                        }`}
                                      >
                                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                          <input 
                                            type="checkbox" 
                                            checked={isChecked}
                                            onChange={() => handleToggleSelectPost(post.ID)}
                                            className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-[#2271b1]"
                                          />
                                        </td>
                                        <td className="py-3 px-2 font-semibold max-w-xs relative">
                                          <div className="flex items-center gap-2">
                                            {post["Featured Image"] && (
                                              <img 
                                                src={post["Featured Image"]} 
                                                alt="" 
                                                className="w-6 h-6 rounded object-cover shrink-0 border border-slate-300/10"
                                                referrerPolicy="no-referrer"
                                              />
                                            )}
                                            <span className="truncate block font-bold">{post.Title}</span>
                                          </div>

                                          {/* Thumbnail Tooltip popup on Hover */}
                                          {hoveredPostId === post.ID && post["Featured Image"] && (
                                            <div className="absolute left-10 top-8 z-30 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-48 text-[11px] text-white pointer-events-none">
                                              <img 
                                                src={post["Featured Image"]} 
                                                alt="" 
                                                className="w-full h-24 object-cover rounded mb-1.5"
                                                referrerPolicy="no-referrer"
                                              />
                                              <span className="font-bold block truncate">{post.Title}</span>
                                              <span className="text-slate-400 font-mono">Word Count: {post["Word Count"]}</span>
                                            </div>
                                          )}
                                        </td>
                                        <td className="py-3 px-2">
                                          <div className="flex gap-1 flex-wrap">
                                            {post.Categories.map(c => (
                                              <span key={c} className="bg-slate-300/10 px-1.5 py-0.5 rounded text-[10px] font-medium">{c}</span>
                                            ))}
                                          </div>
                                        </td>
                                        <td className="py-3 px-2 text-slate-400 font-semibold">{post.Author}</td>
                                        <td className="py-3 px-2 text-slate-400 font-mono text-[11px]">{post["Published Date"]}</td>
                                        <td className="py-3 px-2 text-center">
                                          {post.Status === "publish" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500">
                                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                              🟢 Published
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500">
                                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                              🟡 Draft
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-3 px-2 text-center text-slate-400 font-mono font-bold">{mockSize}</td>
                                        <td className="py-3 px-2 text-center text-slate-400 font-mono font-bold">{imagesCount}</td>
                                        <td className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                                          <button
                                            onClick={() => {
                                              setSelectedIds([post.ID]);
                                              setExportStep(2);
                                              addSystemLog(`Selected single post node ID: ${post.ID}.`, "info");
                                            }}
                                            className="px-2 py-1 bg-[#2271b1]/15 hover:bg-[#2271b1]/30 text-[#2271b1] dark:text-sky-400 rounded text-[10px] font-bold transition-colors cursor-pointer"
                                          >
                                            Export
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        /* DISPLAY CARDS GRID VIEW */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {sortedFilteredPosts.length === 0 ? (
                            <div className={`col-span-2 p-12 rounded-xl border text-center ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                              <Folder size={32} className="mx-auto text-slate-500 mb-2" />
                              <p className="text-sm font-semibold text-slate-400">No posts found matching parameters.</p>
                            </div>
                          ) : (
                            sortedFilteredPosts.map(post => {
                              const isChecked = selectedIds.includes(post.ID);
                              const imagesCount = (post["Gallery Images"]?.length || 0) + (post["Featured Image"] ? 1 : 0);
                              const mockSize = (post["Word Count"] * 0.01 + imagesCount * 1.5 + 0.2).toFixed(1) + " MB";
                              return (
                                <div 
                                  key={post.ID}
                                  onClick={() => handleToggleSelectPost(post.ID)}
                                  className={`p-4 rounded-xl border relative cursor-pointer transition-all flex flex-col justify-between hover:shadow-md ${
                                    isChecked 
                                      ? "border-[#2271b1] bg-blue-500/10 shadow-sm scale-[1.01]" 
                                      : (isDarkMode ? "bg-slate-900 border-slate-800 hover:bg-slate-800/80" : "bg-white border-slate-200 hover:bg-slate-50")
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                      <span className="font-mono text-[10px] text-slate-400">ID: #{post.ID}</span>
                                      {post.Status === "publish" ? (
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Published
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-500 flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Draft
                                        </span>
                                      )}
                                    </div>
                                    
                                    {post["Featured Image"] && (
                                      <img 
                                        src={post["Featured Image"]} 
                                        alt="" 
                                        className="w-full h-32 object-cover rounded-lg mb-3 border border-slate-300/10 shadow-inner"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}

                                    <h4 className="font-bold text-sm leading-tight hover:text-[#2271b1]">{post.Title}</h4>
                                    
                                    <div className="flex flex-wrap gap-1 mt-2 mb-3">
                                      {post.Categories.map(c => (
                                        <span key={c} className="bg-slate-300/10 px-1.5 py-0.5 rounded text-[9px] font-semibold">{c}</span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="border-t border-slate-300/10 pt-3 mt-2 flex items-center justify-between text-[11px] text-slate-400">
                                    <div className="flex flex-col">
                                      <span>👤 {post.Author}</span>
                                      <span className="text-[9px] font-mono mt-0.5">📅 {post["Published Date"]}</span>
                                    </div>
                                    <div className="text-right flex flex-col font-mono font-semibold text-[10px]">
                                      <span>📦 {mockSize}</span>
                                      <span>🖼 {imagesCount} Images</span>
                                    </div>
                                  </div>

                                  {/* Select Checkmark Badge */}
                                  {isChecked && (
                                    <div className="absolute top-2 left-2 bg-[#2271b1] text-white p-1 rounded-full shadow">
                                      <Check size={10} />
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}

                      {/* Advance Button bar */}
                      <div className="flex justify-between items-center pt-4">
                        <span className="text-xs text-slate-400">Selected <strong className="font-bold text-slate-200">{selectedIds.length}</strong> of <strong className="font-bold text-slate-200">{posts.length}</strong> elements</span>
                        <button
                          onClick={() => setExportStep(2)}
                          disabled={selectedIds.length === 0}
                          className="px-5 py-2 bg-[#2271b1] hover:bg-[#1b5585] text-white text-xs font-bold rounded-lg shadow-md disabled:opacity-45 flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          Next: Configure Options ➔
                        </button>
                      </div>

                    </div>
                  )}

                  {/* STEP 2: CHOOSE EXPORT OPTIONS */}
                  {exportStep === 2 && (
                    <div className={`p-6 rounded-xl border space-y-6 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                          ⚙️ Advanced Metadata Options Serialization
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Select the content fields and secondary WordPress schemas to compile inside the ZIP archive package.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        {Object.entries(wizardOptions).map(([key, val]) => (
                          <label 
                            key={key} 
                            className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer select-none transition-all ${
                              val 
                                ? "border-[#2271b1]/50 bg-[#2271b1]/5 text-white" 
                                : "border-slate-300/10 bg-slate-300/5 text-slate-400 hover:bg-slate-300/10"
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={val}
                              onChange={(e) => setWizardOptions({ ...wizardOptions, [key]: e.target.checked })}
                              className="mt-0.5 accent-[#2271b1] cursor-pointer"
                            />
                            <div>
                              <span className="text-xs font-bold block capitalize">{key.replace("_", " ")}</span>
                              <span className="text-[10px] opacity-75">Serialize {key.replace("_", " ")} database entries</span>
                            </div>
                          </label>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-300/10 flex justify-between">
                        <button
                          onClick={() => setExportStep(1)}
                          className="px-4 py-2 border border-slate-300/20 hover:bg-slate-300/10 text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() => {
                            setExportStep(3);
                            handleExecuteExport();
                          }}
                          className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer transition-all"
                        >
                          Next: Run Backup ➔
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: DOWNLOAD COMPILATION */}
                  {exportStep === 3 && (
                    <div className={`p-6 rounded-xl border space-y-6 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                      <div>
                        <h3 className="text-base font-bold text-white">📦 Compilation & Packaging Loop</h3>
                        <p className="text-xs text-slate-400 mt-1">Generating XML database structures, serializing image attachments, and compiling the ZIP package.</p>
                      </div>

                      {/* Dynamic step visual bar */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#2271b1] uppercase tracking-wider">Creating Backup ZIP</span>
                          <span className="font-mono font-bold text-sky-400">{exportProgress}%</span>
                        </div>

                        {/* Animated progress bar */}
                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300" 
                            style={{ width: `${exportProgress}%` }} 
                          />
                        </div>

                        {/* Interactive Sub-step info */}
                        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                          <span>{exportLog}</span>
                          {exportProgress > 30 && exportProgress < 80 && (
                            <span className="text-sky-400">Archiving Media: 125/240</span>
                          )}
                        </div>
                      </div>

                      {exportProgress === 100 && downloadZipBlob ? (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 size={32} className="text-emerald-500" />
                            <div>
                              <h4 className="text-xs font-bold text-white">ZIP Package Generated Successfully!</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Your dynamic secure backup archive is ready for local downloading.</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <a 
                              href={downloadZipBlob}
                              download={`backup-${new Date().toISOString().slice(0, 10)}-${Math.floor(Math.random()*1000)}.zip`}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow"
                            >
                              <DownloadCloud size={14} /> Download ZIP
                            </a>
                            <button
                              onClick={() => {
                                setExportStep(1);
                                setIsExporting(false);
                                setDownloadZipBlob(null);
                              }}
                              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-700 cursor-pointer"
                            >
                              Reset Wizard
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center p-8">
                          <RefreshCw className="animate-spin text-blue-500" size={32} />
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-300/10">
                        <button
                          onClick={() => setExportStep(2)}
                          disabled={exportProgress < 100}
                          className="px-4 py-2 border border-slate-300/20 hover:bg-slate-300/10 text-slate-300 text-xs font-bold rounded-lg cursor-pointer disabled:opacity-40"
                        >
                          ← Back
                        </button>
                      </div>
                    </div>
                  )}

                  {/* DUPLICATE AND BROKEN URL FINDER UTILITY */}
                  <div className={`p-5 rounded-xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers size={14} className="text-indigo-400" /> SEO Quality & Content Duplicate Finder
                    </h3>
                    <p className="text-[11px] text-slate-400 mb-4">Run dynamic verification loops to analyze database duplication or missing featured images.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-slate-400/5 rounded-lg border border-slate-300/10 text-xs">
                        <span className="font-bold text-slate-300 block mb-1">Duplicate Titles</span>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">0 duplicate titles</span>
                          <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 rounded text-[9px] font-mono font-bold">Passed</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-400/5 rounded-lg border border-slate-300/10 text-xs">
                        <span className="font-bold text-slate-300 block mb-1">Duplicate Slugs</span>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">0 duplicate slugs</span>
                          <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 rounded text-[9px] font-mono font-bold">Passed</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-400/5 rounded-lg border border-slate-300/10 text-xs">
                        <span className="font-bold text-slate-300 block mb-1">Broken Images</span>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">All URLs reachable</span>
                          <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 rounded text-[9px] font-mono font-bold">Passed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: FLOATING SUMMARY & SECONDARY PANEL (30% WIDTH) */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-4">
                  
                  {/* FLOATING ACTION SUMMARY */}
                  <div className={`p-5 rounded-2xl border shadow-lg transition-all duration-300 ${
                    selectedIds.length > 0 
                      ? "ring-2 ring-blue-500/20 bg-gradient-to-b from-blue-500/5 to-transparent" 
                      : ""
                  } ${
                    isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-300/10 pb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${selectedIds.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
                        📊 Selection Overview
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                        selectedIds.length > 0 
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : "bg-slate-500/10 text-slate-500"
                      }`}>
                        {selectedIds.length > 0 ? "Active Selection" : "Empty"}
                      </span>
                    </h3>

                    {selectedIds.length === 0 ? (
                      <div className="py-6 text-center space-y-2">
                        <p className="text-xs text-slate-400 italic">No items selected yet.</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Please check individual posts in the table, or use <strong>"Export All Posts"</strong> above to populate.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-300/5">
                          <span className="text-slate-400 font-medium">Selected Articles:</span>
                          <span className="font-mono font-bold text-blue-500 dark:text-sky-400">{selectedIds.length} Posts</span>
                        </div>
                        
                        <div className="flex justify-between py-1 border-b border-slate-300/5">
                          <span className="text-slate-400 font-medium">Inline Media Assets:</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                            {posts.filter(p => selectedIds.includes(p.ID)).reduce((acc, p) => acc + (p["Gallery Images"]?.length || 0) + (p["Featured Image"] ? 1 : 0), 0)} Images
                          </span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-300/5">
                          <span className="text-slate-400 font-medium">Compression Level:</span>
                          <span className="font-mono text-indigo-500 dark:text-indigo-400 font-bold">Deflate (Lvl {settings.zip_compression})</span>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-300/10">
                          <span className="text-slate-400 font-medium">Estimated ZIP Size:</span>
                          <span className="font-mono font-bold text-amber-500">
                            {(posts.filter(p => selectedIds.includes(p.ID)).reduce((acc, p) => {
                              const count = (p["Gallery Images"]?.length || 0) + (p["Featured Image"] ? 1 : 0);
                              return acc + (p["Word Count"] * 0.01 + count * 1.5 + 0.2);
                            }, 0)).toFixed(1)} MB
                          </span>
                        </div>

                        {/* LIVE SELECTION COVERAGE PROGRESS BAR */}
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                            <span>Workspace Selection Coverage:</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{Math.round((selectedIds.length / posts.length) * 100)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-300/20 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${(selectedIds.length / posts.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      {/* Hot Shortcuts Help Panel */}
                      <div className="p-3 bg-slate-300/5 rounded-xl border border-slate-300/10 space-y-1.5 text-[10px] text-slate-400 mb-4">
                        <span className="font-bold text-slate-500 dark:text-slate-300 block mb-1">⌨️ Hotkeys Cheatsheet</span>
                        <div className="flex justify-between">
                          <span>Focus Search query</span>
                          <span className="font-mono bg-slate-300/10 px-1 rounded">Ctrl + F</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Select all posts</span>
                          <span className="font-mono bg-slate-300/10 px-1 rounded">Ctrl + A</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Start backup packing</span>
                          <span className="font-mono bg-slate-300/10 px-1 rounded">Ctrl + E</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Clear all query filters</span>
                          <span className="font-mono bg-slate-300/10 px-1 rounded">Esc</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (exportStep < 3) {
                            setExportStep(exportStep + 1);
                            if (exportStep === 2) {
                              handleExecuteExport();
                            }
                          }
                        }}
                        disabled={selectedIds.length === 0 || exportStep === 3}
                        className="w-full py-2.5 bg-[#2271b1] hover:bg-[#1f5f92] text-white font-bold rounded-lg shadow-md disabled:opacity-45 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      >
                        <Play size={12} />
                        {exportStep === 1 ? "Next: Choose Options" : exportStep === 2 ? "Run Backup Package" : "Archiving Active"}
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* RECENT EXPORTS PANEL */}
              <div className={`p-6 rounded-2xl border shadow-lg space-y-4 mt-6 ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className="flex items-center justify-between border-b border-slate-300/10 pb-3">
                  <div className="flex items-center gap-2">
                    <History className="text-emerald-500" size={18} />
                    <h3 className="font-bold text-sm uppercase tracking-wide text-slate-800 dark:text-slate-100">
                      Recent Exports & Backup Archive History
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-500 font-mono text-[10px] rounded-full font-bold">
                    {history.length} Saved {history.length === 1 ? "Backup" : "Backups"}
                  </span>
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-slate-300/20 rounded-xl">
                    <Database className="mx-auto text-slate-400 opacity-40 mb-2" size={28} />
                    <p className="text-xs text-slate-400">No backup history entries found. Create an export above to list backups here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-slate-300/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                          <th className="py-2 pb-3">Status</th>
                          <th className="py-2 pb-3">ZIP Archive Name</th>
                          <th className="py-2 pb-3">Generated Date</th>
                          <th className="py-2 pb-3 text-center">Posts Count</th>
                          <th className="py-2 pb-3 text-center">Images Count</th>
                          <th className="py-2 pb-3 text-right">Archive Size</th>
                          <th className="py-2 pb-3 text-right pr-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300/5">
                        {history.map((h, idx) => (
                          <tr key={idx} className="hover:bg-slate-400/5 transition-colors group">
                            <td className="py-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-500 font-mono uppercase">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                                {h.status || "success"}
                              </span>
                            </td>
                            <td className="py-3 font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-500 transition-colors">
                              {h.zip_name}
                            </td>
                            <td className="py-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                              📅 {h.timestamp}
                            </td>
                            <td className="py-3 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
                              {h.posts_count}
                            </td>
                            <td className="py-3 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
                              {h.images_count}
                            </td>
                            <td className="py-3 text-right font-semibold font-mono text-amber-500">
                              {h.size}
                            </td>
                            <td className="py-3 text-right pr-2">
                              <div className="flex gap-2 justify-end">
                                <a 
                                  href={h.blob_url || downloadZipBlob || "#"}
                                  download={h.zip_name}
                                  onClick={(e) => {
                                    if (!h.blob_url && !downloadZipBlob) {
                                      e.preventDefault();
                                      addSystemLog(`Regenerating package for ${h.zip_name} on-demand...`, "info");
                                      handleExecuteExport();
                                    }
                                  }}
                                  className="px-3 py-1 bg-[#2271b1] hover:bg-blue-600 text-white text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                                >
                                  <DownloadCloud size={10} /> Download Again
                                </a>
                                <button 
                                  onClick={() => {
                                    setHistory(prev => prev.filter((_, i) => i !== idx));
                                    addSystemLog(`Backup record ${h.zip_name} removed from registry index.`, "info");
                                  }}
                                  className="px-2 py-1 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 text-[10px] font-bold rounded transition-all cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* IMPORT POSTS TAB SCREEN */}
          {activeMenu === "pbrp-import" && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              <div className="border-b border-slate-300/20 pb-4">
                <h1 className="text-2xl font-bold tracking-tight">Import Backup Packages</h1>
                <p className="text-xs text-slate-400 mt-1">Upload an archived backup ZIP and configure post conflicts strategies prior to restore.</p>
              </div>

              {/* Progress Panel for importing */}
              {isImporting && (
                <div className={`border rounded-xl p-5 space-y-4 ${
                  importWarning 
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
                    : importError 
                      ? "bg-red-500/10 border-red-500/30 text-red-500" 
                      : "bg-blue-600/5 border-blue-500/20"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(importWarning || importError) ? (
                        <AlertTriangle className="animate-pulse text-amber-500" size={16} />
                      ) : (
                        <RefreshCw className="animate-spin text-blue-500" size={16} />
                      )}
                      <span className={`text-xs font-semibold uppercase ${
                        importWarning ? "text-amber-500" : importError ? "text-red-500" : "text-blue-500"
                      }`}>
                        {importWarning 
                          ? "Security Event Isolated (Restoration Paused)" 
                          : importError 
                            ? "Restore Halted on Critical Error" 
                            : "Executing ZIP Database Restore"
                        }
                      </span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${
                      importWarning ? "text-amber-500" : importError ? "text-red-500" : "text-blue-500"
                    }`}>{importProgress}%</span>
                  </div>
                  
                  <div className="w-full h-2 bg-slate-300/15 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${
                      importWarning ? "bg-amber-500" : importError ? "bg-red-500" : "bg-blue-500"
                    }`} style={{ width: `${importProgress}%` }} />
                  </div>

                  <p className={`text-xs font-mono ${
                    importWarning ? "text-amber-300/80" : importError ? "text-red-300/80" : "text-slate-400"
                  }`}>{importLog}</p>

                  {(importWarning || importError) && (
                    <div className="pt-3 border-t border-slate-300/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-300/5 p-3.5 rounded-lg">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase block text-slate-400">Security Response System</span>
                        <p className="text-xs text-slate-300">
                          {importWarning 
                            ? "A Directory Traversal / Zip Slip vulnerability attack was safely intercepted and blocked. The file was skipped to protect your server. Choose how to proceed below:"
                            : "A critical error has occurred. State must be reset before executing subsequent operations."
                          }
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleAbortRestore}
                          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow cursor-pointer transition-colors"
                        >
                          Abort / Reset
                        </button>
                        {importWarning && (
                          <button
                            type="button"
                            onClick={handleResumeRestore}
                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold rounded shadow cursor-pointer transition-colors"
                          >
                            Proceed with Valid Files
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {importComplete && importSummary && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 size={18} />
                    <span className="font-bold text-sm">Backup Restored Successfully!</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Your database has synced successfully. {importSummary.posts} posts and {importSummary.images} inline attachments were completely integrated.
                  </p>
                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        setImportComplete(false);
                        setUploadedFile(null);
                        setImportSummary(null);
                        setSimulateZipSlip(false);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded shadow cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              {/* Double grid setup: ZIP Drop block & configuration mapping */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* File select drop zone */}
                <div className={`md:col-span-7 p-6 rounded-xl border flex flex-col justify-center min-h-[250px] ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-4">ZIP Archive Source</h3>

                  {!uploadedFile ? (
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                        dragActive 
                          ? "border-[#2271b1] bg-blue-500/5" 
                          : "border-slate-300/30 hover:border-[#2271b1] hover:bg-slate-300/5"
                      }`}
                    >
                      <UploadCloud size={40} className="text-slate-400 mb-3" />
                      <h4 className="text-sm font-semibold mb-1">Drag & Drop backup ZIP here</h4>
                      <p className="text-xs text-slate-400 mb-4">or select a local computer asset</p>
                      
                      <div className="flex flex-col items-center gap-2">
                        <label className="px-3.5 py-1.5 bg-[#2271b1] hover:bg-[#1a5587] text-white text-xs font-semibold rounded shadow cursor-pointer">
                          Browse Files
                          <input 
                            type="file" 
                            accept=".zip" 
                            onChange={handleFileChange}
                            className="hidden" 
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFile({ name: "wordpress-backup-exploit-zip-slip.zip", size: 1045020 });
                            setSimulateZipSlip(true);
                            setImportSummary({
                              posts: 4,
                              images: 3,
                              categories: ["Security", "Exploits", "Patching"],
                              tags: ["Directory Traversal", "Vulnerability Test", "Zip Slip Mitigation"]
                            });
                            addSystemLog("Loaded simulated Zip Slip test backup: wordpress-backup-exploit-zip-slip.zip", "warning");
                          }}
                          className="mt-4 text-[11px] font-semibold text-amber-500 hover:text-amber-600 underline cursor-pointer bg-transparent border-0"
                        >
                          ⚠️ Simulate Uploading a Malicious ZIP (Zip Slip Attack Demo)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-300/5 border border-slate-300/10 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="text-sky-500" size={24} />
                        <div>
                          <span className="text-xs font-bold block truncate max-w-xs">{uploadedFile.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setUploadedFile(null);
                          setImportSummary(null);
                          setSimulateZipSlip(false);
                        }}
                        className="p-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded cursor-pointer"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Import options */}
                <div className={`md:col-span-5 p-6 rounded-xl border ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-4">Restore Configuration</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold block mb-1">Conflict Strategy</label>
                      <select 
                        value={duplicateStrategy}
                        onChange={(e) => setDuplicateStrategy(e.target.value)}
                        className={`w-full text-xs px-3 py-2 rounded border focus:outline-none ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                        }`}
                      >
                        <option value="skip">Skip duplicates (Preserve existing)</option>
                        <option value="replace">Overwrite existing matches</option>
                        <option value="rename">Rename imported (Create replica)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">Restore Target Block</label>
                      <select 
                        value={restoreStrategy}
                        onChange={(e) => setRestoreStrategy(e.target.value)}
                        className={`w-full text-xs px-3 py-2 rounded border focus:outline-none ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                        }`}
                      >
                        <option value="all">Sideload everything (Posts, SEO & Media)</option>
                        <option value="content">Only insert raw text content</option>
                        <option value="new">Only parse missing nodes</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Integrity Analysis preview block if file uploaded */}
              {uploadedFile && importSummary && !isImporting && !importComplete && (
                <div className={`p-6 rounded-xl border shadow-sm space-y-4 ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="flex items-center gap-2 text-sky-500 border-b border-slate-300/10 pb-3">
                    <Info size={16} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">ZIP Integrity Audit Preview</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-slate-300/5 p-3 rounded border border-slate-300/10">
                      <span className="text-xl font-bold font-mono block text-[#2271b1]">{importSummary.posts}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Posts detected</span>
                    </div>
                    <div className="bg-slate-300/5 p-3 rounded border border-slate-300/10">
                      <span className="text-xl font-bold font-mono block text-[#2271b1]">{importSummary.images}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Images bundled</span>
                    </div>
                    <div className="bg-slate-300/5 p-3 rounded border border-slate-300/10">
                      <span className="text-sm font-bold truncate block py-1 font-mono text-slate-400">Yoast / RankMath</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">SEO Meta Found</span>
                    </div>
                    <div className={`p-3 rounded border ${
                      isMaliciousZip 
                        ? "bg-amber-500/10 border-amber-500/30" 
                        : "bg-slate-300/5 border-slate-300/10"
                    }`}>
                      <span className={`text-sm font-bold block py-1 font-mono ${
                        isMaliciousZip ? "text-amber-500" : "text-emerald-500"
                      }`}>
                        {isMaliciousZip ? "TRAVERSAL ALERT" : "SECURE"}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Zip Slip Audit</span>
                    </div>
                  </div>

                  {isMaliciousZip && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-500 space-y-1">
                      <p className="font-semibold flex items-center gap-1">
                        <AlertTriangle size={14} /> Potential Security Hazard Detected
                      </p>
                      <p className="text-slate-300">
                        This ZIP file name or contents indicate a Zip Slip/Directory Traversal exploit vector. The new secure PHP extraction logic will safely skip malicious filepaths and extract only clean, safe database/posts files.
                      </p>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs">
                    <p><span className="text-slate-400">Detected Categories:</span> {importSummary.categories.join(", ")}</p>
                    <p><span className="text-slate-400">Detected Tags:</span> {importSummary.tags.join(", ")}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-300/10 flex items-center justify-end gap-2">
                    <button 
                      onClick={() => {
                        setUploadedFile(null);
                        setSimulateZipSlip(false);
                      }}
                      className="px-3 py-1.5 border border-slate-300/30 text-xs font-semibold rounded hover:bg-slate-300/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleExecuteRestore}
                      className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#1f639a] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <UploadCloud size={14} /> Commit & Restore DB
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* PLUGIN SETTINGS TAB SCREEN */}
          {activeMenu === "pbrp-settings" && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="border-b border-slate-300/20 pb-4">
                <h1 className="text-2xl font-bold tracking-tight">Plugin Configuration</h1>
                <p className="text-xs text-slate-400 mt-1">Configure ZIP levels, maximum execution thresholds, revisions backups, and password protections.</p>
              </div>

              <div className={`p-6 rounded-xl border shadow-sm ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <SettingsIcon size={14} /> Core Engine Parameters
                </h3>

                <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold block mb-1">ZIP Compression Level (1-9)</label>
                      <select 
                        value={settings.zip_compression}
                        onChange={(e) => setSettings({ ...settings, zip_compression: parseInt(e.target.value) })}
                        className={`w-full px-3 py-2 rounded border focus:outline-none ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                        }`}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                          <option key={num} value={num}>Level {num} {num===6 ? "(Recommended)" : ""}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Image Quality Target</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          min={10} 
                          max={100}
                          value={settings.image_quality}
                          onChange={(e) => setSettings({ ...settings, image_quality: parseInt(e.target.value) })}
                          className={`w-24 px-3 py-2 rounded border focus:outline-none ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                          }`}
                        />
                        <span className="font-semibold">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Max Execution Limit</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={settings.max_execution_time}
                          onChange={(e) => setSettings({ ...settings, max_execution_time: parseInt(e.target.value) })}
                          className={`w-32 px-3 py-2 rounded border focus:outline-none ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                          }`}
                        />
                        <span className="font-semibold">seconds</span>
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Chunk Size Boundary</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={settings.chunk_size}
                          onChange={(e) => setSettings({ ...settings, chunk_size: parseInt(e.target.value) })}
                          className={`w-24 px-3 py-2 rounded border focus:outline-none ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                          }`}
                        />
                        <span className="font-semibold">MB</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-300/10 my-6" />

                  <div className="space-y-2.5">
                    <h4 className="font-semibold block mb-1">Optional Sync Attributes</h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.export_comments}
                        onChange={(e) => setSettings({ ...settings, export_comments: e.target.checked })}
                        className="accent-[#2271b1] cursor-pointer"
                      />
                      <span>Backup and export user comments</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.export_drafts}
                        onChange={(e) => setSettings({ ...settings, export_drafts: e.target.checked })}
                        className="accent-[#2271b1] cursor-pointer"
                      />
                      <span>Include Drafts and Pending Reviews in list queries</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.export_revisions}
                        onChange={(e) => setSettings({ ...settings, export_revisions: e.target.checked })}
                        className="accent-[#2271b1] cursor-pointer"
                      />
                      <span>Archive historical post revisions (increases ZIP volume significantly)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.export_attachments}
                        onChange={(e) => setSettings({ ...settings, export_attachments: e.target.checked })}
                        className="accent-[#2271b1] cursor-pointer"
                      />
                      <span>Sniff and compress internal inline content images</span>
                    </label>
                  </div>

                  <div className="h-px bg-slate-300/10 my-6" />

                  <div className="space-y-3">
                    <h4 className="font-semibold block">Advanced Cryptography Layer</h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.aes_encryption}
                        onChange={(e) => setSettings({ ...settings, aes_encryption: e.target.checked })}
                        className="accent-[#2271b1] cursor-pointer"
                      />
                      <span className="font-semibold flex items-center gap-1.5 text-rose-500">
                        <Key size={14} /> Enable Password Protection (AES-256 Bit Encryption)
                      </span>
                    </label>
                    
                    {settings.aes_encryption && (
                      <div>
                        <label className="font-semibold block mb-1">Backup Password</label>
                        <input 
                          type="password" 
                          value={settings.encryption_key}
                          onChange={(e) => setSettings({ ...settings, encryption_key: e.target.value })}
                          className={`w-72 px-3 py-2 rounded border focus:outline-none ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                          }`}
                          placeholder="Provide secure archive password..."
                        />
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-slate-300/10 my-6" />

                  {/* Backup Exclusions section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5">
                      <Folder size={14} className="text-[#2271b1]" />
                      <h4 className="font-semibold block text-sm">Space-Saving Backup Exclusions</h4>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Define specific file extensions or folder directory paths to omit from compilation to significantly reduce final ZIP package sizes.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Extensions Exclusions */}
                      <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                        <label className="font-semibold block mb-2 text-xs">Exclude File Extensions</label>
                        <div className="flex gap-2 mb-3">
                          <input 
                            type="text"
                            value={newExtension}
                            onChange={(e) => setNewExtension(e.target.value)}
                            placeholder="e.g. .mp4"
                            className={`flex-1 px-2 py-1.5 rounded border text-xs focus:outline-none ${
                              isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"
                            }`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newExtension.trim() && !settings.exclude_extensions.includes(newExtension.trim().toLowerCase())) {
                                  const ext = newExtension.trim().toLowerCase();
                                  setSettings({
                                    ...settings,
                                    exclude_extensions: [...settings.exclude_extensions, ext.startsWith('.') ? ext : '.' + ext]
                                  });
                                  setNewExtension("");
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newExtension.trim() && !settings.exclude_extensions.includes(newExtension.trim().toLowerCase())) {
                                const ext = newExtension.trim().toLowerCase();
                                setSettings({
                                  ...settings,
                                  exclude_extensions: [...settings.exclude_extensions, ext.startsWith('.') ? ext : '.' + ext]
                                });
                                setNewExtension("");
                              }
                            }}
                            className="px-3 py-1 bg-[#2271b1] hover:bg-[#1a558a] text-white text-xs font-semibold rounded cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-400/5 rounded border border-slate-300/10">
                          {settings.exclude_extensions.length === 0 ? (
                            <span className="text-[10px] text-slate-400 italic p-1">No extensions excluded</span>
                          ) : (
                            settings.exclude_extensions.map(ext => (
                              <span key={ext} className="inline-flex items-center gap-1 bg-[#2271b1]/10 text-[#2271b1] dark:text-sky-400 dark:bg-sky-400/15 px-2 py-0.5 rounded text-[10px] font-mono">
                                {ext}
                                <button
                                  type="button"
                                  onClick={() => setSettings({
                                    ...settings,
                                    exclude_extensions: settings.exclude_extensions.filter(x => x !== ext)
                                  })}
                                  className="text-slate-400 hover:text-red-500 cursor-pointer"
                                >
                                  <X size={10} />
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Folder Exclusions */}
                      <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                        <label className="font-semibold block mb-2 text-xs">Exclude Folder Directories</label>
                        <div className="flex gap-2 mb-3">
                          <input 
                            type="text"
                            value={newFolder}
                            onChange={(e) => setNewFolder(e.target.value)}
                            placeholder="e.g. wp-content/cache"
                            className={`flex-1 px-2 py-1.5 rounded border text-xs focus:outline-none ${
                              isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"
                            }`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newFolder.trim() && !settings.exclude_folders.includes(newFolder.trim())) {
                                  setSettings({
                                    ...settings,
                                    exclude_folders: [...settings.exclude_folders, newFolder.trim()]
                                  });
                                  setNewFolder("");
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newFolder.trim() && !settings.exclude_folders.includes(newFolder.trim())) {
                                setSettings({
                                  ...settings,
                                  exclude_folders: [...settings.exclude_folders, newFolder.trim()]
                                });
                                setNewFolder("");
                              }
                            }}
                            className="px-3 py-1 bg-[#2271b1] hover:bg-[#1a558a] text-white text-xs font-semibold rounded cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-400/5 rounded border border-slate-300/10">
                          {settings.exclude_folders.length === 0 ? (
                            <span className="text-[10px] text-slate-400 italic p-1">No folders excluded</span>
                          ) : (
                            settings.exclude_folders.map(fld => (
                              <span key={fld} className="inline-flex items-center gap-1 bg-[#2271b1]/10 text-[#2271b1] dark:text-sky-400 dark:bg-sky-400/15 px-2 py-0.5 rounded text-[10px] font-mono">
                                {fld}
                                <button
                                  type="button"
                                  onClick={() => setSettings({
                                    ...settings,
                                    exclude_folders: settings.exclude_folders.filter(x => x !== fld)
                                  })}
                                  className="text-slate-400 hover:text-red-500 cursor-pointer"
                                >
                                  <X size={10} />
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-300/10 my-6" />

                  {/* Scheduled Backups panel */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[#2271b1]" />
                      <h4 className="font-semibold block text-sm">Automated Backup Scheduling</h4>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Configure background cron automation to schedule periodic archives and enforce local retention storage limits.
                    </p>

                    <div className={`p-5 rounded-lg border ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"} space-y-4`}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.schedule_enabled}
                          onChange={(e) => setSettings({ ...settings, schedule_enabled: e.target.checked })}
                          className="accent-[#2271b1] cursor-pointer"
                        />
                        <span className="font-semibold text-xs">Enable Scheduled Automated Backups</span>
                      </label>

                      {settings.schedule_enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                          <div>
                            <label className="font-semibold block mb-1 text-slate-400">Interval Frequency</label>
                            <select 
                              value={settings.schedule_interval}
                              onChange={(e) => setSettings({ ...settings, schedule_interval: e.target.value as any })}
                              className={`w-full px-3 py-2 rounded border focus:outline-none ${
                                isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"
                              }`}
                            >
                              <option value="daily">Daily Cron Loop (Every midnight)</option>
                              <option value="weekly">Weekly Cron Loop (Sunday 00:00)</option>
                              <option value="monthly">Monthly Cron Loop (1st of month)</option>
                            </select>
                          </div>

                          <div>
                            <label className="font-semibold block mb-1 text-slate-400">Local Retention Limit</label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                min={1}
                                max={50}
                                value={settings.schedule_retention_limit}
                                onChange={(e) => setSettings({ ...settings, schedule_retention_limit: parseInt(e.target.value) || 5 })}
                                className={`w-24 px-3 py-2 rounded border focus:outline-none ${
                                  isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"
                                }`}
                              />
                              <span className="font-medium text-slate-400">past backups kept</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">Older local backup ZIP packages will be safely purged.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-300/10">
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-[#2271b1] hover:bg-[#1a558a] text-white font-semibold rounded shadow cursor-pointer"
                    >
                      Save Settings
                    </button>
                  </div>

                </form>
              </div>

            </div>
          )}

          {/* SYSTEM ACTIVITY LOGS TAB SCREEN */}
          {activeMenu === "pbrp-logs" && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-300/20 pb-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">System Activity Logs</h1>
                  <p className="text-xs text-slate-400 mt-1">Audit exact step-by-step unzipping, checksum, directory validation, and indexing tasks.</p>
                </div>
                <button 
                  onClick={handleClearLogs}
                  disabled={logs.length === 0}
                  className="px-3 py-1.5 border border-red-500/20 text-red-500 hover:bg-red-500/5 text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Trash size={14} /> Clear Log History
                </button>
              </div>

              {/* Console log box */}
              <div className="bg-slate-950 text-slate-100 rounded-lg shadow-xl border border-slate-800 overflow-hidden">
                
                {/* Visual console dots */}
                <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-1.5 border-b border-slate-800">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-slate-500 font-mono ml-3">post_backup_restore_pro.log</span>
                </div>

                {/* Log messages lists */}
                <div className="p-4 font-mono text-xs leading-6 overflow-y-auto max-h-[500px] divide-y divide-slate-800">
                  {logs.length === 0 ? (
                    <p className="text-slate-500 italic py-6 text-center">Your log sheet is completely pristine!</p>
                  ) : (
                    logs.slice().reverse().map((l, i) => (
                      <div key={i} className="py-2 flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-slate-500 select-none">[{l.timestamp}]</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-sans uppercase tracking-wide ${
                            l.type === "success" 
                              ? "bg-emerald-500/10 text-emerald-400" 
                              : l.type === "warning"
                                ? "bg-amber-500/10 text-amber-400"
                                : l.type === "error"
                                  ? "bg-rose-500/10 text-rose-400"
                                  : "bg-blue-500/10 text-blue-400"
                          }`}>
                            {l.type}
                          </span>
                          <span className={l.type === "error" ? "text-rose-400" : ""}>{l.message}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ABOUT DEVELOPER TAB SCREEN */}
          {activeMenu === "pbrp-developer" && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="border-b border-slate-300/20 pb-4">
                <h1 className="text-2xl font-bold tracking-tight">About Developer</h1>
                <p className="text-xs text-slate-400 mt-1">Get in touch with the creator of Post Backup & Restore Pro.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Bio Block */}
                <div className={`md:col-span-7 p-6 rounded-xl border flex flex-col justify-between ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-[#2271b1] rounded-full flex items-center justify-center font-bold text-white text-lg">
                        AS
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Atif Syed</h2>
                        <span className="text-xs text-slate-400 block font-semibold">Senior WordPress Plugin Architect & Security Engineer</span>
                      </div>
                    </div>

                    <div className="text-xs leading-relaxed text-slate-400 space-y-3">
                      <p>
                        With over a decade of core WordPress, full-stack, and security engineering experience, Atif Syed is committed to writing secure, highly performant, and beginner-friendly WordPress tools.
                      </p>
                      <p>
                        Post Backup & Restore Pro was designed with one specific focus: eliminating the over-engineering, sluggish performance, and safety vulnerabilities characteristic of general-purpose site migration tools. By zooming in specifically on post entries, content tags, categories, internal links, and inline media attachments, it gets the job done securely and instantly.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-300/10 flex flex-col sm:flex-row gap-3">
                    <a 
                      href="http://iatifsyed.github.io/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#2271b1] hover:bg-[#1a5585] text-white text-xs font-semibold rounded text-center shadow flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Compass size={14} /> Developer Website
                    </a>
                    <a 
                      href="http://github.com/iatifsyed" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded text-center shadow border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink size={14} /> GitHub Profile
                    </a>
                  </div>
                </div>

                {/* Contacts & Donate Panel */}
                <div className="md:col-span-5 space-y-6">
                  
                  <div className={`p-6 rounded-xl border ${
                    isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-4">Contact Information</h3>
                    <ul className="space-y-3 text-xs">
                      <li className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400 w-16">Contact:</span>
                        <span>+92-300-4860591</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400 w-16">Email:</span>
                        <span className="font-mono">aliasgharswl101@gmail.com</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400 w-16">Location:</span>
                        <span>Lahore, Pakistan</span>
                      </li>
                    </ul>
                  </div>

                  <div className={`p-6 rounded-xl border bg-rose-500/5 border-rose-500/20 ${
                    isDarkMode ? "" : "bg-rose-50"
                  }`}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-3 flex items-center gap-1">
                      <Heart size={14} /> Sponsor Open-Source Work
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      If this tool helps migrate client content or saves server bandwidth, consider buying Atif Syed a coffee. Sponsoring maintains free open-source releases!
                    </p>
                    <a 
                      href="https://github.com/sponsors/iatifsyed" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded shadow flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Heart size={14} /> Sponsor via GitHub Sponsors
                    </a>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* CODE EXPLORER SCREEN */}
          {activeMenu === "pbrp-code-explorer" && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300/20 pb-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-teal-400 font-mono">Plugin Source Code</h1>
                  <p className="text-xs text-slate-400 mt-1">Review the complete enterprise-grade OOP PHP architecture of Post Backup & Restore Pro.</p>
                </div>
                <div>
                  <a 
                    href="/api/download-plugin-zip"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <DownloadCloud size={14} /> Download Installable Plugin ZIP
                  </a>
                </div>
              </div>

              {/* Workspace tree and code editor block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
                
                {/* Code tree */}
                <div className="lg:col-span-4 bg-[#0d131f] border border-slate-800 rounded-xl p-4 overflow-y-auto max-h-[600px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-3 font-mono tracking-wider">File Directory Tree</span>
                  
                  {isLoadingFiles ? (
                    <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                      <RefreshCw size={16} className="animate-spin text-[#2271b1]" /> Scanning codebase...
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {pluginFiles.map(node => renderFileNode(node))}
                    </div>
                  )}
                </div>

                {/* Editor display */}
                <div className="lg:col-span-8 bg-[#090d16] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                  
                  {/* Editor status tab */}
                  <div className="bg-[#0b111e] px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs font-mono">
                    <span className="text-teal-400">{selectedFile ? selectedFile.path : "Select a file to read"}</span>
                    <span className="text-slate-500">PHP 8.0 Engine</span>
                  </div>

                  {/* Code box */}
                  <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-5 text-slate-300 max-h-[520px] bg-[#090d16]">
                    {selectedFile && selectedFile.content ? (
                      <pre className="whitespace-pre overflow-x-auto selection:bg-[#2271b1]">
                        <code>
                          {selectedFile.content}
                        </code>
                      </pre>
                    ) : (
                      <div className="py-32 text-center text-slate-500 italic">
                        Select any PHP, txt, or json file from the left directory column to inspect its contents.
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}

        </main>

      </div>

      {/* GLOBAL TOAST NOTIFICATION CORNER */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none p-4">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => {
            const bgClass = {
              success: "bg-emerald-50 dark:bg-slate-900 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-100 shadow-emerald-500/5",
              error: "bg-red-50 dark:bg-slate-900 border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-100 shadow-red-500/5",
              warning: "bg-amber-50 dark:bg-slate-900 border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-100 shadow-amber-500/5",
              info: "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-slate-500/5"
            }[toast.type];

            const icon = {
              success: <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} />,
              error: <AlertTriangle className="text-red-500 flex-shrink-0" size={18} />,
              warning: <AlertTriangle className="text-amber-500 flex-shrink-0" size={18} />,
              info: <Info className="text-blue-500 dark:text-sky-400 flex-shrink-0" size={18} />
            }[toast.type];

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.85, filter: "blur(4px)", transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className={`pointer-events-auto relative p-4 rounded-xl border shadow-lg flex items-start gap-3 justify-between overflow-hidden backdrop-blur-md ${bgClass}`}
                style={{ width: "100%" }}
              >
                <div className="flex gap-2.5 items-start">
                  <div className="mt-0.5">{icon}</div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold leading-normal">{toast.message}</p>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono block uppercase tracking-wider">
                      {toast.type} • Notification
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setToasts(prev => prev.filter(t => t.id !== toast.id));
                  }}
                  className="p-1 hover:bg-slate-400/10 dark:hover:bg-slate-500/10 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0 cursor-pointer"
                >
                  <X size={14} />
                </button>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-200/20 dark:bg-slate-800/20 overflow-hidden">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: 0 }}
                    transition={{ duration: (toast.duration || 4000) / 1000, ease: "linear" }}
                    className={`h-full ${
                      {
                        success: "bg-emerald-500",
                        error: "bg-red-500",
                        warning: "bg-amber-500",
                        info: "bg-blue-500 dark:bg-sky-400"
                      }[toast.type]
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
