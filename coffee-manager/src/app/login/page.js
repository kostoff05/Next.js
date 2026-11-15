"use client";

// Импортираме необходимите библиотеки и Supabase клиента
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "/lib/supabase";

// Компонент за страницата за вход
export default function LoginPage() {
    // Използваме router за пренасочване между страниците
    const router = useRouter();

    // Състояния за имейл, парола, грешки и зареждане
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Функция, която се изпълнява при изпращане на формата
    async function handleLogin(e) {
        // Предотвратяваме презареждането на страницата
        e.preventDefault();

        // Изчистваме предишните грешки и активираме зареждането
        setErrorMessage("");
        setLoading(true);

        // Изпращаме имейла и паролата към Supabase Authentication
        // signInWithPassword проверява данните и създава потребителска сесия
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        // Спираме зареждането след приключване на заявката
        setLoading(false);

        // Ако има грешка, показваме съобщение и прекратяваме функцията
        if (error) {
            setErrorMessage("Невалиден имейл или парола.");
            return;
        }

        // При успешен вход пренасочваме към Dashboard
        router.push("/dashboard");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4">
            <div className="w-full max-w-md rounded-2xl border border-amber-100 bg-white p-8 shadow-lg">

                {/* Заглавие на страницата */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-amber-950">
                        ☕ Coffee Manager
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Влезте в своя профил
                    </p>
                </div>

                {/* Форма за вход - извиква handleLogin при изпращане */}
                <form onSubmit={handleLogin} className="space-y-5">

                    {/* Поле за имейл - useState съхранява въведената стойност */}
                    <div>
                        <label className="mb-2 block font-medium text-amber-950">
                            Имейл адрес
                        </label>

                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-amber-600"
                        />
                    </div>

                    {/* Поле за парола */}
                    <div>
                        <label className="mb-2 block font-medium text-amber-950">
                            Парола
                        </label>

                        <input
                            type="password"
                            placeholder="Въведете паролата си"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-amber-600"
                        />
                    </div>

                    {/* Показваме съобщение само ако има грешка при вход */}
                    {errorMessage && (
                        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {errorMessage}
                        </p>
                    )}

                    {/* Бутон за вход - блокира се по време на зареждане */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-amber-800 px-6 py-3 font-semibold text-white transition hover:bg-amber-900 disabled:opacity-50"
                    >
                        {/* Променяме текста на бутона според състоянието loading */}
                        {loading ? "Влизане..." : "Вход"}
                    </button>

                </form>

                {/* Връзка към страницата за регистрация */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    Нямате профил?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-amber-800 hover:underline"
                    >
                        Регистрация
                    </Link>
                </p>

            </div>
        </main>
    );
}

