import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Eye, TrendingUp } from 'lucide-react';

const PublisherAnalysis = () => {
  const [sortBy, setSortBy] = useState('cost');
  
  const rawData = `Hulu	131929	1946.27
Hulu	26270	1298.28
Pluto TV	90400	1256.65
Hulu	22478	1173.86
Disney+	34776	871.95
hulu	16538	864.35
Pluto TV	17903	680.66
Samsung TV Plus	14196	537.63
Pluto TV	12537	496.99
Disney+	8335	441.76
Disney+	6414	330.85
Disney+	4645	250.35
Disney+	4407	230.31
WatchFree+	4506	167.51
Samsung TV Plus	1207	144.95
Hulu	2903	138.72
Pluto TV	3235	131.43
Philo	3382	119.45
LG Channels	2799	103.70
The Roku Channel	863	102.42
Pluto TV	2210	86.43
Pluto TV	2189	82.83
Pluto TV	2064	75.98
Tubi	1033	75.49
Disney+	1247	72.04
Samsung TV Plus	1334	70.87
The Roku Channel	1024	69.96
Fox News	2487	63.77
Philo	1588	56.40
Disney+	998	54.05
Pluto TV	1438	53.88
Hulu	917	46.40
DISNEY_PLUS	642	36.47
hulu	565	30.21
Paramount (Undisclosed)	624	29.66
Fox (Undisclosed)	600	27.67
Tubi	369	26.03
Pluto TV	608	25.90
Pluto TV	626	24.68
ESPN	310	24.09
Tubi	277	20.00
Sling	278	19.68
TBS	172	17.83
WatchFree+	129	15.52
Fox News	539	15.18
Philo	445	15.04
Xumo Play	114	13.80
DIRECTV	192	13.59
Sling	126	13.44
Philo	351	13.41
Disney+	274	13.28
Dish	191	13.19
MAX	139	12.91
Fox News	504	12.51
Philo	355	12.42
DIRECTV	197	12.21
Paramount+	127	12.17
Scripps	677	12.07
LG Channels	98	11.77
Spectrum TV	297	11.60
AMC	158	11.48
Pluto TV	279	11.45
Paramount (Undisclosed)	301	11.16
fubo	315	10.99
DIRECTV	246	10.67
Tubi	163	10.55
Max	118	10.47
DIRECTV	168	10.39
Tubi	148	10.24
Science Channel	102	10.19
Spectrum TV	414	10.17
Pluto TV	220	9.65
Sling	168	9.47
Bounce	75	9.14
AMC	206	9.12
Philo	246	9.04
Telly	1201	9.02
Spectrum TV	298	9.01
Pluto TV	220	8.96
The Roku Channel	152	8.92
TLC	100	8.77
Sling	80	8.48
Spectrum TV	205	8.42
fubo	198	8.22
Disney+	115	8.14
Tubi	169	7.68
Spectrum TV	183	7.53
ESPN	83	7.51
Spectrum TV	111	7.48
LG Channels	130	7.46
MSNBC	112	7.03
Philo	163	6.92
Tubi	150	6.90
fubo	124	6.59
[tail aggregate]	138	6.49
Pluto TV	141	6.36
Fox News	74	6.35
DISNEY_PLUS	145	6.25
Lifetime	257	6.12
fubo	242	6.08
HGTV	117	6.08
Telly	239	6.01
Bounce	50	5.99
Pluto	126	5.81
Dish	143	5.62
Sling	145	5.57
GSN	121	5.56
Warner Bros Digital Media Sales (Undisclosed)	68	5.50
Philo	118	5.18
Spectrum TV	111	5.18
Dish	93	5.11
TNT	66	5.10
Philo	132	5.03
hulu	97	4.74
Paramount+	106	4.69
Philo	120	4.58
Fox News	158	4.49
Spectrum TV	109	4.49
Local Now	67	4.48
Fox News	143	4.45
Philo	112	4.35
Filmrise	60	4.31
Hulu	54	4.30
MTV	102	4.30
HGTV GO	215	4.26
WatchFree+	138	4.20
CBS News	126	4.17
Sling	74	4.08
Ion	77	4.07
Sling	35	3.81
DIRECTV	76	3.70
Hulu	52	3.62
Samsung TV Plus	162	3.61
WatchFree+	84	3.58
The Roku Channel	81	3.54
Philo	94	3.51
Discovery	51	3.49
Sling	63	3.47
CNN	50	3.46
Hulu	48	3.39
Philo	86	3.33
The Roku Channel	133	3.27
Fox (Undisclosed)	39	3.23
Investigation Discovery	67	3.22
fubo	26	3.17
Very Local: News & Weather	49	2.97
Discovery+	44	2.95
Food Network	42	2.86
Hulu	44	2.86
Pluto	76	2.83
DIRECTV	33	2.76
MSNBC	61	2.62
Pluto TV	74	2.52
Dish	62	2.51
Haystack	45	2.48
Spectrum TV	94	2.48
Lifetime	24	2.45
Philo	63	2.45
Philo	50	2.33
Scripps	80	2.33
fubo	48	2.32
Pluto TV	19	2.31
Sling	28	2.26
fubo	55	2.22
Local Now	128	2.22
MSNBC	47	2.19
Local Now	43	2.17
Fox News	45	2.15
Philo	61	2.09
Sling	37	2.07
Spectrum TV	31	2.02
Spectrum TV	43	2.01
MovieSphere	68	1.98
TiVo	115	1.98
Plex	72	1.97
HISTORY	22	1.90
Samsung TV Plus	58	1.87
Sling	30	1.82
Philo	45	1.77
Samsung TV Plus	81	1.73
tubi	27	1.69
ESPN	34	1.59
fubo	39	1.54
Local Now	87	1.54
VIDAA+tv	47	1.54
NewsON	26	1.50
Sling TV	26	1.49
HGTV	29	1.41
Fox News	30	1.36
MLB	19	1.36
DirecTV	26	1.34
Spectrum TV	31	1.34
Xumo Play	26	1.25
Court TV	22	1.24
DIRECTV	21	1.16
BET	28	1.15
Pluto TV	9	1.10
Ion	53	1.02
[tail aggregate]	36	1.02
MAX	20	1.01
The Roku Channel	60	0.99
Disney+	21	0.98
Food Network	18	0.94
The Weather Channel	47	0.90
Frndly TV	7	0.84
Pluto TV	23	0.83
Sling	10	0.81
Fox (Undisclosed)	19	0.79
Frndly TV	21	0.79
TNT	16	0.79
Frndly TV	9	0.74
Philo	27	0.74
A&E	9	0.73
DirecTV	16	0.69
fubo	22	0.65
Pluto	20	0.64
TiVo	13	0.62
Fox News	16	0.61
Plex	5	0.61
The CW	8	0.59
DIRECTV	13	0.58
GSN	12	0.54
Xumo Play	28	0.54
A&E	5	0.53
The Golf Channel	7	0.52
AMC	14	0.50
Xumo Play	9	0.50
USA Network	6	0.47
Fawesome.tv	14	0.43
Adult Swim	4	0.42
Sling	5	0.40
The Tennis Channel	6	0.40
Sling	4	0.38
Paramount (Undisclosed)	5	0.37
The Weather Channel	8	0.37
Fox Sports	8	0.36
Vevo	8	0.36
CBS News	6	0.34
Fox (Undisclosed)	9	0.34
Flosports	10	0.33
Investigation Discovery	9	0.33
The Roku Channel	6	0.32
CBS Sports	16	0.31
WCPO 9 Cincinnati	6	0.31
Oxygen	6	0.30
Samsung (Undisclosed)	4	0.30
CNBC	3	0.29
MTV	7	0.29
TiVo	17	0.29
TV Land	3	0.29
CBS	9	0.28
BET	5	0.26
fubo	7	0.26
Frndly TV	3	0.26
Vizio Inc.	12	0.26
WCPO 9 Cincinnati	15	0.26
Samsung (Undisclosed)	10	0.25
Sling TV	4	0.25
History	2	0.24
Sling TV	6	0.23
AMC	5	0.22
Fox Business	3	0.22
truTV	2	0.19
Lifetime	6	0.18
NBC Sports	9	0.18
Plex	4	0.18
Comedy Central	4	0.17
Bally Sports	5	0.16
Disney+	2	0.16
HISTORY	4	0.16
One America News	10	0.16
Philo	2	0.15
TV One	4	0.15
Warner Bros Digital Media Sales (Undisclosed)	3	0.15
Discovery	3	0.14
ESPN	3	0.14
Fox News	3	0.14
Hallmark	3	0.14
Hulu	2	0.14
LG Channels	9	0.14
MLB	3	0.14
MovieSphere	4	0.14
Pluto	2	0.14
Court TV	8	0.13
Roku (Undisclosed)	3	0.13
The History Channel	2	0.13
Bounce	5	0.12
Frndly TV	1	0.12
Lifetime: TV Shows & Movies	1	0.12
Frndly TV	1	0.12
Local Now	7	0.12
Philo	1	0.12
Philo	1	0.12
History	1	0.12
Univision	3	0.12
Fawesome.tv	3	0.10
Frndly TV	6	0.10
Samsung TV Plus	1	0.10
Ion	2	0.09
BET	1	0.08
CBS News	2	0.08
Frndly TV	1	0.08
Philo	1	0.08
Univision	2	0.08
Vevo	4	0.08
CNN	2	0.07
Fox News	1	0.07
fubo	2	0.07
Philo	1	0.07
Sling TV	1	0.07
The History Channel	3	0.07
DirecTV	2	0.06
Discovery (Undisclosed)	2	0.06
Filmrise	3	0.06
LEX 18 News - Lexington, KY (WLEX)	1	0.06
Paramount+	2	0.06
Tubi	2	0.06
[tail aggregate]	2	0.06
Fanduel Sports Network	2	0.05
HGTV	1	0.05
Music Videos on Fire TV	1	0.05
Scripps News	2	0.05
TNT	1	0.05
USA Network	1	0.05
WeTV	2	0.05
BBC	1	0.04
DISH Network	1	0.04
Fox (Undisclosed)	1	0.04
Oxygen	1	0.04
A&E :Full Episodes of TV Shows	1	0.04
Samsung TV Plus	1	0.03
Filmrise	1	0.03
ID GO	1	0.03
Pluto	2	0.03
Univision	1	0.03
AMC (Undisclosed)	1	0.02
Crunchyroll	1	0.02
Lifetime	1	0.02
Sling	1	0.02
Sling	1	0.02
WCPO 9 Cincinnati	1	0.02
ZEE5	1	0.02
Xumo Play	1	0.01
DIRECTV STREAM	1	0.01`;

  const aggregatedData = useMemo(() => {
    const publisherMap = new Map();
    
    const lines = rawData.trim().split('\n');
    lines.forEach(line => {
      const parts = line.split('\t');
      if (parts.length >= 3) {
        let publisher = parts[0].trim();
        const impressions = parseInt(parts[1]) || 0;
        const cost = parseFloat(parts[2]) || 0;
        
        // Normalize publisher names
        publisher = publisher
          .replace(/^hulu$/i, 'Hulu')
          .replace(/^DISNEY_PLUS$/i, 'Disney+')
          .replace(/^tubi$/i, 'Tubi')
          .replace(/^fubo$/i, 'FuboTV')
          .replace(/Sling TV/i, 'Sling')
          .replace(/DirecTV/i, 'DIRECTV')
          .replace(/Pluto TV/i, 'Pluto')
          .replace(/Pluto$/i, 'Pluto');
        
        if (publisherMap.has(publisher)) {
          const existing = publisherMap.get(publisher);
          publisherMap.set(publisher, {
            impressions: existing.impressions + impressions,
            cost: existing.cost + cost
          });
        } else {
          publisherMap.set(publisher, { impressions, cost });
        }
      }
    });
    
    const result = Array.from(publisherMap.entries())
      .map(([name, data]) => ({
        name,
        impressions: data.impressions,
        cost: data.cost,
        cpm: data.impressions > 0 ? (data.cost / data.impressions * 1000) : 0
      }))
      .filter(item => item.name !== '[tail aggregate]');
    
    return result.sort((a, b) => b.cost - a.cost);
  }, []);

  const sortedData = useMemo(() => {
    const data = [...aggregatedData];
    if (sortBy === 'cost') {
      return data.sort((a, b) => b.cost - a.cost);
    } else if (sortBy === 'impressions') {
      return data.sort((a, b) => b.impressions - a.impressions);
    } else {
      return data.sort((a, b) => b.cpm - a.cpm);
    }
  }, [aggregatedData, sortBy]);

  const topPublishers = sortedData.slice(0, 15);
  
  const totalImpressions = aggregatedData.reduce((sum, item) => sum + item.impressions, 0);
  const totalCost = aggregatedData.reduce((sum, item) => sum + item.cost, 0);
  const avgCPM = totalImpressions > 0 ? (totalCost / totalImpressions * 1000) : 0;

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#a855f7', '#f43f5e', '#14b8a6', '#f97316', '#84cc16', '#22d3ee', '#a78bfa', '#fb923c'];

  return (
    <div className="w-full p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Publisher Performance Analysis</h1>
        <p className="text-gray-600 mb-6">Lawrence Campaign Data</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Publishers</p>
                <p className="text-3xl font-bold text-gray-900">{aggregatedData.length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Impressions</p>
                <p className="text-3xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
              </div>
              <Eye className="w-10 h-10 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                <p className="text-3xl font-bold text-gray-900">${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average CPM</p>
                <p className="text-3xl font-bold text-gray-900">${avgCPM.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top 15 Publishers</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('cost')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'cost' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                By Cost
              </button>
              <button
                onClick={() => setSortBy('impressions')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'impressions' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                By Impressions
              </button>
              <button
                onClick={() => setSortBy('cpm')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'cpm' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                By CPM
              </button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topPublishers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} fontSize={12} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'cost') return `$${Number(value).toFixed(2)}`;
                  if (name === 'cpm') return `$${Number(value).toFixed(2)}`;
                  return Number(value).toLocaleString();
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="impressions" fill="#3b82f6" name="Impressions" />
              <Bar yAxisId="right" dataKey="cost" fill="#10b981" name="Cost ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Cost Distribution (Top 10)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topPublishers.slice(0, 10)}
                  dataKey="cost"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: $${entry.cost.toFixed(0)}`}
                  labelLine={{ stroke: '#666', strokeWidth: 1 }}
                >
                  {topPublishers.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Impressions Distribution (Top 10)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topPublishers.slice(0, 10)}
                  dataKey="impressions"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${(entry.impressions / 1000).toFixed(0)}K`}
                  labelLine={{ stroke: '#666', strokeWidth: 1 }}
                >
                  {topPublishers.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => Number(value).toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Complete Publisher Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publisher</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">CPM</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((item, index) => (
                  <tr key={item.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{item.impressions.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${item.cost.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${item.cpm.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{((item.cost / totalCost) * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr className="font-bold">
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4 text-sm text-gray-900">TOTAL</td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">{totalImpressions.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">${totalCost.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">${avgCPM.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">100.00%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherAnalysis;