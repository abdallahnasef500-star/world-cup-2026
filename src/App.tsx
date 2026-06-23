import React, { useState, useEffect, useRef } from 'react';
import {
  GLOBAL_TEAMS,
  WORLD_CUP_EDITIONS
} from './data/worldcups';
import { TRANSLATIONS } from './data/translations';
import { WorldCupEdition, Team, MatchResult, GroupResultForStanding, SavedPrediction } from './types';
import {
  calculateGroupStandings,
  getThirdPlaceTeams,
  resolveKnockoutMatches,
  getHistoricalKnockoutMatches,
  sanitizeWinnersChain
} from './utils/predictor';

import Flag from './components/Flag';
import GroupCard from './components/GroupCard';
import MatchCard from './components/MatchCard';

import {
  Globe,
  Sun,
  Moon,
  Lock,
  Unlock,
  Save,
  Trash2,
  Share2,
  Trophy,
  Award,
  Download,
  Info,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Settings,
  HelpCircle,
  ExternalLink,
  BarChart3,
  TrendingUp,
  Maximize2,
  SlidersHorizontal,
  ArrowUp,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  ChevronUp,
  ChevronDown,
  Search,
  Sparkles,
  Play,
  Scale,
  ListFilter,
  Check
} from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

const safeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("Storage is blocked or unavailable:", e);
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage is blocked or unavailable:", e);
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("Storage is blocked or unavailable:", e);
    }
  }
};

const safeRoundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
};

export default function App() {
  // 1. Language and Theme settings
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // 2. Tournament Selection
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [isHistoricalMode, setIsHistoricalMode] = useState<boolean>(true);
  const [predictorName, setPredictorName] = useState<string>('');
  const [predictorSignature, setPredictorSignature] = useState<string>('');

  // 3. Current Prediction / Interactive simulation states
  const [currentStandings, setCurrentStandings] = useState<{ [groupId: string]: string[] }>({});
  const [bestThirdSelected, setBestThirdSelected] = useState<string[]>([]);
  const [knockoutWinners, setKnockoutWinners] = useState<{ [matchId: string]: string }>({});
  
  // Custom scores for all tournament matches in interactive mode
  const [customScores, setCustomScores] = useState<{ [matchId: string]: { score1: number | null; score2: number | null } }>({});
  // Preferences: automatic calculation of best third-placed teams
  const [isAutoThirdsEnabled, setIsAutoThirdsEnabled] = useState<boolean>(true);
  
  // Interactive full professional simulation states
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [isBracketFullscreen, setIsBracketFullscreen] = useState<boolean>(false);
  
  // Profile Detail Modal for teams & Comparisons
  const [selectedProfileTeam, setSelectedProfileTeam] = useState<Team | null>(null);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [focusedModalTab, setFocusedModalTab] = useState<'ordering' | 'scores'>('ordering');
  
  // Search bar states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Drag-to-pan state for the bracket tree
  const [isDraggingBracket, setIsDraggingBracket] = useState<boolean>(false);
  const [bracketDragStartX, setBracketDragStartX] = useState<number>(0);
  const [bracketDragScrollLeft, setBracketDragScrollLeft] = useState<number>(0);

  // 4. Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // 5. Setup dialog for sharing or settings
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const shareCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 6. Screen-in-screen focus prediction state & Scroll assistance
  const [focusedGroupId, setFocusedGroupId] = useState<string | null>(null);
  const bracketScrollRef = useRef<HTMLDivElement | null>(null);

  const handleScrollBracket = (direction: 'left' | 'right') => {
    if (bracketScrollRef.current) {
      const scrollAmount = 350;
      const isRtl = document.documentElement.dir === 'rtl';
      const multiplier = isRtl ? (direction === 'left' ? 1 : -1) : (direction === 'left' ? -1 : 1);
      bracketScrollRef.current.scrollBy({
        left: scrollAmount * multiplier,
        behavior: 'smooth'
      });
    }
  };

  // Load selected World Cup edition
  const selectedEdition = WORLD_CUP_EDITIONS.find(e => e.year === selectedYear) || WORLD_CUP_EDITIONS[0];

  // Helper translations lookup
  const dict = TRANSLATIONS[language];

  // Active document direction
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Active theme layout class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load predictions on Year or Mode Change
  useEffect(() => {
    loadPredictionsForYear(selectedYear);
  }, [selectedYear, isHistoricalMode]);

  // Recalculate group standings dynamically when scores change
  useEffect(() => {
    if (isHistoricalMode) return;
    
    // Check if we have any custom scores
    const hasCustomScores = Object.keys(customScores).length > 0;
    if (!hasCustomScores) return;

    // Calculate standings for all groups using our updated predictor logic
    const calculated = calculateGroupStandings(selectedEdition, {}, customScores, true);
    const newStandings: { [groupId: string]: string[] } = {};
    Object.keys(calculated).forEach(groupId => {
      newStandings[groupId] = calculated[groupId].map(st => st.team.id);
    });

    // Sync state if different to prevent infinite rendering cascade
    setCurrentStandings(prev => {
      let changed = false;
      const updated = { ...prev };
      Object.keys(newStandings).forEach(groupId => {
        if (!prev[groupId] || prev[groupId].join(',') !== newStandings[groupId].join(',')) {
          updated[groupId] = newStandings[groupId];
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [customScores, selectedEdition, isHistoricalMode]);

  // Recalculate best third-placed qualifiers automatically according to real FIFA rules (Points, GD, GF)
  useEffect(() => {
    if (isHistoricalMode) return;
    if (!isAutoThirdsEnabled) return;
    if (selectedEdition.systemType !== '48-teams' && selectedEdition.systemType !== '24-teams') {
      return;
    }

    const localStandings = calculateGroupStandings(selectedEdition, currentStandings, customScores, !isHistoricalMode);
    const thirdsList: { teamId: string; points: number; gd: number; gf: number }[] = [];
    Object.keys(localStandings).forEach(groupId => {
      const list = localStandings[groupId];
      if (list && list.length >= 3) {
        const thirdPlace = list[2];
        thirdsList.push({
          teamId: thirdPlace.team.id,
          points: thirdPlace.points,
          gd: thirdPlace.gd,
          gf: thirdPlace.gf
        });
      }
    });

    // Sort according to standard tie-breaker criteria
    thirdsList.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.teamId.localeCompare(b.teamId);
    });

    const countNeeded = selectedEdition.systemType === '24-teams' ? 4 : 8;
    const topIds = thirdsList.slice(0, countNeeded).map(t => t.teamId);

    // Sync best thirds choice safely
    setBestThirdSelected(prev => {
      if (prev.join(',') !== topIds.join(',')) {
        return topIds;
      }
      return prev;
    });
  }, [currentStandings, customScores, isAutoThirdsEnabled, isHistoricalMode, selectedEdition]);

  const loadPredictionsForYear = (year: string) => {
    const activeEdition = WORLD_CUP_EDITIONS.find(e => e.year === year) || WORLD_CUP_EDITIONS[0];
    
    if (isHistoricalMode) {
      // Historical mode forces real standings and historical winners
      const originalStandings: { [groupId: string]: string[] } = {};
      Object.keys(activeEdition.historicalStandings).forEach(gId => {
        originalStandings[gId] = [...activeEdition.historicalStandings[gId]];
      });
      setCurrentStandings(originalStandings);

      // Map historical winners automatically
      const originalWinners: { [matchId: string]: string } = {};
      activeEdition.historicalKnockouts.forEach(m => {
        if (m.winnerId) originalWinners[m.matchId] = m.winnerId;
      });
      // Handle historical winner for finals
      if (activeEdition.winnerId && activeEdition.winnerId !== 'unknown') {
        originalWinners["FINAL"] = activeEdition.winnerId;
      }
      setKnockoutWinners(originalWinners);
      setBestThirdSelected([]);
      setCustomScores({});
      setIsAutoThirdsEnabled(true);
      setPredictorName('');
      setPredictorSignature('');
    } else {
      // Prediction mode: Try loading from local storage
      const savedString = safeStorage.getItem(`wc_pred_${year}`);
      if (savedString) {
        try {
          const parsed: SavedPrediction = JSON.parse(savedString);
          setCurrentStandings(parsed.standings || {});
          setBestThirdSelected(parsed.bestThirderKeys || []);
          setKnockoutWinners(parsed.knockoutWinners || {});
          setCustomScores(parsed.customScores || {});
          setPredictorName(parsed.predictorName || '');
          setPredictorSignature(parsed.predictorSignature || '');
          return;
        } catch (e) {
          console.error("Failed to parse saved predictions", e);
        }
      }

      // No saved prediction: Initialize with historical baseline as starting draft
      const baseStandings: { [groupId: string]: string[] } = {};
      Object.keys(activeEdition.historicalStandings).forEach(gId => {
        baseStandings[gId] = [...activeEdition.historicalStandings[gId]];
      });
      setCurrentStandings(baseStandings);
      setKnockoutWinners({});
      setBestThirdSelected([]);
      setCustomScores({});
      setIsAutoThirdsEnabled(true);
      setPredictorName('');
      setPredictorSignature('');
    }
  };

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Change Team Position (Sort standings manually in prediction mode)
  const handleMoveTeam = (groupId: string, teamIndex: number, direction: 'up' | 'down') => {
    if (isHistoricalMode) return;

    const currentOrder = [...(currentStandings[groupId] || selectedEdition.historicalStandings[groupId])];
    const targetIndex = direction === 'up' ? teamIndex - 1 : teamIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    // Swap positions
    const temp = currentOrder[teamIndex];
    currentOrder[teamIndex] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;

    const updatedStandings = {
      ...currentStandings,
      [groupId]: currentOrder
    };

    setCurrentStandings(updatedStandings);

    // Dynamic cleaning pass: clean invalid downstream knockout nodes if they refer to un-advanced teams
    const cleanedWinners = sanitizeWinnersChain(selectedEdition, updatedStandings, bestThirdSelected, knockoutWinners);
    setKnockoutWinners(cleanedWinners);
  };

  // Toggle third place qualifying for applicable tournaments (2026 / 24-team editions)
  const handleToggleThirdPlace = (teamId: string) => {
    if (isHistoricalMode) return;

    const limit = selectedEdition.systemType === '24-teams' ? 4 : 8;
    let updatedList = [...bestThirdSelected];
    if (updatedList.includes(teamId)) {
      updatedList = updatedList.filter(id => id !== teamId);
    } else {
      if (updatedList.length < limit) {
        updatedList.push(teamId);
      } else {
        // Shift old value and add new
        updatedList.shift();
        updatedList.push(teamId);
      }
    }
    setBestThirdSelected(updatedList);

    const cleanedWinners = sanitizeWinnersChain(selectedEdition, currentStandings, updatedList, knockoutWinners);
    setKnockoutWinners(cleanedWinners);
  };

  // Advance dynamic knockout winner on click
  const handleSelectKnockoutWinner = (matchId: string, teamId: string) => {
    if (isHistoricalMode) return;

    const updatedWinners = {
      ...knockoutWinners,
      [matchId]: teamId
    };

    // Auto cleanup down-chain
    const cleanedWinners = sanitizeWinnersChain(selectedEdition, currentStandings, bestThirdSelected, updatedWinners);
    setKnockoutWinners(cleanedWinners);
  };

  // Save current prediction state to LocalStorage
  const handleSavePredictions = () => {
    if (isHistoricalMode) {
      showNotification(language === 'ar' ? "التوقعات مغلقة في الوضع التاريخي الحقيقي!" : "Cannot save predictions in Historical Mode!", "error");
      return;
    }

    const stateToSave: SavedPrediction = {
      year: selectedYear,
      standings: currentStandings,
      bestThirderKeys: bestThirdSelected,
      knockoutWinners: knockoutWinners,
      customScores: customScores,
      predictorName: predictorName,
      predictorSignature: predictorSignature
    };

    safeStorage.setItem(`wc_pred_${selectedYear}`, JSON.stringify(stateToSave));
    showNotification(dict.saveSuccess, "success");
  };

  // Reset and clear predictions
  const handleResetPredictions = () => {
    if (window.confirm(dict.resetConfirm)) {
      safeStorage.removeItem(`wc_pred_${selectedYear}`);
      
      // Reload defaults
      const baseStandings: { [groupId: string]: string[] } = {};
      Object.keys(selectedEdition.historicalStandings).forEach(gId => {
        baseStandings[gId] = [...selectedEdition.historicalStandings[gId]];
      });
      setCurrentStandings(baseStandings);
      setKnockoutWinners({});
      setBestThirdSelected([]);
      setCustomScores({});
      setIsAutoThirdsEnabled(true);
      setPredictorName('');
      setPredictorSignature('');
      
      showNotification(dict.resetSuccess, "info");
    }
  };

  // Math resolution of all knockout stages based on current mode
  const resolvedKnockoutTree = isHistoricalMode
    ? getHistoricalKnockoutMatches(selectedEdition)
    : resolveKnockoutMatches(selectedEdition, currentStandings, bestThirdSelected, knockoutWinners);

  // Group standings stats dictionary for rendering Group Card tables
  const resolvedGroupStandings = calculateGroupStandings(selectedEdition, currentStandings, customScores, !isHistoricalMode);

  // 12 candidates in third place for 2026
  const thirdPlaceCandidates = getThirdPlaceTeams(selectedEdition, currentStandings);

  // Champion Identification
  const resolvedChampion = isHistoricalMode
    ? (selectedEdition.winnerId !== 'unknown' ? GLOBAL_TEAMS[selectedEdition.winnerId] : undefined)
    : (resolvedKnockoutTree["FINAL"]?.winner);

  const resolvedRunnerUp = isHistoricalMode
    ? (selectedEdition.runnerUpId !== 'unknown' ? GLOBAL_TEAMS[selectedEdition.runnerUpId] : undefined)
    : (resolvedKnockoutTree["FINAL"]?.winner 
        ? (resolvedKnockoutTree["FINAL"]?.winner.id === resolvedKnockoutTree["FINAL"]?.team1?.id 
            ? resolvedKnockoutTree["FINAL"]?.team2 
            : resolvedKnockoutTree["FINAL"]?.team1)
        : undefined);

  // Dynamic Simulated Winners aggregation across ALL years
  const simulatedWinnersData = React.useMemo(() => {
    const counts: { [teamId: string]: { count: number; years: string[] } } = {};

    WORLD_CUP_EDITIONS.forEach((edition) => {
      let winnerId: string | undefined = undefined;

      // For the current selected year, use active state if in Prediction Mode
      if (edition.year === selectedYear && !isHistoricalMode) {
        if (resolvedChampion) {
          winnerId = resolvedChampion.id;
        }
      } else {
        // For other years, read from localStorage
        const savedRaw = safeStorage.getItem(`wc_pred_${edition.year}`);
        if (savedRaw) {
          try {
            const saved: SavedPrediction = JSON.parse(savedRaw);
            if (saved.knockoutWinners && saved.knockoutWinners["FINAL"]) {
              winnerId = saved.knockoutWinners["FINAL"];
            }
          } catch (e) {
            console.error("Error parsing saved prediction:", e);
          }
        }
      }

      if (winnerId && winnerId !== 'unknown') {
        if (!counts[winnerId]) {
          counts[winnerId] = { count: 0, years: [] };
        }
        counts[winnerId].count += 1;
        counts[winnerId].years.push(edition.year);
      }
    });

    return Object.entries(counts).map(([teamId, data]) => {
      const team = GLOBAL_TEAMS[teamId];
      return {
        id: teamId,
        name: team ? (language === 'ar' ? team.nameAr : team.nameEn) : teamId,
        emoji: team?.emoji || "🏳️",
        count: data.count,
        years: data.years.sort((a, b) => parseInt(b) - parseInt(a)), // Sort years descending
      };
    }).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [selectedYear, isHistoricalMode, resolvedChampion, language]);

  // Create High Quality Image via HTML Canvas sharing
  const drawShareCanvas = () => {
    const canvas = shareCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw gradient background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0f172a'); // slate-900
    grad.addColorStop(0.5, '#1e1b4b'); // indigo-950
    grad.addColorStop(1, '#020617'); // slate-950
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ambient Soccer Field lines for visual elegance
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 200, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Central Circle outline
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();

    // Card Borders
    ctx.strokeStyle = '#d4af37'; // gold
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // App/Game Header
    ctx.font = '800 32px "Outfit", "Cairo", sans-serif';
    ctx.fillStyle = '#cca300';
    ctx.textAlign = 'center';
    ctx.fillText('FIFA WORLD CUP BRACKET PREDICTION', canvas.width / 2, 100);

    ctx.font = '500 24px "Inter", "Cairo", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Edition: ${selectedEdition.year} - Hosted by ${language === 'ar' ? selectedEdition.hostAr : selectedEdition.hostEn}`, canvas.width / 2, 140);

    // Simulated status
    ctx.font = '700 20px "Outfit", "Cairo", sans-serif';
    ctx.fillStyle = isHistoricalMode ? '#f59e0b' : '#10b981';
    ctx.fillText(isHistoricalMode ? "HISTORICAL RESULTS MODE" : "MY CUSTOM PREDICTIONS MODE", canvas.width / 2, 185);

    // DRAW CHAMPION BOX (CENTER STAGE)
    const cardY = 220;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    safeRoundRect(ctx, canvas.width / 2 - 300, cardY, 600, 360, 24);
    ctx.fill();
    ctx.stroke();

    // Star decorations
    ctx.font = '32px sans-serif';
    ctx.fillStyle = '#cca300';
    ctx.fillText('⭐ ⭐ ⭐', canvas.width / 2, cardY + 50);

    ctx.font = 'bold 24px "Outfit", "Cairo", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(language === 'ar' ? "البطل المتوقع" : "PREDICTED CHAMPION", canvas.width / 2, cardY + 95);

    if (resolvedChampion) {
      // Draw massive Emoji Flag
      ctx.font = '120px sans-serif';
      ctx.fillText(resolvedChampion.emoji || "🏆", canvas.width / 2, cardY + 225);

      ctx.font = '805 38px "Cairo", "Outfit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(language === 'ar' ? resolvedChampion.nameAr : resolvedChampion.nameEn, canvas.width / 2, cardY + 300);
    } else {
      ctx.font = 'italic bold 32px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('🏆 TBA (To Be Decided)', canvas.width / 2, cardY + 200);
      
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Calculate matchups to reveal champion', canvas.width / 2, cardY + 250);
    }

    // DRAW RUNNER UP BOX
    const rY = 620;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    safeRoundRect(ctx, canvas.width / 2 - 250, rY, 500, 150, 16);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 18px "Cairo", "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(language === 'ar' ? "وصيف البطل" : "RUNNER-UP", canvas.width / 2, rY + 40);

    if (resolvedRunnerUp) {
      ctx.font = '40px sans-serif';
      ctx.fillText(resolvedRunnerUp.emoji, canvas.width / 2, rY + 95);

      ctx.font = 'bold 24px "Cairo", "Outfit", sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(language === 'ar' ? resolvedRunnerUp.nameAr : resolvedRunnerUp.nameEn, canvas.width / 2, rY + 130);
    } else {
      ctx.font = 'italic 18px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('TBD', canvas.width / 2, rY + 100);
    }

    // Predictor Name and Signature stamp
    if (!isHistoricalMode && predictorName) {
      // Small horizontal line
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 150, 795);
      ctx.lineTo(canvas.width / 2 + 150, 795);
      ctx.stroke();

      ctx.font = 'bold 16px "Cairo", "Outfit", sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'center';
      ctx.fillText(language === 'ar' ? `المتوقع: ${predictorName}` : `PREDICTOR: ${predictorName}`, canvas.width / 2, 825);

      if (predictorSignature) {
        ctx.font = 'italic 14px "Cairo", sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`🖋️ ${predictorSignature}`, canvas.width / 2, 855);
      }
    }

    // Footer decoration
    ctx.font = 'bold 16px "Outfit", "Cairo", sans-serif';
    ctx.fillStyle = '#cca300';
    ctx.textAlign = 'center';
    ctx.fillText('WORLD CUP SIMULATOR: GOOGLE AI STUDIO BUILD', canvas.width / 2, 920);

    ctx.font = '12px "Inter", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Offline Native Interactive Prediction Tool', canvas.width / 2, 945);
  };

  useEffect(() => {
    if (showShareModal) {
      // Allow DOM to mount canvas before drawing
      setTimeout(drawShareCanvas, 150);
    }
  }, [showShareModal, resolvedChampion, resolvedRunnerUp, selectedYear, isHistoricalMode, language, predictorName, predictorSignature]);

  const handleDownloadPng = () => {
    const canvas = shareCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `WC${selectedYear}_Prediction_${resolvedChampion?.nameEn || 'TBD'}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(language === 'ar' ? "تم تحميل صورة التوقع بنجاح!" : "Downloaded bracket image successfully!");
  };

  const handleSocialShare = (platform: 'wa' | 'fb' | 'tw') => {
    const textStr = language === 'ar' 
      ? `توقعي لبطل كأس العالم ${selectedYear} هو منتخب ${resolvedChampion ? (language === 'ar' ? resolvedChampion.nameAr : resolvedChampion.nameEn) : 'تحدد لاحقاً'}! جرب توقعاتك الآن.`
      : `My predicted winner for the ${selectedYear} World Cup is ${resolvedChampion?.nameEn || 'TBD'}! Try your own mock simulation now.`;
    
    // Dev hosted site link fallback
    const appUrl = encodeURIComponent(window.location.href);
    const textEncoded = encodeURIComponent(textStr);

    let shareUrl = '';
    if (platform === 'wa') {
      shareUrl = `https://api.whatsapp.com/send?text=${textEncoded}%20${appUrl}`;
    } else if (platform === 'fb') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${appUrl}`;
    } else if (platform === 'tw') {
      shareUrl = `https://twitter.com/intent/tweet?text=${textEncoded}&url=${appUrl}`;
    }

    window.open(shareUrl, '_blank');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          showNotification(dict.linkCopied, "success");
        })
        .catch(() => {
          showNotification(language === 'ar' ? 'فشل نسخ الرابط' : 'Failed to copy link', "error");
        });
    } else {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = window.location.href;
        textarea.style.position = 'fixed'; // Avoid scrolling to bottom
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification(dict.linkCopied, "success");
      } catch (err) {
        showNotification(language === 'ar' ? 'فشل نسخ الرابط' : 'Failed to copy link', "error");
      }
    }
  };

  // Full cascaded automated prediction simulation
  const handleSimulateTournament = async () => {
    if (isHistoricalMode) {
      if (window.confirm(language === 'ar' ? 'سيتطلب ذلك الخروج من الوضع التاريخي المغلق لبدء توقعات ديناميكية تلقائية. هل أنت موافق؟' : 'Tournament simulation requires switching to Prediction Mode. Would you like to switch now?')) {
        setIsHistoricalMode(false);
      } else {
        return;
      }
    }

    setIsSimulating(true);
    showNotification(language === 'ar' ? "بدء محاكاة مباريات كأس العالم..." : "Beginning tournament matches prediction simulation...", "info");

    const simulatedScores: { [matchId: string]: { score1: number | null; score2: number | null } } = {};
    const simulatedStandings: { [groupId: string]: string[] } = {};

    selectedEdition.groups.forEach(group => {
      // 6 matches per group
      for (let i = 0; i < group.teams.length; i++) {
        for (let j = i + 1; j < group.teams.length; j++) {
          const t1 = group.teams[i];
          const t2 = group.teams[j];
          const matchId = `group_${group.id}_${t1.id}_${t2.id}`;
          
          // Generate realistic football scores
          const rand = Math.random();
          let s1 = 0;
          let s2 = 0;
          if (rand < 0.35) {
            s1 = Math.floor(Math.random() * 3);
            s2 = s1; // Draw
          } else if (rand < 0.7) {
            s1 = Math.floor(Math.random() * 4);
            s2 = Math.floor(Math.random() * (s1 || 1));
          } else {
            s2 = Math.floor(Math.random() * 4);
            s1 = Math.floor(Math.random() * (s2 || 1));
          }
          simulatedScores[matchId] = { score1: s1, score2: s2 };
        }
      }
    });

    setCustomScores(simulatedScores);

    // Recalculate group standings immediately
    const calculated = calculateGroupStandings(selectedEdition, {}, simulatedScores, true);
    Object.keys(calculated).forEach(groupId => {
      simulatedStandings[groupId] = calculated[groupId].map(st => st.team.id);
    });
    setCurrentStandings(simulatedStandings);

    // Dynamic Best Third-placed selections
    if (selectedEdition.systemType === '48-teams' || selectedEdition.systemType === '24-teams') {
      const thirdsList: { teamId: string; points: number; gd: number; gf: number }[] = [];
      Object.keys(calculated).forEach(groupId => {
        const list = calculated[groupId];
        if (list && list.length >= 3) {
          const thirdPlace = list[2];
          thirdsList.push({
            teamId: thirdPlace.team.id,
            points: thirdPlace.points,
            gd: thirdPlace.gd,
            gf: thirdPlace.gf
          });
        }
      });
      thirdsList.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return a.teamId.localeCompare(b.teamId);
      });
      const countNeeded = selectedEdition.systemType === '24-teams' ? 4 : 8;
      const topThirdIds = thirdsList.slice(0, countNeeded).map(t => t.teamId);
      setBestThirdSelected(topThirdIds);
    }

    // Delay before starting knockout rounds simulation
    await new Promise(resolve => setTimeout(resolve, 800));

    const computedWinners: { [matchId: string]: string } = {};
    const stages: ('r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final')[] = selectedEdition.systemType === '48-teams' 
      ? ['r32', 'r16', 'qf', 'sf', 'third', 'final']
      : ['r16', 'qf', 'sf', 'third', 'final'];

    for (const stage of stages) {
      // Resolve matches with current winners
      const resolved = resolveKnockoutMatches(selectedEdition, simulatedStandings, bestThirdSelected, computedWinners);
      const stageMatches = Object.values(resolved).filter(m => m.stage === stage);

      if (stageMatches.length === 0) continue;

      stageMatches.forEach(m => {
        if (!m.team1 || !m.team2) return;
        // Roll random weighted winner
        const t1Id = m.team1.id;
        const t2Id = m.team2.id;
        // Weight somewhat based on alphabetical or random
        const winner = Math.random() > 0.49 ? t1Id : t2Id;
        computedWinners[m.id] = winner;
      });

      setKnockoutWinners({ ...computedWinners });
      // Short delay per stage
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setIsSimulating(false);
    showNotification(language === 'ar' ? "اكتملت محاكاة وتوقعات البطولة بنجاح!" : "Tournament bracket simulation completed successfully!", "success");
  };

  // Compile prediction matches score against true FIFA history
  const calculatePredictionAccuracy = () => {
    if (selectedYear === '2026') return null;

    let correctGroups = 0;
    const totalGroups = selectedEdition.groups.length;

    let correctKnockoutMatches = 0;
    const totalKnockoutMatches = selectedEdition.historicalKnockouts.length;

    // 1. Check Group Qualifiers (Exact position matches)
    selectedEdition.groups.forEach(g => {
      const act = selectedEdition.historicalStandings[g.id] || [];
      const pred = currentStandings[g.id] || [];
      
      const actQ = act.slice(0, 2);
      const predQ = pred.slice(0, 2);

      if (actQ[0] === predQ[0]) correctGroups += 0.5;
      if (actQ[1] === predQ[1]) correctGroups += 0.5;
    });

    // 2. Check Knockout Matches Winners
    selectedEdition.historicalKnockouts.forEach(hk => {
      const userWinnerId = knockoutWinners[hk.matchId];
      if (userWinnerId && userWinnerId === hk.winnerId) {
        correctKnockoutMatches += 1;
      }
    });

    const totalEvaluated = totalGroups + totalKnockoutMatches;
    const totalCorrect = correctGroups + correctKnockoutMatches;
    const successRate = totalEvaluated > 0 ? Math.round((totalCorrect / totalEvaluated) * 100) : 0;

    return {
      correctGroups,
      totalGroups,
      correctKnockoutMatches,
      totalKnockoutMatches,
      successRate
    };
  };

  // Dynamic profiles analyzer
  const getTeamProfileStats = (team: Team) => {
    let participations = 0;
    let titles = 0;
    const winningYears: string[] = [];

    WORLD_CUP_EDITIONS.forEach(ed => {
      let containsTeam = false;
      ed.groups.forEach(g => {
        if (g.teams.some(t => t.id === team.id)) containsTeam = true;
      });
      if (containsTeam) participations += 1;

      if (ed.winnerId === team.id) {
        titles += 1;
        winningYears.push(ed.year);
      }
    });

    // Curated prominent info
    const curatedProminent: { [id: string]: { continentEn: string; continentAr: string; bestFinishEn: string; bestFinishAr: string; legendEn: string; legendAr: string; currentRank: number } } = {
      ar: { continentEn: "CONMEBOL (South America)", continentAr: "كونميبول (أمريكا الجنوبية)", bestFinishEn: "Champions (1978, 1986, 2022)", bestFinishAr: "البطل (1978، 1986، 2022)", legendEn: "Diego Maradona, Lionel Messi", legendAr: "دييغو مارادونا، ليونيل ميسي", currentRank: 1 },
      br: { continentEn: "CONMEBOL (South America)", continentAr: "كونميبول (أمريكا الجنوبية)", bestFinishEn: "Champions (5 times: 1958, 1962, 1970, 1994, 2002)", bestFinishAr: "البطل (5 مرات: 1958، 1962، 1970، 1994، 2002)", legendEn: "Pelé, Ronaldo Nazário", legendAr: "بيليه، رونالدو نازاريو", currentRank: 5 },
      de: { continentEn: "UEFA (Europe)", continentAr: "يويفا (أوروبا)", bestFinishEn: "Champions (4 times: 1954, 1974, 1990, 2014)", bestFinishAr: "البطل (4 مرات: 1954، 1974، 1990، 2014)", legendEn: "Franz Beckenbauer, Miroslav Klose", legendAr: "فرانز بيكنباور، ميروسلاف كلوزه", currentRank: 11 },
      it: { continentEn: "UEFA (Europe)", continentAr: "يويفا (أوروبا)", bestFinishEn: "Champions (4 times: 1934, 1938, 1982, 2006)", bestFinishAr: "البطل (4 مرات: 1934، 1938، 1982، 2006)", legendEn: "Roberto Baggio, Gianluigi Buffon", legendAr: "روبيرتو باجيو، جيانلويجي بوفون", currentRank: 9 },
      fr: { continentEn: "UEFA (Europe)", continentAr: "يويفا (أوروبا)", bestFinishEn: "Champions (1998, 2018)", bestFinishAr: "البطل (1998، 2018)", legendEn: "Zinedine Zidane, Kylian Mbappé", legendAr: "زين الدين زيدان، كيليان مبابي", currentRank: 2 },
      uy: { continentEn: "CONMEBOL (South America)", continentAr: "كونميبول (أمريكا الجنوبية)", bestFinishEn: "Champions (1930, 1950)", bestFinishAr: "البطل (1930، 1950)", legendEn: "Enzo Francescoli, Luis Suárez", legendAr: "إنزو فرانشيسكولي، لويس سواريز", currentRank: 14 },
      gb: { continentEn: "UEFA (Europe)", continentAr: "يويفا (أوروبا)", bestFinishEn: "Champions (1966)", bestFinishAr: "البطل (1966)", legendEn: "Bobby Charlton, Harry Kane", legendAr: "بوبي تشارلتون، هاري كين", currentRank: 4 },
      en: { continentEn: "UEFA (Europe)", continentAr: "يويفا (أوروبا)", bestFinishEn: "Champions (1966)", bestFinishAr: "البطل (1966)", legendEn: "Bobby Charlton, Harry Kane", legendAr: "بوبي تشارلتون، هاري كين", currentRank: 4 },
      es: { continentEn: "UEFA (Europe)", continentAr: "يويفا (أوروبا)", bestFinishEn: "Champions (2010)", bestFinishAr: "البطل (2010)", legendEn: "Andrés Iniesta, Iker Casillas", legendAr: "أندريس إنييستا، إيكر كاسياس", currentRank: 3 },
      ma: { continentEn: "CAF (Africa)", continentAr: "كاف (أفريقيا)", bestFinishEn: "4th Place (2022)", bestFinishAr: "المركز الرابع (2022)", legendEn: "Mustapha Hadji, Achraf Hakimi", legendAr: "مصطفى حجي، أشرف حكيمي", currentRank: 13 },
      nl: { continentEn: "UEFA (Europe)", continentAr: "يويفا (أوروبا)", bestFinishEn: "Runners-up (3 times)", bestFinishAr: "الوصيف (3 مرات)", legendEn: "Johan Cruyff, Marco van Basten", legendAr: "يوهان كرويف، ماركو فان باستن", currentRank: 7 },
      be: { continentEn: "UEFA (Europe)", continentAr: "يويفا (أوروبا)", bestFinishEn: "3rd Place (2018)", bestFinishAr: "المركز الثالث (2018)", legendEn: "Eden Hazard, Kevin De Bruyne", legendAr: "إيدين هازارد، كيفين دي بروين", currentRank: 6 }
    };

    const fallback = curatedProminent[team.id] || {
      continentEn: "International (FIFA Union)",
      continentAr: "دولي (الاتحاد الدولي فيفا)",
      bestFinishEn: titles > 0 ? `Champions (${titles} times)` : "Group Stage / Qualifiers",
      bestFinishAr: titles > 0 ? `البطل (${titles} مرات)` : "المجموعات / المتأهلين",
      legendEn: "Historic Squad Stars",
      legendAr: "نجوم الصفوف التاريخية",
      currentRank: 45
    };

    return {
      participations: participations || 2,
      titles: titles,
      winningYears,
      ...fallback
    };
  };

  // List of all matches arranged by stage for vertical bracket visual rendering
  const r32Matches = Object.values(resolvedKnockoutTree).filter(m => m.stage === 'r32');
  const r16Matches = Object.values(resolvedKnockoutTree).filter(m => m.stage === 'r16');
  const qfMatches = Object.values(resolvedKnockoutTree).filter(m => m.stage === 'qf');
  const sfMatches = Object.values(resolvedKnockoutTree).filter(m => m.stage === 'sf');
  const thirdMatch = resolvedKnockoutTree["THIRD"];
  const finalMatch = resolvedKnockoutTree["FINAL"];

  // Custom tooltips rendering for recharts bar chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-800 text-slate-100 p-3.5 rounded-xl shadow-xl text-xs space-y-1 z-50">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span>{data.emoji}</span>
            <span className="text-white">{data.name}</span>
          </div>
          <p className="text-slate-350">
            {dict.statsChartFrequency}: <span className="font-mono font-bold text-amber-400">{data.count}</span>
          </p>
          <div className="text-[10px] text-slate-400">
            <span className="block font-semibold text-slate-500">{dict.statsTableYears}:</span>
            <span className="font-mono text-slate-350">{data.years.join(', ')}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-elegant-bg text-slate-800 dark:text-slate-200 font-sans selection:bg-[#cca300]/30 selection:text-[#cca300] pb-24 transition-colors duration-300">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-50 flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 border border-slate-800 dark:border-slate-200 px-5 py-4 rounded-xl shadow-xl transition-all duration-300 animate-slide-up">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-elegant-header sticky top-0 z-40 backdrop-blur-md bg-opacity-90 dark:bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center gap-4">
          
          {/* Logo Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center shadow-md animate-pulse-slow">
              <Trophy className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-display font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-amber-600 dark:from-white dark:via-slate-200 dark:to-amber-400 bg-clip-text text-transparent">
                {dict.title}
              </h1>
              <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-medium">
                {dict.subtitle}
              </p>
            </div>
          </div>

          {/* Smart Unified Search Bar */}
          <div className="hidden md:block relative flex-1 max-w-sm mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder={language === 'ar' ? "ابحث عن منتخب، بطولة، أسطورة..." : "Search team, year, legend..."}
                style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                className="w-full text-xs pl-9 pr-4 py-2 bg-slate-100 dark:bg-[#1c2436] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-left rtl:text-right"
              />
            </div>

            {/* Absolute Dropdown results box */}
            {isSearchFocused && searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-[#161e2d] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto animate-scale-up">
                {(() => {
                  const query = searchQuery.toLowerCase().trim();
                  const matches: any[] = [];
                  
                  // Years
                  WORLD_CUP_EDITIONS.forEach(ed => {
                    const hostNm = language === 'ar' ? ed.hostAr : ed.hostEn;
                    const winnerNm = language === 'ar' ? ed.historicalWinnerAr : ed.historicalWinnerEn;
                    if (ed.year.includes(query) || hostNm.toLowerCase().includes(query) || ed.hostEn.toLowerCase().includes(query)) {
                      matches.push({
                        type: 'edition',
                        id: ed.year,
                        titleEn: `World Cup ${ed.year} - ${ed.hostEn}`,
                        titleAr: `كأس العالم ${ed.year} - ${ed.hostAr}`,
                        subEn: `Winner: ${ed.historicalWinnerEn}`,
                        subAr: `البطل: ${winnerNm}`,
                        icon: `🏆`
                      });
                    }
                  });

                  // Teams
                  Object.values(GLOBAL_TEAMS).forEach(t => {
                    if ((t.nameEn + t.nameAr).toLowerCase().includes(query)) {
                      matches.push({
                        type: 'team',
                        id: t.id,
                        titleEn: t.nameEn,
                        titleAr: t.nameAr,
                        subEn: `Inspect Country Profile`,
                        subAr: `عرض تفاصيل ملف المنتخب`,
                        icon: t.emoji,
                        teamData: t
                      });
                    }
                  });

                  // Legends
                  const legendsList = [
                    { nameEn: "Lionel Messi", nameAr: "ليونيل ميسي", year: "2022", noteEn: "Qatar 2022 Legend", noteAr: "أسطورة مونديال قطر 2022" },
                    { nameEn: "Diego Maradona", nameAr: "دييغو مارادونا", year: "1986", noteEn: "Mexico 1986 King", noteAr: "بطل المكسيك 1986" },
                    { nameEn: "Pelé", nameAr: "بيليه", year: "1970", noteEn: "Mexico 1970 Champ", noteAr: "العصر الذهبي للمكسيك 1970" },
                    { nameEn: "Zinedine Zidane", nameAr: "زين الدين زيدان", year: "1998", noteEn: "France 1998 Star", noteAr: "نجم فرنسا 1998" }
                  ];

                  legendsList.forEach(leg => {
                    if ((leg.nameEn + leg.nameAr).toLowerCase().includes(query)) {
                      matches.push({
                        type: 'legend',
                        id: leg.year,
                        titleEn: `Legend: ${leg.nameEn}`,
                        titleAr: `الأسطورة: ${leg.nameAr}`,
                        subEn: `View WC ${leg.year} tournament`,
                        subAr: `عرض نسخة كأس العالم ${leg.year}`,
                        icon: `⭐`
                      });
                    }
                  });

                  if (matches.length === 0) {
                    return (
                      <p className="p-4 text-center text-xs italic text-slate-400">
                        {language === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matches found'}
                      </p>
                    );
                  }

                  return matches.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (m.type === 'team') {
                          setSelectedProfileTeam(m.teamData);
                        } else {
                          setSelectedYear(m.id);
                        }
                        setSearchQuery('');
                      }}
                      className="w-full text-left rtl:text-right px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-elegant-subbg flex items-center gap-3 transition-colors shrink-0 cursor-pointer"
                    >
                      <span className="text-lg shrink-0">{m.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate text-left rtl:text-right">
                          {language === 'ar' ? m.titleAr : m.titleEn}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate text-left rtl:text-right mt-0.5">
                          {language === 'ar' ? m.subAr : m.subEn}
                        </p>
                      </div>
                    </button>
                  ));
                })()}
              </div>
            )}
          </div>

          {/* Quick Settings Bar */}
          <div className="flex items-center gap-2">
            
            {/* Language Selection */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-elegant-input transition-all text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 focus:outline-none"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-elegant-input transition-all text-slate-500 focus:outline-none"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-8 space-y-6">
        
        {/* Top Control Panel Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. Year & Edition selection card */}
          <div className="lg:col-span-1 bg-white dark:bg-elegant-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
                <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {dict.selectEdition}
                </h2>
              </div>
              
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-elegant-input border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl font-display font-bold text-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-none cursor-pointer appearance-none text-slate-800 dark:text-slate-100 text-left rtl:text-right"
                >
                  {WORLD_CUP_EDITIONS.map(ed => (
                    <option key={ed.year} value={ed.year}>
                      🏆 {ed.year} - {language === 'ar' ? ed.hostAr : ed.hostEn} ({ed.teamsCount} {language === 'ar' ? 'منتخباً' : 'Teams'})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 ltr:right-4 rtl:left-4 flex items-center text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Historical Winner Information badge */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-elegant-subbg border border-slate-200/50 dark:border-slate-800/40 flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-500 shrink-0 fill-amber-500/10" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  {dict.historyWinnerTitle} ({selectedEdition.year})
                </p>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                  <span>{language === 'ar' ? selectedEdition.historicalWinnerAr : selectedEdition.historicalWinnerEn}</span>
                  {selectedEdition.winnerId !== 'unknown' && (
                    <Flag team={GLOBAL_TEAMS[selectedEdition.winnerId]} size="sm" className="inline-block" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Simulation Mode selector card */}
          <div className="lg:col-span-2 bg-white dark:bg-elegant-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500 shrink-0" />
                <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {dict.modeSelectorTitle}
                </h2>
              </div>

              {/* Mode Toggle switch */}
              <div className="grid grid-cols-2 gap-3.5 bg-slate-100 dark:bg-elegant-subbg p-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800">
                
                {/* Historical Mode */}
                <button
                  onClick={() => setIsHistoricalMode(true)}
                  className={`py-3.5 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-2 px-3 transition-all ${
                    isHistoricalMode 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-550/10'
                  }`}
                >
                  <Lock className="w-4 h-4 shrink-0" />
                  <div className="text-center sm:text-start">
                    <span className="text-xs md:text-sm font-bold block">{dict.historicalModeName}</span>
                  </div>
                </button>

                {/* Prediction Mode */}
                <button
                  onClick={() => setIsHistoricalMode(false)}
                  className={`py-3.5 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-2 px-3 transition-all ${
                    !isHistoricalMode 
                      ? 'bg-indigo-600 text-white font-bold shadow-md' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-550/10'
                  }`}
                >
                  <Unlock className="w-4 h-4 shrink-0" />
                  <div className="text-center sm:text-start">
                    <span className="text-xs md:text-sm font-bold block">{dict.predictionModeName}</span>
                  </div>
                </button>

              </div>
            </div>

            {/* Mode description text */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-50 dark:bg-elegant-subbg border border-slate-100 dark:border-slate-800 flex gap-2.5 items-start">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isHistoricalMode ? dict.historicalDescription : dict.predictionDescription}
              </p>
            </div>

            {/* Predictor Signature Card */}
            {!isHistoricalMode && (
              <div className="mt-5 p-5 rounded-2xl border border-slate-200 dark:border-amber-500/10 bg-slate-50/50 dark:bg-[#161e2d]/60 backdrop-blur-md shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 dark:text-amber-500 flex items-center gap-2 mb-4 uppercase tracking-wider">
                  <Award className="w-4 h-4 text-amber-500" />
                  {dict.predictorIdentityTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 select-none">
                      {dict.predictorNameLabel}
                    </label>
                    <input
                      type="text"
                      value={predictorName}
                      onChange={(e) => setPredictorName(e.target.value)}
                      placeholder={dict.predictorNamePlaceholder}
                      className="w-full text-xs bg-white dark:bg-elegant-bg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 select-none">
                      {dict.predictorSignatureLabel}
                    </label>
                    <input
                      type="text"
                      value={predictorSignature}
                      onChange={(e) => setPredictorSignature(e.target.value)}
                      placeholder={dict.predictorSignaturePlaceholder}
                      className="w-full text-xs bg-white dark:bg-elegant-bg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Global Save and Share Action Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-yellow-500/20 bg-white dark:bg-elegant-card backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400 max-w-sm">
            <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{!isHistoricalMode ? dict.howToSort : dict.bracketLocked}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {!isHistoricalMode && (
              <>
                {/* Reset prediction */}
                <button
                  onClick={handleResetPredictions}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 hover:border-rose-500/20 active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 focus:outline-none cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {dict.resetBtn}
                </button>

                {/* Save predictions */}
                <button
                  onClick={handleSavePredictions}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer focus:outline-none"
                >
                  <Save className="w-3.5 h-3.5" />
                  {dict.saveBtn}
                </button>
                
                {/* Full simulation predictor */}
                <button
                  onClick={handleSimulateTournament}
                  disabled={isSimulating}
                  className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer focus:outline-none h-fit"
                >
                  <Play className={`w-3.5 h-3.5 fill-white/10 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? (language === 'ar' ? "جاري المحاكاة..." : "Simulating...") : (language === 'ar' ? "محاكاة كاملة" : "Auto-Simulate")}</span>
                </button>
              </>
            )}

            {/* Compare with Reality (Only for historical seasons) */}
            {selectedYear !== '2026' && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-4 py-2.5 rounded-xl border border-amber-500/30 text-amber-500 hover:bg-amber-500/5 active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? "قارن بالحقيقة" : "Compare with Reality"}</span>
              </button>
            )}

            {/* Share custom predictions */}
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer focus:outline-none"
            >
              <Share2 className="w-3.5 h-3.5" />
              {dict.shareBtn}
            </button>
          </div>
        </div>

        {/* --- DYNAMIC DISPLAY SECTIONS --- */}

        {/* Champion and Runner-up crown visual presentation cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-[#121826] dark:to-elegant-subbg border border-slate-200 dark:border-slate-800 shadow-inner">
          
          {/* Projected Champion */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#161e2d] border border-slate-200 dark:border-yellow-500/30 shadow-md relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 ltr:right-0 rtl:left-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-3">
              <Trophy className="w-7 h-7 text-amber-500 fill-amber-500/10 animate-bounce" />
              <div>
                <h3 className="font-display font-extrabold text-xs text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  {dict.winnerBadge}
                </h3>
                <h2 className="font-display font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white mt-1">
                  {resolvedChampion 
                    ? (language === 'ar' ? resolvedChampion.nameAr : resolvedChampion.nameEn) 
                    : dict.noWinnerYet}
                </h2>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between gap-4">
              <Flag team={resolvedChampion} size="xl" className="shadow-md" />
              {!isHistoricalMode && !resolvedChampion && (
                <p className="text-[11px] text-slate-400 font-medium">
                  {dict.selectWinnerToAdvance}
                </p>
              )}
            </div>
          </div>

          {/* Projected Runner-up */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-7 h-7 text-indigo-400 fill-indigo-400/10" />
              <div>
                <h3 className="font-display font-extrabold text-xs text-indigo-500 uppercase tracking-widest">
                  {dict.runnerUpBadge}
                </h3>
                <h2 className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white mt-1">
                  {resolvedRunnerUp 
                    ? (language === 'ar' ? resolvedRunnerUp.nameAr : resolvedRunnerUp.nameEn) 
                    : dict.noWinnerYet}
                </h2>
              </div>
            </div>
            <div className="mt-6 flex items-start justify-between gap-4">
              <Flag team={resolvedRunnerUp} size="lg" className="shadow-md" />
            </div>
          </div>

        </div>

        {/* 1. Group Stage Grid Table Panel */}
        <div id="group-stage-sec" className="space-y-4 scroll-mt-24">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3 block">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-1.5 h-6 rounded-full bg-amber-500" />
              {dict.groupStage}
            </h2>
            <span className="text-xs bg-slate-100 dark:bg-elegant-subbg px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800 font-bold font-mono">
              {selectedEdition.groups.length} {language === 'ar' ? 'مجموعات' : 'Groups'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedEdition.groups.map(g => (
              <GroupCard
                key={g.id}
                group={g}
                language={language}
                standings={resolvedGroupStandings[g.id]}
                isHistoricalMode={isHistoricalMode}
                onMoveTeam={handleMoveTeam}
                onOpenFocus={setFocusedGroupId}
              />
            ))}
          </div>
        </div>

        {/* 2. SPECIFIC THIRD-PLACES SCREEN: Best Third-Place Qualifiers */}
        {(selectedYear === '2026' || selectedEdition.systemType === '24-teams') && !isHistoricalMode && (
          <div id="third-place-sec" className="bg-gradient-to-br from-indigo-955/40 via-elegant-card to-elegant-bg border border-slate-800 p-5 rounded-2xl shadow-lg space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-indigo-400 stroke-[2] shrink-0" />
              <div>
                <h2 className="font-display font-extrabold text-lg text-slate-100">
                  {selectedEdition.systemType === '24-teams' ? dict.bestThirdPlaceTitle24 : dict.bestThirdPlaceTitle}
                </h2>
                <p className="text-xs text-slate-350 mt-0.5">
                  {selectedEdition.systemType === '24-teams' ? dict.bestThirdPlaceDesc24 : dict.bestThirdPlaceDesc}
                </p>
              </div>
            </div>

            {/* Custom counter progress */}
            <div className="flex items-center justify-between gap-4 p-3 bg-elegant-subbg rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-indigo-400">
                {selectedEdition.systemType === '24-teams'
                  ? dict.selectedCount24.replace('{count}', bestThirdSelected.length.toString())
                  : dict.selectedCount.replace('{count}', bestThirdSelected.length.toString())}
              </span>
              <div className="flex-1 h-2 bg-elegant-bg rounded-full overflow-hidden max-w-xs mx-4">
                <div 
                  className={`h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300`} 
                  style={{ 
                    width: `${(Math.min(bestThirdSelected.length, selectedEdition.systemType === '24-teams' ? 4 : 8) / (selectedEdition.systemType === '24-teams' ? 4 : 8)) * 100}%` 
                  }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-elegant-input/75 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                {bestThirdSelected.length === (selectedEdition.systemType === '24-teams' ? 4 : 8) ? 'Complete' : 'Pending'}
              </span>
            </div>

            {/* 12 Third-Place Cards Toggle row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
              {thirdPlaceCandidates.map((team) => {
                const isSelected = bestThirdSelected.includes(team.id);
                return (
                  <button
                    key={team.id}
                    onClick={() => handleToggleThirdPlace(team.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2.5 transition-all text-center focus:outline-none ${
                      isSelected
                        ? 'bg-amber-500 border-amber-400 text-slate-950 font-extrabold shadow-md transform scale-[1.03]'
                        : 'bg-elegant-input border-slate-805 text-slate-300 hover:border-slate-700 hover:bg-[#1c2436] cursor-pointer'
                    }`}
                  >
                    <Flag team={team} size="md" className="shadow-sm" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono opacity-60 uppercase mb-0.5">
                        {language === 'ar' ? 'المركز الثالث' : '3rd Place'}
                      </span>
                      <span className="text-xs truncate max-w-[100px] block">
                        {language === 'ar' ? team.nameAr : team.nameEn}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-[9px] uppercase bg-slate-950 text-amber-500 px-1.5 py-0.5 rounded-md font-bold font-mono">
                        {dict.bestThirdSelected}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Tournament Knockout Matches Tree Rendering */}
        <div id="knockout-stage-sec" className="space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-1.5 h-6 rounded-full bg-indigo-500" />
              {dict.knockoutStage}
            </h2>
            
            {/* Scroll Assist Left/Right arrow controls */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-elegant-subbg p-1 rounded-xl border border-slate-200/40 dark:border-slate-800 shrink-0">
              <button
                onClick={() => handleScrollBracket('left')}
                className="p-1.5 hover:bg-white dark:hover:bg-[#1c2436] text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0 border border-transparent hover:border-slate-250 dark:hover:border-slate-700/60 shadow-sm"
                title={language === 'ar' ? "تمرير لليمين" : "Scroll Left"}
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
              <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />
              <button
                onClick={() => handleScrollBracket('right')}
                className="p-1.5 hover:bg-white dark:hover:bg-[#1c2436] text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-white rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0 border border-transparent hover:border-slate-250 dark:hover:border-slate-700/60 shadow-sm"
                title={language === 'ar' ? "تمرير لليسار" : "Scroll Right"}
              >
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Dynamic Scrollable Column Container for Tree Bracket */}
          <div ref={bracketScrollRef} className="overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth custom-scrollbar">
            <div className="min-w-[1000px] flex items-stretch gap-6 py-4 justify-between">
              
              {/* STAGE A: ROUND OF 32 (specifically for 2026 format) */}
              {selectedYear === '2026' && (
                <div className="flex-1 min-w-[240px] flex flex-col justify-around gap-12 border-r border-slate-100 dark:border-slate-800 pr-4">
                  <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800">
                    {language === 'ar' ? "دور الـ 32" : "Round of 32"} ({r32Matches.length})
                  </div>
                  {r32Matches.map(m => (
                    <MatchCard
                      key={m.id}
                      match={m}
                      language={language}
                      isHistoricalMode={isHistoricalMode}
                      onSelectWinner={handleSelectKnockoutWinner}
                      predictedWinnerId={knockoutWinners[m.id]}
                    />
                  ))}
                </div>
              )}

              {/* STAGE B: ROUND OF 16 (for 2026 and standard 32-team tournament formats) */}
              {(selectedEdition.systemType === '48-teams' || selectedEdition.systemType === '32-teams') && (
                <div className="flex-1 min-w-[240px] flex flex-col justify-around gap-12 border-r border-slate-100 dark:border-slate-800 pr-4">
                  <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800">
                    {language === 'ar' ? "دور الـ 16" : "Round of 16"} ({r16Matches.length})
                  </div>
                  {r16Matches.map(m => (
                    <MatchCard
                      key={m.id}
                      match={m}
                      language={language}
                      isHistoricalMode={isHistoricalMode}
                      onSelectWinner={handleSelectKnockoutWinner}
                      predictedWinnerId={knockoutWinners[m.id]}
                    />
                  ))}
                </div>
              )}

              {/* STAGE C: QUARTER FINALS (for 48, 32, 16 formats) */}
              {selectedEdition.systemType !== '13-teams' && (
                <div className="flex-1 min-w-[240px] flex flex-col justify-around gap-16 border-r border-slate-100 dark:border-slate-800 pr-4">
                  <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800">
                    {language === 'ar' ? "ربع النهائي" : "Quarter Finals"} ({qfMatches.length})
                  </div>
                  {qfMatches.map(m => (
                    <MatchCard
                      key={m.id}
                      match={m}
                      language={language}
                      isHistoricalMode={isHistoricalMode}
                      onSelectWinner={handleSelectKnockoutWinner}
                      predictedWinnerId={knockoutWinners[m.id]}
                    />
                  ))}
                </div>
              )}

              {/* STAGE D: SEMI FINALS (All) */}
              <div className="flex-1 min-w-[240px] flex flex-col justify-around gap-20 border-r border-slate-100 dark:border-slate-800 pr-4">
                <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800">
                  {language === 'ar' ? "نصف النهائي" : "Semi Finals"} ({sfMatches.length})
                </div>
                {sfMatches.map(m => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    language={language}
                    isHistoricalMode={isHistoricalMode}
                    onSelectWinner={handleSelectKnockoutWinner}
                    predictedWinnerId={knockoutWinners[m.id]}
                  />
                ))}
              </div>

              {/* STAGE E: CHAMPIONSHIP MATCH + THIRD PLACE BOX (FINAL) */}
              <div className="flex-1 min-w-[245px] flex flex-col justify-around gap-8">
                
                {/* 3rd Place Match Option */}
                {thirdMatch && (
                  <div className="space-y-2 mt-4">
                    <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800">
                      {dict.thirdPlaceBadge}
                    </div>
                    <MatchCard
                      match={thirdMatch}
                      language={language}
                      isHistoricalMode={isHistoricalMode}
                      onSelectWinner={handleSelectKnockoutWinner}
                      predictedWinnerId={knockoutWinners["THIRD"]}
                    />
                  </div>
                )}

                {/* Final Match Matchcard */}
                <div className="space-y-2">
                  <div className="text-center font-bold text-xs uppercase tracking-wider text-amber-500 py-1 border-b border-amber-500/30">
                    {language === 'ar' ? "المباراة النهائية" : "Grand Final"}
                  </div>
                  {finalMatch ? (
                    <MatchCard
                      match={finalMatch}
                      language={language}
                      isHistoricalMode={isHistoricalMode}
                      onSelectWinner={handleSelectKnockoutWinner}
                      predictedWinnerId={knockoutWinners["FINAL"]}
                    />
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-450 italic">
                      Locked
                    </div>
                  )}
                </div>

                {/* Simulated Champion Spotlight Crown box */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-yellow-500/50 bg-slate-100 dark:bg-gradient-to-b dark:from-[#1c2436] dark:to-elegant-subbg flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden group shadow-yellow-500/5">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none" />
                  <Trophy className="w-10 h-10 text-amber-400 fill-amber-400/10 mb-2" />
                  <p className="text-[10px] uppercase font-mono tracking-widest text-[#cca300] font-bold">
                    {language === 'ar' ? "البطل التوقعي" : "CHAMPION FORECAST"}
                  </p>
                  <p className="text-base font-extrabold text-slate-800 dark:text-white mt-1">
                    {resolvedChampion ? (language === 'ar' ? resolvedChampion.nameAr : resolvedChampion.nameEn) : 'TBD'}
                  </p>
                  <div className="mt-3">
                    <Flag team={resolvedChampion} size="lg" className="shadow" />
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* STATISTICS DASHBOARD */}
        <div id="stats-dashboard-sec" className="bg-white dark:bg-elegant-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 scroll-mt-24">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-xl dark:bg-indigo-400/10 dark:text-indigo-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  {dict.statsDashboardTitle}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {dict.statsDashboardSubtitle}
              </p>
            </div>
            
            {/* Real-time Indicator Badge */}
            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>{language === 'ar' ? "تحليل مباشر" : "Live Analytics"}</span>
            </div>
          </div>

          {simulatedWinnersData.length === 0 ? (
            /* Empty State Container */
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-105 dark:bg-elegant-subbg border border-slate-200 dark:border-slate-805 flex items-center justify-center text-slate-400 dark:text-slate-505">
                <Trophy className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {dict.statsNoData}
              </p>
            </div>
          ) : (
            /* Full Dashboard Grid */
            <div className="space-y-6">
              
              {/* Stat Summary Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Stat 1: Total Simulations */}
                <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-elegant-subbg border border-slate-150 dark:border-slate-800/60 flex items-center gap-4">
                  <div className="p-3 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {dict.statsTotalSimulations}
                    </span>
                    <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5 block">
                      {simulatedWinnersData.reduce((acc, curr) => acc + curr.count, 0)}
                    </span>
                  </div>
                </div>

                {/* Stat 2: Unique Champions */}
                <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-elegant-subbg border border-slate-150 dark:border-slate-800/60 flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                    <Trophy className="w-5 h-5 fill-amber-500/5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {dict.statsUniqueWinners}
                    </span>
                    <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5 block">
                      {simulatedWinnersData.length}
                    </span>
                  </div>
                </div>

                {/* Stat 3: Top Predicted Winner */}
                <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-elegant-subbg border border-slate-150 dark:border-slate-800/60 flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <Award className="w-5 h-5 fill-emerald-500/5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {dict.statsMostFrequentWinner}
                    </span>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                      <span className="text-lg">{simulatedWinnersData[0]?.emoji}</span>
                      <span className="truncate max-w-[120px] sm:max-w-none">{simulatedWinnersData[0]?.name}</span>
                      <span className="text-xs text-slate-405 font-mono font-bold">
                        ({simulatedWinnersData[0]?.count})
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Data Visualization Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Bar Chart Container */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-elegant-subbg border border-slate-150 dark:border-slate-800/60">
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    {language === 'ar' ? "توزيع توقعات المنتخبات المتوجة" : "Predicted Champions Distribution"}
                  </h3>
                  
                  <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={simulatedWinnersData}
                        margin={{ top: 10, right: 10, left: -25, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 500 }}
                          tickLine={false}
                          axisLine={false}
                          interval={0}
                          tickFormatter={(value) => value.length > 8 ? `${value.substring(0, 8)}..` : value}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 500 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }} />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={38}>
                          {simulatedWinnersData.map((entry, index) => {
                            // Highlight the top predicted team with gold/amber, others with elegant indigo shades
                            const barColor = index === 0 
                              ? '#f59e0b' // Amber-500
                              : index === 1 
                                ? '#6366f1' // Indigo-500
                                : index === 2
                                  ? '#818cf8' // Indigo-400
                                  : '#c7d2fe'; // Indigo-200
                            return <Cell key={`cell-${index}`} fill={barColor} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Detailed Leaderboard List */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-elegant-subbg border border-slate-150 dark:border-slate-800/60 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-500 fill-amber-500/10" />
                      {language === 'ar' ? "ترتيب المتوجين المتوقعين" : "Predicted Champions Leaderboard"}
                    </h3>
                    
                    {/* Leaderboard Table Grid */}
                    <div className="max-h-60 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
                      {simulatedWinnersData.map((data, idx) => (
                        <div 
                          key={data.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-elegant-card border border-slate-100 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                        >
                          {/* Rank & Team Name */}
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-black text-slate-400 bg-slate-100 dark:bg-elegant-input dark:text-indigo-400 w-6 h-6 rounded-md flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-lg">{data.emoji}</span>
                              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                                {data.name}
                              </span>
                            </div>
                          </div>

                          {/* Count & Years won */}
                          <div className="text-right flex flex-col items-end">
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
                                {data.count}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {data.count === 1 
                                  ? (language === 'ar' ? 'تتويج' : 'win') 
                                  : (language === 'ar' ? 'تتويجات' : 'wins')}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 truncate max-w-[150px] sm:max-w-xs block">
                              {data.years.join(', ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Simulation Tip helper */}
                  {!isHistoricalMode && resolvedChampion && (
                    <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/55 flex items-center gap-2 text-[10px] text-slate-400 italic leading-none">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping shrink-0" />
                      <span>{dict.statsActiveSimulationTip}</span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* --- SOCIAL SHARE & CANVAS POPUP DIALOG MODAL --- */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-elegant-card border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col animate-scale-up">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-elegant-header">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-500" />
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
                  {dict.socialShareTitle}
                </h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-elegant-input text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto max-h-[70vh] space-y-4">
              
              {/* Invisible/Drawn preview canvas container */}
              <div className="flex justify-center border border-slate-250 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-950 max-w-[420px] mx-auto shadow-md">
                <canvas 
                  ref={shareCanvasRef} 
                  className="w-full h-auto aspect-square object-contain"
                  style={{ width: "100%", height: "100%", maxWidth: "420px" }}
                  width="1000"
                  height="1000"
                />
              </div>

              {/* Action grid options */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                
                {/* Download option */}
                <button
                  onClick={handleDownloadPng}
                  className="col-span-2 py-3 bg-amber-500 hover:bg-amber-600 active:scale-98 transition-all hover:shadow text-slate-950 font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer focus:outline-none text-sm"
                >
                  <Download className="w-4 h-4 stroke-[2]" />
                  {dict.downloadPng}
                </button>

                <div className="w-full col-span-2 h-[1px] bg-slate-150 dark:bg-slate-800/40 my-1" />

                {/* Social links */}
                <button
                  onClick={() => handleSocialShare('wa')}
                  className="py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-500/[0.05] hover:bg-emerald-500/10 hover:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="text-emerald-500 font-bold">💬</span>
                  {dict.whatsApp}
                </button>

                <button
                  onClick={() => handleSocialShare('tw')}
                  className="py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/30 hover:bg-slate-150 dark:hover:bg-elegant-input text-slate-705 dark:text-slate-300 font-bold transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="font-bold">X</span>
                  {dict.xPlatform}
                </button>

                <button
                  onClick={() => handleSocialShare('fb')}
                  className="py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-blue-500/5 dark:bg-blue-500/[0.05] hover:bg-blue-500/10 hover:border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="text-blue-500 font-bold">📘</span>
                  {dict.facebook}
                </button>

                <button
                  onClick={handleCopyLink}
                  className="py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-indigo-500/5 dark:bg-indigo-500/[0.05] hover:bg-indigo-500/10 hover:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="text-indigo-500 font-bold">🔗</span>
                  {dict.copyLink}
                </button>

              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-elegant-header flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-elegant-input text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors hover:bg-slate-300 dark:hover:bg-slate-800 cursor-pointer focus:outline-none"
              >
                {dict.closeBtn}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- SCREEN-IN-SCREEN SIMPLIFIED SELECTION EDITOR WITH PREDICTIVE TABS --- */}
      {focusedGroupId && !isHistoricalMode && (() => {
        const focusedGroup = selectedEdition.groups.find(g => g.id === focusedGroupId);
        if (!focusedGroup) return null;
        const focusedStandings = resolvedGroupStandings[focusedGroup.id];

        const navigateGroup = (direction: 'next' | 'prev') => {
          const allGroupIds = selectedEdition.groups.map(g => g.id);
          const currentIndex = allGroupIds.indexOf(focusedGroupId);
          if (currentIndex !== -1) {
            let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
            if (targetIndex < 0) targetIndex = allGroupIds.length - 1;
            if (targetIndex >= allGroupIds.length) targetIndex = 0;
            setFocusedGroupId(allGroupIds[targetIndex]);
          }
        };

        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-elegant-card border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col animate-scale-up">
              
              {/* Modal Header */}
              <div className="px-5 py-4.5 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50 dark:bg-elegant-subbg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                      {dict.focusModalTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {dict.focusModalSubtitle.replace('{group}', language === 'ar' ? focusedGroup.nameAr : focusedGroup.nameEn)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFocusedGroupId(null)}
                  className="p-1 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-elegant-input text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                
                {/* Tabs Selection */}
                <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-[#131b2c] p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                  <button
                    onClick={() => setFocusedModalTab('ordering')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      focusedModalTab === 'ordering'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {language === 'ar' ? "ترتيب يدوي للمجموعة" : "Manual Table Sorting"}
                  </button>
                  <button
                    onClick={() => setFocusedModalTab('scores')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      focusedModalTab === 'scores'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {language === 'ar' ? "توقع نتائج المباريات بالأهداف" : "Match Score Predictor"}
                  </button>
                </div>

                {focusedModalTab === 'ordering' ? (
                  <div className="space-y-4">
                    {/* Visual Status Indicator: Advancing list */}
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/15 rounded-xl flex items-center justify-between gap-2.5">
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {dict.focusModalAdvancing}
                      </div>
                      <div className="flex items-center gap-2">
                        {focusedStandings.slice(0, 2).map((st, i) => (
                          <div key={st.team.id} className="flex items-center gap-1 bg-white/40 dark:bg-slate-950/40 px-2 py-0.5 rounded-md border border-emerald-500/10 text-xs font-semibold">
                            <span>{st.team.emoji}</span>
                            <span className="text-[10px] text-slate-800 dark:text-slate-200 uppercase font-mono">{i + 1}º</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vertical interactive list reordering */}
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {focusedStandings.map((standing, index) => {
                        const team = standing.team;
                        const isTop2 = index < 2;

                        return (
                          <div
                            key={team.id}
                            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                              isTop2 
                                ? 'bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/20 dark:border-emerald-500/10'
                                : 'bg-slate-50/50 dark:bg-elegant-subbg border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-mono text-xs font-black shadow-inner ${
                                index === 0 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                                index === 1 ? 'bg-slate-400/30 text-slate-600 dark:text-slate-400' :
                                'bg-slate-100 dark:bg-[#131b2c] text-slate-400 dark:text-slate-505'
                              }`}>
                                {index + 1}
                              </span>
                              
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Flag team={team} size="md" className="shadow-sm" />
                                <div className="min-w-0">
                                  <span className="text-sm font-extrabold text-slate-900 dark:text-white block truncate">
                                    {language === 'ar' ? team.nameAr : team.nameEn}
                                  </span>
                                  <span className="text-[10px] text-slate-400 dark:text-slate-505 font-mono">
                                    {standing.points} {language === 'ar' ? 'نقاط' : 'Pts'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleMoveTeam(focusedGroup.id, index, 'up')}
                                disabled={index === 0}
                                className="w-8 h-8 rounded-lg bg-white dark:bg-elegant-input border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-550 dark:text-slate-400 disabled:opacity-20 flex items-center justify-center transition-all cursor-pointer"
                                title="Move Up"
                              >
                                <ChevronUp className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleMoveTeam(focusedGroup.id, index, 'down')}
                                disabled={index === focusedStandings.length - 1}
                                className="w-8 h-8 rounded-lg bg-white dark:bg-elegant-input border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-550 dark:text-slate-400 disabled:opacity-20 flex items-center justify-center transition-all cursor-pointer"
                                title="Move Down"
                              >
                                <ChevronDown className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {(() => {
                      const fixtures: any[] = [];
                      for (let i = 0; i < focusedGroup.teams.length; i++) {
                        for (let j = i + 1; j < focusedGroup.teams.length; j++) {
                          const t1 = focusedGroup.teams[i];
                          const t2 = focusedGroup.teams[j];
                          fixtures.push({
                            id: `group_${focusedGroup.id}_${t1.id}_${t2.id}`,
                            team1: t1,
                            team2: t2
                          });
                        }
                      }

                      return fixtures.map(f => {
                        const matchScr = customScores[f.id] || { score1: null, score2: null };
                        return (
                          <div key={f.id} className="p-3.5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-55/40 dark:bg-[#131b2c] space-y-2 shadow-sm">
                            <div className="flex items-center justify-between gap-1">
                              {/* Team 1 */}
                              <div className="flex-1 flex items-center justify-end gap-2 text-right min-w-0">
                                <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                                  {language === 'ar' ? f.team1.nameAr : f.team1.nameEn}
                                </span>
                                <Flag team={f.team1} size="md" />
                              </div>

                              {/* Scores Inputs */}
                              <div className="flex items-center gap-1.5 shrink-0 mx-2">
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="-"
                                  value={matchScr.score1 ?? ''}
                                  onChange={(e) => {
                                    const valInput = e.target.value === '' ? null : parseInt(e.target.value, 10);
                                    setCustomScores(prev => ({
                                      ...prev,
                                      [f.id]: { score1: isNaN(valInput as any) ? null : valInput, score2: prev[f.id]?.score2 ?? null }
                                    }));
                                  }}
                                  className="w-10 h-9 rounded-lg bg-white dark:bg-elegant-input border border-slate-200 dark:border-slate-800 text-center text-xs font-black focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-none focus:placeholder-transparent text-slate-850 dark:text-white"
                                />
                                <span className="text-slate-350 dark:text-slate-600 font-mono text-[10px] font-bold">VS</span>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="-"
                                  value={matchScr.score2 ?? ''}
                                  onChange={(e) => {
                                    const valInput = e.target.value === '' ? null : parseInt(e.target.value, 10);
                                    setCustomScores(prev => ({
                                      ...prev,
                                      [f.id]: { score1: prev[f.id]?.score1 ?? null, score2: isNaN(valInput as any) ? null : valInput }
                                    }));
                                  }}
                                  className="w-10 h-9 rounded-lg bg-white dark:bg-elegant-input border border-slate-200 dark:border-slate-800 text-center text-xs font-black focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-none focus:placeholder-transparent text-slate-850 dark:text-white"
                                />
                              </div>

                              {/* Team 2 */}
                              <div className="flex-1 flex items-center justify-start gap-2 text-left min-w-0">
                                <Flag team={f.team2} size="md" />
                                <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                                  {language === 'ar' ? f.team2.nameAr : f.team2.nameEn}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}

              </div>

              {/* Modal Footer: navigation buttons and close */}
              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-elegant-subbg flex justify-between items-center gap-3">
                <button
                  onClick={() => navigateGroup('prev')}
                  className="px-3 py-2 bg-white dark:bg-elegant-input border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl flex items-center gap-1 hover:shadow-sm cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                  {dict.focusModalPrev}
                </button>

                <button
                  onClick={() => setFocusedGroupId(null)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-97 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg"
                >
                  {dict.focusModalClose}
                </button>

                <button
                  onClick={() => navigateGroup('next')}
                  className="px-3 py-2 bg-white dark:bg-elegant-input border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl flex items-center gap-1 hover:shadow-sm cursor-pointer"
                >
                  {dict.focusModalNext}
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* --- FLOATING NAVIGATION PILL DOCK --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-[#121826]/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 px-4 py-2.5 rounded-full shadow-2xl z-40 flex items-center gap-1.5 sm:gap-2.5 transition-all duration-350 hover:scale-[1.02] border-indigo-500/10 hover:border-indigo-500/30">
        
        {/* Jump: Groups */}
        <button
          onClick={() => document.getElementById('group-stage-sec')?.scrollIntoView({ behavior: 'smooth' })}
          className="p-1 px-2.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-elegant-input rounded-full text-slate-500 dark:text-slate-400 hover:text-indigo-550 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 font-sans"
          title={language === 'ar' ? "دور المجموعات" : "Group Stage"}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-[10px] sm:text-xs font-extrabold pr-0.5">{language === 'ar' ? "المجموعات" : "Groups"}</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />

        {/* Jump: Third Places */}
        {(selectedYear === '2026' || selectedEdition.systemType === '24-teams') && !isHistoricalMode && (
          <>
            <button
              onClick={() => document.getElementById('third-place-sec')?.scrollIntoView({ behavior: 'smooth' })}
              className="p-1 px-2.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-elegant-input rounded-full text-slate-500 dark:text-slate-400 hover:text-indigo-550 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 font-sans"
              title={language === 'ar' ? "أفضل الثوالث" : "Best Third-Places"}
            >
              <Award className="w-4 h-4 text-amber-500 fill-amber-500/5" />
              <span className="text-[10px] sm:text-xs font-extrabold pr-0.5">{language === 'ar' ? "الثوالث" : "Thirds"}</span>
            </button>
            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />
          </>
        )}

        {/* Jump: Knockouts */}
        <button
          onClick={() => document.getElementById('knockout-stage-sec')?.scrollIntoView({ behavior: 'smooth' })}
          className="p-1 px-2.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-elegant-input rounded-full text-slate-500 dark:text-slate-400 hover:text-indigo-550 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 font-sans"
          title={language === 'ar' ? "الأدوار الإقصائية" : "Knockouts"}
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          <span className="text-[10px] sm:text-xs font-extrabold pr-0.5">{language === 'ar' ? "الإقصائيات" : "Knockout"}</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />

        {/* Jump: Stats */}
        <button
          onClick={() => document.getElementById('stats-dashboard-sec')?.scrollIntoView({ behavior: 'smooth' })}
          className="p-1 px-2.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-elegant-input rounded-full text-slate-500 dark:text-slate-400 hover:text-indigo-550 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 font-sans"
          title={language === 'ar' ? "إحصائيات الأبطال" : "Champions Statistics"}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px] sm:text-xs font-extrabold pr-0.5">{language === 'ar' ? "الإحصائيات" : "Stats"}</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />

        {/* Jump: Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-elegant-input rounded-full text-slate-650 dark:text-slate-400 hover:text-amber-500 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center bg-slate-100 dark:bg-elegant-input"
          title={language === 'ar' ? "أعلى الصفحة" : "Scroll to Top"}
        >
          <ArrowUp className="w-4 h-4" />
        </button>

      </div>

      {/* Footer Branding credits block */}
      <footer className="mt-12 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-elegant-header text-xs font-mono space-y-1 select-none">
        <p>© 2026 FIFA World Cup Predictor & Simulator Engine</p>
        <p>Google AI Studio Build Integration | Full-Stack client local persistence</p>
      </footer>

    </div>
  );
}
