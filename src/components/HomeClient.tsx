"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Briefcase, Search, PenLine, Building2, ShieldCheck, ArrowRight, Star, Coins, MessageSquare, X, Clock, Trash2, Loader2 } from "lucide-react";
import { ReviewCard, Review } from "@/components/ReviewCard";
import { ReviewModal } from "@/components/ReviewModal";
import { ShareCardModal } from "@/components/ShareCardModal";

type Props = {
  user?: { id?: string | null; name?: string | null; email?: string | null; image?: string | null; role?: string | null } | null;
  recentReviews: Review[];
};

function TypingTitle() {
  const words = ["Get", "Good", "Go", "Growth"];
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReduced(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsReduced(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (isReduced) {
      setCurrentText(words[wordIndex]);
      const timer = setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 2500);
      return () => clearTimeout(timer);
    }

    let timer: NodeJS.Timeout;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      if (currentText.length <= 1) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      } else {
        timer = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length - 1));
        }, 75);
      }
    } else {
      if (currentText === currentWord) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      } else {
        timer = setTimeout(() => {
          // ในกรณีเริ่มต้นที่ค่าว่าง ให้พิมพ์ตัวแรก หรือถ้าพิมพ์อยู่ให้พิมพ์ตัวถัดไป
          const nextLength = currentText.length === 0 ? 1 : currentText.length + 1;
          setCurrentText(currentWord.substring(0, nextLength));
        }, 150);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, isReduced]);

  return (
    <>
      <span className="text-primary-ink">{currentText}</span>
      {!isReduced && (
        <span className="font-light cursor-blink text-primary-ink -ml-0.5">|</span>
      )}
    </>
  );
}

export function HomeClient({ user, recentReviews }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [shareReview, setShareReview] = useState<Review | null>(null);

  // States for search interaction
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [uniqueCompanies, setUniqueCompanies] = useState<string[]>([]);
  const [uniquePositions, setUniquePositions] = useState<string[]>([]);
  const [deletingItems, setDeletingItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLFormElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const POPULAR_COMPANIES = ["LINE", "Agoda", "Shopee", "SCG", "KBTG"];
  const POPULAR_POSITIONS = ["Software Engineer", "UX/UI Designer", "Product Manager", "Data Analyst"];

  // Handle cached hero image: onLoad won't fire if already cached
  useEffect(() => {
    if (heroImgRef.current?.complete) {
      setHeroImgLoaded(true);
    }
  }, []);

  // Intersection Observer for Scroll Reveal (Features + Reviews + Stats + CTA)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === featuresRef.current) {
              setFeaturesVisible(true);
              observer.unobserve(entry.target);
            } else if (entry.target === reviewsRef.current) {
              setReviewsVisible(true);
              observer.unobserve(entry.target);
            } else if (entry.target === statsRef.current) {
              setStatsVisible(true);
              observer.unobserve(entry.target);
            } else if (entry.target === ctaRef.current) {
              setCtaVisible(true);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (reviewsRef.current) observer.observe(reviewsRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Load recent searches
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gintern_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, []);

  // Extract unique companies and positions from reviews
  useEffect(() => {
    if (recentReviews && recentReviews.length > 0) {
      const companies = new Set<string>();
      const positions = new Set<string>();
      recentReviews.forEach((review) => {
        if (review.company?.name) {
          companies.add(review.company.name);
        }
        if (review.position) {
          positions.add(review.position);
        }
      });
      setUniqueCompanies(Array.from(companies));
      setUniquePositions(Array.from(positions));
    }
  }, [recentReviews]);

  // Click outside and focus outside to close dropdown
  useEffect(() => {
    const handleInteractionOutside = (e: Event) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleInteractionOutside);
    document.addEventListener("focusin", handleInteractionOutside);
    return () => {
      document.removeEventListener("mousedown", handleInteractionOutside);
      document.removeEventListener("focusin", handleInteractionOutside);
    };
  }, []);

  // Keyboard Shortcut: กด / เพื่อโฟกัสช่องค้นหาหลัก
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.getAttribute("contenteditable") === "true";
      if (e.key === "/" && !isInput) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addToRecentSearches = (query: string) => {
    if (!query || !query.trim()) return;
    const trimmed = query.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem("gintern_recent_searches", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const removeFromRecentSearches = (e: React.MouseEvent, queryToRemove: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // เริ่มอนิเมชันสไลด์ออก
    setDeletingItems((prev) => [...prev, queryToRemove]);
    
    // ดึงโฟกัสให้อยู่ที่กล่องข้อความค้นหาหลักเพื่อรักษาเมนู dropdown ไว้
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // รออนิเมชันการยุบตัวและเลื่อนออกทำงาน 300ms จึงทำการลบค่าจริงจาก state/localStorage
    setTimeout(() => {
      setRecentSearches((prev) => {
        const updated = prev.filter((item) => item !== queryToRemove);
        try {
          localStorage.setItem("gintern_recent_searches", JSON.stringify(updated));
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      setDeletingItems((prev) => prev.filter((item) => item !== queryToRemove));
      setActiveIndex(-1);
    }, 300);
  };

  const selectSuggestion = (val: string) => {
    setSearchQuery(val);
    addToRecentSearches(val);
    setIsDropdownOpen(false);
    router.push(`/search?q=${encodeURIComponent(val)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    addToRecentSearches(searchQuery);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Get autocomplete recommendations
  const getFilteredSuggestions = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();

    const matchedCompanies = Array.from(new Set([...uniqueCompanies, ...POPULAR_COMPANIES]))
      .filter((c) => c.toLowerCase().includes(query))
      .slice(0, 3)
      .map((c) => ({ type: "company" as const, label: c, value: c }));

    const matchedPositions = Array.from(new Set([...uniquePositions, ...POPULAR_POSITIONS]))
      .filter((p) => p.toLowerCase().includes(query))
      .slice(0, 3)
      .map((p) => ({ type: "position" as const, label: p, value: p }));

    return [...matchedCompanies, ...matchedPositions];
  };

  const filteredSuggestions = getFilteredSuggestions();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsDropdownOpen(true);
      }
      return;
    }

    const totalItems = searchQuery.trim()
      ? filteredSuggestions.length
      : recentSearches.length;

    if (totalItems === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < totalItems) {
        e.preventDefault();
        const selectedValue = searchQuery.trim()
          ? filteredSuggestions[activeIndex].value
          : recentSearches[activeIndex];
        selectSuggestion(selectedValue);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return <span>{text}</span>;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <span>{text}</span>;
    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);
    return (
      <span>
        {before}
        <span className="font-semibold text-primary-ink">{match}</span>
        {after}
      </span>
    );
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light via-bg to-accent-pale/60 py-20 sm:py-28 relative">
        {/* Background decorative glows (isolated overflow to avoid clipping absolute dropdown) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/25 rounded-full blur-3xl opacity-70" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-70" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">
          {/* Left Column: Text + Search */}
          <div className="flex-1 flex flex-col items-center md:items-start">
          <h1
            className="text-5xl sm:text-6xl font-bold text-ink mb-4 flex items-center justify-center md:justify-start select-none hero-stagger hero-stagger-1"
            style={{ letterSpacing: "-0.02em", textWrap: "balance" }}
            data-font="ui"
          >
            <TypingTitle />
            <span className="text-slate-800 ml-2">Intern</span>
          </h1>

          <h2
            className="text-xl sm:text-2xl font-medium text-ink/80 mb-3 text-center w-full hero-text-left hero-stagger hero-stagger-2"
            style={{ textWrap: "balance" }}
          >
            รีวิวฝึกงานจากรุ่นพี่ตัวจริง
          </h2>
          <p className="text-muted text-sm sm:text-base mb-8 max-w-lg leading-relaxed text-center w-full hero-text-left hero-stagger hero-stagger-3">
            ค้นหาประสบการณ์จริงจากรุ่นพี่ในสายงานต่างๆ ปลอดภัย โปร่งใส
            <br />
            ไขทุกข้อข้องใจก่อนตัดสินใจเข้าฝึกงานจริง
          </p>

          {/* Quick Search Form */}
          <form onSubmit={handleSubmit} className="relative z-10 max-w-xl mx-auto md:mx-0 mb-6 w-full hero-stagger hero-stagger-4" role="search" ref={containerRef}>
            <div className={`relative w-full rounded-xl bg-white transition-all duration-200 border border-slate-200/60 shadow-md ${isFocused ? 'ring-4 ring-primary/20 border-primary shadow-lg' : 'hover:shadow-lg'}`}>
              <input
                ref={inputRef}
                type="text"
                name="q"
                value={searchQuery}
                onFocus={() => {
                  setIsFocused(true);
                  setIsDropdownOpen(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                aria-label="ค้นหาบริษัทหรือตำแหน่งงาน"
                placeholder="ค้นหาบริษัท, ตำแหน่ง หรือสายงานที่สนใจ..."
                className="w-full bg-transparent py-4 pl-12 pr-32 text-ink placeholder:text-muted outline-none text-base min-h-[44px]"
                role="combobox"
                aria-expanded={isDropdownOpen}
                aria-autocomplete="list"
              />
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted transition-all duration-200 ${isFocused ? 'scale-110 text-primary' : ''}`} />
              
              {/* Shortcut Indicator [/] */}
              <div 
                className={`absolute right-20 sm:right-24 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 hidden sm:flex items-center bg-slate-100 border border-slate-200/80 text-slate-400 px-2 py-0.5 rounded text-[10px] font-mono leading-none ${isFocused || searchQuery ? 'opacity-0 scale-90 invisible' : 'opacity-100 scale-100 visible'}`}
              >
                /
              </div>

              {/* Clear button (X) */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveIndex(-1);
                    inputRef.current?.focus();
                  }}
                  className="absolute right-20 sm:right-24 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                  aria-label="ล้างข้อความค้นหา"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                aria-label="ค้นหาประสบการณ์ฝึกงาน"
                disabled={isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-ink px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 min-w-[64px] justify-center"
                data-font="ui"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "ค้นหา"
                )}
              </button>
            </div>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-xl z-50 overflow-hidden text-left py-3 animate-in">
                {searchQuery.trim() === "" ? (
                  // State A: Empty input
                  <div className="space-y-4">
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5" data-font="ui">
                          <Clock className="w-3.5 h-3.5" />
                          <span>คำค้นหาล่าสุด</span>
                        </div>
                        <div className="mt-1">
                          {recentSearches.map((item, index) => {
                            const isDeleting = deletingItems.includes(item);
                            return (
                              <div
                                key={`recent-${item}`}
                                className={`group/item px-4 flex items-center justify-between cursor-pointer text-sm transition-all duration-300 ease-out overflow-hidden ${
                                  isDeleting 
                                    ? 'max-h-0 py-0 opacity-0 translate-x-12 pointer-events-none' 
                                    : 'max-h-[40px] py-2 opacity-100 translate-x-0'
                                } ${
                                  activeIndex === index 
                                    ? 'bg-primary-light/40 text-primary-ink font-semibold' 
                                    : 'text-ink hover:bg-slate-50'
                                }`}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseDown={(e) => {
                                  if (isDeleting) return;
                                  e.preventDefault();
                                  selectSuggestion(item);
                                }}
                              >
                                <span className="truncate">{item}</span>
                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeFromRecentSearches(e, item);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 relative z-10 animate-trash-hover cursor-pointer"
                                  aria-label="ลบประวัติ"
                                >
                                  <Trash2 className="w-3.5 h-3.5 transition-transform" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider" data-font="ui">
                        ค้นหายอดนิยม
                      </div>
                      <div className="mt-2 px-4 flex flex-wrap gap-2">
                        {POPULAR_COMPANIES.slice(0, 3).map((comp) => (
                          <button
                            key={`popular-comp-${comp}`}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectSuggestion(comp);
                            }}
                            className="group bg-primary-light/35 hover:bg-primary-light/70 text-primary-ink px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border border-primary/10 hover:border-primary/45 shadow-sm hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                          >
                            <Building2 className="w-3 h-3 text-primary-ink/60 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3" />
                            <span>{comp}</span>
                          </button>
                        ))}
                        {POPULAR_POSITIONS.slice(0, 3).map((pos) => (
                          <button
                            key={`popular-pos-${pos}`}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectSuggestion(pos);
                            }}
                            className="group bg-accent-pale/45 hover:bg-accent-pale/80 text-accent-ink px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border border-accent/10 hover:border-accent/45 shadow-sm hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
                          >
                            <Briefcase className="w-3 h-3 text-accent-ink/60 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3" />
                            <span>{pos}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // State B: Typing input
                  <div>
                    {filteredSuggestions.length > 0 ? (
                      <div>
                        {/* Filtered Companies */}
                        {filteredSuggestions.filter(s => s.type === "company").length > 0 && (
                          <div className="mb-2">
                            <div className="px-4 py-1 text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5" data-font="ui">
                              <Building2 className="w-3.5 h-3.5" />
                              <span>บริษัท</span>
                            </div>
                            <div className="mt-1">
                              {filteredSuggestions
                                .map((item, idx) => ({ item, globalIdx: idx }))
                                .filter(({ item }) => item.type === "company")
                                .map(({ item, globalIdx }) => (
                                  <div
                                    key={`company-${item.value}`}
                                    className={`px-4 py-2.5 cursor-pointer text-sm flex items-center gap-2 transition-colors ${
                                      activeIndex === globalIdx
                                        ? 'bg-primary-light/40 text-primary-ink font-semibold'
                                        : 'text-ink hover:bg-slate-50'
                                    }`}
                                    onMouseEnter={() => setActiveIndex(globalIdx)}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      selectSuggestion(item.value);
                                    }}
                                  >
                                    <Building2 className="w-3.5 h-3.5 text-muted shrink-0" />
                                    <span className="truncate">{highlightMatch(item.label, searchQuery)}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Filtered Positions */}
                        {filteredSuggestions.filter(s => s.type === "position").length > 0 && (
                          <div>
                            <div className="px-4 py-1 text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5" data-font="ui">
                              <Briefcase className="w-3.5 h-3.5" />
                              <span>ตำแหน่งงาน</span>
                            </div>
                            <div className="mt-1">
                              {filteredSuggestions
                                .map((item, idx) => ({ item, globalIdx: idx }))
                                .filter(({ item }) => item.type === "position")
                                .map(({ item, globalIdx }) => (
                                  <div
                                    key={`position-${item.value}`}
                                    className={`px-4 py-2.5 cursor-pointer text-sm flex items-center gap-2 transition-colors ${
                                      activeIndex === globalIdx
                                        ? 'bg-primary-light/40 text-primary-ink font-semibold'
                                        : 'text-ink hover:bg-slate-50'
                                    }`}
                                    onMouseEnter={() => setActiveIndex(globalIdx)}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      selectSuggestion(item.value);
                                    }}
                                  >
                                    <Briefcase className="w-3.5 h-3.5 text-muted shrink-0" />
                                    <span className="truncate">{highlightMatch(item.label, searchQuery)}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`px-4 py-3 cursor-pointer text-sm flex items-center gap-2 transition-colors ${
                          activeIndex === 0
                            ? 'bg-primary-light/40 text-primary-ink font-semibold'
                            : 'text-muted hover:bg-slate-50'
                        }`}
                        onMouseEnter={() => setActiveIndex(0)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectSuggestion(searchQuery);
                        }}
                      >
                        <Search className="w-4 h-4 text-muted shrink-0" />
                        <span className="truncate">
                          ค้นหาเกี่ยวกับ <span className="font-bold text-primary-ink">"{searchQuery}"</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </form>

          {/* CTA button: fade out gracefully when dropdown is open to avoid overlap */}
          <div
            className={`flex justify-center md:justify-start hero-stagger hero-stagger-5 transition-all duration-200 ${
              isDropdownOpen
                ? 'opacity-0 pointer-events-none -translate-y-1 scale-95'
                : 'opacity-100 pointer-events-auto translate-y-0 scale-100'
            }`}
          >
            <Link
              href={user ? "/review/new" : "/login"}
              className="inline-flex items-center gap-2 bg-white text-ink border border-border px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 shadow-sm hover:shadow transition-all duration-200 min-h-[44px]"
              data-font="ui"
            >
              <PenLine className="w-4 h-4 text-primary" />
              <span>{user ? "เขียนรีวิวประสบการณ์ของคุณ" : "เข้าร่วมและรีวิวฝึกงาน"}</span>
            </Link>
          </div>
          </div>{/* End Left Column */}

          {/* Right Column: Illustration (Desktop Only) */}
          <div className="hidden md:flex flex-1 items-center justify-center hero-stagger hero-stagger-2">
            <div className="relative w-full max-w-md">
              {/* Decorative ring behind image */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 scale-105 blur-sm" />
              {/* Skeleton: absolute overlay, fade out after image loads */}
              <div
                className={`absolute inset-0 rounded-3xl bg-primary/5 transition-opacity duration-300 pointer-events-none ${
                  heroImgLoaded ? 'opacity-0' : 'animate-pulse opacity-100'
                }`}
              />
              {/* Image always in flow to prevent layout shift */}
              <img
                ref={heroImgRef}
                src="/hero-illustration.png"
                alt="Career discovery illustration"
                width={480}
                height={480}
                loading="eager"
                decoding="async"
                onLoad={() => setHeroImgLoaded(true)}
                className={`relative w-full h-auto object-contain drop-shadow-xl select-none transition-opacity duration-300 ${
                  heroImgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                draggable={false}
              />
            </div>
          </div>

          </div>{/* End flex row */}
        </div>{/* End max-w-6xl */}


      </section>

      {/* Main Core Features Highlight */}
      <section 
        ref={featuresRef} 
        className={`max-w-5xl mx-auto px-4 py-16 sm:py-24 transition-all duration-500 ${
          featuresVisible ? 'reveal-active' : ''
        }`}
      >
        <div className="text-center max-w-xl mx-auto mb-16 reveal-item delay-100">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary-light/50 px-3 py-1 rounded-full" data-font="ui">
            ทำไมต้องใช้ GIntern?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mt-3" data-font="ui">
            แพลตฟอร์มที่เชื่อมโลกการฝึกงานให้โปร่งใส
          </h2>
          <p className="text-muted text-sm mt-3">
            เราสร้างระบบนี้ขึ้นมาเพื่อช่วยแก้ปัญหาความไม่ชัดเจน และยกระดับสิทธิประโยชน์ที่นักศึกษาควรได้รับ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Safety/Anonymous */}
          <div className="group bg-surface rounded-2xl p-6 border border-border flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:border-primary-light/60 hover:bg-white feature-card reveal-item delay-200">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-light/20 text-primary-ink border border-primary-light/40 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-primary-light/40 transition-[transform,background-color] duration-300 ease-out animate-icon-pop-init animate-icon-pop-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2 transition-colors duration-200 group-hover:text-primary-ink" data-font="ui">ปลอดภัยด้วย Anonymous</h3>
              <p className="text-muted text-sm leading-relaxed">
                เลือกรักษาความเป็นส่วนตัวของคุณได้ 100% ปิดบังตัวตนและรูปโปรไฟล์ ทั้งตอนรีวิวและคอมเมนต์เพื่อแชร์มุมมองจริงได้ปลอดภัยที่สุด
              </p>
            </div>
            <Link href="/about" className="text-sm font-semibold text-primary-ink hover:text-primary-hover mt-5 flex items-center gap-1.5 w-fit transition-colors duration-200" data-font="ui">
              <span>อ่านเพิ่มเติม</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-250 ease-out group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Card 2: Deep Search/Data */}
          <div className="group bg-surface rounded-2xl p-6 border border-border flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:border-accent/40 hover:bg-white feature-card reveal-item delay-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-pale/50 text-accent-ink border border-accent-pale flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-accent-pale transition-[transform,background-color] duration-300 ease-out animate-icon-pop-init animate-icon-pop-2">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2 transition-colors duration-200 group-hover:text-accent-ink" data-font="ui">ข้อมูลเจาะลึกที่แท้จริง</h3>
              <p className="text-muted text-sm leading-relaxed">
                เจาะลึกเรตติ้งด้านพี่เลี้ยง (Mentor) การเรียนรู้ (Learning) ปริมาณงาน (Workload) วัฒนธรรมองค์กร และเบี้ยเลี้ยงฝึกงานเฉลี่ยจริง
              </p>
            </div>
            <Link href="/search" className="text-sm font-semibold text-accent-ink hover:text-accent mt-5 flex items-center gap-1.5 w-fit transition-colors duration-200" data-font="ui">
              <span>เริ่มค้นหา</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-250 ease-out group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Card 3: Community */}
          <div className="group bg-surface rounded-2xl p-6 border border-border flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:border-primary-light/40 hover:bg-white feature-card reveal-item delay-400">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-light/20 text-primary-ink border border-primary-light/30 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-primary-light/35 transition-[transform,background-color] duration-300 ease-out animate-icon-pop-init animate-icon-pop-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2 transition-colors duration-200 group-hover:text-primary-ink" data-font="ui">คอมมูนิตี้แลกเปลี่ยน</h3>
              <p className="text-muted text-sm leading-relaxed">
                ช่องทางสำหรับคอมเมนต์และพูดคุยสอบถามข้อมูลเพิ่มเติมกับผู้รีวิวได้โดยตรง ช่วยไขทุกข้อสงสัยอย่างชัดเจน
              </p>
            </div>
            <Link href="/about" className="text-sm font-semibold text-primary-ink hover:text-primary-hover mt-5 flex items-center gap-1.5 w-fit transition-colors duration-200" data-font="ui">
              <span>วิธีการทำงาน</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-250 ease-out group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Reviews Showcase */}
      <section 
        ref={reviewsRef}
        className={`bg-surface/20 border-t border-border/80 py-16 sm:py-24 transition-all duration-500 ${
          reviewsVisible ? 'reveal-active' : ''
        }`}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 reveal-item delay-100">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider" data-font="ui">
                อัปเดตล่าสุด
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mt-2" data-font="ui">
                รีวิวฝึกงานล่าสุดจากรุ่นพี่
              </h2>
            </div>
            <Link 
              href="/search"
              className="group/btn text-sm font-semibold text-primary-ink bg-primary-light hover:bg-primary px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow"
              data-font="ui"
            >
              <span>ดูรีวิวทั้งหมด</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-250 ease-out group-hover/btn:translate-x-1" />
            </Link>
          </div>

          {recentReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentReviews.map((review, idx) => (
                <div key={review.id} className={`reveal-item ${idx === 0 ? 'delay-200' : 'delay-300'}`}>
                  <ReviewCard 
                    review={review} 
                    currentUserId={user?.id} 
                    onCommentClick={(r) => setSelectedReview(r)}
                    onShareClick={(r) => setShareReview(r)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface rounded-2xl border border-border p-12 text-center reveal-item delay-200">
              <Building2 className="w-12 h-12 text-muted mx-auto mb-3" />
              <p className="text-muted text-sm">ยังไม่มีรีวิวเข้ามาในขณะนี้ มาร่วมเป็นคนแรกที่เขียนรีวิวประสบการณ์กัน!</p>
            </div>
          )}
        </div>
      </section>

      {/* platform statistic */}
      <section 
        ref={statsRef}
        className={`max-w-5xl mx-auto px-4 py-16 sm:py-20 text-center transition-all duration-500 ${
          statsVisible ? 'reveal-active' : ''
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="bg-white border border-slate-200/50 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:border-primary-light/80 transition-all duration-300 ease-out reveal-item delay-100">
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary-hover to-primary-ink bg-clip-text text-transparent" data-font="ui">100%</p>
            <p className="text-xs text-muted mt-2 font-semibold">ปลอดภัย & Anonymous</p>
          </div>
          <div className="bg-white border border-slate-200/50 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:border-primary-light/80 transition-all duration-300 ease-out reveal-item delay-200">
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary-ink to-primary-hover bg-clip-text text-transparent" data-font="ui">Free</p>
            <p className="text-xs text-muted mt-2 font-semibold">ใช้งานฟรีสำหรับนักศึกษา</p>
          </div>
          <div className="bg-white border border-slate-200/50 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:border-accent/40 transition-all duration-300 ease-out reveal-item delay-300">
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-accent to-accent-ink bg-clip-text text-transparent" data-font="ui">Real</p>
            <p className="text-xs text-muted mt-2 font-semibold">แชร์จากประสบการณ์จริง</p>
          </div>
          <div className="bg-white border border-slate-200/50 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:border-primary-light/60 transition-all duration-300 ease-out reveal-item delay-400">
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary-ink to-accent-ink bg-clip-text text-transparent" data-font="ui">Active</p>
            <p className="text-xs text-muted mt-2 font-semibold">คอมมูนิตี้อัปเดตตลอดเวลา</p>
          </div>
        </div>
      </section>

      {/* CTA Join Section */}
      <section 
        ref={ctaRef}
        className={`bg-gradient-to-b from-surface/30 via-bg to-accent-pale/25 border-t border-border/60 py-16 sm:py-24 text-center transition-all duration-500 ${
          ctaVisible ? 'reveal-active' : ''
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 reveal-item delay-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4" data-font="ui">
            ร่วมส่งต่อสังคมฝึกงานที่ดีและเป็นธรรมขึ้นด้วยกัน
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8" style={{ textWrap: "balance" }}>
            ทุกการแชร์และบอกเล่าในอดีตของคุณ มีค่าเป็นเกราะป้องกันและแสงนำทางให้แก่เพื่อนๆ และน้องๆ รุ่นถัดไปได้เจอกับโอกาสและสวัสดิการที่เหมาะสมที่สุด
          </p>
          <Link
            href={user ? "/review/new" : "/login"}
            className="group/btn inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-ink px-6 py-3.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-95"
            data-font="ui"
          >
            <PenLine className="w-4 h-4 transition-transform duration-200 group-hover/btn:-rotate-6 group-hover/btn:scale-110" />
            <span>{user ? "เขียนรีวิวประสบการณ์ของคุณ" : "เข้าสู่ระบบเพื่อรีวิวฝึกงาน"}</span>
          </Link>
        </div>
      </section>

      {/* Modal Review Details */}
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          currentUserId={user?.id}
          onShareClick={(r) => {
            setSelectedReview(null);
            setShareReview(r);
          }}
        />
      )}
      {shareReview && (
        <ShareCardModal
          review={shareReview}
          onClose={() => setShareReview(null)}
        />
      )}
    </>
  );
}
