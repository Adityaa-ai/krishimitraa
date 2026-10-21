
import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';

export default function Feedback() {
  const [form, setForm] = useState({
    name: '',
    category: 'General Feedback',
    rating: '5',
    message: '',
  });

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Could not submit feedback.');
      }

      setStatus('success');
      setForm({
        name: '',
        category: 'General Feedback',
        rating: '5',
        message: '',
      });
    } catch (error) {
      setStatus(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Feedback | KrishiSethuu</title>
        <meta
          name="description"
          content="Share feedback to help improve KrishiSethuu for farmers."
        />
      </Head>

      <div className="min-h-screen bg-stone-50">
        <Header />

        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <section className="mb-8 rounded-3xl bg-green-900 px-6 py-10 text-white sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-200">
              Your voice matters
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
              Help us grow better.
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-green-100">
              Tell us about your experience with KrishiSethuu. Your feedback
              helps us improve farming information and make the platform
              easier to use.
            </p>
          </section>

          <div className="grid gap-6 md:grid-cols-5">
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:col-span-3 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                Share your feedback
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Fields marked * are required.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                    Name (optional)
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    maxLength={80}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-700">
                    What is your feedback about? *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                  >
                    <option>General Feedback</option>
                    <option>AI Assistant</option>
                    <option>Weather Information</option>
                    <option>Crop Health Detection</option>
                    <option>Mandi Prices</option>
                    <option>Website Design</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                  </select>
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-gray-700">
                    Overall experience *
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ['1', '★', 'Poor'],
                      ['2', '★★', 'Fair'],
                      ['3', '★★★', 'Good'],
                      ['4', '★★★★', 'Very good'],
                      ['5', '★★★★★', 'Excellent'],
                    ].map(([value, stars, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setForm((previous) => ({ ...previous, rating: value }))
                        }
                        aria-pressed={form.rating === value}
                        className={`rounded-xl border px-3 py-2 text-sm ${
                          form.rating === value
                            ? 'border-green-800 bg-green-50 text-green-900'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="block text-amber-500">{stars}</span>
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                    Your comments or suggestions *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={5}
                    maxLength={2000}
                    rows={5}
                    value={form.message}
                    onChange={updateField}
                    placeholder="Tell us what worked well or what we can improve..."
                    className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3"
                  />
                  <p className="mt-1 text-right text-xs text-gray-400">
                    {form.message.length}/2000
                  </p>
                </div>

                {status === 'success' && (
                  <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
                    Thank you! Your feedback has been received.
                  </p>
                )}

                {status && status !== 'success' && (
                  <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
                    {status}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || form.message.trim().length < 5}
                  className="w-full rounded-xl bg-green-800 px-5 py-3 font-semibold text-white hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Submitting...' : 'Submit feedback'}
                </button>
              </form>
            </section>

            <aside className="space-y-4 md:col-span-2">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="text-3xl">🌱</div>
                <h2 className="mt-3 text-lg font-bold text-gray-900">
                  Built for farmers
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Your suggestions help us make agricultural information
                  clearer, more useful, and easier to access.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="text-3xl">💡</div>
                <h2 className="mt-3 text-lg font-bold text-gray-900">
                  What can you share?
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  <li>• Features you'd like to see</li>
                  <li>• Problems or incorrect information</li>
                  <li>• Ways to improve usability</li>
                  <li>• Ideas for local farming support</li>
                </ul>
              </div>

              <p className="px-1 text-xs leading-relaxed text-gray-500">
                Please avoid including passwords, financial details, or other
                sensitive personal information.
              </p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
