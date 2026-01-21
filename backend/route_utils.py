import numpy as np

def create_route(src, dst, route_type, via_points=None):
    if via_points is None:
        via_points = []

    all_points = [src] + via_points + [dst]
    total_distance = 0
    total_crime_reports = 0
    total_police_distance = 0
    total_cctv_count = 0
    coordinates = []
    path_parts = []

    coordinates.append([float(src['Latitude']), float(src['Longitude'])])
    path_parts.append(src['Area Name'])

    for point in via_points:
        coordinates.append([float(point['Latitude']), float(point['Longitude'])])
        path_parts.append(point['Area Name'])

        p1 = all_points[len(path_parts)-2]
        p2 = point
        dist = np.sqrt((float(p1['Latitude']) - float(p2['Latitude']))**2 + 
                       (float(p1['Longitude']) - float(p2['Longitude']))**2) * 111
        total_distance += dist
        total_crime_reports += (int(p1['Crime Reports Count']) + int(p2['Crime Reports Count'])) // 2
        total_police_distance += (float(p1['Police Stations Nearby (km)']) + float(p2['Police Stations Nearby (km)'])) / 2
        total_cctv_count += int(p1['CCTV Presence'] == 'Yes')

    coordinates.append([float(dst['Latitude']), float(dst['Longitude'])])
    path_parts.append(dst['Area Name'])

    last_p1 = all_points[-2]
    last_p2 = dst
    final_dist = np.sqrt((float(last_p1['Latitude']) - float(last_p2['Latitude']))**2 + 
                         (float(last_p1['Longitude']) - float(last_p2['Longitude']))**2) * 111
    total_distance += final_dist
    total_crime_reports += (int(last_p1['Crime Reports Count']) + int(last_p2['Crime Reports Count'])) // 2
    total_police_distance += (float(last_p1['Police Stations Nearby (km)']) + float(last_p2['Police Stations Nearby (km)'])) / 2
    total_cctv_count += int(last_p1['CCTV Presence'] == 'Yes') + int(last_p2['CCTV Presence'] == 'Yes')

    avg_police_distance = total_police_distance / (len(all_points) - 1)
    safety_score = calculate_safety_score_for_route(all_points)

    return {
        'path': " ➔ ".join(path_parts),
        'via_points': [p['Area Name'] for p in via_points],
        'distance': total_distance,
        'safety_score': safety_score,
        'crime_reports': total_crime_reports,
        'police_distance': avg_police_distance,
        'cctv_count': total_cctv_count,
        'coordinates': [{'location': loc, 'latitude': lat, 'longitude': lon} 
                       for loc, (lat, lon) in zip(path_parts, coordinates)]
    }

def calculate_safety_score_for_route(points):
    total_score = 0
    for point in points:
        cctv_score = (point['CCTV Presence'] == 'Yes') * 0.3
        police_score = (1 - min(max(point['Police Stations Nearby (km)'] / 5, 0), 1)) * 0.2
        crime_score = (1 - min(max(point['Crime Reports Count'] / 50, 0), 1)) * 0.3
        road_score = (point['Road Condition Score'] / 5) * 0.2
        total_score += cctv_score + police_score + crime_score + road_score

    return min(max(total_score / len(points), 0), 1)

def get_safety_tip(safety_score):
    if safety_score > 0.7:
        return "This route is safe. Enjoy your journey!"
    elif safety_score > 0.4:
        return "This route is moderately safe. Avoid walking alone at night."
    else:
        return "This route has higher risk. Consider traveling with others."

def get_safety_level(safety_score):
    if safety_score > 0.7:
        return "🟢 Safe"
    elif safety_score > 0.5:
        return "🟡 Moderate"
    elif safety_score > 0.3:
        return "🟠 Risky"
    else:
        return "🔴 Dangerous" 