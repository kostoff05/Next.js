"use client";

import { useState } from "react";

export default function LikeCounter() {

    const [likes, setLikes] = useState(0);

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mt-12 text-center">

            <h2 className="text-2xl font-bold mb-3">
                ❤️ Харесва ли ти GameZone?
            </h2>

            <p className="text-gray-400 mb-6">
                Покажи своята подкрепа!
            </p>

            {/* Брой харесвания */}
            <p className="text-5xl font-bold text-purple-400 mb-6">
                {likes}
            </p>

            <p className="text-gray-400 mb-6">
                Харесвания
            </p>

            {/* Бутони */}
            <div className="flex flex-wrap justify-center gap-4">

                <button
                    onClick={() => setLikes(likes + 1)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition"
                >
                    👍 Харесвам
                </button>

                <button
                    onClick={() => setLikes(0)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl transition"
                >
                    🔄 Нулирай
                </button>

            </div>

        </div>
    );
}