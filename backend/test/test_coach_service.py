"""
Tests for CoachService

Purpose:
---------
Validate:
1. Score calculation
2. Score categories
3. Primary emission source detection
4. Highlighted actions
5. Edge cases
"""

from app.services.coach import CoachService
from app.schemas.coach import CoachRequest


# =====================================================
# Eco Champion
# =====================================================

def test_eco_champion_score():
    """
    Very low emissions should produce
    Eco Champion category.
    """

    data = CoachRequest(
        transport=1,
        electricity=1,
        diet=1,
        total=3
    )

    result = CoachService.get_coach_advice(data)

    assert result.score >= 90
    assert result.score_category == "🌟 Eco Champion"


# =====================================================
# Sustainable
# =====================================================

def test_sustainable_score():
    """
    Moderate-low emissions should be sustainable.
    """

    data = CoachRequest(
        transport=2,
        electricity=2,
        diet=2,
        total=6
    )

    result = CoachService.get_coach_advice(data)

    assert result.score >= 75


# =====================================================
# Moderate Impact
# =====================================================

def test_moderate_impact_score():
    """
    Average emissions should be moderate impact.
    """

    data = CoachRequest(
        transport=4,
        electricity=4,
        diet=4,
        total=12
    )

    result = CoachService.get_coach_advice(data)

    assert result.score_category == "⚖️ Moderate Impact"


# =====================================================
# High Impact
# =====================================================

def test_high_impact_score():
    """
    Higher emissions should enter High Impact tier.
    """

    data = CoachRequest(
        transport=8,
        electricity=8,
        diet=8,
        total=24
    )

    result = CoachService.get_coach_advice(data)

    assert result.score_category == "⚠️ High Impact"


# =====================================================
# Critical Impact
# =====================================================

def test_critical_impact_score():
    """
    Very high emissions should trigger critical impact.
    """

    data = CoachRequest(
        transport=20,
        electricity=20,
        diet=20,
        total=60
    )

    result = CoachService.get_coach_advice(data)

    assert result.score_category == "🚨 Critical Impact"


# =====================================================
# Transportation Dominates
# =====================================================

def test_transportation_primary_source():
    """
    Transportation should be detected as primary source.
    """

    data = CoachRequest(
        transport=20,
        electricity=2,
        diet=2,
        total=24
    )

    result = CoachService.get_coach_advice(data)

    assert result.primary_source == "Transportation"
    assert "public transit" in result.highlighted_action


# =====================================================
# Electricity Dominates
# =====================================================

def test_electricity_primary_source():
    """
    Electricity should be detected as primary source.
    """

    data = CoachRequest(
        transport=2,
        electricity=20,
        diet=2,
        total=24
    )

    result = CoachService.get_coach_advice(data)

    assert result.primary_source == "Electricity"
    assert "energy audit" in result.highlighted_action


# =====================================================
# Diet Dominates
# =====================================================

def test_diet_primary_source():
    """
    Diet should be detected as primary source.
    """

    data = CoachRequest(
        transport=2,
        electricity=2,
        diet=20,
        total=24
    )

    result = CoachService.get_coach_advice(data)

    assert result.primary_source == "Diet"
    assert "plant-based" in result.highlighted_action


# =====================================================
# Zero Emission Edge Case
# =====================================================

def test_zero_total_does_not_crash():
    """
    total=0 should not divide by zero.
    """

    data = CoachRequest(
        transport=0,
        electricity=0,
        diet=0,
        total=0
    )

    result = CoachService.get_coach_advice(data)

    assert result.score >= 0
    assert result.score <= 100


# =====================================================
# Score Bounds
# =====================================================

def test_score_always_between_0_and_100():
    """
    Score should always stay inside valid bounds.
    """

    data = CoachRequest(
        transport=999,
        electricity=999,
        diet=999,
        total=2997
    )

    result = CoachService.get_coach_advice(data)

    assert 0 <= result.score <= 100