Чтобы собрать запустить проект локально:
```bash
npm install
npm run dev
```
Чтобы собртать запустить проект на хостинге:
```bash
npm install
npm run build
npm run start
```
Чтобы приминить миграции Prisma:
```bash
npm run generate
npm run migrate
```
Для локального подключения вам понадобится создать в корне проекта файл `.env` и в нем указать данные для подключения к базе данных.
`.env` можно получить исключительно лично от разработчиков.

Проект находится на ранней стадии разработки.
Могут возникать проблемы с главным сервером, поэтому рекомендуется использовать локальную версию.
Сервер периодический может быть недоступен.

Для корректной работы рекомендуется скачивать специфичные для задачи ветки по адресу: https://github.com/Anen135/b-apps-tasks

Ссылка на демо-приложение: https://b-apps-tasks.onrender.com

Мы используем сторонние сервисы:
- [Google Auth](https://developers.google.com/identity/protocols/oauth2/web-experience-apps) - Для авторизации через Google
- [GitHub Auth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps) - Для авторизации через GitHub
- [Supabase](https://supabase.com/) - Как хостинг базы данных
- [Filebase](https://filebase.com/) - Как хостинг статических файлов
- [Render](https://render.com/) - Как хостинг сервера

Используемый стэк:
  UI Framework:
  - [Shadcn UI](https://shadcn.com/)
  - [Radix UI](https://www.radix-ui.com/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [particle.js](https://github.com/matteobruni/tsparticles)
  - [Liveblocks](https://liveblocks.io/)
  Security:
  - [NextAuth.js](https://next-auth.js.org/)
  - [bcrypt](https://www.npmjs.com/package/bcrypt)

  Backend:
  - [Prisma](https://www.prisma.io/)
  - [Next.js](https://nextjs.org/)
  - [React](https://reactjs.org/)
  - [Vercel](https://vercel.com/)
  - [PostgreSQL](https://www.postgresql.org/)

  FAQ:
  - Не удается подключиться к базе данных
  > Если у вас уже есть `.env` с корректными данными, то скорее всего произошла проблема с миграциями Prisma. Инструкция: https://pris.ly/d/getting-started
  Если проблема сохраняется, узнайте статус активной миграции у ведующих разработчиков, чтобы синхронизироваться миграциями с ними.
  - Не удается авторизоваться
  > Скорее всего случилась проблема с OAuth, возможно провайдер поменял условия использования, или сейчас проводятся работы на бэкенде.
  - Не удается собрать/запустить проект
  > Проверьте, что у вас установлены все зависимости, введя в терминал команду `npm install`.