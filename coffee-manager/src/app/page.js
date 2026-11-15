import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4">
      <div className="w-full max-w-xl text-center">

        {/* Лого и заглавие */}
        <div className="mb-6 text-6xl">
          ☕
        </div>

        <h1 className="mb-4 text-5xl font-bold text-amber-950">
          Coffee Manager
        </h1>

        {/* Описание на приложението */}
        <p className="mb-8 text-lg leading-relaxed text-gray-600">
          Управлявайте напитките във вашето кафене
          лесно и удобно. Добавяйте, редактирайте и
          изтривайте напитки от вашето меню.
        </p>

        {/* Бутони за вход и регистрация */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-amber-800 px-8 py-3 font-semibold text-white transition hover:bg-amber-900"
          >
            Вход
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-amber-800 px-8 py-3 font-semibold text-amber-900 transition hover:bg-amber-50"
          >
            Регистрация
          </Link>
        </div>

        {/* Допълнителна информация */}
        <p className="mt-10 text-sm text-gray-500">
          Създайте профил и управлявайте своето меню
          от едно място.
        </p>

      </div>
    </main>
  );
}

