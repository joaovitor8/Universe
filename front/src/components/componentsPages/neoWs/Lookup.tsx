"use client"

import { useCallback, useState } from "react"
import { TypeAsteroidsLookup } from "@/components/Types"
import { ExternalLink } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import Loading from "@/app/loading"


const DataRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="py-2 border-b border-slate-800/50 flex justify-between items-center text-sm gap-4">
    <span className="text-slate-400">{label}</span>
    <span className="font-medium text-right wrap-break-words">{value || 'N/A'}</span>
  </div>
);

const Badge = ({ label, variant = "default" }: { label: string; variant?: "default" | "danger" }) => (
  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
    variant === "danger" ? "bg-red-900/50 text-red-300" : "bg-purple-900/50 text-purple-300"
  }`}>
    {label}
  </span>
);

export const Lookup = () => {
  const [asteroidsID, setAsteroidsID] = useState('')
  const [asteroidsLookup, setAsteroidsLookup] = useState<TypeAsteroidsLookup | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedApproachDate, setSelectedApproachDate] = useState<string>('')

  const apiOff = "http://127.0.0.1:4000"
  const apiOn = "https://api-universe.onrender.com"


  const GetAsteroidsLookup = useCallback(async () => {
    if (!asteroidsID) {
      setError("Please enter an Asteroid ID.");
      return;
    }
    setLoading(true);
    setError(null);
    setAsteroidsLookup(null);

    try {
      const response = await fetch(`${apiOn}/api/neows/lookup?id=${asteroidsID}`);
      if (!response.ok) {
        throw new Error(`The asteroid ID may be incorrect or the API is unavailable.`);
      }
      const data = await response.json();
      setAsteroidsLookup(data);

      if (data.close_approach?.length > 0) {
        setSelectedApproachDate(data.close_approach[0].close_approach_date_full);
      } else {
        setSelectedApproachDate('');
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [asteroidsID]);

  const selectedApproachData = asteroidsLookup?.close_approach_data?.find(
    (approach) => approach.close_approach_date_full === selectedApproachDate
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Asteroid Lookup</h1>
        <p className="text-muted-foreground mt-2">Get detailed information about a specific asteroid by its ID.</p>
      </div>

      <div className="flex justify-center items-center gap-2 mb-8">
        <Input
          type="text"
          placeholder="Enter the Asteroid ID"
          onChange={(e) => setAsteroidsID(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={GetAsteroidsLookup} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {loading && <Loading />}
      {error && (
        <div className="text-center p-12 border-2 border-dashed border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && !asteroidsLookup && (
        <div className="text-center p-12 border-2 border-dashed border-slate-700 rounded-lg">
          <p className="text-muted-foreground">Enter an Asteroid ID to see its detailed information.</p>
        </div>
      )}

      {asteroidsLookup && (
        <div className="space-y-8 mt-8 animate-fade-in">
          {/* Header with asteroid name and hazard status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
            <div>
              <h2 className="text-2xl font-bold">{asteroidsLookup.name}</h2>
              <p className="text-slate-400">ID: {asteroidsLookup.id}</p>
            </div>
            {/* <div className="flex gap-2 flex-wrap">
              {asteroidsLookup.is_potentially_hazardous_asteroid && (
                <Badge label="Potentially Hazardous" variant="danger" />
              )}
              {asteroidsLookup.is_sentry_object && (
                <Badge label="Sentry Object" />
              )}
            </div> */}
          </div>

          {/* Main info grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Estimated Diameter */}
            <Card>
              <CardHeader>
                <CardTitle>Estimated Diameter</CardTitle>
              </CardHeader>
              <CardContent>
                <DataRow label="Kilometers" value={`${asteroidsLookup.estimated_diameter.kilometers} km`} />
                <DataRow label="Miles" value={`${asteroidsLookup.estimated_diameter.miles} mi`} />
                <DataRow label="Meters" value={`${asteroidsLookup.estimated_diameter.meters} m`} />
                <DataRow label="Feet" value={`${asteroidsLookup.estimated_diameter.feet} ft`} />
              </CardContent>
            </Card>

            {/* Basic Properties */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <DataRow label="Absolute Magnitude" value={asteroidsLookup.absolute_magnitude_h.toFixed(2)} />
                <DataRow label="Potentially Hazardous" value={asteroidsLookup.is_potentially_hazardous_asteroid ? 'Yes' : 'No'} />
                <DataRow label="Sentry Object" value={asteroidsLookup.is_sentry_object ? 'Yes' : 'No'} />
                <DataRow label="NASA JPL URL" value={
                  <a href={asteroidsLookup.nasa_jpl_url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1">
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                } />
              </CardContent>
            </Card>

            {/* Orbital Classification */}
            <Card>
              <CardHeader>
                <CardTitle>Orbital Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <DataRow label="Orbit Class Type" value={asteroidsLookup.orbital_data.orbit_class_type} />
                <DataRow label="Orbit Class Description" value={asteroidsLookup.orbital_data.orbit_class_description} />
                <DataRow label="Orbit Class Range" value={asteroidsLookup.orbital_data.orbit_class_range} />
              </CardContent>
            </Card>
          </div>

          {/* Orbital Data */}
          <Card>
            <CardHeader>
              <CardTitle>Orbital Data</CardTitle>
              <CardDescription>Detailed orbital parameters for {asteroidsLookup.name}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-sm text-slate-300 mb-4">Orbital Elements</h4>
                <DataRow label="Semi Major Axis" value={asteroidsLookup.orbital_data.semi_major_axis} />
                <DataRow label="Eccentricity" value={asteroidsLookup.orbital_data.eccentricity} />
                <DataRow label="Inclination" value={`${asteroidsLookup.orbital_data.inclination}°`} />
                <DataRow label="Ascending Node Longitude" value={`${asteroidsLookup.orbital_data.ascending_node_longitude}°`} />
                <DataRow label="Perihelion Argument" value={`${asteroidsLookup.orbital_data.perihelion_argument}°`} />
                <DataRow label="Mean Anomaly" value={`${asteroidsLookup.orbital_data.mean_anomaly}°`} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-300 mb-4">Distances & Periods</h4>
                <DataRow label="Perihelion Distance" value={`${asteroidsLookup.orbital_data.perihelion_distance} AU`} />
                <DataRow label="Aphelion Distance" value={`${asteroidsLookup.orbital_data.aphelion_distance} AU`} />
                <DataRow label="Orbital Period" value={`${Math.round(Number(asteroidsLookup.orbital_data.orbital_period))} days`} />
                <DataRow label="Mean Motion" value={`${asteroidsLookup.orbital_data.mean_motion}°/day`} />
                <DataRow label="Jupiter Tisserand Invariant" value={asteroidsLookup.orbital_data.jupiter_tisserand_invariant} />
                <DataRow label="Minimum Orbit Intersection" value={`${asteroidsLookup.orbital_data.minimum_orbit_intersection} AU`} />
              </div>
            </CardContent>
          </Card>

          {/* Orbital Determination Info */}
          <Card>
            <CardHeader>
              <CardTitle>Orbital Determination Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <DataRow label="Orbit Determination Date" value={asteroidsLookup.orbital_data.orbit_determination_date} />
                <DataRow label="Epoch Osculation" value={asteroidsLookup.orbital_data.epoch_osculation} />
                <DataRow label="Observation Date" value={asteroidsLookup.orbital_data.observation_date} />
                <DataRow label="Observations Used" value={asteroidsLookup.orbital_data.observations_used} />
              </div>
              <div>
                <DataRow label="Orbit ID" value={asteroidsLookup.orbital_data.orbit_id} />
                <DataRow label="Orbit Uncertainty" value={asteroidsLookup.orbital_data.orbit_uncertainty} />
                <DataRow label="Perihelion Time" value={asteroidsLookup.orbital_data.perihelion_time} />
                <DataRow label="Equinox" value={asteroidsLookup.orbital_data.equinox} />
              </div>
            </CardContent>
          </Card>

          {/* Close Approach Data */}
          {asteroidsLookup.close_approach_data && asteroidsLookup.close_approach_data.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Close Approach Data</CardTitle>
                <CardDescription>Select a date to see approach details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  placeholder="Select approach date"
                  options={asteroidsLookup.close_approach_data.map((date, key) => ({
                    key: key,
                    value: date.close_approach_date_full,
                    label: date.close_approach_date_full
                  }))}
                  value={selectedApproachDate}
                  onChange={setSelectedApproachDate}
                />

                {selectedApproachData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 pt-6 border-t border-slate-800">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-300 mb-4">Relative Velocity</h4>
                      <DataRow label="Km/s" value={selectedApproachData.relative_velocity.kilometers_second} />
                      <DataRow label="Km/h" value={selectedApproachData.relative_velocity.kilometers_hour} />
                      <DataRow label="Miles/h" value={selectedApproachData.relative_velocity.miles_hour} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-300 mb-4">Miss Distance</h4>
                      <DataRow label="Astronomical Units" value={selectedApproachData.miss_distance.astronomical} />
                      <DataRow label="Kilometers" value={selectedApproachData.miss_distance.kilometers} />
                      <DataRow label="Lunar Distance" value={selectedApproachData.miss_distance.lunar} />
                    </div>
                  </div>
                )}

                {selectedApproachData && (
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <DataRow label="Orbiting Body" value={selectedApproachData.orbiting_body} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
