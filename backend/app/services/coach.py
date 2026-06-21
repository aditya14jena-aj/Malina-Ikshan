from app.schemas.coach import CoachRequest, CoachResponse

class CoachService:
    @staticmethod
    def get_coach_advice(data: CoachRequest) -> CoachResponse:
        total = data.total if data.total > 0 else 1.0
        
        # Calculate percentages
        t_pct = int(round((data.transport / total) * 100))
        e_pct = int(round((data.electricity / total) * 100))
        d_pct = int(round((data.diet / total) * 100))

        # 1. Base Score calculation using total emissions (target is ~5kg)
        if total <= 5:
            base_score = 100 - (total * 2)
        elif total <= 10:
            base_score = 90 - ((total - 5) * 3)
        elif total <= 15:
            base_score = 75 - ((total - 10) * 3)
        elif total <= 25:
            base_score = 60 - ((total - 15) * 2)
        else:
            base_score = max(0, 40 - (total - 25))

        # 2. Emission distribution penalty
        distribution_penalty = 0
        max_pct = max(t_pct, e_pct, d_pct)
        if max_pct > 80:
            distribution_penalty = 10
        elif max_pct > 60:
            distribution_penalty = 5
            
        score = int(max(0, min(100, base_score - distribution_penalty)))

        # 3. Categories & Explanation
        if score >= 90:
            score_category = "🌟 Eco Champion"
            score_explanation = "Outstanding! Your footprint is well below average. You are leading the way in sustainable living."
        elif score >= 75:
            score_category = "🌱 Sustainable"
            score_explanation = "Great job! Your emissions are manageable, but there's still slight room for improvement in high-impact areas."
        elif score >= 60:
            score_category = "⚖️ Moderate Impact"
            score_explanation = "Your carbon footprint is average. Making small daily adjustments can easily push you into the sustainable tier."
        elif score >= 40:
            score_category = "⚠️ High Impact"
            score_explanation = "Your emissions are above the recommended threshold. Focus on your primary emission source to make significant cuts."
        else:
            score_category = "🚨 Critical Impact"
            score_explanation = "Your ecological footprint is critically high. Urgent action is needed across all categories to reduce your environmental impact."

        # Determine primary source
        pcts = {
            "Transportation": t_pct,
            "Electricity": e_pct,
            "Diet": d_pct
        }
        primary_source = max(pcts, key=pcts.get)

        # Generate Transport Insight
        if t_pct < 20:
            t_insight = f"Your transportation emissions are relatively low, contributing only {t_pct}% of your footprint. Continue prioritizing efficient travel habits."
        elif t_pct > 40:
            t_insight = f"Transportation accounts for a significant {t_pct}% of your emissions. Try substituting a few car trips a week with public transit, cycling, or walking."
        else:
            t_insight = f"Transportation makes up {t_pct}% of your carbon footprint. Look for opportunities to carpool or combine errands to keep this number down."

        # Generate Electricity Insight
        if e_pct < 20:
            e_insight = f"Your electricity usage is highly efficient, contributing just {e_pct}% of your footprint. Great job minimizing household energy waste."
        elif e_pct > 40:
            e_insight = f"Electricity accounts for {e_pct}% of your emissions. Reducing daily consumption by 20% through mindful appliance use could significantly lower your environmental impact."
        else:
            e_insight = f"Electricity usage forms {e_pct}% of your emissions. Ensure you are turning off idle devices and leveraging natural light to optimize this."

        # Generate Diet Insight
        if d_pct < 20:
            d_insight = f"Your diet is very eco-friendly, adding only {d_pct}% to your footprint. Maintaining a low-impact diet makes a massive difference."
        elif d_pct > 30:
            d_insight = f"Food choices contribute {d_pct}% of your emissions. Incorporating one additional plant-based day each week could significantly reduce your annual emissions."
        else:
            d_insight = f"Dietary choices account for {d_pct}% of your emissions. Continuing to balance your meals with sustainable options will help maintain this moderate level."

        # One highlighted action item based on the primary source
        if primary_source == "Transportation":
            highlighted_action = "Commit to taking public transit or cycling for your commute twice this week to slash your primary emission source."
            potential_daily_savings = round(data.transport * 0.20, 2)
            potential_action = "20% car travel cut"
        elif primary_source == "Electricity":
            highlighted_action = "Perform an energy audit today: unplug all unused electronics and lower your thermostat/AC by 1-2 degrees."
            potential_daily_savings = round(data.electricity * 0.20, 2)
            potential_action = "20% power cut"
        else:
            highlighted_action = "Make your next 3 meals entirely plant-based to immediately curb the high emissions from your diet."
            potential_daily_savings = round(data.diet * 0.20, 2)
            potential_action = "Low-emission meal swap"
            
        potential_yearly_savings = round(potential_daily_savings * 365, 2)

        return CoachResponse(
            score=score,
            score_category=score_category,
            score_explanation=score_explanation,
            primary_source=primary_source,
            transport_insight=t_insight,
            electricity_insight=e_insight,
            diet_insight=d_insight,
            highlighted_action=highlighted_action,
            potential_daily_savings=potential_daily_savings,
            potential_yearly_savings=potential_yearly_savings,
            potential_action=potential_action
        )
