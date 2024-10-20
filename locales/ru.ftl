start_command =
    .description = Запуск бота
airdrop_command =
    .description = Аирдроп
language_command =
    .description = Сменить язык
setcommands_command =
    .description = Установить команды бота

welcome =
    👋 Добро пожаловать!

    ✉️ Чтобы участвовать в аирдропе,
    получите приглашение!
language = 
    .select = Пожалуйста, выберите ваш язык
    .changed = Язык успешно изменён!
admin =
    .commands-updated = Команды обновлены.
unhandled = Неизвестная команда. Попробуйте /airdrop

button =
    .check_subscriptions = Проверить подписки
    .send_invite = Отправить приглашение
    .update = Обновить
    .connect = Добавить адрес кошелька
    .change = Изменить адрес кошелька
    .select_address = Изменить адрес кошелька
    .add_address = ✅ Подтвердить
    .cancel = ❌ Отменить
    .back = « Назад

check_limit = 🕔 Вы можете выполнить проверку раз в { $seconds } секунд
alert =
    .you_subscribed = ✅ Вы выполнили все условия!
    .you_not_subscribed = ❌ Вы не выполнили все условия!
referral =
    .new = 👍 <a href="{ $link }">{ $full_name }</a> присоединился по вашей ссылке.
    .complied =
    ✅ <a href="{ $link }">{ $full_name }</a> выполнил все условия.
    🎁 Вы получили <b>{ $amount } $QR</b>!
invite =
    .self = Вы не можете пригласить самого себя!
    .nonexistent = Такого приглашения не существует!
connect =
    .already_connected = ❌ Кошелёк уже подключен!
    .already_disconnected = ❌ Кошелёк и так не был подключен!
    .address = Твой кошелёк: <a href="https://tonviewer.com/{ $address }">{ $short_address }</a>
    .select_address = Отправьте мне свой адрес кошелька в сети TON:{ $error_comment }
    .error_comment = 🔺 { $error_comment }
    .wallet_not_found = Кошелёк не найден.
    .preview_address =
        👛 <b>Address:</b> <a href="https://tonviewer.com/{ $address }">{ $short_address }</a>
        💎 <b>Balance:</b> { $balance } TON
airdrop =
    .check = Чтобы участвовать в аирдропе, подпишитесь на каналы:
    .uninvited =
        ✉️ Чтобы участвовать в аирдропе,
        получите приглашение!
    .info =
        Твой баланс: <b>{ $balance } $QR</b>

        <b>$QR</b> — это мем-токен на TON, посвящённый QR-коду. Мы стремимся собрать сплочённое комьюнити и постоянно радовать вас новыми активностями!

        Хочешь получить еще больше <b>$QR</b>? 🦸‍♂️ Просто пригласи друга! Отправляй приглашение или ссылку — как только друг запустит бота и выполнит все условия, ты и твой друг получите по <b>{ $amount } $QR</b>. Бонус придёт <b>за каждого друга!</b>{ $address }

        Твоя реф-ссылка:
        { $referral_link }

        Твои рефералы: <b>{ $referrals }</b>, из них <b>{ $complied_referrals }</b> выполнил(и) все условия