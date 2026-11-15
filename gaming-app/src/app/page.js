import LikeCounter from "@/components/Likecounter"; // import на бутон за лайкове

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">

      <div className="max-w-5xl mx-auto">

        {/* Заглавие */}
        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold text-purple-400 mb-4">
            🎮 GameZone
          </h1>

          <p className="text-gray-400 text-lg">
            Добре дошли в моя гейминг портал!
            Тук ще откриете любимите ми видеоигри.
          </p>

        </div>

        {/* Секция с игри */}
        <h2 className="text-3xl font-bold mb-6">
          🏆 Моите ТОП 3 игри
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Игра 1 */}
          <div className="bg-gray-900 p-7 rounded-2xl border border-gray-800 hover:border-purple-500 transition">

            <div className="text-5xl mb-5">🚗</div>

            <h3 className="text-2xl font-bold mb-3">
              GTA V
            </h3>

            <p className="text-gray-400">
              Изследвай огромен отворен свят,
              изпълнявай мисии и се забавлявай.
            </p>

            <p className="mt-5 text-purple-400 font-semibold">
              Action / Adventure
            </p>

          </div>

          {/* Игра 2 */}
          <div className="bg-gray-900 p-7 rounded-2xl border border-gray-800 hover:border-purple-500 transition">

            <div className="text-5xl mb-5">🔫</div>

            <h3 className="text-2xl font-bold mb-3">
              Counter-Strike 2
            </h3>

            <p className="text-gray-400">
              Състезателна игра, в която
              стратегията и отборната работа
              са най-важни.
            </p>

            <p className="mt-5 text-purple-400 font-semibold">
              FPS / Multiplayer
            </p>

          </div>

          {/* Игра 3 */}
          <div className="bg-gray-900 p-7 rounded-2xl border border-gray-800 hover:border-purple-500 transition">

            <div className="text-5xl mb-5">⚽</div>

            <h3 className="text-2xl font-bold mb-3">
              EA Sports FC
            </h3>

            <p className="text-gray-400">
              Изгради своя мечтан футболен
              отбор и се състезавай с приятели.
            </p>

            <p className="mt-5 text-purple-400 font-semibold">
              Sports / Football
            </p>

          </div>

        </div>

        {/* Интерактивен компонент */}
        <LikeCounter />



      </div>

    </main>
  );
}