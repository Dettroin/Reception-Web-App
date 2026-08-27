import React from 'react';

const Table = ({ columns, data, loading, emptyMessage = 'No records found.' }) => {
  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-white/10 rounded-2xl animate-pulse backdrop-blur-sm border border-white/20">
        <span className="text-text-muted font-bold tracking-wider">Loading data...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center text-center bg-white/10 rounded-2xl border-2 border-dashed border-white/30 backdrop-blur-sm">
        <span className="text-text-secondary font-bold tracking-wider">{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-b-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/20">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className="group hover:bg-white/30 transition-all duration-300 cursor-default backdrop-blur-sm relative"
            >
              {columns.map((col, colIndex) => (
                <td 
                  key={colIndex} 
                  className="px-6 py-4 text-sm text-text-primary whitespace-nowrap font-medium group-hover:text-black transition-colors"
                >
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
