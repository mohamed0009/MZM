import { useState, useEffect, useRef, useCallback } from "react";
import { SearchIcon, Pill, User, FileText, ShoppingCart, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import searchService, { SearchResult, SearchResultsGroup } from "@/lib/search-service";
import debounce from "lodash/debounce";
import ReactDOM from "react-dom";

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
  onResultClick?: (result: SearchResult) => void;
  showTabs?: boolean;
  size?: "sm" | "md" | "lg";
  maxWidth?: string;
  onClose?: () => void;
  isDashboard?: boolean;
  positionMode?: 'absolute' | 'fixed' | 'container-relative';
}

export function SearchBox({
  placeholder = "Rechercher médicaments, clients...",
  className = "",
  onResultClick,
  showTabs = false,
  size = "md",
  maxWidth = "md:max-w-md",
  onClose,
  isDashboard = false,
  positionMode = 'absolute'
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultsGroup | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle mounting for client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Setup debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery || !searchQuery.trim()) {
        setResults(null);
        setIsLoading(false);
        return;
      }

      try {
        const searchResults = await searchService.search(searchQuery);
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        // Set empty results to avoid UI breaking
        setResults({
          medications: [],
          clients: [],
          prescriptions: [],
          sales: []
        });
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Handle input changes
  useEffect(() => {
    if (query && query.trim()) {
      setIsLoading(true);
      setIsOpen(true);
      debouncedSearch(query);
    } else {
      setResults(null);
      setIsOpen(false);
      setIsLoading(false);
    }
  }, [query, debouncedSearch]);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target as Node) &&
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Position the dropdown correctly
  useEffect(() => {
    if (!isOpen || !searchRef.current || !resultsRef.current || !mounted) return;
    
    const updatePosition = () => {
      if (!searchRef.current || !resultsRef.current) return;
      
      const searchRect = searchRef.current.getBoundingClientRect();
      const resultsEl = resultsRef.current;
      
      // Different positioning strategies
      if (positionMode === 'fixed') {
        // Fixed positioning (relative to viewport)
        resultsEl.style.position = 'fixed';
        resultsEl.style.top = `${searchRect.bottom}px`;
        resultsEl.style.left = `${searchRect.left}px`;
        resultsEl.style.width = `${searchRect.width}px`;
      } 
      else if (positionMode === 'container-relative') {
        // Container-relative (good for complex layouts like dashboard)
        resultsEl.style.position = 'absolute';
        resultsEl.style.top = '100%';
        resultsEl.style.left = '0';
        resultsEl.style.right = '0';
        resultsEl.style.width = '100%';
      }
      else {
        // Absolute positioning with scrollY (default)
        resultsEl.style.position = 'absolute';
        resultsEl.style.top = `${searchRect.height + 8}px`; // 8px margin
        resultsEl.style.left = '0';
        resultsEl.style.width = '100%';
      }
    };
    
    // Initial positioning
    updatePosition();
    
    // Update on resize and scroll
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, results, positionMode, mounted]);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else {
      router.push(result.link);
    }
    setIsOpen(false);
    setQuery("");
  };

  // Handle search clear
  const handleClear = () => {
    setQuery("");
    setResults(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query && query.trim()) {
      // Implement global search here
      console.log(`Performing global search for: ${query}`);
      
      // Navigate to search results page
      // router.push(`/search?q=${encodeURIComponent(query)}`);
      
      setIsOpen(false);
    }
  };

  // Get filtered results based on active tab
  const getFilteredResults = () => {
    if (!results) return [];
    
    if (activeTab === "all") {
      return [
        ...results.medications,
        ...results.clients,
        ...results.prescriptions,
        ...results.sales
      ];
    }
    
    return results[activeTab as keyof SearchResultsGroup] || [];
  };

  // Get result counts
  const getTotalResults = (): number => {
    if (!results) return 0;
    return results.medications.length + 
           results.clients.length + 
           results.prescriptions.length + 
           results.sales.length;
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 text-sm";
      case "lg":
        return "h-10 text-base";
      default:
        return "h-9 text-sm";
    }
  };

  // Render icon based on type
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'pill':
        return <Pill className="h-4 w-4 mr-2 text-blue-500" />;
      case 'user':
        return <User className="h-4 w-4 mr-2 text-blue-500" />;
      case 'file-text':
        return <FileText className="h-4 w-4 mr-2 text-blue-500" />;
      case 'shopping-cart':
        return <ShoppingCart className="h-4 w-4 mr-2 text-blue-500" />;
      default:
        return <SearchIcon className="h-4 w-4 mr-2 text-blue-500" />;
    }
  };

  // Get group label
  const getGroupLabel = (type: string): string => {
    switch (type) {
      case 'medication':
        return 'Médicaments';
      case 'client':
        return 'Clients';
      case 'prescription':
        return 'Ordonnances';
      case 'sale':
        return 'Ventes';
      default:
        return 'Résultats';
    }
  };

  return (
    <div className={`search-container relative w-full ${maxWidth} ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`pl-9 pr-9 w-full bg-slate-50 border-slate-200 rounded-md transition-all focus:border-blue-300 focus:ring-1 focus:ring-blue-300 ${getSizeClasses()}`}
          onFocus={() => query && query.trim() && setIsOpen(true)}
          aria-label="Search"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-slate-200"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </form>

      {/* Search Results Dropdown - Portal for better z-index handling */}
      {isOpen && mounted && ReactDOM.createPortal(
        <div 
          ref={resultsRef}
          className="search-results-dropdown bg-white rounded-md shadow-lg border border-gray-200 max-h-[80vh] overflow-hidden z-50"
          style={{ 
            zIndex: 2147483647, // Max z-index
            minWidth: '250px'
          }}
        >
          {/* Search status info */}
          {query && (
            <div className="px-3 py-1.5 text-xs text-gray-500 border-b border-gray-200 flex justify-between items-center">
              <span>
                {isLoading 
                  ? "Recherche en cours..." 
                  : results && getTotalResults() > 0 
                    ? `${getTotalResults()} résultat${getTotalResults() > 1 ? 's' : ''}`
                    : "Aucun résultat"
                }
              </span>
              <span className="text-gray-400 font-mono">"{query}"</span>
            </div>
          )}

          {/* Results tabs */}
          {showTabs && results && getTotalResults() > 0 && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-2 pt-2">
                <TabsList className="w-full bg-slate-100 p-1">
                  <TabsTrigger 
                    value="all" 
                    className="flex-1 text-xs py-1"
                  >
                    Tous ({getTotalResults()})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="medications" 
                    className="flex-1 text-xs py-1"
                    disabled={!results.medications.length}
                  >
                    Médicaments ({results.medications.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="clients" 
                    className="flex-1 text-xs py-1"
                    disabled={!results.clients.length}
                  >
                    Clients ({results.clients.length})
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          )}

          <div className="overflow-y-auto max-h-[60vh]">
            {/* Loading state */}
            {isLoading && (
              <div className="p-4 text-center text-sm text-gray-500">
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent mr-2 align-[-2px]"></div>
                Recherche en cours...
              </div>
            )}

            {/* No results state */}
            {!isLoading && results && getTotalResults() === 0 && (
              <div className="p-6 text-center text-sm">
                <div className="bg-slate-100 rounded-full p-3 inline-flex mb-2">
                  <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-gray-500 mb-1">Aucun résultat trouvé pour</p>
                <p className="font-medium text-gray-700">"{query}"</p>
              </div>
            )}

            {/* Results list */}
            {!isLoading && results && getTotalResults() > 0 && (
              <div>
                {/* Group results by type */}
                {(() => {
                  const filteredResults = getFilteredResults();
                  const groupedResults: Record<string, SearchResult[]> = {};
                  
                  filteredResults.forEach(result => {
                    if (!groupedResults[result.type]) {
                      groupedResults[result.type] = [];
                    }
                    groupedResults[result.type].push(result);
                  });
                  
                  return Object.entries(groupedResults).map(([type, items]) => (
                    <div key={type} className="p-2 border-t first:border-t-0 border-gray-200">
                      <h3 className="text-xs font-semibold text-gray-500 mb-1 px-2">
                        {getGroupLabel(type)} ({items.length})
                      </h3>
                      {items.map(result => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm flex items-center justify-between group"
                        >
                          <div className="flex items-center min-w-0">
                            {renderIcon(result.iconType)}
                            <span className="font-medium truncate">
                              {result.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 ml-2 truncate flex-shrink-0 group-hover:text-blue-600">
                            {result.details}
                          </span>
                        </button>
                      ))}
                    </div>
                  ));
                })()}

                {/* Search all action */}
                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={handleSubmit}
                    className="w-full text-left px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors text-sm flex items-center justify-center text-blue-600"
                  >
                    <SearchIcon className="h-4 w-4 mr-2" />
                    <span>Rechercher "{query}" partout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
} 