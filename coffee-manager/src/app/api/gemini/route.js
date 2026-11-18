import { NextResponse } from "next/server";

// Изпълняваме маршрута в Node.js среда (на сървъра).
export const runtime = "nodejs";

// Обработваме POST заявките от интерфейса.
export async function POST(request) {
    try {
        // Прочитаме JSON тялото и взимаме въпроса.
        const { prompt } = await request.json();

        // Проверяваме дали въпросът е текст до 500 символа.
        if (typeof prompt !== "string" ||
            !prompt.trim() || prompt.length > 500) {
            return NextResponse.json(
                { error: "Въведете въпрос до 500 символа." },
                { status: 400 }
            );
        }

        // Четем ключа САМО от сървърната среда.
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Gemini API ключът не е настроен." },
                { status: 500 }
            );
        }

        // Моделът трябва да е достъпен за Google проекта.
        // При нужда го сменяме с достъпен модел от AI Studio.
        const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

        // Изпращаме въпроса към Gemini GenerateContent API.
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey,
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text:
                                "Ти си AI асистент за кафене. " +
                                "Отговаряй на български. Предложи име, " +
                                "съставки, приготвяне и ориентировъчна " +
                                "цена в евро. Не представяй ориентировъчни " +
                                "цени като проверени. Въпрос: " + prompt.trim(),
                        }],
                    }],
                }),
                cache: "no-store",
            }
        );

        // Ако външната услуга е върнала грешка,
        // не изпращаме секретна информация към браузъра.
        if (!response.ok) {
            return NextResponse.json(
                { error: "Gemini не успя да обработи заявката." },
                { status: 502 }
            );
        }

        // Прочитаме отговора и намираме текстовите части.
        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts
            ?.filter((part) => typeof part.text === "string")
            .map((part) => part.text)
            .join("\n");

        // Възможно е да няма генериран текст.
        if (!answer) {
            return NextResponse.json(
                { error: "Gemini не върна текстов отговор." },
                { status: 502 }
            );
        }

        // Връщаме JSON към React компонента.
        return NextResponse.json({ answer });
    } catch (error) {
        // Хващаме невалиден JSON и други неочаквани грешки.
        return NextResponse.json(
            { error: "Възникна грешка при заявката." },
            { status: 500 }
        );
    }
}
