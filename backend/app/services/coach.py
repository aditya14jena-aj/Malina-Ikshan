from app.schemas.coach import CoachRequest, CoachResponse

class CoachService:
    @staticmethod
    def get_coach_advice(data: CoachRequest) -> CoachResponse:
        total = data.total if data.total > 0 else 1.0
        
        # Calculate percentages
        t_pct = (data.transport / total) * 100
        e_pct = (data.electricity / total) * 100
        d_pct = (data.diet / total) * 100

        # Eco Score (100 is best, scales down with higher emissions)
        # Daily target is ~5kg, which gives 100 - 5 * 3 = 85.
        score = max(0, min(100, 100 - int(data.total * 3.5)))

        # Determine primary source
        pcts = {
            "Transportation": t_pct,
            "Electricity": e_pct,
            "Diet": d_pct
        }
        primary_source = max(pcts, key=pcts.get)

        # Build potential recommendations
        active_recs = []
        
        # 1. Transportation
        if t_pct > 40:
            active_recs.append("Opt for active transportation: Swap solo car rides for public transit, cycling, or walking.")
        
        # 2. Electricity
        if e_pct > 40:
            active_recs.append("Reduce household energy: Switch to LED bulbs, unplug idle devices, and manage heating/cooling.")
        
        # 3. Diet
        if d_pct > 30:
            active_recs.append("Integrate plant-based meals: Choose vegetarian or vegan options to reduce high-impact food emissions.")

        # General fallbacks to guarantee 3 recommendations
        fallbacks = [
            "Monitor daily habits: Consistency helps you identify and eliminate carbon-heavy routines.",
            "Conserve water: Energy is required to filter and heat water. Shorten showers to save resources.",
            "Compost & recycle: Reducing waste decreases methane emissions from landfills.",
            "Choose local: Buying locally grown food minimizes transportation emissions from freight."
        ]

        # Combine active recommendations with fallbacks to get exactly 3 unique items
        recommendations = list(active_recs)
        for fb in fallbacks:
            if len(recommendations) >= 3:
                break
            if fb not in recommendations:
                recommendations.append(fb)

        # One highlighted action item based on the primary source
        if primary_source == "Transportation":
            highlighted_action = "🚗 Critical Action: Cut down car trips by 50% this week by combining errands or utilizing public transit."
        elif primary_source == "Electricity":
            highlighted_action = "⚡ Critical Action: Conduct a quick home energy check to unplug standby electronics and optimize your thermostat."
        else:
            highlighted_action = "🍽 Critical Action: Commit to a fully plant-based day tomorrow to immediately drop your food emissions."

        return CoachResponse(
            score=score,
            primary_source=primary_source,
            recommendations=recommendations[:3],
            highlighted_action=highlighted_action
        )
