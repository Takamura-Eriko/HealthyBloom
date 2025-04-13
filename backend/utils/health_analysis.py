def analyze_health_data(data: dict) -> list[str]:
    """
    健診データから推奨される栄養タイプを判定する関数

    Parameters:
        data (dict): 健診データ（例：血圧、血糖、脂質 など）

    Returns:
        list[str]: 該当する栄養タイプ（low_salt, low_sugar, low_fat など）
    """
    nutrition_types = []

    # 高血圧気味 → 減塩食
    if data.get("blood_pressure_systolic", 0) >= 130 or data.get("blood_pressure_diastolic", 0) >= 85:
        nutrition_types.append("low_salt")

    # 血糖値が高め → 低糖質食
    if data.get("blood_sugar", 0) >= 126 or data.get("hba1c", 0) >= 6.5:
        nutrition_types.append("low_sugar")

    # 脂質が高め → 低脂肪
    if data.get("cholesterol_total", 0) >= 220 or data.get("cholesterol_ldl", 0) >= 140:
        nutrition_types.append("low_fat")

    # 中性脂肪が高い → 低脂肪
    if data.get("triglycerides", 0) >= 150:
        nutrition_types.append("low_fat")

    # 肝臓値（GPT）が高い → 肝臓サポート
    if data.get("liver_gpt", 0) >= 56:
        nutrition_types.append("liver_support")

    return nutrition_types
