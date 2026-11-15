"use client";

import { useState } from "react";

export default function PizzaCounter() {

    const [count, setCount] = useState(0);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-12 text-center">

            <h2 className="text-3xl font-bold mb-3">
                🛒 Твоята поръчка
            </h2>

            <p className="text-gray-500 mb-6">
                Избери колко пици искаш да поръчаш.
            </p>

            {/* Брой пици */}
            <p className="text-5xl font-bold text-red-600 mb-3">
                {count}
            </p>

            <p className="text-gray-500 mb-6">
                Брой пици
            </p>

            {/* Бутони */}
            <div className="flex flex-wrap justify-center gap-4">

                <button
                    onClick={() => setCount(count + 1)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition"
                >
                    ➕ Добави пица
                </button>

                <button
                    onClick={() => setCount(Math.max(0, count - 1))}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition"
                >
                    ➖ Премахни пица
                </button>

            </div>

            {/* Обща цена */}
            <div className="mt-8 bg-orange-50 rounded-xl p-6">

                <p className="text-gray-600 mb-2">
                    Обща цена на поръчката
                </p>

                <p className="text-4xl font-bold text-green-700">
                    {count * 10} €
                </p>

                <p className="text-sm text-gray-500 mt-2">
                    Цена за една пица: 10 €
                </p>

            </div>

        </div>
    );
}