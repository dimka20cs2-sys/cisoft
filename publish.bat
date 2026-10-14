@echo off
chcp 65001 >nul
rem Публикация изменений сайта на GitHub Pages. Просто запусти двойным кликом.
cd /d "%~dp0"
git add -A
git diff --cached --quiet && (echo Изменений нет — публиковать нечего. & pause & exit /b 0)
git commit -q -m "Обновление сайта %date% %time:~0,5%"
git push -q && echo Готово! Через 1-2 минуты изменения будут на https://dimka20cs2-sys.github.io/dm-soft/ || echo Ошибка при отправке. Проверь интернет.
pause