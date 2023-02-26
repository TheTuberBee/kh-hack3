class TeamStructure:
    def __init__(self, positions, display_name):
        self.positions = positions


traditional = TeamStructure(["TOP", "MIDDLE", "JUNGLE", "BOTTOM", "UTILITY"], "Traditional")
double_jungle = TeamStructure(["TOP", "MIDDLE", "JUNGLE", "JUNGLE", "UTILITY"], "Double Jungle")
two_man_mid = TeamStructure(["TOP", "MIDDLE", "JUNGLE", "BOTTOM", "UTILITY", "MIDDLE", "NONE"], "Two-man Mid")
flex = TeamStructure(["TOP", "MIDDLE", "JUNGLE", "BOTTOM", "UTILITY", "APEX", "NONE"], "Flex")
all_rounder = TeamStructure(["TOP", "MIDDLE", "JUNGLE", "BOTTOM", "UTILITY", "APEX", "NONE"], "All-Rounder")