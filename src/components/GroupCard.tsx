import React from 'react';
import { Group, Team, Language, GroupResultForStanding } from '../types';
import Flag from './Flag';
import { ChevronUp, ChevronDown, Lock, Maximize2 } from 'lucide-react';

interface GroupCardProps {
  key?: string;
  group: Group;
  language: Language;
  standings: GroupResultForStanding[];
  isHistoricalMode: boolean;
  onMoveTeam: (groupId: string, teamIndex: number, direction: 'up' | 'down') => void;
  onOpenFocus?: (groupId: string) => void;
}

export default function GroupCard({
  group,
  language,
  standings,
  isHistoricalMode,
  onMoveTeam,
  onOpenFocus
}: GroupCardProps) {
  // Translate labels
  const title = language === 'ar' ? group.nameAr : group.nameEn;
  const colRank = language === 'ar' ? "الترتيب" : "Pos";
  const colTeam = language === 'ar' ? "المنتخب" : "Team";
  const colPts = language === 'ar' ? "نقاط" : "Pts";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-elegant-card shadow-md transition-all duration-300 hover:shadow-lg hover:border-slate-350 dark:hover:border-slate-700 flex flex-col h-full">
      {/* Group Header */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-elegant-header-card flex justify-between items-center bg-slate-50/50 dark:bg-elegant-subbg">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="font-display font-extrabold text-base text-slate-800 dark:text-slate-100 tracking-tight truncate">
            {title}
          </h3>
          {!isHistoricalMode && onOpenFocus && (
            <button
              onClick={() => onOpenFocus(group.id)}
              className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-850 text-indigo-500 rounded-md transition-all cursor-pointer flex items-center justify-center shrink-0"
              title={language === 'ar' ? "شاشة التوقع التفاعلية" : "Interactive Simulation Screen-in-Screen"}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {isHistoricalMode ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider">{language === 'ar' ? "حقيقي" : "Locked"}</span>
          </div>
        ) : (
          <span className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-elegant-subbg px-2 py-0.5 rounded-full">
            {language === 'ar' ? "تفاعلي" : "Active"}
          </span>
        )}
      </div>

      {/* Standings Table */}
      <div className="p-4 flex-1">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead>
            <tr className="text-[11px] tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 uppercase font-mono">
              <th className="py-1.5 font-medium text-center w-10">{colRank}</th>
              <th className="py-1.5 font-medium px-2">{colTeam}</th>
              <th className="py-1.5 font-medium text-center w-12">{colPts}</th>
              {!isHistoricalMode && <th className="py-1.5 font-medium text-center w-16"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
            {standings.map((standing, index) => {
              const team = standing.team;
              const isQualified = index < 2; // Top 2 advance
              
              return (
                <tr 
                  key={team.id} 
                  className={`group transition-colors ${
                    isQualified 
                      ? 'bg-emerald-500/5 dark:bg-blue-600/10' 
                      : 'bg-transparent'
                  }`}
                >
                  {/* Position number with color badge */}
                  <td className="py-2 text-center">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full font-mono text-xs font-bold ${
                      index === 0 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                      index === 1 ? 'bg-slate-400/20 text-slate-600 dark:text-slate-400' :
                      'text-slate-400 dark:text-slate-600'
                    }`}>
                      {index + 1}
                    </span>
                  </td>

                  {/* Flag and Team Name */}
                  <td className="py-2 px-2 font-medium">
                    <div className="flex items-center gap-2.5">
                      <Flag team={team} size="sm" />
                      <span className="truncate text-slate-700 dark:text-slate-200 text-xs md:text-sm">
                        {language === 'ar' ? team.nameAr : team.nameEn}
                      </span>
                      {isQualified && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                  </td>

                  {/* Mock/Interactive Points */}
                  <td className="py-2 text-center font-mono font-bold text-xs">
                    <span className={isQualified ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                      {standing.points}
                    </span>
                  </td>

                  {/* Interactive Re-order Arrows in Prediction Mode */}
                  {!isHistoricalMode && (
                    <td className="py-2 text-center w-16">
                      <div className="inline-flex rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                        <button
                          onClick={() => onMoveTeam(group.id, index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          title="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-[1px] bg-slate-100 dark:bg-slate-800" />
                        <button
                          onClick={() => onMoveTeam(group.id, index, 'down')}
                          disabled={index === standings.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          title="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
