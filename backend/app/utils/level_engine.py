from functools import lru_cache

# 10-tier threshold table: (level, min_points_required)
LEVEL_THRESHOLDS = [
    (1, 0),
    (2, 100),
    (3, 250),
    (4, 500),
    (5, 1000),
    (6, 2000),
    (7, 3500),
    (8, 5000),
    (9, 7500),
    (10, 10000),
]

_threshold_map = dict(LEVEL_THRESHOLDS)


@lru_cache(maxsize=512)
def calculate_level(total_points: int) -> dict:
    """
    Returns the current level, next level, points required to reach next level,
    and a 0–100 progress percentage for the current tier.

    Memoized via lru_cache to eliminate redundant re-computation across
    multiple calls within the same request lifecycle.
    """
    current_level = 1
    current_min = 0

    for lvl, threshold in LEVEL_THRESHOLDS:
        if total_points >= threshold:
            current_level = lvl
            current_min = threshold
        else:
            break

    if current_level == 10:
        return {
            "current_level": 10,
            "next_level": 10,
            "points_required": 0,
            "progress_percentage": 100.0,
        }

    next_level = current_level + 1
    next_min = _threshold_map[next_level]
    span = next_min - current_min
    points_into_tier = total_points - current_min
    progress_pct = round(min(100.0, (points_into_tier / span) * 100), 1)
    points_required = max(0, next_min - total_points)

    return {
        "current_level": current_level,
        "next_level": next_level,
        "points_required": points_required,
        "progress_percentage": progress_pct,
    }
