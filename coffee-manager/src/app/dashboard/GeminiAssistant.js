"use client";

// useState пази данните, които се променят в интерфейса.
import { useState } from "react";

export default function GeminiAssistant() {
    // Текстът, въведен от потребителя.
    const [prompt, setPrompt] = useState("");

    // Отговорът, получен от нашия API маршрут.
    const [answer, setAnswer] = useState("");

    // Дали в момента чакаме отговор.
    const [loading, setLoading] = useState(false);

    // Съобщение при грешка.
    const [error, setError] = useState("");

    // Изпълнява се при изпращане на формата.
    async function handleGenerate(e) {
        // Спираме автоматичното презареждане на страницата.
        e.preventDefault();

        // Не приемаме празна или повторна заявка.
        if (!prompt.trim() || loading) return;

        // Изчистваме стария отговор и включваме зареждането.
        setAnswer("");
        setError("");
        setLoading(true);

        try {
            // Изпращаме заявка до нашия Next.js сървър,
            // а НЕ директно до Gemini (така ключът е скрит).
            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            // Прочитаме получения JSON отговор.
            const data = await response.json();

            // Ако сървърът е върнал грешка, я показваме.
            if (!response.ok) {
                throw new Error(data.error || "Възникна грешка.");
            }

            // Показваме отговора на Gemini чрез React state.
            setAnswer(data.answer);
        } catch (err) {
            // Визуализираме съобщението за грешка.
            setError(err.message);
        } finally {
            // Спираме индикатора независимо от резултата.
            setLoading(false);
        }
    }

    return (
        <section className="mt-10 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-amber-950">
                ✨ Gemini AI Асистент
            </h2>

            <p className="mb-6 text-gray-600">
                Опишете напитка, а Gemini ще предложи рецепта и цена.
            </p>

            {/* Формата извиква handleGenerate при изпращане. */}
            <form onSubmit={handleGenerate} className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    maxLength={500}
                    required
                    rows={4}
                    placeholder="Например: Предложи ми лятна напитка с кафе..."
                    className="w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-amber-600"
                />

                <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="rounded-xl bg-amber-800 px-6 py-3 font-semibold text-white transition hover:bg-amber-900 disabled:opacity-50"
                >
                    {loading ? "Gemini генерира..." : "✨ Генерирай предложение"}
                </button>
            </form>

            {/* Показваме грешката само ако има такава. */}
            {error && (
                <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-600">
                    {error}
                </p>
            )}

            {/* Показваме резултата само след успешен отговор. */}
            {answer && (
                <div className="mt-6 rounded-xl bg-amber-50 p-5">
                    <h3 className="mb-3 text-xl font-bold text-amber-950">
                        Предложение от Gemini
                    </h3>
                    <p className="whitespace-pre-wrap leading-7 text-gray-700">
                        {answer}
                    </p>
                </div>
            )}
        </section>
    );
}
