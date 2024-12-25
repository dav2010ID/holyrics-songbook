function removeChords(text) {
    // Заменяем <br> на реальные разрывы строк
    text = text.replace(/<br>/g, '\n');
    
    // Удаляем аккорды
    return text.replace(/\[[A-G][#b]?\/?[A-G]?[#b]?[0-9]?\]/g, '').trim();
}

function parseSongData(jsonData) {
    var songs = [];

    // Итерируем по массиву песен в JSON данных
    jsonData.srp.forEach(function(songData) {
        var s = {};

        // Формируем заголовок как "520 - Люблю я мріяти про край де ангели святі"
        s.title = songData.i[0] + " - " + songData.i[2];
        var tset = []; // Для хранения всех секций песни

        let i = 1; // Нумерация куплетов начинается с 1

        // Обрабатываем секции (Куплеты)
        songData.s.forEach(function(section, index) {
            // Добавляем заголовок куплета
            var kup = "##(Куплет " + i + ")\n" + removeChords(section);
            tset.push(kup);

            // Если есть соответствующий Припев, добавляем его
            if (songData.p && songData.p[index]) {
                var chorus = removeChords(songData.p[index][0]); // Очищаем текст припева
                tset.push(chorus); // Добавляем припев после куплета
            }

            i++;
        });

        // Формируем полный текст песни с разделением секций
        s.lyrics = tset.join("\n\n");

        // Добавляем песню в массив
        songs.push(s);
    });

    return { songs: songs };
}



function info() {
    return {
        id: 'json',
        name: 'JSON File',
        description: 'JSON File',
        file_filter: {
            description: 'JSON File',
            extensions: ['json']
        }
    };
}

function settings() {
    return [
        {
            id: 'charset',
            label: 'Charset',
            allowed_values: ['UTF-8', 'ISO-8859-1', 'ASCII', 'Windows-1252']
        }
    ];
}

function extract(files, settings) {
    var json = files[0].readString();
    var obj = JSON.parse(json);
    return parseSongData(obj);
}
