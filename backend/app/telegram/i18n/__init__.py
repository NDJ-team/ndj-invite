import json
from pathlib import Path

LOCALES_DIR = Path(__file__).parent
_cache: dict[str, dict] = {}


def load_locale(lang: str) -> dict:
    if lang not in _cache:
        path = LOCALES_DIR / f"{lang}.json"
        if path.exists():
            _cache[lang] = json.loads(path.read_text(encoding="utf-8"))
        else:
            _cache[lang] = _cache.get("ru", {})
    return _cache[lang]


def t(key: str, lang: str = "ru", **kwargs) -> str:
    locale = load_locale(lang)
    text = locale.get(key, key)
    if kwargs:
        text = text.format(**kwargs)
    return text
