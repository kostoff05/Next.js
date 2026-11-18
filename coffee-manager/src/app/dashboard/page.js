"use client";
import GeminiAssistant from "./GeminiAssistant";

// useState - съхранява данни, които могат да се променят в компонента
// useEffect - изпълнява допълнителна логика при зареждане или промяна на данни
import { useState, useEffect } from "react";

// Позволява пренасочване към други страници в Next.js
import { useRouter } from "next/navigation";

// Supabase клиентът, чрез който комуникираме с базата данни и Authentication
import { supabase } from "/lib/supabase";

// Основният компонент на Dashboard страницата
export default function DashboardPage() {
    const router = useRouter();

    // Потребителят, който в момента е влязъл в приложението
    // Първоначално е null, защото още не сме проверили сесията
    const [user, setUser] = useState(null);

    // Показва дали проверката на потребителската сесия продължава
    const [loading, setLoading] = useState(true);

    // Напитки от Supabase
    // Първоначално масивът е празен, защото данните още не са заредени
    const [drinks, setDrinks] = useState([]);

    // Следим дали напитките се зареждат от базата данни
    const [drinksLoading, setDrinksLoading] = useState(true);

    // Данни от формата за добавяне

    // Името на новата напитка
    const [name, setName] = useState("");

    // Цената на новата напитка
    const [price, setPrice] = useState("");

    // Избраната категория, като по подразбиране е Coffee
    const [category, setCategory] = useState("Coffee");

    // Следим дали в момента записваме нова напитка
    const [saving, setSaving] = useState(false);

    // Съобщение за успешна операция или възникнала грешка
    const [message, setMessage] = useState("");

    // Данни за редактиране

    // ID на напитката, която редактираме
    // null означава, че в момента не редактираме нищо
    const [editingId, setEditingId] = useState(null);

    // Отделни състояния за полетата във формата за редактиране
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editCategory, setEditCategory] = useState("Coffee");

    // Следим дали в момента се изпълнява UPDATE операция
    const [updating, setUpdating] = useState(false);

    // Състояние при изтриване
    // Съхраняваме ID на напитката, която се изтрива
    const [deletingId, setDeletingId] = useState(null);

    // ============================================================
    // READ - ИЗВЛИЧАНЕ НА НАПИТКИТЕ ОТ SUPABASE
    // ============================================================

    // Асинхронна функция, която извлича напитките на даден потребител
    // userId е идентификаторът на потребителя, чиито напитки търсим
    async function fetchDrinks(userId) {

        // Изпращаме заявка към Supabase
        // await изчаква заявката да приключи, преди кодът да продължи
        const { data, error } = await supabase

            // Избираме таблицата drinks
            .from("drinks")

            // SELECT * - извличаме всички колони от таблицата
            .select("*")

            // Взимаме само напитките, при които user_id съвпада с userId
            // Така всеки потребител работи само със собствените си напитки
            .eq("user_id", userId)

            // Сортираме по дата на създаване
            // ascending: false означава от най-новите към най-старите
            .order("created_at", { ascending: false });

        // Проверяваме дали заявката е върнала грешка
        if (error) {
            setMessage("Грешка при зареждане: " + error.message);

            // Връщаме false, за да покажем, че операцията е неуспешна
            return false;
        }

        // Записваме получените напитки в React състоянието
        // Ако data няма стойност, използваме празен масив
        setDrinks(data || []);

        // Връщаме true при успешно извличане
        return true;
    }

    // ============================================================
    // ПРОВЕРКА НА ПОТРЕБИТЕЛСКАТА СЕСИЯ
    // ============================================================

    // useEffect се изпълнява при зареждане на Dashboard
    useEffect(() => {

        // Използваме active, за да избегнем актуализиране
        // на състоянието след премахване на компонента
        let active = true;

        // Проверяваме дали потребителят е вписан
        async function checkUser() {

            // getUser() извлича информация за текущия потребител
            // data съдържа user, а error съдържа евентуална грешка
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            // Ако компонентът вече не е активен, прекратяваме функцията
            if (!active) return;

            // Ако има грешка или няма вписан потребител
            if (error || !user) {
                setLoading(false);

                // Пренасочваме към страницата за вход
                router.replace("/login");
                return;
            }

            // Запазваме текущия потребител
            setUser(user);

            // Приключваме проверката на сесията
            setLoading(false);
        }

        // Извикваме функцията за проверка
        checkUser();

        // Следим за промени в Authentication сесията
        // Например вход, изход или промяна на сесията
        const { data: listener } =
            supabase.auth.onAuthStateChange((_event, session) => {

                // Не изпълняваме действия, ако компонентът е премахнат
                if (!active) return;

                // Ако няма активна сесия, потребителят е излязъл
                if (!session) {
                    setUser(null);

                    // Изчистваме напитките от предишния потребител
                    setDrinks([]);

                    // Пренасочваме към Login
                    router.replace("/login");
                } else {

                    // Ако има сесия, запазваме потребителя
                    setUser(session.user);
                    setLoading(false);
                }
            });

        // Cleanup функция - изпълнява се при премахване на компонента
        return () => {
            active = false;

            // Прекратяваме слушането за промени в сесията
            listener.subscription.unsubscribe();
        };

    }, [router]);

    // ============================================================
    // АВТОМАТИЧНО ЗАРЕЖДАНЕ НА НАПИТКИТЕ
    // ============================================================

    // Този useEffect зарежда напитките след установяване на потребителя
    useEffect(() => {

        // Ако още няма потребител, не изпълняваме заявката
        if (!user) return;

        let active = true;

        // Функция за първоначално зареждане на напитките
        async function loadDrinks() {

            // Показваме, че данните се зареждат
            setDrinksLoading(true);

            // Извличаме напитките от Supabase
            const { data, error } = await supabase
                .from("drinks")
                .select("*")

                // Филтрираме по ID на текущия потребител
                .eq("user_id", user.id)

                // Показваме най-новите напитки първи
                .order("created_at", { ascending: false });

            if (!active) return;

            // При грешка показваме съобщение
            if (error) {
                setMessage("Грешка при зареждане: " + error.message);
            } else {

                // При успех обновяваме масива с напитки
                setDrinks(data || []);
            }

            // Приключваме зареждането
            setDrinksLoading(false);
        }

        // Извикваме функцията
        loadDrinks();

        // Cleanup при премахване на компонента
        return () => {
            active = false;
        };

        // Ефектът се изпълнява отново, ако ID на потребителя се промени
    }, [user?.id]);

    // ============================================================
    // LOGOUT - ИЗЛИЗАНЕ ОТ ПРОФИЛА
    // ============================================================

    async function handleLogout() {

        // signOut() прекратява текущата потребителска сесия
        const { error } = await supabase.auth.signOut();

        // Проверяваме дали е възникнала грешка
        if (error) {
            alert("Възникна грешка при излизане от профила.");
            return;
        }

        // След успешен изход пренасочваме към Login
        router.replace("/login");
    }

    // ============================================================
    // CREATE - ДОБАВЯНЕ НА НОВА НАПИТКА
    // ============================================================

    // Функцията се изпълнява при изпращане на формата за добавяне
    async function handleAddDrink(e) {

        // Предотвратяваме стандартното презареждане на страницата
        e.preventDefault();

        // Ако няма потребител или вече записваме напитка, спираме
        // Това предотвратява повторно изпращане на една и съща заявка
        if (!user || saving) return;

        // Изчистваме предишното съобщение
        setMessage("");

        // Проверяваме дали въведените данни са валидни
        if (

            // trim() премахва интервалите в началото и края
            // Ако името е празно, условието става true
            !name.trim() ||

            // Проверяваме дали има въведена цена
            !price ||

            // Проверяваме дали цената може да се преобразува във валидно число
            !Number.isFinite(Number(price)) ||

            // Цената трябва да бъде по-голяма от нула
            Number(price) <= 0
        ) {
            setMessage("Моля, въведете валидно име и цена.");
            return;
        }

        // Започваме операцията по записване
        setSaving(true);

        // INSERT заявка към таблицата drinks
        const { error } = await supabase
            .from("drinks")

            // insert() добавя нов запис в базата данни
            // Подаваме масив с обект, съдържащ данните за напитката
            .insert([
                {
                    // Записваме името без излишните интервали
                    name: name.trim(),

                    // Преобразуваме цената от текст към число
                    price: Number(price),

                    // Избраната категория
                    category: category,

                    // Свързваме напитката с текущия потребител
                    // Това е важно за RLS политиките
                    user_id: user.id,
                },
            ]);

        // Ако Supabase върне грешка при добавянето
        if (error) {
            setMessage("Грешка при добавяне: " + error.message);

            // Спираме състоянието на записване
            setSaving(false);
            return;
        }

        // Изчистваме полетата след успешно добавяне
        setName("");
        setPrice("");

        // Връщаме категорията по подразбиране
        setCategory("Coffee");

        // Извличаме напитките отново, за да обновим интерфейса
        const refreshed = await fetchDrinks(user.id);

        // Показваме съобщение, ако списъкът е обновен успешно
        if (refreshed) {
            setMessage("Напитката е добавена успешно!");
        }

        // Приключваме операцията по записване
        setSaving(false);
    }

    // ============================================================
    // UPDATE - ОТВАРЯНЕ НА ФОРМАТА ЗА РЕДАКТИРАНЕ
    // ============================================================

    // Получаваме обекта на напитката, която потребителят е избрал
    function handleEditDrink(drink) {

        // Запазваме ID на напитката, която ще редактираме
        setEditingId(drink.id);

        // Попълваме формата със съществуващите данни
        setEditName(drink.name);

        // Преобразуваме цената в текст за input полето
        setEditPrice(String(drink.price));

        // Запазваме текущата категория
        setEditCategory(drink.category);

        // Изчистваме предишните съобщения
        setMessage("");
    }

    // ============================================================
    // ОТКАЗ ОТ РЕДАКТИРАНЕ
    // ============================================================

    function handleCancelEdit() {

        // Премахваме ID на редактираната напитка
        // Това ще скрие формата за редактиране
        setEditingId(null);

        // Изчистваме полетата за редактиране
        setEditName("");
        setEditPrice("");
        setEditCategory("Coffee");
    }

    // ============================================================
    // UPDATE - ЗАПАЗВАНЕ НА РЕДАКТИРАНАТА НАПИТКА
    // ============================================================

    // Изпълнява се при натискане на "Запази промените"
    async function handleUpdateDrink(e) {

        // Предотвратяваме презареждането на страницата
        e.preventDefault();

        // Проверяваме дали:
        // 1. Има вписан потребител
        // 2. Има избрана напитка за редактиране
        // 3. Не се изпълнява друга UPDATE операция
        if (!user || editingId === null || updating) return;

        // Изчистваме съобщенията
        setMessage("");

        // Проверяваме валидността на новите данни
        if (
            !editName.trim() ||
            !editPrice ||
            !Number.isFinite(Number(editPrice)) ||
            Number(editPrice) <= 0
        ) {
            setMessage("Моля, въведете валидно име и цена.");
            return;
        }

        // Показваме, че редактирането е започнало
        setUpdating(true);

        // Изпращаме UPDATE заявка към Supabase
        const { data, error } = await supabase
            .from("drinks")

            // update() променя стойностите на съществуващ запис
            .update({
                name: editName.trim(),
                price: Number(editPrice),
                category: editCategory,
            })

            // Редактираме само напитката с избраното ID
            .eq("id", editingId)

            // Допълнително ограничаваме заявката до текущия потребител
            .eq("user_id", user.id)

            // Връщаме ID на успешно редактирания запис
            .select("id");

        // Проверяваме за грешка от базата данни
        if (error) {
            setMessage("Грешка при редактиране: " + error.message);
            setUpdating(false);
            return;
        }

        // Проверяваме дали действително е редактиран запис
        // Ако няма резултат, напитката може да не съществува
        // или потребителят да няма достъп до нея
        if (!data || data.length === 0) {
            setMessage("Напитката не беше намерена или нямате достъп до нея.");
            setUpdating(false);
            return;
        }

        // Обновяваме списъка след редактирането
        const refreshed = await fetchDrinks(user.id);

        if (refreshed) {

            // Затваряме формата за редактиране
            handleCancelEdit();

            // Показваме съобщение за успешна операция
            setMessage("Напитката е редактирана успешно!");
        }

        // Приключваме UPDATE операцията
        setUpdating(false);
    }

    // ============================================================
    // DELETE - ИЗТРИВАНЕ НА НАПИТКА
    // ============================================================

    // drinkId е ID на напитката, която искаме да изтрием
    async function handleDeleteDrink(drinkId) {

        // Проверяваме дали има потребител и дали не се изпълнява
        // друга операция по изтриване или редактиране
        if (!user || deletingId !== null || updating) return;

        // Показваме прозорец за потвърждение
        // window.confirm() връща true при OK и false при Cancel
        const confirmed = window.confirm(
            "Сигурни ли сте, че искате да изтриете тази напитка?"
        );

        // Ако потребителят откаже, прекратяваме функцията
        if (!confirmed) return;

        // Изчистваме предишните съобщения
        setMessage("");

        // Запазваме ID на напитката, която се изтрива
        setDeletingId(drinkId);

        // Изпращаме DELETE заявка към Supabase
        const { data, error } = await supabase
            .from("drinks")

            // delete() изтрива запис от таблицата
            .delete()

            // Изтриваме само напитката с конкретното ID
            .eq("id", drinkId)

            // Ограничаваме операцията до напитките на текущия потребител
            .eq("user_id", user.id)

            // Връщаме ID на изтрития запис
            .select("id");

        // Проверяваме за грешка при изтриването
        if (error) {
            setMessage("Грешка при изтриване: " + error.message);
            setDeletingId(null);
            return;
        }

        // Проверяваме дали действително е изтрит запис
        if (!data || data.length === 0) {
            setMessage("Напитката не беше намерена или нямате достъп до нея.");
            setDeletingId(null);
            return;
        }

        // Ако редактираме изтритата напитка, затваряме формата
        if (editingId === drinkId) {
            handleCancelEdit();
        }

        // Обновяване на списъка
        // Извличаме останалите напитки след изтриването
        const refreshed = await fetchDrinks(user.id);

        if (refreshed) {
            setMessage("Напитката е изтрита успешно!");
        }

        // Изчистваме ID на изтриваната напитка
        setDeletingId(null);
    }

    // ============================================================
    // ПРОВЕРКА ПРЕДИ ВИЗУАЛИЗИРАНЕ НА DASHBOARD
    // ============================================================

    // Ако проверката продължава или няма потребител,
    // не показваме основния Dashboard интерфейс
    if (loading || !user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
                <p className="text-lg text-amber-900">
                    Зареждане...
                </p>
            </main>
        );
    }

    // ============================================================
    // ПОТРЕБИТЕЛСКИ ИНТЕРФЕЙС - JSX
    // ============================================================

    return (
        <main className="min-h-screen bg-[#faf7f2]">

            {/* Горна навигация */}
            <header className="border-b border-amber-100 bg-white">
                <div className="mx-auto flex max-w-5xl px-6 py-5">
                    <div className="flex w-full flex-wrap items-center justify-between gap-4">

                        {/* Заглавие на приложението */}
                        <h1 className="text-2xl font-bold text-amber-950">
                            ☕ Coffee Manager
                        </h1>

                        <div className="flex flex-wrap items-center gap-3">

                            {/* Показваме имейла на текущия потребител */}
                            <span className="text-sm font-medium text-amber-950">
                                {user.email}
                            </span>

                            {/* Извикваме handleLogout при натискане */}
                            <button
                                onClick={handleLogout}
                                className="rounded-xl bg-red-50 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-100"
                            >
                                Изход
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-6 py-10">

                {/* Приветствена секция */}
                <section className="mb-10">
                    <p className="mb-2 font-medium text-amber-700">
                        COFFEE DASHBOARD
                    </p>

                    <h2 className="text-4xl font-bold text-amber-950">
                        Управление на напитки
                    </h2>

                    <p className="mt-3 text-gray-600">
                        Добавяйте и управлявайте напитките
                        в менюто на вашето кафене.
                    </p>
                </section>

                {/* Статистика за броя на напитките */}
                <section className="mb-10 rounded-2xl bg-amber-900 p-6 text-white shadow-md">
                    <p className="text-sm text-amber-200">
                        Общо напитки в менюто
                    </p>

                    {/* length връща броя на елементите в масива drinks */}
                    {/* Стойността се обновява при промяна на масива */}
                    <p className="mt-2 text-4xl font-bold">
                        {drinks.length}
                    </p>
                </section>

                {/* ================================================== */}
                {/* ФОРМА ЗА ДОБАВЯНЕ НА НОВА НАПИТКА - CREATE */}
                {/* ================================================== */}

                <section className="mb-10 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-2xl font-bold text-amber-950">
                        Добавяне на нова напитка
                    </h3>

                    {/* При изпращане на формата извикваме handleAddDrink */}
                    <form onSubmit={handleAddDrink} className="space-y-4">

                        {/* Поле за име на напитката */}
                        <div>
                            <label className="mb-2 block font-medium">
                                Име на напитката
                            </label>

                            {/* Контролирано поле - стойността идва от useState */}
                            <input
                                type="text"
                                placeholder="Например: Latte"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-amber-600"
                            />
                        </div>

                        {/* Поле за цена */}
                        <div>
                            <label className="mb-2 block font-medium">
                                Цена (€)
                            </label>

                            {/* step="0.01" позволява цени със стотинки */}
                            {/* min="0.01" задава минимална стойност */}
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="Например: 3.50"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-amber-600"
                            />
                        </div>

                        {/* Избор на категория */}
                        <div>
                            <label className="mb-2 block font-medium">
                                Категория
                            </label>

                            {/* При избор обновяваме category чрез setCategory */}
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-amber-600"
                            >
                                <option value="Coffee">Кафе</option>
                                <option value="Tea">Чай</option>
                                <option value="Cold Drinks">
                                    Студени напитки
                                </option>
                            </select>
                        </div>

                        {/* Бутон за добавяне */}
                        {/* disabled={saving} предотвратява повторно натискане */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full rounded-xl bg-amber-800 px-6 py-3 font-semibold text-white transition hover:bg-amber-900 disabled:opacity-50"
                        >
                            {/* Показваме различен текст според състоянието saving */}
                            {saving ? "Добавяне..." : "+ Добави напитка"}
                        </button>
                    </form>
                </section>

                {/* ================================================== */}
                {/* СПИСЪК С НАПИТКИ - READ */}
                {/* ================================================== */}

                <section>
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-amber-950">
                            Нашето меню
                        </h3>

                        {/* Брой на заредените напитки */}
                        <span className="text-sm text-gray-500">
                            {drinks.length} напитки
                        </span>
                    </div>

                    {/* Показваме съобщение само ако message има стойност */}
                    {message && (
                        <p
                            role="status"
                            className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900"
                        >
                            {message}
                        </p>
                    )}

                    {/* Проверяваме дали напитките още се зареждат */}
                    {drinksLoading ? (

                        // Ако зареждането продължава, показваме текст
                        <p className="text-gray-500">
                            Зареждане на напитките...
                        </p>

                    ) : drinks.length === 0 ? (

                        // Ако зареждането е приключило, но няма напитки
                        <div className="rounded-2xl border border-amber-100 bg-white p-8 text-center text-gray-500">
                            Все още няма добавени напитки.
                        </div>

                    ) : (

                        // Ако има напитки, ги визуализираме в мрежа
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                            {/* map() обхожда масива и създава карта за всяка напитка */}
                            {drinks.map((drink) => (
                                <div
                                    // key помага на React да разпознава отделните елементи
                                    key={drink.id}
                                    className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                                >

                                    {/* Икона на напитката */}
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl">
                                        ☕
                                    </div>

                                    {/* Име на напитката от базата данни */}
                                    <h4 className="text-xl font-bold text-amber-950">
                                        {drink.name}
                                    </h4>

                                    {/* Категория на напитката */}
                                    <p className="mt-2 text-sm text-gray-500">
                                        {drink.category}
                                    </p>

                                    {/* Цена на напитката */}
                                    <div className="mt-6">
                                        <span className="text-xl font-bold text-amber-800">
                                            {/* Number() преобразува цената в число */}
                                            {/* toFixed(2) я форматира до два знака след точката */}
                                            {Number(drink.price).toFixed(2)} €
                                        </span>
                                    </div>

                                    {/* Бутони за редактиране и изтриване */}
                                    <div className="mt-5 flex flex-wrap gap-3">

                                        {/* UPDATE - бутон за редактиране */}
                                        {/* Подаваме целия обект drink към функцията */}
                                        <button
                                            type="button"
                                            onClick={() => handleEditDrink(drink)}
                                            disabled={updating || deletingId !== null}
                                            className="flex-1 rounded-lg bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-200 disabled:opacity-50"
                                        >
                                            Редактирай
                                        </button>

                                        {/* DELETE - бутон за изтриване */}
                                        {/* Подаваме само ID на напитката */}
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteDrink(drink.id)}
                                            disabled={deletingId !== null || updating}
                                            className="flex-1 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                        >
                                            {/* Променяме текста по време на изтриване */}
                                            {deletingId === drink.id
                                                ? "Изтриване..."
                                                : "Изтрий"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ================================================== */}
                {/* ФОРМА ЗА РЕДАКТИРАНЕ НА НАПИТКА - UPDATE */}
                {/* ================================================== */}

                {/* Показваме формата само ако editingId не е null */}
                {/* Това означава, че потребителят е избрал напитка */}
                {editingId !== null && (
                    <section className="mt-10 rounded-2xl border border-amber-200 bg-white p-6 shadow-md">
                        <h3 className="mb-6 text-2xl font-bold text-amber-950">
                            Редактиране на напитка
                        </h3>

                        {/* При изпращане извикваме handleUpdateDrink */}
                        <form onSubmit={handleUpdateDrink} className="space-y-4">

                            {/* Поле за редактиране на името */}
                            {/* Първоначално съдържа името на избраната напитка */}
                            <div>
                                <label className="mb-2 block font-medium">
                                    Име на напитката
                                </label>

                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-amber-600"
                                />
                            </div>

                            {/* Поле за редактиране на цената */}
                            <div>
                                <label className="mb-2 block font-medium">
                                    Цена (€)
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-amber-600"
                                />
                            </div>

                            {/* Поле за редактиране на категорията */}
                            <div>
                                <label className="mb-2 block font-medium">
                                    Категория
                                </label>

                                <select
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-amber-600"
                                >
                                    <option value="Coffee">Кафе</option>
                                    <option value="Tea">Чай</option>
                                    <option value="Cold Drinks">
                                        Студени напитки
                                    </option>
                                </select>
                            </div>

                            <div className="flex flex-wrap gap-3">

                                {/* Бутон за запазване на промените в Supabase */}
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="rounded-xl bg-amber-800 px-6 py-3 font-semibold text-white transition hover:bg-amber-900 disabled:opacity-50"
                                >
                                    {/* Показваме състоянието на UPDATE операцията */}
                                    {updating ? "Запазване..." : "Запази промените"}
                                </button>

                                {/* Бутон за отказ от редактиране */}
                                {/* Не изпраща заявка към базата данни */}
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    disabled={updating}
                                    className="rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
                                >
                                    Отказ
                                </button>

                            </div>
                        </form>
                    </section>
                )}
            </div>
            {/* AI асистент за предложения на напитки */}
            <GeminiAssistant />


        </main>
    );
}


