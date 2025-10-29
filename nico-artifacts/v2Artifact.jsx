import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PublisherDashboard = () => {
  const [sortBy, setSortBy] = useState('spend');
  const [viewMode, setViewMode] = useState('bar');

  const rawData = `Lawrence	Disney+	Disney+	1446075923	Disney+	648	328	20.36
Lawrence	Disney+	Disney+	291097	Disney+	42,384	22,799	1,441.54
Lawrence	Disney+	Disney+	963996	Disney+	7,587	3,625	232.75
Lawrence	Disney+	Disney+	b07y8sjgcv	Disney+	12,632	6,202	405.42
Lawrence	Disney+	Disney+	com.disney.disneyplus	Disney+	10,382	4,741	324.47
Lawrence	Disney+	Disney+	com.disney.disneyplus.ps5	DISNEY_PLUS	1,078	749	54.84
Lawrence	Disney+	Disney+	com.disney.plus	Disney+	1,444	744	50.34
Lawrence	Disney+	Disney+	g19280013786	Disney+	13,161	6,572	457.52
Lawrence	Disney+	Disney+	vizio.disney	Disney+	2,148	1,509	112.13
Lawrence	Disney+	[tail aggregate]	[tail aggregate]		18	13	0.73
Lawrence	Fox News	Fox News	2946	Fox News	12,773	5,539	151.73
Lawrence	Fox News	Fox News	[tail aggregate]		604	115	10.11
Lawrence	Fox News	Fox News	b00v8x7xto	Fox News	2,100	637	22.37
Lawrence	Fox News	Fox News	com.dish	Dish	227	46	4.27
Lawrence	Fox News	Fox News	com.foxnews.android	Fox News	508	165	5.95
Lawrence	Fox News	Fox News	directv.stb	DIRECTV	299	88	8.93
Lawrence	Fox News	[tail aggregate]	[tail aggregate]		198	46	2.71
Lawrence	Hulu	Hulu	2285	Hulu	2,698	1,187	93.54
Lawrence	Hulu	Hulu	[tail aggregate]		363	114	9.09
Lawrence	Hulu	Hulu	b00f4a1gn6	Hulu	1,578	576	44.46
Lawrence	Hulu	Hulu	com.hulu.plus	Hulu	1,681	632	52.56
Lawrence	Hulu	Hulu	g16534661441	Hulu	1,146	434	35.33
Lawrence	ESPN	ESPN	140474	DIRECTV	1,968	315	19.81
Lawrence	ESPN	ESPN	34376	ESPN	486	47	4.62
Lawrence	ESPN	ESPN	449099	Sling	339	35	2.00
Lawrence	ESPN	ESPN	46041	Sling	965	138	7.72
Lawrence	ESPN	ESPN	[tail aggregate]		1,349	176	13.55
Lawrence	ESPN	ESPN	b00e81o27y	ESPN	246	48	4.52
Lawrence	ESPN	ESPN	b00odc5n80	Sling	541	78	4.62
Lawrence	ESPN	ESPN	b01j62q632	DIRECTV	1,150	169	10.49
Lawrence	ESPN	ESPN	com.att.tv	DIRECTV	2,339	238	14.98
Lawrence	ESPN	ESPN	directv.stb	DIRECTV	7,480	1,030	64.46
Lawrence	ESPN	[tail aggregate]	[tail aggregate]		13	1	0.04
Lawrence	DirecTV	DirecTV	140474	DIRECTV	3,369	422	26.56
Lawrence	DirecTV	DirecTV	[tail aggregate]		265	50	3.03
Lawrence	DirecTV	DirecTV	b01j62q632	DIRECTV	1,590	213	13.01
Lawrence	DirecTV	DirecTV	com.att.tv	DIRECTV	3,667	516	29.78
Lawrence	DirecTV	DirecTV	directv.stb	DIRECTV	1,105	260	22.63
Lawrence	Pluto	Pluto	74519	Pluto TV	825	493	47.74
Lawrence	Pluto	Pluto	[tail aggregate]		509	264	23.03
Lawrence	Pluto	Pluto	b00kdsgipk	Pluto TV	528	225	19.85
Lawrence	Pluto	Pluto	tv.pluto.android	Pluto TV	583	244	20.83
Lawrence	Paramount+	Paramount+	[tail aggregate]		434	143	11.39
Lawrence	Paramount+	Paramount+	paramountstreaming	Paramount (Undisclosed)	958	337	21.07
Lawrence	TBS	TBS	[tail aggregate]		757	141	10.00
Lawrence	HGTV	HGTV	[tail aggregate]		443	122	9.38
Lawrence	MAX	MAX	[tail aggregate]		581	206	19.95
Lawrence	Philo	Philo	196460	Philo	372	197	22.79
Lawrence	Philo	Philo	b07bkpfxtj	Philo	234	109	12.29
Lawrence	Philo	[tail aggregate]	[tail aggregate]		1	1	0.05
Lawrence	Philo	[tail aggregate]	[tail aggregate]		144	68	7.80
Lawrence	Samsung TV Plus	Samsung TV Plus	g15147002586	Samsung TV Plus	1,460	330	32.60
Lawrence	Samsung TV Plus	[tail aggregate]	[tail aggregate]		7	3	0.31
Lawrence	Tubi	Tubi	41468	Tubi	349	150	15.60
Lawrence	Tubi	Tubi	[tail aggregate]		353	153	14.43
Lawrence	AMC	AMC	23048	Spectrum TV	328	109	7.94
Lawrence	AMC	AMC	[tail aggregate]		247	104	7.48
Lawrence	AMC	AMC	[tail aggregate]		616	161	13.58
Lawrence	Vizio Inc.	Vizio Inc.	vizio.watchfree	WatchFree+	231	110	12.14
Lawrence	The Roku Channel	The Roku Channel	151908	The Roku Channel	257	59	6.35
Lawrence	The Roku Channel	[tail aggregate]	[tail aggregate]		2	0	0.00
Lawrence	FuboTV	FuboTV	[tail aggregate]		274	64	7.42
Lawrence	FuboTV	[tail aggregate]	[tail aggregate]		11	2	0.14
Lawrence	Fox (Undisclosed)	[tail aggregate]	[tail aggregate]		195	57	4.26
Lawrence	Fox (Undisclosed)	[tail aggregate]	[tail aggregate]		27	4	0.43
Lawrence	MSNBC	MSNBC	[tail aggregate]		220	55	4.82
Lawrence	Sling TV	Sling TV	46041	Sling	275	52	5.47
Lawrence	Sling TV	Sling TV	[tail aggregate]		231	36	3.86
Lawrence	DISH Network	DISH Network	com.dish	Dish	256	41	4.67
Lawrence	TLC	[tail aggregate]	[tail aggregate]		128	44	3.82
Lawrence	Lifetime	Lifetime	[tail aggregate]		267	11	1.16
Lawrence	Spectrum TV	[tail aggregate]	[tail aggregate]		56	29	3.19
Lawrence	MTV	[tail aggregate]	[tail aggregate]		49	25	2.99
Lawrence	LG Channels	[tail aggregate]	[tail aggregate]		151	24	2.21
Lawrence	CBS Sports	[tail aggregate]	[tail aggregate]		163	24	0.91
Lawrence	GSN	[tail aggregate]	[tail aggregate]		36	21	2.27
Lawrence	TNT	[tail aggregate]	[tail aggregate]		98	22	2.10
Lawrence	Warner Bros Digital Media Sales (Undisclosed)	[tail aggregate]	[tail aggregate]		60	21	2.05
Lawrence	CBS News	[tail aggregate]	[tail aggregate]		59	21	1.22
Lawrence	BET	[tail aggregate]	[tail aggregate]		37	14	1.62
Lawrence	The History Channel	The History Channel	[tail aggregate]		269	14	1.17
Lawrence	Investigation Discovery	[tail aggregate]	[tail aggregate]		22	13	1.45
Lawrence	CNN	[tail aggregate]	[tail aggregate]		19	10	1.10
Lawrence	Paramount (Undisclosed)	[tail aggregate]	[tail aggregate]		50	8	0.31
Lawrence	HISTORY	[tail aggregate]	[tail aggregate]		11	8	0.94
Lawrence	A&E	[tail aggregate]	[tail aggregate]		191	7	0.68
Lawrence	Food Network	[tail aggregate]	[tail aggregate]		14	7	0.85
Lawrence	TV One	[tail aggregate]	[tail aggregate]		13	6	0.71
Lawrence	Discovery+	[tail aggregate]	[tail aggregate]		13	5	0.60
Lawrence	Xumo Play	[tail aggregate]	[tail aggregate]		24	5	0.60
Lawrence	Fox Sports	[tail aggregate]	[tail aggregate]		158	2	0.20
Lawrence	Fox Sports	[tail aggregate]	[tail aggregate]		187	37	2.28
Lawrence	CNBC	[tail aggregate]	[tail aggregate]		73	3	0.37
Lawrence	Discovery	[tail aggregate]	[tail aggregate]		27	3	0.37
Lawrence	Plex	[tail aggregate]	[tail aggregate]		18	3	0.30
Lawrence	CBS	[tail aggregate]	[tail aggregate]		8	2	0.08
Lawrence	truTV	[tail aggregate]	[tail aggregate]		4	2	0.16`;

  const processedData = useMemo(() => {
    const lines = rawData.trim().split('\n');
    const publisherMap = new Map();

    lines.forEach(line => {
      const parts = line.split('\t');
      const publisher = parts[1];
      const impressions = parseInt(parts[6]) || 0;
      const spend = parseFloat(parts[7]) || 0;

      if (publisherMap.has(publisher)) {
        const existing = publisherMap.get(publisher);
        publisherMap.set(publisher, {
          impressions: existing.impressions + impressions,
          spend: existing.spend + spend
        });
      } else {
        publisherMap.set(publisher, { impressions, spend });
      }
    });

    const result = Array.from(publisherMap.entries()).map(([name, data]) => ({
      name,
      impressions: data.impressions,
      spend: parseFloat(data.spend.toFixed(2)),
      cpm: data.impressions > 0 ? parseFloat(((data.spend / data.impressions) * 1000).toFixed(2)) : 0
    }));

    return result.sort((a, b) => b[sortBy] - a[sortBy]).slice(0, 30);
  }, [sortBy]);

  const totalStats = useMemo(() => {
    const lines = rawData.trim().split('\n');
    let totalImpressions = 0;
    let totalSpend = 0;

    lines.forEach(line => {
      const parts = line.split('\t');
      totalImpressions += parseInt(parts[6]) || 0;
      totalSpend += parseFloat(parts[7]) || 0;
    });

    return {
      impressions: totalImpressions,
      spend: parseFloat(totalSpend.toFixed(2)),
      cpm: totalImpressions > 0 ? ((totalSpend / totalImpressions) * 1000).toFixed(2) : 0
    };
  }, []);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f97316'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">October Publisher Analysis - Lawrence</h1>
          <p className="text-slate-400">Campaign Analytics - Top 30 Publishers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="text-slate-400 text-sm font-medium mb-2">Total Impressions</div>
            <div className="text-3xl font-bold text-blue-400">{totalStats.impressions.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="text-slate-400 text-sm font-medium mb-2">Total Spend</div>
            <div className="text-3xl font-bold text-green-400">${totalStats.spend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="text-slate-400 text-sm font-medium mb-2">Average CPM</div>
            <div className="text-3xl font-bold text-purple-400">$56.70</div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">Sort By</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="impressions">Impressions</option>
                <option value="spend">Spend</option>
                <option value="cpm">CPM</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">View Mode</label>
              <select 
                value={viewMode} 
                onChange={(e) => setViewMode(e.target.value)}
                className="bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bar">Bar Chart</option>
                <option value="table">Table View</option>
              </select>
            </div>
          </div>

          {viewMode === 'bar' ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Impressions by Publisher</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={120}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="impressions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Spend by Publisher</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={120}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Bar dataKey="spend" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">CPM by Publisher</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={120}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Bar dataKey="cpm" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Rank</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Publisher</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-semibold">Impressions</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-semibold">Spend</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-semibold">CPM</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.map((item, index) => (
                    <tr key={item.name} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4 text-slate-400">{index + 1}</td>
                      <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-right text-blue-400">{item.impressions.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-green-400">${item.spend.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-purple-400">${item.cpm.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublisherDashboard;