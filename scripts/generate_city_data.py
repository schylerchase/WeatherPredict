#!/usr/bin/env python3
"""
Generate pre-processed city data for faster autocomplete.
This creates a JSON file with major world cities for client-side search.
"""

import json
import sys
from pathlib import Path

# Major world cities (subset for demo - in production, fetch from API)
MAJOR_CITIES = [
    {"name": "New York", "country": "United States", "country_code": "US", "lat": 40.7128, "lon": -74.0060, "population": 8336817, "timezone": "America/New_York", "admin1": "New York"},
    {"name": "Los Angeles", "country": "United States", "country_code": "US", "lat": 34.0522, "lon": -118.2437, "population": 3979576, "timezone": "America/Los_Angeles", "admin1": "California"},
    {"name": "Chicago", "country": "United States", "country_code": "US", "lat": 41.8781, "lon": -87.6298, "population": 2693976, "timezone": "America/Chicago", "admin1": "Illinois"},
    {"name": "London", "country": "United Kingdom", "country_code": "GB", "lat": 51.5074, "lon": -0.1278, "population": 8982000, "timezone": "Europe/London", "admin1": "England"},
    {"name": "Paris", "country": "France", "country_code": "FR", "lat": 48.8566, "lon": 2.3522, "population": 2161000, "timezone": "Europe/Paris", "admin1": "Île-de-France"},
    {"name": "Tokyo", "country": "Japan", "country_code": "JP", "lat": 35.6762, "lon": 139.6503, "population": 13960000, "timezone": "Asia/Tokyo", "admin1": "Tokyo"},
    {"name": "Sydney", "country": "Australia", "country_code": "AU", "lat": -33.8688, "lon": 151.2093, "population": 5312000, "timezone": "Australia/Sydney", "admin1": "New South Wales"},
    {"name": "Berlin", "country": "Germany", "country_code": "DE", "lat": 52.5200, "lon": 13.4050, "population": 3644826, "timezone": "Europe/Berlin", "admin1": "Berlin"},
    {"name": "Toronto", "country": "Canada", "country_code": "CA", "lat": 43.6532, "lon": -79.3832, "population": 2731571, "timezone": "America/Toronto", "admin1": "Ontario"},
    {"name": "Mumbai", "country": "India", "country_code": "IN", "lat": 19.0760, "lon": 72.8777, "population": 12442373, "timezone": "Asia/Kolkata", "admin1": "Maharashtra"},
    {"name": "São Paulo", "country": "Brazil", "country_code": "BR", "lat": -23.5505, "lon": -46.6333, "population": 12325232, "timezone": "America/Sao_Paulo", "admin1": "São Paulo"},
    {"name": "Singapore", "country": "Singapore", "country_code": "SG", "lat": 1.3521, "lon": 103.8198, "population": 5850342, "timezone": "Asia/Singapore", "admin1": "Singapore"},
    {"name": "Dubai", "country": "United Arab Emirates", "country_code": "AE", "lat": 25.2048, "lon": 55.2708, "population": 3331420, "timezone": "Asia/Dubai", "admin1": "Dubai"},
    {"name": "Hong Kong", "country": "Hong Kong", "country_code": "HK", "lat": 22.3193, "lon": 114.1694, "population": 7500700, "timezone": "Asia/Hong_Kong", "admin1": "Hong Kong"},
    {"name": "Seoul", "country": "South Korea", "country_code": "KR", "lat": 37.5665, "lon": 126.9780, "population": 9776000, "timezone": "Asia/Seoul", "admin1": "Seoul"},
    {"name": "Mexico City", "country": "Mexico", "country_code": "MX", "lat": 19.4326, "lon": -99.1332, "population": 8918653, "timezone": "America/Mexico_City", "admin1": "Mexico City"},
    {"name": "Amsterdam", "country": "Netherlands", "country_code": "NL", "lat": 52.3676, "lon": 4.9041, "population": 872680, "timezone": "Europe/Amsterdam", "admin1": "North Holland"},
    {"name": "Rome", "country": "Italy", "country_code": "IT", "lat": 41.9028, "lon": 12.4964, "population": 2873000, "timezone": "Europe/Rome", "admin1": "Lazio"},
    {"name": "Madrid", "country": "Spain", "country_code": "ES", "lat": 40.4168, "lon": -3.7038, "population": 3223000, "timezone": "Europe/Madrid", "admin1": "Community of Madrid"},
    {"name": "Stockholm", "country": "Sweden", "country_code": "SE", "lat": 59.3293, "lon": 18.0686, "population": 975904, "timezone": "Europe/Stockholm", "admin1": "Stockholm County"},
]


def generate_city_data() -> None:
    """Generate the city data JSON file."""
    output_path = Path(__file__).parent.parent / "src" / "data" / "cities.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Transform to match our Location type
    cities = []
    for i, city in enumerate(MAJOR_CITIES):
        cities.append({
            "id": i + 1,
            "name": city["name"],
            "country": city["country"],
            "countryCode": city["country_code"],
            "latitude": city["lat"],
            "longitude": city["lon"],
            "timezone": city["timezone"],
            "admin1": city.get("admin1", ""),
            "population": city.get("population", 0),
        })

    # Sort by population (descending) for relevance
    cities.sort(key=lambda x: x.get("population", 0), reverse=True)

    with open(output_path, "w") as f:
        json.dump(cities, f, indent=2)

    print(f"Generated {len(cities)} cities to {output_path}")


def main() -> int:
    """Main entry point."""
    try:
        generate_city_data()
        return 0
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
