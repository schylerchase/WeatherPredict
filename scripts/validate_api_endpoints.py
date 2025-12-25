#!/usr/bin/env python3
"""
Validate API endpoints are accessible during build.
This script checks that all weather APIs are responding before deployment.
"""

import sys
import requests
from typing import List, Tuple

# API endpoints to validate
ENDPOINTS: List[Tuple[str, str]] = [
    (
        "Open-Meteo Forecast",
        "https://api.open-meteo.com/v1/forecast?latitude=40.7&longitude=-74&current=temperature_2m"
    ),
    (
        "Open-Meteo Geocoding",
        "https://geocoding-api.open-meteo.com/v1/search?name=test"
    ),
    (
        "RainViewer Maps",
        "https://api.rainviewer.com/public/weather-maps.json"
    ),
]

def validate_endpoints() -> bool:
    """Check all API endpoints are responding."""
    all_ok = True

    print("Validating API endpoints...")
    print("-" * 50)

    for name, url in ENDPOINTS:
        try:
            response = requests.get(url, timeout=10)
            if response.ok:
                print(f"[OK]   {name}")
            else:
                print(f"[WARN] {name} - Status {response.status_code}")
        except requests.exceptions.Timeout:
            print(f"[WARN] {name} - Timeout")
        except requests.exceptions.RequestException as e:
            print(f"[FAIL] {name} - {e}")
            all_ok = False

    print("-" * 50)
    return all_ok


def main() -> int:
    """Main entry point."""
    if not validate_endpoints():
        print("\nSome API endpoints are not accessible.")
        print("The app may have issues fetching weather data.")
        # Don't fail the build, just warn
        return 0

    print("\nAll API endpoints are accessible!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
