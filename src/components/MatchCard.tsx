import React from 'react';
import { MatchResult, Team, Language } from '../types';
import Flag from './Flag';
import { Check, Trophy, MapPin, Clock } from 'lucide-react';

interface MatchCardProps {
  key?: string;
  match: MatchResult;
  language: Language;
  isHistoricalMode: boolean;
  onSelectWinner: (matchId: string, teamId: string) => void;
  predictedWinnerId?: string;
  predictedScore1?: number | null;
  predictedScore2?: number | null;
  onScoreChange?: (matchId: string, score1: number | null, score2: number | null) => void;
  onOpenTeamProfile?: (team: Team) => void;
}

export default function MatchCard({
  match,
  language,
  isHistoricalMode,
  onSelectWinner,
  predictedWinnerId,
  predictedScore1,
  predictedScore2,
  onScoreChange,
  onOpenTeamProfile
}: MatchCardProps) {
  const { team1, team2, score1, score2, winner } = match;

  const isResolvable = team1 && team2;
  const showHistoricalScore = isHistoricalMode && (score1 !== undefined && score2 !== undefined);

  // Helper translations
  const label = language === 'ar' ? match.labelAr : match.labelEn;
  const noTeamLabel = language === 'ar' ? "لم يحدد" : "TBD";
  
  // Highlight currently chosen team in prediction mode
  const currentWinnerId = isHistoricalMode ? winner?.id : predictedWinnerId;

  const handleRowClick = (team?: Team) => {
    if (isHistoricalMode || !isResolvable || !team) return;
    onSelectWinner(match.id, team.id);
  };

  const handleTeamScoreChange = (teamNum: 1 | 2, valueStr: string) => {
    if (isHistoricalMode || !onScoreChange) return;
    
    const parsed = valueStr === '' ? null : parseInt(valueStr, 10);
    const finalS1 = teamNum === 1 ? parsed : (predictedScore1 !== undefined ? predictedScore1 : null);
    const finalS2 = teamNum === 2 ? parsed : (predictedScore2 !== undefined ? predictedScore2 : null);

    onScoreChange(match.id, finalS1, finalS2);

    // Auto-advance if not equal
    if (finalS1 !== null && finalS2 !== null && team1 && team2) {
      if (finalS1 > finalS2) {
        onSelectWinner(match.id, team1.id);
      } else if (finalS2 > finalS1) {
        onSelectWinner(match.id, team2.id);
      }
    }
  };

  // Determine stage visual badge color
  const getStageBadgeColor = () => {
    switch (match.stage) {
      case 'final':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'sf':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'qf':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'third':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
  };

  const getStageName = () => {
    if (language === 'ar') {
      switch (match.stage) {
        case 'r32': return 'دور الـ 32';
        case 'r16': return 'دور الـ 16';
        case 'qf': return 'ربع النهائي';
        case 'sf': return 'نصف النهائي';
        case 'third': return 'المركز الثالث';
        case 'final': return 'النهائي';
      }
    } else {
      switch (match.stage) {
        case 'r32': return 'Round of 32';
        case 'r16': return 'Round of 16';
        case 'qf': return 'Quarter Finals';
        case 'sf': return 'Semi Finals';
        case 'third': return '3rd Place';
        case 'final': return 'Final';
      }
    }
  };

  return (
    <div className={`rounded-xl border transition-all duration-300 bg-white dark:bg-elegant-input overflow-hidden relative shadow-sm ${
      match.stage === 'final' 
        ? 'border-amber-400/50 hover:border-amber-400 shadow-amber-500/5' 
        : 'border-slate-150 dark:border-slate-800 hover:border-slate-330 dark:hover:border-slate-705'
    }`}>
      
      {/* Match Header / Stage Label */}
      <div className="px-3.5 py-1.5 bg-slate-50/70 dark:bg-elegant-subbg border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md border ${getStageBadgeColor()}`}>
          {getStageName()}
        </span>
        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[120px]" title={label}>
          {label}
        </span>
      </div>

      {/* Stadium & Kick-off Time Sub-header */}
      {(match.stadiumEn || match.kickoffTime) && (
        <div className="px-3.5 py-1 bg-slate-100/40 dark:bg-elegant-subbg/20 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-sans gap-2">
          <span className="truncate flex items-center gap-1 font-medium" title={language === 'ar' ? (match.stadiumAr || match.stadiumEn) : match.stadiumEn}>
            <MapPin className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">{language === 'ar' ? (match.stadiumAr || match.stadiumEn) : match.stadiumEn}</span>
          </span>
          {match.kickoffTime && (
            <span className="shrink-0 flex items-center gap-1 font-mono text-slate-400 dark:text-slate-500">
              <Clock className="w-2.5 h-2.5 shrink-0" />
              <span>{match.kickoffTime}</span>
            </span>
          )}
        </div>
      )}

      {/* Match Competitors Rows */}
      <div className="p-2.5 flex flex-col gap-1.5 select-none">
        
        {/* Team 1 Row */}
        <div 
          onClick={() => handleRowClick(team1)}
          className={`flex items-center justify-between p-2 rounded-lg transition-all ${
            !isHistoricalMode && isResolvable ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer' : ''
          } ${
            currentWinnerId && team1 && currentWinnerId === team1.id 
              ? 'bg-amber-500/10 dark:bg-amber-500/15 text-slate-900 dark:text-white font-extrabold border-l-2 border-amber-500' 
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5 truncate max-w-[160px]">
            <span 
              onClick={(e) => {
                if (team1 && onOpenTeamProfile) {
                  e.stopPropagation();
                  onOpenTeamProfile(team1);
                }
              }}
              title={language === 'ar' ? "عرض الحساب والبيانات" : "View profile and stats"}
              className="cursor-help shrink-0"
            >
              <Flag team={team1} size="sm" />
            </span>
            <span className="text-xs truncate">
              {team1 
                ? (language === 'ar' ? team1.nameAr : team1.nameEn) 
                : `${noTeamLabel}`}
            </span>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-sm">
            {showHistoricalScore && (
              <span className={`font-bold ${winner?.id === team1?.id ? 'text-amber-500' : 'text-slate-400'}`}>
                {score1}
              </span>
            )}

            {!isHistoricalMode && isResolvable && (
              <input
                type="number"
                min="0"
                placeholder="0"
                value={predictedScore1 === null || predictedScore1 === undefined ? '' : predictedScore1}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleTeamScoreChange(1, e.target.value)}
                className="w-10 h-7 text-center rounded bg-slate-100 dark:bg-elegant-bg/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-550"
              />
            )}

            {!isHistoricalMode && team1 && currentWinnerId === team1.id && (
              <span className="flex items-center justify-center bg-amber-500 text-slate-950 rounded-full w-4 h-4 p-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>
        </div>

        {/* Team 2 Row */}
        <div 
          onClick={() => handleRowClick(team2)}
          className={`flex items-center justify-between p-2 rounded-lg transition-all ${
            !isHistoricalMode && isResolvable ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer' : ''
          } ${
            currentWinnerId && team2 && currentWinnerId === team2.id 
              ? 'bg-amber-500/10 dark:bg-amber-500/15 text-slate-900 dark:text-white font-extrabold border-l-2 border-amber-500' 
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5 truncate max-w-[160px]">
            <span 
              onClick={(e) => {
                if (team2 && onOpenTeamProfile) {
                  e.stopPropagation();
                  onOpenTeamProfile(team2);
                }
              }}
              title={language === 'ar' ? "عرض الحساب والبيانات" : "View profile and stats"}
              className="cursor-help shrink-0"
            >
              <Flag team={team2} size="sm" />
            </span>
            <span className="text-xs truncate">
              {team2 
                ? (language === 'ar' ? team2.nameAr : team2.nameEn) 
                : `${noTeamLabel}`}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-sm">
            {showHistoricalScore && (
              <span className={`font-bold ${winner?.id === team2?.id ? 'text-amber-500' : 'text-slate-400'}`}>
                {score2}
              </span>
            )}

            {!isHistoricalMode && isResolvable && (
              <input
                type="number"
                min="0"
                placeholder="0"
                value={predictedScore2 === null || predictedScore2 === undefined ? '' : predictedScore2}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleTeamScoreChange(2, e.target.value)}
                className="w-10 h-7 text-center rounded bg-slate-100 dark:bg-elegant-bg/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-550"
              />
            )}

            {!isHistoricalMode && team2 && currentWinnerId === team2.id && (
              <span className="flex items-center justify-center bg-amber-500 text-slate-950 rounded-full w-4 h-4 p-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Ribbon for Champion Finals */}
      {match.stage === 'final' && winner && (
        <div className="px-3.5 py-1.5 bg-amber-500/10 border-t border-amber-500/20 text-center flex items-center justify-center gap-1">
          <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 capitalize">
            {language === 'ar' ? "البطل التاريخي: " : "Winner: "} 
            {language === 'ar' ? winner.nameAr : winner.nameEn}
          </span>
        </div>
      )}

      {/* Tie-breaker Helper text if score is equal in Prediction Mode */}
      {!isHistoricalMode && isResolvable && predictedScore1 !== null && predictedScore2 !== null && predictedScore1 === predictedScore2 && (
        <div className="px-2.5 py-1 bg-amber-500/5 dark:bg-amber-500/10 text-[9px] text-[#cca300] text-center border-t border-slate-100 dark:border-slate-800/60 font-medium">
          {language === 'ar' ? "تعادل! اضغط على اسم المنتخب الذي تأهل بركلات الترجيح" : "Draw! Click team row to select winner on Penalties"}
        </div>
      )}

    </div>
  );
}
