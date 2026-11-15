
"use client";

// Импортираме необходимите библиотеки и Supabase клиента
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "/lib/supabase";

// Компонент за страницата за регистрация
export default function RegisterPage() {
    // Използваме router за пренасочване между страниците
    const router = useRouter();

    // Състояния за имейл, парола, съобщения и зареждане
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Функция, която се изпълнява при изпращане на формата
    async function handleRegister(e) {
        // Предотвратяваме презареждането на страницата
        e.preventDefault();

        // Изчистваме съобщенията и активираме зареждането
        setMessage("");
        setLoading(true);

        // Изпращаме имейла и паролата към Supabase за регистрация
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        // Спираме зареждането след приключване на заявката
        setLoading(false);

        // Ако възникне грешка, показваме съобщение
        if (error) {
            setMessage(error.message);
            return;
        }

        // Ако няма активна сесия, изискваме потвърждение на имейла
        if (!data.session) {
            setMessage(
                "Проверете имейла си, за да потвърдите регистрацията."
            );
            return;
        }

        // При успешна регистрация пренасочваме към Dashboard
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
                        Създайте своя профил
                    </p>
                </div>

                {/* Форма за регистрация - извиква handleRegister при изпращане */}
                <form onSubmit={handleRegister} className="space-y-5">

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

                    {/* Поле за парола - минимум 6 символа */}
                    <div>
                        <label className="mb-2 block font-medium text-amber-950">
                            Парола
                        </label>

                        <input
                            type="password"
                            placeholder="Въведете парола"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-amber-600"
                        />
                    </div>

                    {/* Показваме съобщение само когато message има стойност */}
                    {message && (
                        <p role="status" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                            {message}
                        </p>
                    )}

                    {/* Бутон за регистрация - блокира се по време на зареждане */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-amber-800 px-6 py-3 font-semibold text-white transition hover:bg-amber-900 disabled:opacity-50"
                    >
                        {loading ? "Регистриране..." : "Регистрация"}
                    </button>
                </form>

                {/* Връзка към страницата за вход */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    Вече имате профил?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-amber-800 hover:underline"
                    >
                        Вход
                    </Link>
                </p>

            </div>
        </main>
    );
}


