import PizzaCounter from "../components/PizzaCounter";

export default function Home() {
  return (
    <main className="min-h-screen bg-orange-50 text-gray-900 px-6 py-12">

      <div className="max-w-5xl mx-auto">

        {/* Заглавие */}
        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold text-red-600 mb-4">
            🍕 PizzaLab
          </h1>

          <p className="text-xl text-gray-600">
            Най-вкусните пици, приготвени с любов!
          </p>

          <p className="mt-3 text-gray-500">
            Избери любимата си пица и се наслади на истински вкус.
          </p>

        </div>

        {/* Меню */}
        <h2 className="text-3xl font-bold mb-6">
          📋 Нашето меню
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Пица 1 */}
          <div className="bg-white p-7 rounded-2xl shadow-md hover:shadow-xl transition">

            <div className="text-6xl mb-5 text-center">
              🍅
            </div>

            <h3 className="text-2xl font-bold mb-3">
              Маргарита
            </h3>

            <p className="text-gray-500 mb-5">
              Доматен сос, моцарела и пресен босилек.
            </p>

            <p className="text-2xl font-bold text-red-600">
              10 €
            </p>

          </div>

          {/* Пица 2 */}
          <div className="bg-white p-7 rounded-2xl shadow-md hover:shadow-xl transition">

            <div className="text-6xl mb-5 text-center">
              🌶️
            </div>

            <h3 className="text-2xl font-bold mb-3">
              Пеперони
            </h3>

            <p className="text-gray-500 mb-5">
              Доматен сос, моцарела и пикантно пеперони.
            </p>

            <p className="text-2xl font-bold text-red-600">
              10 €
            </p>

          </div>

          {/* Пица 3 */}
          <div className="bg-white p-7 rounded-2xl shadow-md hover:shadow-xl transition">

            <div className="text-6xl mb-5 text-center">
              🧀
            </div>

            <h3 className="text-2xl font-bold mb-3">
              Четири сирена
            </h3>

            <p className="text-gray-500 mb-5">
              Моцарела, чедър, горгонзола и пармезан.
            </p>

            <p className="text-2xl font-bold text-red-600">
              10 €
            </p>

          </div>

        </div>

        {/* Брояч за поръчки */}
        <PizzaCounter />

      </div>

    </main>
  );
}