from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder

from app.config import get_settings


def get_main_menu_kb() -> InlineKeyboardMarkup:
    s = get_settings()
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(text="\U0001f48c Создать приглашение", callback_data="create_invitation")
    )
    if s.NEXT_PUBLIC_TELEGRAM_MINI_APP_URL:
        builder.row(
            InlineKeyboardButton(
                text="\U0001f449 Открыть в приложении",
                web_app={"url": s.NEXT_PUBLIC_TELEGRAM_MINI_APP_URL},
            )
        )
    builder.row(
        InlineKeyboardButton(text="\U0001f4c2 Мои приглашения", callback_data="my_invitations"),
        InlineKeyboardButton(text="\U0001f465 Гости", callback_data="my_guests"),
    )
    builder.row(
        InlineKeyboardButton(text="\U0001f517 Моя ссылка", callback_data="my_link"),
        InlineKeyboardButton(text="\u2753 Помощь", callback_data="help"),
    )
    return builder.as_markup()


def get_event_type_kb() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    events = [
        ("\U0001f48d Свадьба", "event:WEDDING"),
        ("\U0001f382 День рождения", "event:BIRTHDAY"),
        ("\U0001f389 Юбилей", "event:JUBILEE"),
        ("\U0001f393 Выпускной", "event:GRADUATION"),
        ("\U0001f3e2 Корпоратив", "event:CORPORATE"),
        ("\U0001f388 Другое", "event:OTHER"),
    ]
    for text, data in events:
        builder.row(InlineKeyboardButton(text=text, callback_data=data))
    builder.row(InlineKeyboardButton(text="\u23ed\ufe0f Назад", callback_data="menu"))
    return builder.as_markup()


def get_template_kb() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    templates = [
        ("Minimal Wedding", "tpl:minimal"),
        ("Premium Wedding", "tpl:premium"),
        ("Kyrgyz Wedding", "tpl:kyrgyz"),
    ]
    for text, data in templates:
        builder.row(InlineKeyboardButton(text=text, callback_data=data))
    builder.row(InlineKeyboardButton(text="\u23ed\ufe0f Назад", callback_data="create_invitation"))
    return builder.as_markup()


def get_skip_kb() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.row(InlineKeyboardButton(text="\u23ed\ufe0f Пропустить", callback_data="skip_step"))
    return builder.as_markup()


def get_done_kb() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.row(InlineKeyboardButton(text="\u2705 Готово", callback_data="done_photos"))
    return builder.as_markup()


def get_back_to_menu_kb() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.row(InlineKeyboardButton(text="\U0001f3e0 Главное меню", callback_data="menu"))
    return builder.as_markup()


def get_invitation_card_kb(invitation_id: str, slug: str, is_draft: bool) -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    s = get_settings()
    if is_draft:
        builder.row(
            InlineKeyboardButton(text="\U0001f504 Продолжить", callback_data=f"continue:{invitation_id}")
        )
    else:
        url = f"{s.INVITE_BASE_URL}/{slug}"
        builder.row(
            InlineKeyboardButton(text="\U0001f449 Открыть", url=url),
            InlineKeyboardButton(text="\U0001f465 Гости", callback_data=f"stats:{invitation_id}"),
        )
        builder.row(
            InlineKeyboardButton(text="\U0001f4f1 QR-код", callback_data=f"qr:{slug}"),
            InlineKeyboardButton(text="\u270fufe0f Редактировать", callback_data=f"edit:{invitation_id}"),
        )
    return builder.as_markup()


def get_share_kb(slug: str) -> InlineKeyboardMarkup:
    s = get_settings()
    url = f"{s.INVITE_BASE_URL}/{slug}"
    builder = InlineKeyboardBuilder()
    builder.row(InlineKeyboardButton(text="\U0001f449 Открыть приглашение", url=url))
    builder.row(InlineKeyboardButton(text="\U0001f4f1 QR-код", callback_data=f"qr:{slug}"))
    if s.NEXT_PUBLIC_TELEGRAM_MINI_APP_URL:
        builder.row(
            InlineKeyboardButton(
                text="\U0001f449 Открыть в приложении",
                web_app={"url": url},
            )
        )
    builder.row(InlineKeyboardButton(text="\U0001f4c2 Мои приглашения", callback_data="my_invitations"))
    builder.row(InlineKeyboardButton(text="\U0001f3e0 Главное меню", callback_data="menu"))
    return builder.as_markup()


def get_mini_app_kb() -> InlineKeyboardMarkup:
    s = get_settings()
    builder = InlineKeyboardBuilder()
    if s.NEXT_PUBLIC_TELEGRAM_MINI_APP_URL:
        builder.row(
            InlineKeyboardButton(
                text="\U0001f449 Открыть создание",
                web_app={"url": s.NEXT_PUBLIC_TELEGRAM_MINI_APP_URL},
            )
        )
    builder.row(InlineKeyboardButton(text="\U0001f3e0 Главное меню", callback_data="menu"))
    return builder.as_markup()
