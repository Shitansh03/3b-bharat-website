// Comprehensive Country List with coordinates for interactive 3D Globe camera focus & polygon highlighting
export const COUNTRIES = [
  { name: "India", geoName: "India", code: "IN", lat: 20.5937, lng: 78.9629, flag: "🇮🇳" },
  { name: "United States", geoName: "United States of America", code: "US", lat: 37.0902, lng: -95.7129, flag: "🇺🇸" },
  { name: "United Kingdom", geoName: "United Kingdom", code: "GB", lat: 55.3781, lng: -3.436, flag: "🇬🇧" },
  { name: "United Arab Emirates", geoName: "United Arab Emirates", code: "AE", lat: 23.4241, lng: 53.8478, flag: "🇦🇪" },
  { name: "Saudi Arabia", geoName: "Saudi Arabia", code: "SA", lat: 23.8859, lng: 45.0792, flag: "🇸🇦" },
  { name: "Qatar", geoName: "Qatar", code: "QA", lat: 25.3548, lng: 51.1839, flag: "🇶🇦" },
  { name: "Oman", geoName: "Oman", code: "OM", lat: 21.5126, lng: 55.9233, flag: "🇴🇲" },
  { name: "Kuwait", geoName: "Kuwait", code: "KW", lat: 29.3117, lng: 47.4818, flag: "🇰🇼" },
  { name: "Germany", geoName: "Germany", code: "DE", lat: 51.1657, lng: 10.4515, flag: "🇩🇪" },
  { name: "France", geoName: "France", code: "FR", lat: 46.2276, lng: 2.2137, flag: "🇫🇷" },
  { name: "Australia", geoName: "Australia", code: "AU", lat: -25.2744, lng: 133.7751, flag: "🇦🇺" },
  { name: "Canada", geoName: "Canada", code: "CA", lat: 56.1304, lng: -106.3468, flag: "🇨🇦" },
  { name: "Singapore", geoName: "Singapore", code: "SG", lat: 1.3521, lng: 103.8198, flag: "🇸🇬" },
  { name: "Japan", geoName: "Japan", code: "JP", lat: 36.2048, lng: 138.2529, flag: "🇯🇵" },
  { name: "South Korea", geoName: "South Korea", code: "KR", lat: 35.9078, lng: 127.7669, flag: "🇰🇷" },
  { name: "Netherlands", geoName: "Netherlands", code: "NL", lat: 52.1326, lng: 5.2913, flag: "🇳🇱" },
  { name: "Switzerland", geoName: "Switzerland", code: "CH", lat: 46.8182, lng: 8.2275, flag: "🇨🇭" },
  { name: "Italy", geoName: "Italy", code: "IT", lat: 41.8719, lng: 12.5674, flag: "🇮🇹" },
  { name: "Spain", geoName: "Spain", code: "ES", lat: 40.4637, lng: -3.7492, flag: "🇪🇸" },
  { name: "South Africa", geoName: "South Africa", code: "ZA", lat: -30.5595, lng: 22.9375, flag: "🇿🇦" },
  { name: "Brazil", geoName: "Brazil", code: "BR", lat: -14.235, lng: -51.9253, flag: "🇧🇷" },
  { name: "New Zealand", geoName: "New Zealand", code: "NZ", lat: -40.9006, lng: 174.886, flag: "🇳🇿" },
  { name: "Sweden", geoName: "Sweden", code: "SE", lat: 60.1282, lng: 18.6435, flag: "🇸🇪" },
  { name: "Norway", geoName: "Norway", code: "NO", lat: 60.472, lng: 8.4689, flag: "🇳🇴" },
  { name: "Denmark", geoName: "Denmark", code: "DK", lat: 56.2639, lng: 9.5018, flag: "🇩🇰" },
  { name: "Belgium", geoName: "Belgium", code: "BE", lat: 50.5039, lng: 4.4699, flag: "🇧🇪" },
  { name: "Austria", geoName: "Austria", code: "AT", lat: 47.5162, lng: 14.5501, flag: "🇦🇹" },
  { name: "Poland", geoName: "Poland", code: "PL", lat: 51.9194, lng: 19.1451, flag: "🇵🇱" },
  { name: "Turkey", geoName: "Turkey", code: "TR", lat: 38.9637, lng: 35.2433, flag: "🇹🇷" },
  { name: "Ireland", geoName: "Ireland", code: "IE", lat: 53.1424, lng: -7.6921, flag: "🇮🇪" },
  { name: "Portugal", geoName: "Portugal", code: "PT", lat: 39.3999, lng: -8.2245, flag: "🇵🇹" },
  { name: "Malaysia", geoName: "Malaysia", code: "MY", lat: 4.2105, lng: 101.9758, flag: "🇲🇾" },
  { name: "Indonesia", geoName: "Indonesia", code: "ID", lat: -0.7893, lng: 113.9213, flag: "🇮🇩" },
  { name: "Thailand", geoName: "Thailand", code: "TH", lat: 15.87, lng: 100.9925, flag: "🇹🇭" },
  { name: "Vietnam", geoName: "Vietnam", code: "VN", lat: 14.0583, lng: 108.2772, flag: "🇻🇳" },
  { name: "Philippines", geoName: "Philippines", code: "PH", lat: 12.8797, lng: 121.774, flag: "🇵🇭" },
  { name: "Mexico", geoName: "Mexico", code: "MX", lat: 23.6345, lng: -102.5528, flag: "🇲🇽" },
  { name: "Argentina", geoName: "Argentina", code: "AR", lat: -38.4161, lng: -63.6167, flag: "🇦🇷" },
  { name: "Chile", geoName: "Chile", code: "CL", lat: -35.6751, lng: -71.543, flag: "🇨🇱" },
  { name: "Egypt", geoName: "Egypt", code: "EG", lat: 26.8206, lng: 30.8025, flag: "🇪🇬" },
  { name: "Kenya", geoName: "Kenya", code: "KE", lat: -0.0236, lng: 37.9062, flag: "🇰🇪" },
  { name: "Nigeria", geoName: "Nigeria", code: "NG", lat: 9.082, lng: 8.6753, flag: "🇳🇬" },
];

export const getCountryByName = (name) => {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  return (
    COUNTRIES.find(
      (c) =>
        c.name.toLowerCase() === lower ||
        c.geoName.toLowerCase() === lower ||
        c.code.toLowerCase() === lower
    ) || null
  );
};
