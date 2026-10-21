
import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';

const CROPS = [
  'Onion', 'Rice', 'Wheat', 'Tomato', 'Potato',
  'Cotton', 'Soybean', 'Maize', 'Chilli', 'Groundnut',
];

const STATES = [
  'Maharashtra', 'Madhya Pradesh', 'Gujarat', 'Rajasthan',
  'Uttar Pradesh', 'Punjab', 'Haryana', 'Karnataka',
  'Tamil Nadu', 'West Bengal', 'Andhra Pradesh', 'Telangana',
];

const money = (value) =>
  Number(value).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });

export default function Market() {
  const [commodity, setCommodity] = useState('Onion');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('');
  const [results, setResults] = useState([]);
  const [source, setSource] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function searchPrices(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    setSource('');
    setSearched(true);

    try {
      const params = new URLSearchParams({ commodity });

      if (state) params.set('state', state);
      if (district.trim()) params.set('district', district.trim());

      const response = await fetch(`/api/market?${params.toString()}`);
      const body = await response.json();

      if (!response.ok || !body.ok) {
        throw new Error(
          body.message || body.error || 'Could not load mandi prices.'
        );
      }

      setResults(body.data?.mandiPrices || []);
      setSource(body.source || '');
      setUpdatedAt(body.updatedAt || '');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Mandi Prices | KrishiSethuu</title>
        <meta
          name="description"
          content="Search government-reported Indian mandi prices for agricultural commodities."
        />
      </Head>

      <div className="min-h-screen bg-stone-50">
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="mb-8 overflow-hidden rounded-3xl bg-green-900 p-6 text-white sm:p-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-200">
              Market intelligence for farmers
            </p>
            <h1 className="text-3xl font-bold sm:text-5xl">
              Know your mandi price.
            </h1>
            <p className="mt-4 max-w-2xl text-green-100 sm:text-lg">
              Compare reported crop prices before deciding where to sell.
              Prices are shown per quintal, based on available market records.
            </p>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-bold text-gray-900">
              Find market prices
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose a crop and narrow your search by location.
            </p>

            <form
              onSubmit={searchPrices}
              className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div>
                <label htmlFor="commodity" className="mb-2 block text-sm font-medium text-gray-700">
                  Crop / commodity
                </label>
                <select
                  id="commodity"
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3"
                >
                  {CROPS.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="state" className="mb-2 block text-sm font-medium text-gray-700">
                  State
                </label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3"
                >
                  <option value="">All available states</option>
                  {STATES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="district" className="mb-2 block text-sm font-medium text-gray-700">
                  District (optional)
                </label>
                <input
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Nashik"
                  maxLength={80}
                  className="w-full rounded-xl border border-gray-300 px-3 py-3"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-green-800 px-5 py-3 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Searching...' : 'Search prices'}
                </button>
              </div>
            </form>
          </section>

          {error && (
            <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
              <strong>Unable to load prices.</strong>
              <p className="mt-1 text-sm">{error}</p>
              <p className="mt-2 text-sm">
                Check your government API configuration and try again.
              </p>
            </div>
          )}

          {loading && (
            <div className="py-12 text-center text-gray-600" role="status">
              Fetching mandi records...
            </div>
          )}

          {!loading && searched && !error && results.length === 0 && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
              <h2 className="font-semibold">No matching records found</h2>
              <p className="mt-1 text-sm">
                Try another crop, state, or district. The selected market may
                not have a reported record in the available dataset.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <section className="mt-8">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {commodity} mandi prices
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {results.length} record{results.length === 1 ? '' : 's'} shown
                    {updatedAt ? ` · Dataset updated ${updatedAt}` : ''}
                  </p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  Source: data.gov.in
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    label: 'Lowest reported price',
                    value: Math.min(...results.map((r) => r.min)),
                  },
                  {
                    label: 'Highest reported price',
                    value: Math.max(...results.map((r) => r.max)),
                  },
                  {
                    label: 'Average modal price',
                    value: results.reduce((sum, r) => sum + r.modal, 0) / results.length,
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-bold text-green-900">
                      ₹{money(item.value)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">per quintal</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-stone-100 text-gray-700">
                      <tr>
                        <th className="px-4 py-4 font-semibold">Market</th>
                        <th className="px-4 py-4 font-semibold">District / State</th>
                        <th className="px-4 py-4 font-semibold">Variety</th>
                        <th className="px-4 py-4 font-semibold">Min (₹)</th>
                        <th className="px-4 py-4 font-semibold">Max (₹)</th>
                        <th className="px-4 py-4 font-semibold">Modal (₹)</th>
                        <th className="px-4 py-4 font-semibold">Arrival date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {results.map((item, index) => (
                        <tr key={`${item.market}-${item.date}-${index}`} className="hover:bg-green-50">
                          <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-900">
                            {item.market}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                            {[item.district, item.state].filter(Boolean).join(', ') || '—'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                            {item.variety || '—'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">₹{money(item.min)}</td>
                          <td className="whitespace-nowrap px-4 py-4">₹{money(item.max)}</td>
                          <td className="whitespace-nowrap px-4 py-4 font-bold text-green-800">
                            ₹{money(item.modal)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                            {item.date || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                Prices reflect the records returned by the government dataset;
                they may not be today&apos;s prices or a guaranteed sale price.
                Confirm the latest rate with your local mandi before selling.
              </p>
            </section>
          )}

          {!searched && (
            <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 text-sm text-gray-600">
              <strong className="text-gray-900">Before you sell</strong>
              <p className="mt-2">
                Compare modal prices across nearby markets, check the arrival
                date, and account for transport, handling, and quality deductions.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
