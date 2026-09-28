def calculate_wear(
    operating_hours: float,
    temperature: float,
    vibration: float,
    cutting_force: float
):
    """
    Demo AI-based tool wear calculation.

    This uses sensor and operating data to estimate
    the current tool wear percentage.
    """

    # Base wear from operating hours
    operating_wear = (operating_hours / 500) * 50

    # Temperature contribution
    temperature_wear = max(0, (temperature - 40) * 0.15)

    # Vibration contribution
    vibration_wear = vibration * 2

    # Cutting force contribution
    force_wear = (cutting_force / 200) * 10

    # Total estimated wear
    wear = (
        operating_wear
        + temperature_wear
        + vibration_wear
        + force_wear
    )

    # Keep wear between 0 and 100
    wear = max(0, min(wear, 100))

    # Determine condition
    if wear <= 40:
        status = "Normal"
    elif wear <= 75:
        status = "Warning"
    else:
        status = "Critical"

    return {
        "predicted_wear": round(wear, 2),
        "status": status
    }