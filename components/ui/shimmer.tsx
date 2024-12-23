interface ShimmerProps {
  className?: string;
}

export const Shimmer = ({ className = "" }: ShimmerProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_2s_infinite] dark:via-gray-600" 
        style={{ 
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }} 
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/10 to-transparent opacity-50 dark:via-slate-800/10" />
    </div>
  );
};
