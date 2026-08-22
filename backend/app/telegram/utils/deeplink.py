def parse_deep_link(payload: str) -> tuple[str, str]:
    if payload.startswith("partner_"):
        return "partner", payload[8:]
    if payload.startswith("invite_"):
        return "invite", payload[7:]
    return "unknown", payload
