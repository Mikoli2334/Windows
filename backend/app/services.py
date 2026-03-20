"""
Калькулятор цен на окна.
Цены указаны в BYN (белорусских рублях).
"""

PROFILE_MULTIPLIERS = {
    "эконом": 0.85,
    "стандарт": 1.0,
    "премиум": 1.45,
}

GLASS_PRICES_PER_SQM = {
    "однокамерный": 35.0,
    "двухкамерный": 55.0,
    "энергосберегающий": 75.0,
    "шумозащитный": 85.0,
}

OPENING_PRICES = {
    "глухое": 0,
    "поворотное": 25.0,
    "откидное": 30.0,
    "поворотно-откидное": 45.0,
}

COLOR_PRICES = {
    "white": 0,
    "brown": 35.0,
    "oak": 50.0,
    "anthracite": 60.0,
    "custom": 80.0,
}

MOSQUITO_NET_PER_SQM = 15.0
WINDOWSILL_PER_M = 25.0
SLOPES_PER_WINDOW = 45.0


def calculate_price(
    base_price: float,
    width: int,
    height: int,
    sections: int,
    opening_type: str,
    glass_type: str,
    profile_type: str,
    color: str = "white",
    has_mosquito_net: bool = False,
    has_windowsill: bool = False,
    windowsill_depth: int = 0,
    has_slopes: bool = False,
    quantity: int = 1,
) -> dict:
    area_sqm = (width / 1000) * (height / 1000)
    perimeter_m = 2 * ((width / 1000) + (height / 1000))

    # Базовая цена профиля за погонный метр
    profile_mult = PROFILE_MULTIPLIERS.get(profile_type, 1.0)
    profile_cost = base_price * perimeter_m * profile_mult

    # Стоимость стеклопакета
    glass_price = GLASS_PRICES_PER_SQM.get(glass_type, 55.0) * area_sqm

    # Стоимость открывания (за секцию)
    opening_cost = OPENING_PRICES.get(opening_type, 0) * sections

    # Цвет
    color_cost = COLOR_PRICES.get(color, 0)

    # Дополнительные опции
    options_cost = 0.0
    breakdown = {}

    if has_mosquito_net:
        net_cost = MOSQUITO_NET_PER_SQM * area_sqm
        options_cost += net_cost
        breakdown["mosquito_net"] = round(net_cost, 2)

    if has_windowsill:
        sill_cost = WINDOWSILL_PER_M * (width / 1000) * max(1, windowsill_depth / 200)
        options_cost += sill_cost
        breakdown["windowsill"] = round(sill_cost, 2)

    if has_slopes:
        options_cost += SLOPES_PER_WINDOW
        breakdown["slopes"] = SLOPES_PER_WINDOW

    # Секции
    section_surcharge = max(0, (sections - 1)) * 30.0

    base_total = profile_cost + glass_price
    extras = opening_cost + color_cost + section_surcharge + options_cost
    total_per_unit = base_total + extras

    breakdown.update({
        "profile": round(profile_cost, 2),
        "glass": round(glass_price, 2),
        "opening": round(opening_cost, 2),
        "color": round(color_cost, 2),
        "sections_surcharge": round(section_surcharge, 2),
    })

    return {
        "base_price": round(base_total, 2),
        "area_price": round(glass_price, 2),
        "options_price": round(extras, 2),
        "total_per_unit": round(total_per_unit, 2),
        "quantity": quantity,
        "total_price": round(total_per_unit * quantity, 2),
        "breakdown": breakdown,
    }
