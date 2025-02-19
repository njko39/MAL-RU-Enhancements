# MAL-RU-Enhancements
Скрипт, чтобы переводить названия и описания аниме на [MyAnimeList](https://myanimelist.net/). В приоритете берёт описание и название с [Шикимори](https://shikimori.one/), но если их там нет, или сайт недоступен, то с этой гитхаб страницы.
![{29A53DE4-4BFA-474C-8106-5AFD31105CB9}](https://github.com/user-attachments/assets/4f9398f1-dfb4-4728-882c-2fe67ffa629f)
[Установить с GitHub](https://raw.githubusercontent.com/njko39/MAL-RU-Enhancements/refs/heads/main/MAL-RU-Enhancements.js)
# Как предложить описание, которого нет
Предпочтительнее будет предложить описание на странице аниме на Шикимори, чтобы оно появилось сразу везде.
## Шикимори
![image](https://github.com/user-attachments/assets/4da757bb-840a-4002-afbc-5df358269006)
## GitHub
В папке `assets/anime/` нужно создать папку с названием ID аниме и создать `description.md` для описания, или `title.md` для названия. Если Шикимори доступен и на нём есть описание и название у этого аниме, то файлы на гитхабе игнорируются.
![image](https://github.com/user-attachments/assets/e4a4f61d-e6ff-484e-990e-1526282d05c8)
Например, для Монолога фармацевта 2 должно получиться так:
- `assets/anime/58514/description.md` — описание
- `assets/anime/58514/title.md` — название

Создать pull request новых файлов в этот репозиторий. 
